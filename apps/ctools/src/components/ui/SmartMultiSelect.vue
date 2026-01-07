<script setup lang="ts" generic="T extends string | number | Record<string, any>">
import { ref, computed } from 'vue'
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
} from '@headlessui/vue'
import { Check, ChevronsUpDown, X } from 'lucide-vue-next'

export interface SelectOption<V> {
    label: string
    value: V
}

const props = defineProps<{
    modelValue: T[]
    options: (T | SelectOption<T>)[]
    placeholder?: string
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: T[]): void
}>()

const query = ref('')

const normalizedOptions = computed(() => {
    return props.options.map(opt => {
        if (typeof opt === 'object' && opt !== null && 'label' in opt && 'value' in opt) {
            return opt as SelectOption<T>
        }
        return { label: String(opt), value: opt } as SelectOption<T>
    })
})

const filteredOptions = computed(() => {
    if (query.value === '') return normalizedOptions.value
    return normalizedOptions.value.filter((option) =>
        option.label
          .toLowerCase()
          .replace(/\s+/g, '')
          .includes(query.value.toLowerCase().replace(/\s+/g, ''))
    )
})

const removeTag = (tag: T) => {
    emit('update:modelValue', props.modelValue.filter(t => t !== tag))
}
</script>

<template>
  <Combobox 
      :model-value="modelValue" 
      @update:model-value="val => emit('update:modelValue', val)"
      multiple
  >
    <div class="relative mt-1">
      <div
        class="relative w-full cursor-text min-h-[32px] rounded-sm bg-layer-02 text-left border border-border-strong focus-within:border-interactive-01 sm:text-sm flex items-center flex-wrap gap-1 p-1 pr-8"
      >
        <!-- Chips -->
        <span 
            v-for="tag in modelValue" 
            :key="String(tag)" 
            class="inline-flex items-center gap-1 rounded bg-layer-03 px-1.5 py-0.5 text-[10px] font-medium text-text-primary border border-border-subtle group"
        >
            {{ tag }}
            <button @click.stop="removeTag(tag)" class="text-text-tertiary hover:text-text-primary focus:outline-none">
                <X class="w-3 h-3" />
            </button>
        </span>

        <ComboboxInput
          class="min-w-[60px] flex-1 border-none py-0.5 pl-1 text-xs leading-5 text-text-primary bg-transparent focus:outline-none placeholder-text-tertiary"
          :display-value="() => ''"
          @change="query = $event.target.value"
          :placeholder="modelValue.length === 0 ? placeholder : ''"
        />
        
        <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronsUpDown class="h-4 w-4 text-text-tertiary" aria-hidden="true" />
        </ComboboxButton>
      </div>

      <transition
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ComboboxOptions
          class="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-sm bg-layer-02 py-1 text-xs shadow-xl ring-1 ring-black/5 focus:outline-none border border-border-subtle"
        >
          <ComboboxOption
            v-for="option in filteredOptions"
            as="template"
            :key="String(option.value)"
            :value="option.value"
            v-slot="{ selected, active }"
          >
            <li
              class="relative cursor-default select-none py-2 pl-10 pr-4"
              :class="{
                'bg-interactive-01 text-white': active,
                'text-text-primary': !active,
              }"
            >
              <span
                class="block truncate"
                :class="{ 'font-medium': selected, 'font-normal': !selected }"
              >
                {{ option }}
              </span>
              <span
                v-if="selected"
                class="absolute inset-y-0 left-0 flex items-center pl-3"
                :class="{ 'text-white': active, 'text-interactive-01': !active }"
              >
                <Check class="h-3 w-3" aria-hidden="true" />
              </span>
            </li>
          </ComboboxOption>
        </ComboboxOptions>
      </transition>
    </div>
  </Combobox>
</template>
