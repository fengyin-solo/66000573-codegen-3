<template>
  <div class="panel">
    <h4>🎚️ 窗宽窗位调节</h4>
    <div class="preset-row">
      <el-button v-for="(p, k) in store.fixedPresets" :key="k" size="small" @click="applyFixed(k)" :type="active===k?'primary':''">{{ k }}</el-button>
    </div>

    <div class="custom-header">
      <span class="sec-title">自定义方案</span>
      <el-button size="small" link type="primary" @click="openSave">💾 保存当前为方案</el-button>
    </div>
    <div v-if="customNames.length" class="custom-list">
      <div v-for="name in customNames" :key="name" class="custom-item" :class="{ on: active===name }">
        <span class="ci-name" :title="store.customPresets[name].desc" @click="applyCustom(name)">{{ name }}</span>
        <span class="ci-val">W{{ store.customPresets[name].window }}/L{{ store.customPresets[name].level }}</span>
        <el-button size="small" link @click="openRename(name)">改名</el-button>
        <el-button size="small" link type="danger" @click="removePreset(name)">删除</el-button>
      </div>
    </div>
    <div v-else class="custom-empty">
      <span>暂无自定义方案</span>
      <el-button size="small" @click="restoreDefaults">↺ 恢复默认方案</el-button>
    </div>

    <div class="slider-row">
      <span>窗宽: {{ store.windowVal }}</span>
      <input type="range" :min="WINDOW_MIN" :max="WINDOW_MAX" v-model.number="store.windowVal" @input="onChange"/>
    </div>
    <div class="slider-row">
      <span>窗位: {{ store.levelVal }}</span>
      <input type="range" :min="LEVEL_MIN" :max="LEVEL_MAX" v-model.number="store.levelVal" @input="onChange"/>
    </div>

    <el-dialog v-model="saveVisible" title="保存当前为自定义方案" width="340px" append-to-body>
      <div class="form-row"><span>名称</span><el-input v-model="saveForm.name" size="small" placeholder="请输入方案名称"/></div>
      <div class="form-row"><span>窗宽</span><el-input-number v-model="saveForm.window" size="small" :controls="false" style="width:130px"/></div>
      <div class="form-row"><span>窗位</span><el-input-number v-model="saveForm.level" size="small" :controls="false" style="width:130px"/></div>
      <el-alert v-if="saveErrors.length" type="error" :closable="false" class="err-box">
        <div v-for="(e, i) in saveErrors" :key="i">• {{ e }}</div>
      </el-alert>
      <template #footer>
        <el-button size="small" @click="saveVisible=false">取消</el-button>
        <el-button size="small" type="primary" @click="doSave">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="renameVisible" title="重命名方案" width="320px" append-to-body>
      <div class="form-row"><span>新名称</span><el-input v-model="renameValue" size="small" @keyup.enter="doRename"/></div>
      <el-alert v-if="renameErrors.length" type="error" :closable="false" class="err-box">
        <div v-for="(e, i) in renameErrors" :key="i">• {{ e }}</div>
      </el-alert>
      <template #footer>
        <el-button size="small" @click="renameVisible=false">取消</el-button>
        <el-button size="small" type="primary" @click="doRename">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useImagingStore, WINDOW_MIN, WINDOW_MAX, LEVEL_MIN, LEVEL_MAX } from '../store/imaging'
const store = useImagingStore()
const active = ref('')

const customNames = computed(() => Object.keys(store.customPresets))

function applyFixed(k: string) {
  const p = store.fixedPresets[k]
  if (p) { active.value = k; store.applyWindow(p.window, p.level) }
}
function applyCustom(name: string) {
  const p = store.customPresets[name]
  if (p) { active.value = name; store.applyWindow(p.window, p.level) }
}
function onChange() { active.value = '' }

// 保存当前窗宽窗位为命名方案
const saveVisible = ref(false)
const saveForm = reactive<{ name: string; window: number | undefined; level: number | undefined }>({ name: '', window: 0, level: 0 })
const saveErrors = ref<string[]>([])
function openSave() {
  saveForm.name = ''
  saveForm.window = store.windowVal
  saveForm.level = store.levelVal
  saveErrors.value = []
  saveVisible.value = true
}
function doSave() {
  const r = store.saveCustomPreset(saveForm.name, saveForm.window ?? NaN, saveForm.level ?? NaN)
  if (!r.ok) { saveErrors.value = r.errors; return }
  const n = saveForm.name.trim()
  saveVisible.value = false
  active.value = n
  ElMessage.success(`方案"${n}"已保存`)
}

// 改名
const renameVisible = ref(false)
const renameTarget = ref('')
const renameValue = ref('')
const renameErrors = ref<string[]>([])
function openRename(name: string) {
  renameTarget.value = name
  renameValue.value = name
  renameErrors.value = []
  renameVisible.value = true
}
function doRename() {
  const r = store.renameCustomPreset(renameTarget.value, renameValue.value)
  if (!r.ok) { renameErrors.value = r.errors; return }
  const n = renameValue.value.trim()
  if (active.value === renameTarget.value) active.value = n
  renameVisible.value = false
  ElMessage.success(`已重命名为"${n}"`)
}

// 删除
async function removePreset(name: string) {
  try {
    await ElMessageBox.confirm(`确定删除自定义方案"${name}"？`, '删除确认', {
      type: 'warning', confirmButtonText: '删除', cancelButtonText: '取消'
    })
  } catch { return }
  store.deleteCustomPreset(name)
  if (active.value === name) active.value = ''
  ElMessage.success(`方案"${name}"已删除`)
}

// 恢复默认自定义方案
function restoreDefaults() {
  store.restoreDefaultPresets()
  ElMessage.success('已恢复默认自定义方案')
}
</script>

<style scoped>
.panel { background:#161b22; border-radius:6px; padding:10px; border:1px solid #30363d }
.panel h4 { color:#58a6ff; font-size:12px; margin-bottom:8px }
.preset-row { display:flex; gap:4px; flex-wrap:wrap; margin-bottom:10px }
.custom-header { display:flex; justify-content:space-between; align-items:center; border-top:1px dashed #30363d; padding-top:6px; margin-bottom:4px }
.sec-title { font-size:11px; color:#8b949e }
.custom-list { margin-bottom:6px }
.custom-item { display:flex; align-items:center; gap:6px; padding:3px 6px; border-radius:4px; font-size:11px }
.custom-item:hover { background:#0d1117 }
.custom-item.on { background:#12315e; outline:1px solid #1f6feb }
.ci-name { color:#e6edf3; cursor:pointer; flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap }
.ci-name:hover { color:#58a6ff }
.ci-val { color:#8b949e; font-family:monospace; font-size:10px }
.custom-empty { display:flex; justify-content:space-between; align-items:center; font-size:11px; color:#8b949e; padding:4px 2px 8px }
.slider-row { display:flex; align-items:center; gap:8px; margin:6px 0; font-size:11px; color:#8b949e }
.slider-row input { flex:1; accent-color:#58a6ff }
.form-row { display:flex; align-items:center; gap:8px; margin-bottom:10px; font-size:12px }
.form-row span { width:36px; color:#8b949e }
.err-box { margin-bottom:6px }
</style>
