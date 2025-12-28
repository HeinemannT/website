import { createRouter, createWebHashHistory } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'

const SvgTuner = () => import('../views/SvgTuner.vue')

const ProcessTool = () => import('../views/ProcessTool.vue')
const ImageUpload = () => import('../views/ImageUpload.vue')
const ColorsetBuilder = () => import('../views/ColorsetBuilder.vue')
const LayoutBuilder = () => import('../views/LayoutBuilder.vue')
const TableBuilder = () => import('../views/TableBuilder.vue')
const CdrawTool = () => import('../views/CdrawTool.vue')

import Dashboard from '../views/Dashboard.vue'

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
                { path: 'process', component: ProcessTool },
                { path: 'table', component: TableBuilder },
                { path: 'image', component: ImageUpload },
                { path: 'tuner', component: SvgTuner },
                { path: 'cdraw', component: CdrawTool },
                { path: '/:pathMatch(.*)*', redirect: '/' }
            ]
        }
    ]
})

export default router
