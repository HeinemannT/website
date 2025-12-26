<script setup lang="ts">
import { ref, onMounted, shallowRef, nextTick } from 'vue'
import BpmnModeler from 'bpmn-js/lib/Modeler'
import {
    PlusCircle, RotateCcw, Code, Download, FileCode, CheckCircle,
    LayoutTemplate, Zap, User, X
} from 'lucide-vue-next'
import InspectorPanel from '../components/ui/InspectorPanel.vue'
import BaseButton from '../components/ui/BaseButton.vue'
import CodeOutputPanel from '../components/ui/CodeOutputPanel.vue'
import BaseInput from '../components/ui/BaseInput.vue'
import { useToast } from '../composables/useToast'
import { useClipboard } from '../composables/useClipboard'
import { useDownload } from '../composables/useDownload'
import { base64AndGunzip, gzipAndBase64, chunkString } from '../utils/gzip'
import { ScriptBuilder } from '../utils/ScriptBuilder'
import ToolLayout from '../components/layout/ToolLayout.vue'
import { usePersistentState } from '../composables/usePersistentState'
import { camundaModdleDescriptor } from '../config/camundaModdle'

// Import BPMN styles
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'

const { add: toast } = useToast()
const { copy: copyToClipboard } = useClipboard()
const { downloadBlob } = useDownload()
const activeTab = ref<'input' | 'xml'>('input')
const inputString = usePersistentState('process:inputString', '')
const xmlContent = usePersistentState('process:xmlContent', '')
const statusMsg = ref('')
const statusType = ref<'info' | 'error'>('info')
const targetObject = usePersistentState('process:targetObject', 't.exampleProcess')
const filename = usePersistentState('process:filename', 'process_diagram')
const hasDiagram = ref(false)
const inspectorVisible = ref(false)
const inspectorTitle = ref('')
const inspectorType = ref('')

const isServiceTask = ref(false)
const isUserTask = ref(false)
const props = ref({
    id: '',
    name: '',
    topic: '',
    formKey: '',
    roles: [] as { value: string, obj: any }[]
})
const helper = ref({ script: '', variable: '' })
const isResizing = ref(false)
const sidebarWidth = ref(400) // Default wider sidebar

// Modeler instance (shallow to avoid Proxy issues)
const modeler = shallowRef<any>(null)
const selectedElement = shallowRef<any>(null)
const isInternalUpdate = ref(false)
let debounceTimer: any = null



// --- Lifecycle ---
onMounted(async () => {
    // Wait for DOM to be ready
    await nextTick()
    
    try {
        initModeler()
    } catch (e) {
        console.error("Failed to init BpmnJS:", e)
        toast('Failed to load BPMN Editor. Please check console.', 'error')
    }
})

// --- Methods ---
const initModeler = () => {
    const canvas = document.querySelector('#canvas')
    if (!canvas) return;

    modeler.value = new BpmnModeler({
        container: '#canvas',
        keyboard: { bindTo: window },
        moddleExtensions: {
            camunda: camundaModdleDescriptor
        }
    })

    modeler.value.on('commandStack.changed', async () => {
        try {
            const { xml } = await modeler.value.saveXML({ format: true });
            isInternalUpdate.value = true;
            xmlContent.value = xml;
            isInternalUpdate.value = false;
        } catch (err) { console.error(err); }
    });

    modeler.value.on('selection.changed', (e: any) => {
        const selection = e.newSelection;
        if (selection.length === 1) {
            loadInspector(selection?.[0]);
        } else {
            selectedElement.value = null;
            inspectorVisible.value = false;
        }
    });

    // If we have content, load it
    if (xmlContent.value) {
        renderDiagram(xmlContent.value).catch(() => {
             // If fails, maybe empty it 
             hasDiagram.value = false
        })
    }
}

const createNewDiagram = async () => {
    try {
        await modeler.value.createDiagram();
        hasDiagram.value = true;
        activeTab.value = 'xml';
        statusMsg.value = 'Created new diagram';
        inputString.value = '';
    } catch (err) {
        console.error('Error creating diagram', err);
        statusMsg.value = 'Error creating diagram';
        statusType.value = 'error';
    }
}

const clearAll = () => {
    modeler.value.clear();
    hasDiagram.value = false;
    inspectorVisible.value = false;
    xmlContent.value = '';
    inputString.value = '';
    statusMsg.value = 'Reset complete';
}

const processInput = () => {
    statusMsg.value = '';
    let raw = inputString.value.trim();
    if (!raw) return;

    try {
        // Handle "content := " format
        if (raw.includes(":=")) {
            const match = raw.match(/content\s*:=\s*'([^']+)'/);
            if (match && match[1]) raw = match[1];
        }
        // Handle "Extended;script;var" format
        if (raw.includes(';')) {
            const parts = raw.split(';');
            const gzipPart = parts.find(p => p.trim().startsWith('H4s')); // Gzip magic number often starts with H4s in Base64
            const lastPart = parts[parts.length - 1]
            raw = gzipPart ? gzipPart.trim() : (lastPart || '').trim();
        }
        raw = raw.replace(/^'|'$/g, '').replace(/,$/, '');

        const decompressed = base64AndGunzip(raw)

        xmlContent.value = decompressed;
        renderDiagram(decompressed);
        statusMsg.value = 'Decoded successfully';
        statusType.value = 'info';
        activeTab.value = 'xml';
    } catch (err) {
        if (raw.length > 20) {
            statusMsg.value = 'Invalid format';
            statusType.value = 'error';
        }
    }
}

const handleXmlEdit = () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        if (!isInternalUpdate.value) {
            renderDiagram(xmlContent.value);
        }
    }, 500);
}

const renderDiagram = async (xml: string) => {
    try {
        await modeler.value.importXML(xml);
        hasDiagram.value = true;
        
        // Wait for render
        await nextTick()
        const canvas = modeler.value.get('canvas')
        canvas.zoom('fit-viewport');
    } catch (err) {
        statusMsg.value = 'Invalid BPMN XML';
        statusType.value = 'error';
    }
}

const copyAsExtendedScript = async () => {
    if (!hasDiagram.value) return;
    try {
        const { xml } = await modeler.value.saveXML({ format: true });
        
        const base64 = gzipAndBase64(xml)
        
        let name = filename.value.trim() || 'process_diagram';
        if (!name.toLowerCase().endsWith('.bpmn')) name += '.bpmn';

        const fullPayload = `${name};application/xml;${base64}`;
        const chunked = chunkString(fullPayload)
        const target = targetObject.value.trim() || 'this.object';
        
        const sb = new ScriptBuilder();
        sb.callMethod(target, 'change', { content: chunked });
        const finalString = sb.toString();

        copyToClipboard(finalString, 'Extended Script');
    } catch (err: any) {
        toast('Export failed: ' + err.message, 'error');
    }
}

const downloadSVG = async () => {
    try {
        const { svg } = await modeler.value.saveSVG();
        downloadBlob(svg, `${filename.value || 'diagram'}.svg`, 'image/svg+xml');
    } catch (e: any) { toast(e.message, 'error') }
}

const downloadXML = async () => {
    try {
        const { xml } = await modeler.value.saveXML({ format: true });
        downloadBlob(xml, `${filename.value || 'diagram'}.bpmn`, 'text/xml');
    } catch (e: any) { toast(e.message, 'error') }
}

// --- Inspector Logic ---
const loadInspector = (element: any) => {
    selectedElement.value = element;
    const bo = element.businessObject;

    inspectorVisible.value = true;
    inspectorTitle.value = bo.name || bo.id;
    inspectorType.value = element.type;
    isServiceTask.value = element.type === 'bpmn:ServiceTask';
    isUserTask.value = element.type === 'bpmn:UserTask';

    props.value.id = bo.id;
    props.value.name = bo.name || '';
    
    // Reset extended props
    props.value.topic = '';
    props.value.formKey = '';
    props.value.roles = [];
    helper.value = { script: '', variable: '' };

    if (isServiceTask.value) {
        props.value.topic = bo.topic || '';
        const parts = props.value.topic.split(';');
        if (parts.length >= 3) {
            helper.value.script = parts[1] || '';
            helper.value.variable = parts[2] || '';
        }
    }

    if (isUserTask.value) {
        props.value.formKey = bo.formKey || '';
        if (bo.extensionElements && bo.extensionElements.values) {
            const camProps = bo.extensionElements.values.find((e: any) => e.$type === 'camunda:Properties');
            if (camProps && camProps.values) {
                props.value.roles = camProps.values
                    .filter((p: any) => p.name === 'role-participant')
                    .map((p: any) => ({ value: p.value, obj: p }));
            }
        }
    }
}

const updateProps = () => {
    if (!selectedElement.value) return;
    const modeling = modeler.value.get('modeling');
    let updates: any = { id: props.value.id, name: props.value.name };

    if (isServiceTask.value) {
        updates['camunda:topic'] = props.value.topic;
        updates['camunda:type'] = 'external';
    }
    if (isUserTask.value) {
        updates['camunda:formKey'] = props.value.formKey;
    }

    modeling.updateProperties(selectedElement.value, updates);
    inspectorTitle.value = props.value.name || props.value.id;
}

const buildTopic = () => {
    if (helper.value.script || helper.value.variable) {
        const s = helper.value.script || 'null';
        const v = helper.value.variable || 'null';
        props.value.topic = `Extended;${s};${v}`;
        updateProps();
    }
}

const addRole = () => {
    if (!selectedElement.value) return;
    const moddle = modeler.value.get('moddle');
    const modeling = modeler.value.get('modeling');
    const bo = selectedElement.value.businessObject;

    let extensions = bo.extensionElements;
    if (!extensions) {
        extensions = moddle.create('bpmn:ExtensionElements');
        modeling.updateProperties(selectedElement.value, { extensionElements: extensions });
    }

    let camProps = extensions.values.find((e: any) => e.$type === 'camunda:Properties');
    if (!camProps) {
        camProps = moddle.create('camunda:Properties');
        extensions.get('values').push(camProps);
    }

    const newProp = moddle.create('camunda:Property', {
        name: 'role-participant',
        value: 'newPropID'
    });
    camProps.get('values').push(newProp);
    loadInspector(selectedElement.value);
}

const removeRole = (idx: number) => {
    if (!selectedElement.value) return;
    const modeling = modeler.value.get('modeling');
    const bo = selectedElement.value.businessObject;
    const roleRef = props.value.roles[idx]?.obj;
    if (!roleRef) return;

    const camProps = bo.extensionElements?.values.find((e: any) => e.$type === 'camunda:Properties');
    if (camProps) {
        const values = camProps.get('values');
        const i = values.indexOf(roleRef);
        if (i > -1) {
            values.splice(i, 1);
            modeling.updateProperties(selectedElement.value, {
                extensionElements: bo.extensionElements
            });
            loadInspector(selectedElement.value);
        }
    }
}

const updateRoles = () => {
    props.value.roles.forEach(role => {
        role.obj.value = role.value;
    });
}

// Resizer logic
const startResize = () => { isResizing.value = true; document.body.style.cursor = 'col-resize'; }
const handleResize = (e: MouseEvent) => { 
    if (isResizing.value) {
        const container = document.body.getBoundingClientRect(); // Using body or main container
        const newWidth = container.width - e.clientX;
        sidebarWidth.value = Math.max(200, Math.min(newWidth, 600)); 
    }
}
const stopResize = () => { isResizing.value = false; document.body.style.cursor = ''; }

</script>

<template>
  <ToolLayout 
      :sidebarStyle="{ width: sidebarWidth + 'px' }" 
      @mousemove="handleResize" 
      @mouseup="stopResize"
      class="select-none"
  >
    
    <!-- Canvas -->
    <template #main>
        <div id="canvas" class="w-full h-full bg-slate-50 dark:bg-slate-900 bg-grid-pattern relative"></div>

        <!-- Empty State -->
        <div v-if="!hasDiagram" class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
            <div class="w-16 h-16 mb-4 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                <LayoutTemplate class="w-8 h-8 text-slate-400" />
            </div>
            <p class="text-sm font-medium text-slate-500 mb-4">Waiting for BPMN data...</p>
            <BaseButton @click="createNewDiagram" class="pointer-events-auto">
                <PlusCircle class="w-4 h-4 mr-2" /> Create New Diagram
            </BaseButton>
        </div>
    </template>

    <!-- Right Panel -->
    <template #sidebar>
        <!-- Resizer Handle -->
        <div class="absolute left-0 top-0 bottom-0 w-1 cursor-col-resize z-50 -ml-0.5 hover:bg-indigo-500 transition-colors" 
             @mousedown="startResize"></div>

        <div class="h-full flex flex-col relative">
            <div class="flex border-b border-slate-700">
                <button @click="activeTab = 'input'" :class="activeTab === 'input' ? 'text-indigo-400 border-indigo-500' : 'text-slate-400 border-transparent hover:text-slate-200'" class="flex-1 py-3 text-xs font-semibold uppercase border-b-2 transition-colors">Input</button>
                <button @click="activeTab = 'xml'" :class="activeTab === 'xml' ? 'text-indigo-400 border-indigo-500' : 'text-slate-400 border-transparent hover:text-slate-200'" class="flex-1 py-3 text-xs font-semibold uppercase border-b-2 transition-colors">XML Editor</button>
            </div>

            <!-- Input Tab -->
            <div v-show="activeTab === 'input'" class="flex-grow flex flex-col p-4">
                 <div class="relative flex-grow flex flex-col">
                    <textarea v-model="inputString" @input="processInput"
                      class="w-full h-full p-3 text-xs font-mono bg-slate-900 border border-slate-700 rounded text-slate-300 focus:ring-1 focus:ring-indigo-500 outline-none resize-none placeholder-slate-600"
                      placeholder="Paste extended script or gzip content..."></textarea>
                    <div class="absolute bottom-2 right-2" v-if="statusMsg === 'Decoded successfully'">
                        <CheckCircle class="w-4 h-4 text-emerald-500" />
                    </div>
                 </div>
                 <div class="mt-2 text-xs h-4" :class="statusType === 'error' ? 'text-pink-400' : 'text-emerald-400'">{{ statusMsg }}</div>
            </div>

            <!-- XML Tab -->
            <div v-show="activeTab === 'xml'" class="flex-grow flex flex-col relative border-t border-slate-700">
                 <CodeOutputPanel 
                    title="XML Editor" 
                    :code="xmlContent" 
                    :editable="true"
                    @update:code="(val: string) => { xmlContent = val; handleXmlEdit() }"
                 >
                 </CodeOutputPanel>
            </div>

            <!-- Inspector (Overlay inside sidebar for now, or just replace content?) -->
            <!-- If inspector is visible, we overlay the input/xml tabs in the sidebar -->
            <div v-if="inspectorVisible" class="absolute inset-0 bg-slate-50 dark:bg-slate-900 z-20 flex flex-col">
                 <InspectorPanel :title="inspectorTitle" :subtitle="inspectorType">
                    <template #header-actions>
                         <button @click="inspectorVisible = false" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1">
                             <X class="w-4 h-4" />
                         </button>
                    </template>
                     
                     <div class="space-y-4 p-4 overflow-y-auto flex-1">
                         <BaseInput label="ID" v-model="props.id" @change="updateProps" />
                         <BaseInput label="Name" v-model="props.name" @change="updateProps" />

                         <!-- Service Task -->
                         <div v-if="isServiceTask" class="pt-4 border-t border-slate-100 dark:border-slate-800">
                            <div class="flex items-center gap-2 text-indigo-500 mb-2">
                                <Zap class="w-3.5 h-3.5" /> <span class="text-xs font-bold uppercase">Extended Logic</span>
                            </div>
                            <BaseInput label="Topic (Raw)" v-model="props.topic" @change="updateProps" mono class="mb-2" />
                            
                            <div className="grid grid-cols-2 gap-2">
                                <BaseInput label="Script Name" v-model="helper.script" @input="buildTopic" />
                                <BaseInput label="Variable" v-model="helper.variable" @input="buildTopic" />
                            </div>
                         </div>

                         <!-- User Task -->
                         <div v-if="isUserTask" class="pt-4 border-t border-slate-100 dark:border-slate-800">
                            <div class="flex items-center gap-2 text-pink-500 mb-2">
                                <User class="w-3.5 h-3.5" /> <span class="text-xs font-bold uppercase">Form Config</span>
                            </div>
                            <BaseInput label="Form Key" v-model="props.formKey" @change="updateProps" />

                            <div class="mt-3">
                                <div class="flex justify-between items-center mb-1">
                                    <label class="text-xs font-bold text-slate-500">Roles</label>
                                    <button @click="addRole" class="text-[10px] bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">+ Add</button>
                                </div>
                                <div class="space-y-2">
                                    <div v-for="(role, idx) in props.roles" :key="idx" class="flex gap-1">
                                       <input type="text" v-model="role.value" @change="updateRoles" class="flex-1 text-xs p-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded" />
                                       <button @click="removeRole(idx)" class="text-slate-400 hover:text-red-500"><X class="w-4 h-4" /></button>
                                    </div>
                                    <p v-if="props.roles.length === 0" class="text-[10px] text-slate-400 italic text-center">No roles assigned</p>
                                </div>
                            </div>
                         </div>
                     </div>

                     <div class="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                         <h4 class="text-xs font-bold text-slate-500 uppercase mb-2">Export / Controls</h4>
                         <div class="space-y-2">
                             <div class="flex gap-2">
                                <BaseInput v-model="filename" placeholder="Filename" mono />
                                <div class="flex items-center text-xs text-slate-400">.bpmn</div>
                             </div>
                             <div class="flex gap-2">
                                 <BaseButton size="sm" class="flex-1" @click="downloadSVG"><Download class="w-3 h-3 mr-2" /> SVG</BaseButton>
                                 <BaseButton size="sm" variant="outline" class="flex-1" @click="downloadXML"><FileCode class="w-3 h-3 mr-2" /> XML</BaseButton>
                             </div>
                             <BaseInput v-model="targetObject" label="Target Object" mono />
                             <BaseButton size="sm" class="w-full bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-600" @click="copyAsExtendedScript">
                                 <Code class="w-3 h-3 mr-2" /> Copy Script
                             </BaseButton>
                             <BaseButton size="sm" variant="ghost" class="w-full text-slate-400" @click="clearAll">
                                 <RotateCcw class="w-3 h-3 mr-2" /> Reset All
                             </BaseButton>
                         </div>
                     </div>
                 </InspectorPanel>
            </div>
        </div>
    </template>
  </ToolLayout>
</template>

<style scoped>
/* Scoped styles mainly for ensuring bpmn-js canvas is clean */
#canvas {
    height: 100%;
    width: 100%;
}

/* Dark Mode Support for BPMN.js */
/* Inverts the black lines/text to white-ish, preserves hues roughly via rotation */
:global(.dark) #canvas :deep(svg) {
    filter: invert(0.9) hue-rotate(180deg);
}
</style>
