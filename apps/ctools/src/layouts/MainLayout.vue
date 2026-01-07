<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref } from 'vue'
import { IconInformation, IconDarkmode, IconLightmode } from '@components/icons'
import { useThemeStore } from '@stores/theme'
import AboutModal from '@components/ui/AboutModal.vue'
import { TOOLS } from '@config/tools'

const route = useRoute()
const themeStore = useThemeStore()
const showAbout = ref(false)

const navigation = TOOLS.map(t => ({
  name: t.name,
  path: t.path,
  icon: t.icon,
  color: t.color,
  activeClass: t.activeClass
}))
</script>

<template>
  <div>
  <div class="flex h-screen w-screen overflow-hidden bg-background text-text-primary transition-colors duration-300 font-sans">
    
    <!-- Sidebar (Collapsed) -->
    <aside class="w-16 bg-layer-01 border-r border-border-subtle flex flex-col items-center py-4 z-50 shrink-0">
      <router-link to="/" class="mb-8 block group relative">
        <div class="flex flex-col items-center justify-center">
            <!-- Logo -->
            <div class="text-2xl font-bold tracking-tighter leading-none text-text-primary group-hover:text-interactive-01 transition-colors">
                c
            </div>
            <div class="text-[0.6rem] font-bold uppercase tracking-widest text-text-secondary group-hover:text-interactive-01 transition-colors">
                Tools
            </div>
        </div>
      </router-link>

      <nav class="flex-1 space-y-2 w-full px-0">
        <router-link v-for="item in navigation" :key="item.path" :to="item.path"
          class="w-full h-12 flex items-center justify-center transition-all duration-200 group relative border-l-4"
          :class="[
            (item.path === '/' ? route.path === '/' : route.path.startsWith(item.path))
              ? item.activeClass 
              : 'border-transparent text-text-secondary hover:bg-layer-02 hover:text-text-primary'
          ]"
        >
          <component :is="item.icon" class="w-5 h-5 transition-colors" :class="route.path.startsWith(item.path) ? item.color : ''" />
          
          <!-- Tooltip -->
          <div class="absolute left-full ml-1 px-3 py-2 bg-layer-03 text-text-primary text-xs font-semibold shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
            {{ item.name }}
          </div>
        </router-link>
      </nav>

      <div class="mt-auto flex flex-col items-center gap-2 mb-4">
        <button @click="showAbout = true" class="w-10 h-10 flex items-center justify-center text-text-secondary hover:bg-layer-02 hover:text-text-primary transition-colors" title="About CTools">
          <IconInformation class="w-5 h-5 fill-current" />
        </button>
        <button @click="themeStore.toggleTheme()" class="w-10 h-10 flex items-center justify-center text-text-secondary hover:bg-layer-02 hover:text-text-primary transition-colors">
          <IconLightmode v-if="themeStore.isDark" class="w-5 h-5 fill-current" />
          <IconDarkmode v-else class="w-5 h-5 fill-current" />
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0 bg-background">   
      <!-- Workspace -->
      <main class="flex-1 overflow-hidden relative">
        <router-view v-slot="{ Component }">
          <component :is="Component" />
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
  transition: opacity 0.15s cubic-bezier(0.2, 0, 0.38, 0.9); /* Carbon Motion */
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
