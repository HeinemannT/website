<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref } from 'vue'
import {
  Sun,
  Moon,
  HelpCircle
} from 'lucide-vue-next'
import { useThemeStore } from '../stores/theme'
import AboutModal from '../components/ui/AboutModal.vue'
import { TOOLS } from '../config/tools'

const route = useRoute()
const themeStore = useThemeStore()
const showAbout = ref(false)

const navigation = TOOLS.map(t => ({
  name: t.name,
  path: t.path,
  icon: t.icon,
  color: t.sidebarColor || t.color // Fallback if sidebarColor not set
}))
</script>

<template>
  <div>
  <div class="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
    
    <!-- Sidebar (Collapsed) -->
    <aside class="w-16 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col items-center py-4 z-20 shrink-0">
      <router-link to="/" class="mb-8 block group relative">
        <div class="flex flex-col items-center justify-center transition-transform duration-200 group-hover:scale-110">
            <!-- Creative Logo -->
            <div class="text-2xl font-black tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-br from-indigo-600 to-violet-500 dark:from-indigo-400 dark:to-violet-300 transition-all">
                c
            </div>
            <div class="text-[0.6rem] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 transition-colors">
                Tools
            </div>
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
  <AboutModal :isOpen="showAbout" @close="showAbout = false" />
  </div>
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
