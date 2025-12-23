<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed, ref } from 'vue'
import {
  LayoutDashboard,
  Palette,
  LayoutTemplate,
  Activity,
  Table,
  Image as ImageIcon,
  Edit3,
  Sun,
  Moon,
  HelpCircle
} from 'lucide-vue-next'
import { useThemeStore } from '../stores/theme'
import AboutModal from '../components/ui/AboutModal.vue'

const route = useRoute()
const themeStore = useThemeStore()
const showAbout = ref(false)

const navigation = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard, color: 'text-slate-500' },
  { name: 'Colorset', path: '/colorset', icon: Palette, color: 'text-pink-500' },
  { name: 'Layout', path: '/layout', icon: LayoutTemplate, color: 'text-blue-500' },
  { name: 'Process', path: '/process', icon: Activity, color: 'text-emerald-500' },
  { name: 'Table', path: '/table', icon: Table, color: 'text-orange-500' },
  { name: 'Image', path: '/image', icon: ImageIcon, color: 'text-violet-500' },
  { name: 'SVG Tuner', path: '/tuner', icon: Edit3, color: 'text-teal-500' },
]

const currentTool = computed(() => navigation.find(n => n.path === route.path))
</script>

<template>
  <div class="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
    
    <!-- Sidebar (Collapsed) -->
    <aside class="w-16 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col items-center py-4 z-20 shrink-0">
      <router-link to="/" class="mb-8 block">
        <div class="w-10 h-10 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-white dark:to-slate-200 rounded-xl flex flex-col items-center justify-center text-white dark:text-slate-900 shadow-lg shadow-slate-500/20 font-bold hover:scale-105 transition-transform overflow-hidden">
          <span class="text-xs leading-none mt-1">c</span>
          <span class="text-[8px] leading-none uppercase tracking-tighter">Tools</span>
        </div>
      </router-link>

      <nav class="flex-1 space-y-4 w-full px-2">
        <router-link v-for="item in navigation" :key="item.path" :to="item.path"
          class="w-10 h-10 mx-auto rounded-lg flex items-center justify-center transition-all duration-200 group relative"
          :class="[
            (item.path === '/' ? route.path === '/' : route.path.startsWith(item.path))
              ? 'bg-slate-100 dark:bg-slate-800 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700' 
              : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          ]"
        >
          <component :is="item.icon" class="w-5 h-5 transition-colors" :class="[(item.path === '/' ? route.path === '/' : route.path.startsWith(item.path)) ? item.color : '']" />
          
          <!-- Tooltip -->
          <div class="absolute left-full ml-3 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
            {{ item.name }}
          </div>
        </router-link>
      </nav>

      <div class="mt-auto flex flex-col items-center gap-2 mb-4">
        <button @click="showAbout = true" class="w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" title="About CTools">
          <HelpCircle class="w-5 h-5" />
        </button>
        <button @click="themeStore.toggleTheme()" class="w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <Sun v-if="themeStore.isDark" class="w-5 h-5" />
          <Moon v-else class="w-5 h-5" />
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Header -->
      <header class="h-14 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-800 shrink-0 px-6 flex items-center justify-between z-10 transition-colors duration-300">
        <div class="flex items-center gap-3">
          <h1 v-if="currentTool" class="text-lg font-semibold tracking-tight flex items-center gap-2">
            <component :is="currentTool.icon" class="w-5 h-5" :class="currentTool.color" />
            {{ currentTool.name }}
          </h1>
          <h1 v-else class="text-lg font-semibold tracking-tight text-slate-500">Dashboard</h1>
        </div>
        
        <div class="flex items-center gap-4">
           <!-- Global Actions will be injected here via Teleport if needed -->
           <div id="header-actions"></div>
        </div>
      </header>
      
      <!-- Workspace -->
      <main class="flex-1 overflow-hidden relative">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
             <keep-alive>
                <component :is="Component" />
             </keep-alive>
          </transition>
        </router-view>
      </main>
    </div>
  </div>
  </div>
  <AboutModal :isOpen="showAbout" @close="showAbout = false" />
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
