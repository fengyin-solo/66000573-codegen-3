/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { computed, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useImagingStore, WIN_MIN, WIN_MAX, LEV_MIN, LEV_MAX, FIXED_PREFIX } from '../store/imaging';
const store = useImagingStore();
const fixedPresets = computed(() => store.fixedPresets());
function fixedLabel(key, p) {
    const short = p.desc?.split(' (')[0].split('（')[0].trim();
    return short || key;
}
// ---- 保存当前方案 ----
const saveVisible = ref(false);
const newName = ref('');
const saveErrors = ref([]);
const errMap = computed(() => {
    const m = {};
    for (const e of saveErrors.value)
        m[e.field] = e.message;
    return m;
});
function openSave() {
    newName.value = '';
    saveErrors.value = [];
    saveVisible.value = true;
}
function confirmSave() {
    saveErrors.value = store.saveCurrentPreset(newName.value);
    if (!saveErrors.value.length) {
        saveVisible.value = false;
        ElMessage.success(`方案“${newName.value.trim()}”已保存并应用`);
    }
}
// ---- 重命名 ----
const renameVisible = ref(false);
const renameText = ref('');
const renameError = ref('');
let renameTarget = null;
function openRename(cp) {
    renameTarget = cp;
    renameText.value = cp.name;
    renameError.value = '';
    renameVisible.value = true;
}
function confirmRename() {
    if (!renameTarget)
        return;
    const errors = store.renameCustomPreset(renameTarget.id, renameText.value);
    if (errors.length) {
        renameError.value = errors.map(e => e.message).join('；');
        return;
    }
    renameVisible.value = false;
    ElMessage.success('已重命名');
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['panel']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-item']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-item']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-row']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "panel" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "group-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "preset-row" },
});
for (const [p, k] of __VLS_getVForSourceType((__VLS_ctx.fixedPresets))) {
    const __VLS_0 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        ...{ 'onClick': {} },
        key: (k),
        size: "small",
        type: (__VLS_ctx.store.activePresetId === __VLS_ctx.FIXED_PREFIX + k ? 'primary' : ''),
    }));
    const __VLS_2 = __VLS_1({
        ...{ 'onClick': {} },
        key: (k),
        size: "small",
        type: (__VLS_ctx.store.activePresetId === __VLS_ctx.FIXED_PREFIX + k ? 'primary' : ''),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    let __VLS_4;
    let __VLS_5;
    let __VLS_6;
    const __VLS_7 = {
        onClick: (...[$event]) => {
            __VLS_ctx.store.applyPreset(__VLS_ctx.FIXED_PREFIX + k);
        }
    };
    __VLS_3.slots.default;
    (__VLS_ctx.fixedLabel(k, p));
    var __VLS_3;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "group-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
const __VLS_8 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    ...{ 'onClick': {} },
    size: "small",
    type: "primary",
    plain: true,
}));
const __VLS_10 = __VLS_9({
    ...{ 'onClick': {} },
    size: "small",
    type: "primary",
    plain: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
let __VLS_12;
let __VLS_13;
let __VLS_14;
const __VLS_15 = {
    onClick: (__VLS_ctx.openSave)
};
__VLS_11.slots.default;
var __VLS_11;
if (__VLS_ctx.store.customPresets.length) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "preset-row custom-row" },
    });
    for (const [cp] of __VLS_getVForSourceType((__VLS_ctx.store.customPresets))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.store.customPresets.length))
                        return;
                    __VLS_ctx.store.applyPreset(cp.id);
                } },
            key: (cp.id),
            ...{ class: "custom-item" },
            ...{ class: ({ active: __VLS_ctx.store.activePresetId === cp.id }) },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "custom-name" },
        });
        (cp.name);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "custom-wl" },
        });
        (cp.window);
        (cp.level);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ onClick: () => { } },
            ...{ class: "custom-ops" },
        });
        const __VLS_16 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
            ...{ 'onClick': {} },
            size: "small",
            link: true,
            title: "重命名",
        }));
        const __VLS_18 = __VLS_17({
            ...{ 'onClick': {} },
            size: "small",
            link: true,
            title: "重命名",
        }, ...__VLS_functionalComponentArgsRest(__VLS_17));
        let __VLS_20;
        let __VLS_21;
        let __VLS_22;
        const __VLS_23 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.store.customPresets.length))
                    return;
                __VLS_ctx.openRename(cp);
            }
        };
        __VLS_19.slots.default;
        var __VLS_19;
        const __VLS_24 = {}.ElPopconfirm;
        /** @type {[typeof __VLS_components.ElPopconfirm, typeof __VLS_components.elPopconfirm, typeof __VLS_components.ElPopconfirm, typeof __VLS_components.elPopconfirm, ]} */ ;
        // @ts-ignore
        const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
            ...{ 'onConfirm': {} },
            title: "确定删除该方案？",
            width: "180",
        }));
        const __VLS_26 = __VLS_25({
            ...{ 'onConfirm': {} },
            title: "确定删除该方案？",
            width: "180",
        }, ...__VLS_functionalComponentArgsRest(__VLS_25));
        let __VLS_28;
        let __VLS_29;
        let __VLS_30;
        const __VLS_31 = {
            onConfirm: (...[$event]) => {
                if (!(__VLS_ctx.store.customPresets.length))
                    return;
                __VLS_ctx.store.deleteCustomPreset(cp.id);
            }
        };
        __VLS_27.slots.default;
        {
            const { reference: __VLS_thisSlot } = __VLS_27.slots;
            const __VLS_32 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
                size: "small",
                link: true,
                type: "danger",
                title: "删除",
            }));
            const __VLS_34 = __VLS_33({
                size: "small",
                link: true,
                type: "danger",
                title: "删除",
            }, ...__VLS_functionalComponentArgsRest(__VLS_33));
            __VLS_35.slots.default;
            var __VLS_35;
        }
        var __VLS_27;
    }
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "empty-custom" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    const __VLS_36 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
        ...{ 'onClick': {} },
        size: "small",
        type: "primary",
        link: true,
    }));
    const __VLS_38 = __VLS_37({
        ...{ 'onClick': {} },
        size: "small",
        type: "primary",
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    let __VLS_40;
    let __VLS_41;
    let __VLS_42;
    const __VLS_43 = {
        onClick: (...[$event]) => {
            if (!!(__VLS_ctx.store.customPresets.length))
                return;
            __VLS_ctx.store.restoreDefaultPresets();
        }
    };
    __VLS_39.slots.default;
    var __VLS_39;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "slider-row" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
(__VLS_ctx.store.windowVal);
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    ...{ onInput: (...[$event]) => {
            __VLS_ctx.store.setManualWindowing();
        } },
    type: "range",
    min: (__VLS_ctx.WIN_MIN),
    max: (__VLS_ctx.WIN_MAX),
});
(__VLS_ctx.store.windowVal);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "slider-row" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
(__VLS_ctx.store.levelVal);
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    ...{ onInput: (...[$event]) => {
            __VLS_ctx.store.setManualWindowing();
        } },
    type: "range",
    min: (__VLS_ctx.LEV_MIN),
    max: (__VLS_ctx.LEV_MAX),
});
(__VLS_ctx.store.levelVal);
const __VLS_44 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    modelValue: (__VLS_ctx.saveVisible),
    title: "保存窗宽窗位方案",
    width: "320px",
    appendToBody: true,
}));
const __VLS_46 = __VLS_45({
    modelValue: (__VLS_ctx.saveVisible),
    title: "保存窗宽窗位方案",
    width: "320px",
    appendToBody: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
__VLS_47.slots.default;
const __VLS_48 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    labelPosition: "top",
}));
const __VLS_50 = __VLS_49({
    labelPosition: "top",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
__VLS_51.slots.default;
const __VLS_52 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    error: (__VLS_ctx.errMap.window || ''),
}));
const __VLS_54 = __VLS_53({
    error: (__VLS_ctx.errMap.window || ''),
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
__VLS_55.slots.default;
{
    const { label: __VLS_thisSlot } = __VLS_55.slots;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "dialog-val" },
});
(__VLS_ctx.store.windowVal);
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "dialog-hint" },
});
(__VLS_ctx.WIN_MIN);
(__VLS_ctx.WIN_MAX);
var __VLS_55;
const __VLS_56 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    error: (__VLS_ctx.errMap.level || ''),
}));
const __VLS_58 = __VLS_57({
    error: (__VLS_ctx.errMap.level || ''),
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
__VLS_59.slots.default;
{
    const { label: __VLS_thisSlot } = __VLS_59.slots;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "dialog-val" },
});
(__VLS_ctx.store.levelVal);
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "dialog-hint" },
});
(__VLS_ctx.LEV_MIN);
(__VLS_ctx.LEV_MAX);
var __VLS_59;
const __VLS_60 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    error: (__VLS_ctx.errMap.name || ''),
}));
const __VLS_62 = __VLS_61({
    error: (__VLS_ctx.errMap.name || ''),
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
__VLS_63.slots.default;
{
    const { label: __VLS_thisSlot } = __VLS_63.slots;
}
const __VLS_64 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.newName),
    placeholder: "请输入方案名称",
    maxlength: "20",
}));
const __VLS_66 = __VLS_65({
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.newName),
    placeholder: "请输入方案名称",
    maxlength: "20",
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
let __VLS_68;
let __VLS_69;
let __VLS_70;
const __VLS_71 = {
    onKeyup: (__VLS_ctx.confirmSave)
};
var __VLS_67;
var __VLS_63;
var __VLS_51;
{
    const { footer: __VLS_thisSlot } = __VLS_47.slots;
    const __VLS_72 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
        ...{ 'onClick': {} },
        size: "small",
    }));
    const __VLS_74 = __VLS_73({
        ...{ 'onClick': {} },
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_73));
    let __VLS_76;
    let __VLS_77;
    let __VLS_78;
    const __VLS_79 = {
        onClick: (...[$event]) => {
            __VLS_ctx.saveVisible = false;
        }
    };
    __VLS_75.slots.default;
    var __VLS_75;
    const __VLS_80 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
        ...{ 'onClick': {} },
        size: "small",
        type: "primary",
    }));
    const __VLS_82 = __VLS_81({
        ...{ 'onClick': {} },
        size: "small",
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_81));
    let __VLS_84;
    let __VLS_85;
    let __VLS_86;
    const __VLS_87 = {
        onClick: (__VLS_ctx.confirmSave)
    };
    __VLS_83.slots.default;
    var __VLS_83;
}
var __VLS_47;
const __VLS_88 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    modelValue: (__VLS_ctx.renameVisible),
    title: "重命名方案",
    width: "320px",
    appendToBody: true,
}));
const __VLS_90 = __VLS_89({
    modelValue: (__VLS_ctx.renameVisible),
    title: "重命名方案",
    width: "320px",
    appendToBody: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
__VLS_91.slots.default;
const __VLS_92 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
    labelPosition: "top",
}));
const __VLS_94 = __VLS_93({
    labelPosition: "top",
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
__VLS_95.slots.default;
const __VLS_96 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
    error: (__VLS_ctx.renameError),
}));
const __VLS_98 = __VLS_97({
    error: (__VLS_ctx.renameError),
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
__VLS_99.slots.default;
{
    const { label: __VLS_thisSlot } = __VLS_99.slots;
}
const __VLS_100 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.renameText),
    placeholder: "请输入新名称",
    maxlength: "20",
}));
const __VLS_102 = __VLS_101({
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.renameText),
    placeholder: "请输入新名称",
    maxlength: "20",
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
let __VLS_104;
let __VLS_105;
let __VLS_106;
const __VLS_107 = {
    onKeyup: (__VLS_ctx.confirmRename)
};
var __VLS_103;
var __VLS_99;
var __VLS_95;
{
    const { footer: __VLS_thisSlot } = __VLS_91.slots;
    const __VLS_108 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
        ...{ 'onClick': {} },
        size: "small",
    }));
    const __VLS_110 = __VLS_109({
        ...{ 'onClick': {} },
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_109));
    let __VLS_112;
    let __VLS_113;
    let __VLS_114;
    const __VLS_115 = {
        onClick: (...[$event]) => {
            __VLS_ctx.renameVisible = false;
        }
    };
    __VLS_111.slots.default;
    var __VLS_111;
    const __VLS_116 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
        ...{ 'onClick': {} },
        size: "small",
        type: "primary",
    }));
    const __VLS_118 = __VLS_117({
        ...{ 'onClick': {} },
        size: "small",
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_117));
    let __VLS_120;
    let __VLS_121;
    let __VLS_122;
    const __VLS_123 = {
        onClick: (__VLS_ctx.confirmRename)
    };
    __VLS_119.slots.default;
    var __VLS_119;
}
var __VLS_91;
/** @type {__VLS_StyleScopedClasses['panel']} */ ;
/** @type {__VLS_StyleScopedClasses['group-label']} */ ;
/** @type {__VLS_StyleScopedClasses['preset-row']} */ ;
/** @type {__VLS_StyleScopedClasses['group-label']} */ ;
/** @type {__VLS_StyleScopedClasses['preset-row']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-row']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-item']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-name']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-wl']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-ops']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-custom']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-row']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-row']} */ ;
/** @type {__VLS_StyleScopedClasses['dialog-val']} */ ;
/** @type {__VLS_StyleScopedClasses['dialog-hint']} */ ;
/** @type {__VLS_StyleScopedClasses['dialog-val']} */ ;
/** @type {__VLS_StyleScopedClasses['dialog-hint']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            WIN_MIN: WIN_MIN,
            WIN_MAX: WIN_MAX,
            LEV_MIN: LEV_MIN,
            LEV_MAX: LEV_MAX,
            FIXED_PREFIX: FIXED_PREFIX,
            store: store,
            fixedPresets: fixedPresets,
            fixedLabel: fixedLabel,
            saveVisible: saveVisible,
            newName: newName,
            errMap: errMap,
            openSave: openSave,
            confirmSave: confirmSave,
            renameVisible: renameVisible,
            renameText: renameText,
            renameError: renameError,
            openRename: openRename,
            confirmRename: confirmRename,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
