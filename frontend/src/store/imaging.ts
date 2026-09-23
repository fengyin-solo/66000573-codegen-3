import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import axios from 'axios'
import type { VolumeData, ROIResult, WindowPreset } from '@/types'

// 窗宽窗位允许范围（与调节滑块一致）
export const WINDOW_MIN = 10
export const WINDOW_MAX = 3000
export const LEVEL_MIN = -1000
export const LEVEL_MAX = 1000

// 固定方案（后端未返回时的兜底）
const FIXED_PRESETS: Record<string, WindowPreset> = {
  lung: { window: 1500, level: -600, desc: '肺窗 (W1500/L-600)' },
  mediastinum: { window: 350, level: 50, desc: '纵隔窗 (W350/L50)' },
  bone: { window: 2000, level: 300, desc: '骨窗 (W2000/L300)' },
  brain: { window: 80, level: 40, desc: '脑窗 (W80/L40)' },
  abdomen: { window: 400, level: 40, desc: '腹窗 (W400/L40)' },
}

// 出厂自定义方案：用户删光自定义方案后可一键恢复
const DEFAULT_CUSTOM_PRESETS: Record<string, WindowPreset> = {
  '肺结节窗': { window: 1600, level: -550, desc: '自定义 W1600/L-550' },
  '肝窗': { window: 150, level: 30, desc: '自定义 W150/L30' },
  '椎体窗': { window: 600, level: 200, desc: '自定义 W600/L200' },
}

const STORAGE_KEY = 'customWindowPresets'

function loadCustomPresets(): Record<string, WindowPreset> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* 数据损坏时回退默认 */ }
  return { ...DEFAULT_CUSTOM_PRESETS }
}

export const useImagingStore = defineStore('imaging', () => {
  const loading = ref(false)
  const volumeData = ref<VolumeData | null>(null)
  const preset = ref('brain')
  const windowVal = ref(80)
  const levelVal = ref(40)
  const roiResults = ref<ROIResult[]>([])
  const mprSlice = ref({ axial: 32, coronal: 32, sagittal: 32 })
  const customPresets = ref<Record<string, WindowPreset>>(loadCustomPresets())

  const fixedPresets = computed<Record<string, WindowPreset>>(
    () => volumeData.value?.windowPresets || FIXED_PRESETS
  )

  // 自定义方案变更后持久化到 localStorage
  watch(customPresets, v => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(v)) } catch { /* 忽略写入失败 */ }
  }, { deep: true })

  async function loadVolume() {
    loading.value = true
    try {
      const { data } = await axios.post('/api/volume', {
        preset: preset.value, width: 64, height: 64, depth: 64
      })
      volumeData.value = data
      mprSlice.value = { axial: 32, coronal: 32, sagittal: 32 }
    } finally { loading.value = false }
  }

  async function analyzeROI(rois: any[]) {
    loading.value = true
    try {
      const { data } = await axios.post('/api/roi', { volume: volumeData.value?.volume, rois })
      roiResults.value = data.rois
    } finally { loading.value = false }
  }

  function applyWindow(w: number, l: number) { windowVal.value = w; levelVal.value = l }

  /** 校验方案，返回不合规项列表（空数组表示通过）。excludeName 用于改名时排除自身 */
  function validatePreset(name: string, w: number, l: number, excludeName = ''): string[] {
    const errors: string[] = []
    const n = name.trim()
    if (!n) {
      errors.push('方案名称不能为空')
    } else {
      if (fixedPresets.value[n]) errors.push(`名称"${n}"与固定方案重复`)
      if (n !== excludeName && customPresets.value[n]) errors.push(`名称"${n}"与已有自定义方案重复`)
    }
    if (!Number.isFinite(w)) errors.push('窗宽无效')
    else if (w < WINDOW_MIN) errors.push(`窗宽 ${w} 低于可用下限 ${WINDOW_MIN}`)
    if (!Number.isFinite(l)) errors.push('窗位无效')
    else if (l < LEVEL_MIN || l > LEVEL_MAX) errors.push(`窗位 ${l} 超出允许范围 (${LEVEL_MIN}~${LEVEL_MAX})`)
    return errors
  }

  function saveCustomPreset(name: string, w: number, l: number) {
    const errors = validatePreset(name, w, l)
    if (errors.length) return { ok: false as const, errors }
    const n = name.trim()
    customPresets.value[n] = { window: w, level: l, desc: `自定义 W${w}/L${l}` }
    return { ok: true as const, errors: [] as string[] }
  }

  function renameCustomPreset(oldName: string, newName: string) {
    const p = customPresets.value[oldName]
    if (!p) return { ok: false as const, errors: [`方案"${oldName}"不存在`] }
    const n = newName.trim()
    if (n === oldName) return { ok: true as const, errors: [] as string[] }
    const errors = validatePreset(n, p.window, p.level)
    if (errors.length) return { ok: false as const, errors }
    const { [oldName]: _removed, ...rest } = customPresets.value
    customPresets.value = { ...rest, [n]: p }
    return { ok: true as const, errors: [] as string[] }
  }

  function deleteCustomPreset(name: string) {
    if (!customPresets.value[name]) return
    const { [name]: _removed, ...rest } = customPresets.value
    customPresets.value = rest
  }

  function restoreDefaultPresets() {
    customPresets.value = { ...DEFAULT_CUSTOM_PRESETS }
  }

  return { loading, volumeData, preset, windowVal, levelVal, roiResults, mprSlice,
    customPresets, fixedPresets,
    loadVolume, analyzeROI, applyWindow,
    validatePreset, saveCustomPreset, renameCustomPreset, deleteCustomPreset, restoreDefaultPresets }
})
