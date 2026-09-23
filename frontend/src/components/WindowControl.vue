<template>
  <div class="panel">
    <h4>🎚️ 窗宽窗位调节</h4>

    <!-- 固定方案 -->
    <div class="group-label">固定方案</div>
    <div class="preset-row">
      <el-button
        v-for="(p, k) in fixedPresets" :key="k"
        size="small"
        :type="store.activePresetId === FIXED_PREFIX + k ? 'primary' : ''"
        @click="store.applyPreset(FIXED_PREFIX + k)"
      >{{ fixedLabel(k, p) }}</el-button>
    </div>

    <!-- 用户自建方案 -->
    <div class="group-label">
      <span>我的方案</span>
      <el-button size="small" type="primary" plain @click="openSave">💾 保存当前窗宽窗位</el-button>
    </div>

    <div v-if="store.customPresets.length" class="preset-row custom-row">
      <div v-for="cp in store.customPresets" :key="cp.id" class="custom-item"
           :class="{ active: store.activePresetId === cp.id }"
           @click="store.applyPreset(cp.id)">
        <span class="custom-name">{{ cp.name }}</span>
        <span class="custom-wl">W{{ cp.window }}/L{{ cp.level }}</span>
        <span class="custom-ops" @click.stop>
          <el-button size="small" link title="重命名" @click="openRename(cp)">✏️</el-button>
          <el-popconfirm title="确定删除该方案？" width="180" @confirm="store.deleteCustomPreset(cp.id)">
            <template #reference>
              <el-button size="small" link type="danger" title="删除">🗑️</el-button>
            </template>
          </el-popconfirm>
        </span>
      </div>
    </div>
    <div v-else class="empty-custom">
      <span>暂无自定义方案，手动调节后可保存；</span>
      <el-button size="small" type="primary" link @click="store.restoreDefaultPresets()">↩ 恢复默认方案</el-button>
    </div>

    <!-- 手动拖动调节 -->
    <div class="slider-row">
      <span>窗宽: {{ store.windowVal }}</span>
      <input type="range" :min="WIN_MIN" :max="WIN_MAX" v-model.number="store.windowVal" @input="store.setManualWindowing()"/>
    </div>
    <div class="slider-row">
      <span>窗位: {{ store.levelVal }}</span>
      <input type="range" :min="LEV_MIN" :max="LEV_MAX" v-model.number="store.levelVal" @input="store.setManualWindowing()"/>
    </div>

    <!-- 保存方案对话框 -->
    <el-dialog v-model="saveVisible" title="保存窗宽窗位方案" width="320px" append-to-body>
      <el-form label-position="top">
        <el-form-item :error="errMap.window || ''">
          <template #label>窗宽</template>
          <span class="dialog-val">{{ store.windowVal }}</span>
          <span class="dialog-hint">允许范围 {{ WIN_MIN }} ~ {{ WIN_MAX }}</span>
        </el-form-item>
        <el-form-item :error="errMap.level || ''">
          <template #label>窗位</template>
          <span class="dialog-val">{{ store.levelVal }}</span>
          <span class="dialog-hint">允许范围 {{ LEV_MIN }} ~ {{ LEV_MAX }}</span>
        </el-form-item>
        <el-form-item :error="errMap.name || ''">
          <template #label>方案名称</template>
          <el-input v-model="newName" placeholder="请输入方案名称" maxlength="20" @keyup.enter="confirmSave"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button size="small" @click="saveVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="confirmSave">保存</el-button>
      </template>
    </el-dialog>

    <!-- 重命名对话框 -->
    <el-dialog v-model="renameVisible" title="重命名方案" width="320px" append-to-body>
      <el-form label-position="top">
        <el-form-item :error="renameError">
          <template #label>方案名称</template>
          <el-input v-model="renameText" placeholder="请输入新名称" maxlength="20" @keyup.enter="confirmRename"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button size="small" @click="renameVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="confirmRename">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useImagingStore, WIN_MIN, WIN_MAX, LEV_MIN, LEV_MAX, FIXED_PREFIX } from '../store/imaging'
import type { CustomWindowPreset, WindowPreset, PresetValidation } from '../types'

const store = useImagingStore()

const fixedPresets = computed<Record<string, WindowPreset>>(() => store.fixedPresets())

function fixedLabel(key: string, p: WindowPreset): string {
  const short = p.desc?.split(' (')[0].split('（')[0].trim()
  return short || key
}

// ---- 保存当前方案 ----
const saveVisible = ref(false)
const newName = ref('')
const saveErrors = ref<PresetValidation[]>([])

const errMap = computed<Record<string, string>>(() => {
  const m: Record<string, string> = {}
  for (const e of saveErrors.value) m[e.field] = e.message
  return m
})

function openSave() {
  newName.value = ''
  saveErrors.value = []
  saveVisible.value = true
}

function confirmSave() {
  saveErrors.value = store.saveCurrentPreset(newName.value)
  if (!saveErrors.value.length) {
    saveVisible.value = false
    ElMessage.success(`方案“${newName.value.trim()}”已保存并应用`)
  }
}

// ---- 重命名 ----
const renameVisible = ref(false)
const renameText = ref('')
const renameError = ref('')
let renameTarget: CustomWindowPreset | null = null

function openRename(cp: CustomWindowPreset) {
  renameTarget = cp
  renameText.value = cp.name
  renameError.value = ''
  renameVisible.value = true
}

function confirmRename() {
  if (!renameTarget) return
  const errors = store.renameCustomPreset(renameTarget.id, renameText.value)
  if (errors.length) {
    renameError.value = errors.map(e => e.message).join('；')
    return
  }
  renameVisible.value = false
  ElMessage.success('已重命名')
}
</script>

<style scoped>
.panel { background:#161b22; border-radius:6px; padding:10px; border:1px solid #30363d }
.panel h4 { color:#58a6ff; font-size:12px; margin-bottom:8px }
.group-label { display:flex; justify-content:space-between; align-items:center; font-size:11px; color:#8b949e; margin:8px 0 4px }
.preset-row { display:flex; gap:4px; flex-wrap:wrap; margin-bottom:10px }
.custom-row { flex-direction:column; gap:4px }
.custom-item { display:flex; align-items:center; gap:6px; padding:3px 8px; border:1px solid #30363d; border-radius:4px; cursor:pointer; font-size:11px; color:#c9d1d9; transition:border-color .15s }
.custom-item:hover { border-color:#58a6ff }
.custom-item.active { border-color:#409eff; background:#1d2a3d }
.custom-name { font-weight:600 }
.custom-wl { color:#8b949e; font-family:monospace; flex:1 }
.custom-ops { display:flex; gap:2px }
.empty-custom { font-size:11px; color:#8b949e; margin-bottom:10px; padding:6px 8px; background:#0d1117; border:1px dashed #30363d; border-radius:4px }
.slider-row { display:flex; align-items:center; gap:8px; margin:6px 0; font-size:11px; color:#8b949e }
.slider-row input { flex:1; accent-color:#58a6ff }
.dialog-val { font-weight:600; color:#e6edf3; margin-right:8px }
.dialog-hint { font-size:10px; color:#8b949e }
</style>
