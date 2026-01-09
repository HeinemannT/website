import { createRouter, createWebHashHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'

const SvgTuner = () => import('@features/svg-tuner/views/SvgTuner.vue')

const ProcessTool = () => import('@features/process-tool/views/ProcessTool.vue')
const ImageUpload = () => import('@features/image-upload/views/ImageUpload.vue')
const ColorsetBuilder = () => import('@features/colorset/views/ColorsetBuilder.vue')
const LayoutBuilder = () => import('@features/layout-builder/views/LayoutBuilder.vue')
const TemplateBuilder = () => import('@features/template-builder/views/TemplateBuilder.vue')
const TableBuilder = () => import('@features/table-builder/views/TableBuilder.vue')
const CdrawTool = () => import('@features/cdraw/views/CdrawTool.vue')

import Dashboard from '@features/dashboard/views/Dashboard.vue'

// const Placeholder = (name: string) => ({ template: `<div class="p-8"><h2 class="text-xl font-bold mb-4">${name}</h2><p class="text-slate-500">Coming soon...</p></div>` })

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            component: MainLayout,
            children: [
                { path: '', component: Dashboard },
                { path: 'colorset', component: ColorsetBuilder },
                { path: 'layout', component: LayoutBuilder },
                { path: 'template', component: TemplateBuilder },
                { path: 'process', component: ProcessTool },
                { path: 'table', component: TableBuilder },
                { path: 'image', component: ImageUpload },
                { path: 'tuner', component: SvgTuner },
                { path: 'cdraw', component: CdrawTool },
                { path: 'pbac', component: () => import('@features/pbac-architect/views/PbacArchitect.vue') },
                { path: '/:pathMatch(.*)*', redirect: '/' }
            ]
        }
    ]
})

export default router
