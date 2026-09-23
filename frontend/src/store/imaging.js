import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import axios from 'axios';
/** 窗宽可调范围（含可用下限） */
export const WIN_MIN = 10;
export const WIN_MAX = 3000;
/** 窗位允许范围 */
export const LEV_MIN = -1000;
export const LEV_MAX = 1000;
/** 后端不可用时的兜底固定方案 */
export const FALLBACK_FIXED_PRESETS = {
    lung: { window: 1500, level: -600, desc: '肺窗 (W1500/L-600)' },
    mediastinum: { window: 350, level: 50, desc: '纵隔窗 (W350/L50)' },
    bone: { window: 2000, level: 300, desc: '骨窗 (W2000/L300)' },
    brain: { window: 80, level: 40, desc: '脑窗 (W80/L40)' },
    abdomen: { window: 400, level: 40, desc: '腹窗 (W400/L40)' },
};
/** 固定方案前缀，与用户自建方案的 id 命名空间隔离 */
export const FIXED_PREFIX = 'fixed:';
/** 默认激活的固定方案 */
export const DEFAULT_PRESET_ID = FIXED_PREFIX + 'brain';
/** 首次使用 / 恢复默认时填充的用户方案 */
const BUILTIN_CUSTOM_PRESETS = [
    { name: '软组织窗', window: 400, level: 50 },
    { name: '血管窗', window: 600, level: 200 },
];
const STORAGE_KEY = 'custom-window-presets';
function genId() {
    return 'cp-' + (typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : Date.now().toString(36) + Math.random().toString(36).slice(2, 8));
}
/** 从固定方案 desc 中提取短名称，如 "肺窗 (W1500/L-600)" -> "肺窗" */
function fixedShortName(desc) {
    return desc.split(' (')[0].split('（')[0].trim();
}
export const useImagingStore = defineStore('imaging', () => {
    const loading = ref(false);
    const volumeData = ref(null);
    const preset = ref('brain');
    const windowVal = ref(80);
    const levelVal = ref(40);
    const roiResults = ref([]);
    const mprSlice = ref({ axial: 32, coronal: 32, sagittal: 32 });
    /** 当前激活方案：`fixed:xxx` 为固定方案，`cp-xxx` 为用户自建，'' 表示手动调窗 */
    const activePresetId = ref(DEFAULT_PRESET_ID);
    function loadCustomPresets() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw === null) {
                // 首次使用：预置内置默认方案
                return BUILTIN_CUSTOM_PRESETS.map(p => ({ ...p, id: genId() }));
            }
            const arr = JSON.parse(raw);
            if (!Array.isArray(arr))
                return [];
            return arr.filter(p => p && typeof p.name === 'string' &&
                typeof p.window === 'number' && typeof p.level === 'number');
        }
        catch {
            return [];
        }
    }
    const customPresets = ref(loadCustomPresets());
    watch(customPresets, list => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }, { deep: true });
    /** 固定方案（优先取后端返回，缺省时用兜底表） */
    function fixedPresets() {
        return volumeData.value?.windowPresets || FALLBACK_FIXED_PRESETS;
    }
    /** 按 id 找到固定方案，找不到返回 undefined */
    function findFixed(id) {
        if (!id.startsWith(FIXED_PREFIX))
            return undefined;
        return fixedPresets()[id.slice(FIXED_PREFIX.length)];
    }
    /**
     * 校验方案名称与数值是否合规。
     * @param excludeId 改名时排除自身 id
     * @returns 不合规项列表，空数组表示全部合规
     */
    function validatePreset(win, lev, name, excludeId) {
        const errors = [];
        const trimmed = name.trim();
        if (!trimmed) {
            errors.push({ field: 'name', message: '方案名称不能为空' });
        }
        else {
            const lower = trimmed.toLowerCase();
            const dupCustom = customPresets.value.some(p => p.id !== excludeId && p.name.trim().toLowerCase() === lower);
            const fixed = fixedPresets();
            const dupFixed = Object.entries(fixed).some(([key, p]) => key.toLowerCase() === lower || fixedShortName(p.desc).toLowerCase() === lower);
            if (dupCustom || dupFixed) {
                errors.push({ field: 'name', message: `方案名称“${trimmed}”与已有方案重复` });
            }
        }
        if (!Number.isFinite(win) || win < WIN_MIN) {
            errors.push({ field: 'window', message: `窗宽不能低于可用下限 ${WIN_MIN}` });
        }
        else if (win > WIN_MAX) {
            errors.push({ field: 'window', message: `窗宽不能超过上限 ${WIN_MAX}` });
        }
        if (!Number.isFinite(lev)) {
            errors.push({ field: 'level', message: '窗位必须为有效数值' });
        }
        else if (lev < LEV_MIN || lev > LEV_MAX) {
            errors.push({ field: 'level', message: `窗位超出允许范围 ${LEV_MIN} ~ ${LEV_MAX}` });
        }
        return errors;
    }
    /** 保存当前窗宽窗位为带名称的新方案；返回不合规项（空数组表示成功） */
    function saveCurrentPreset(name) {
        const win = windowVal.value, lev = levelVal.value;
        const errors = validatePreset(win, lev, name);
        if (errors.length)
            return errors;
        const cp = { id: genId(), name: name.trim(), window: win, level: lev };
        customPresets.value.push(cp);
        activePresetId.value = cp.id;
        return [];
    }
    /** 重命名自建方案；返回不合规项（空数组表示成功） */
    function renameCustomPreset(id, newName) {
        const target = customPresets.value.find(p => p.id === id);
        if (!target)
            return [{ field: 'name', message: '方案不存在或已被删除' }];
        const errors = validatePreset(target.window, target.level, newName, id);
        if (errors.length)
            return errors;
        target.name = newName.trim();
        return [];
    }
    /** 删除自建方案 */
    function deleteCustomPreset(id) {
        const i = customPresets.value.findIndex(p => p.id === id);
        if (i >= 0)
            customPresets.value.splice(i, 1);
        if (activePresetId.value === id)
            activePresetId.value = '';
    }
    /** 恢复内置默认方案（仅在自建方案为空时作为入口调用） */
    function restoreDefaultPresets() {
        customPresets.value = BUILTIN_CUSTOM_PRESETS.map(p => ({ ...p, id: genId() }));
    }
    /** 选择任一方案后立即应用（渲染层 watch 窗宽窗位即刷新） */
    function applyPreset(id) {
        if (id.startsWith(FIXED_PREFIX)) {
            const p = findFixed(id);
            if (!p)
                return;
            windowVal.value = p.window;
            levelVal.value = p.level;
            activePresetId.value = id;
        }
        else {
            const cp = customPresets.value.find(p => p.id === id);
            if (!cp)
                return;
            windowVal.value = cp.window;
            levelVal.value = cp.level;
            activePresetId.value = id;
        }
    }
    /** 手动拖动调节：取消方案高亮 */
    function setManualWindowing() {
        activePresetId.value = '';
    }
    async function loadVolume() {
        loading.value = true;
        try {
            const { data } = await axios.post('/api/volume', {
                preset: preset.value, width: 64, height: 64, depth: 64
            });
            volumeData.value = data;
            mprSlice.value = { axial: 32, coronal: 32, sagittal: 32 };
            // 载入新影像后重新应用当前选中的方案，保证画面与方案一致
            if (activePresetId.value)
                applyPreset(activePresetId.value);
        }
        finally {
            loading.value = false;
        }
    }
    async function analyzeROI(rois) {
        loading.value = true;
        try {
            const { data } = await axios.post('/api/roi', { volume: volumeData.value?.volume, rois });
            roiResults.value = data.rois;
        }
        finally {
            loading.value = false;
        }
    }
    function applyWindow(w, l) {
        windowVal.value = w;
        levelVal.value = l;
        activePresetId.value = '';
    }
    return {
        loading, volumeData, preset, windowVal, levelVal, roiResults, mprSlice,
        customPresets, activePresetId,
        fixedPresets, loadVolume, analyzeROI, applyWindow,
        validatePreset, saveCurrentPreset, renameCustomPreset,
        deleteCustomPreset, restoreDefaultPresets, applyPreset, setManualWindowing,
    };
});
