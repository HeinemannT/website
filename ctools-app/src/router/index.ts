import { createRouter, createWebHashHistory } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'

import SvgTuner from '../views/SvgTuner.vue'

import ProcessTool from '../views/ProcessTool.vue'
import ImageUpload from '../views/ImageUpload.vue'
import ColorsetBuilder from '../views/ColorsetBuilder.vue'
import LayoutBuilder from '../views/LayoutBuilder.vue'
import TableBuilder from '../views/TableBuilder.vue'

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
                { path: '/:pathMatch(.*)*', redirect: '/' }
            ]
        }
    ]
})

export default router
