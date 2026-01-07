<script setup lang="ts" generic="T extends string | number | Record<string, any>">
import { ref, computed } from 'vue'
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
} from '@headlessui/vue'
import { Check, ChevronsUpDown } from 'lucide-vue-next'

export interface SelectOption<V> {
    label: string
    value: V
}

const props = defineProps<{
    modelValue: T
    options: (T | SelectOption<T>)[]
    placeholder?: string
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: T): void
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
</script>

<template>
  <Combobox 
      :model-value="modelValue" 
      @update:model-value="val => emit('update:modelValue', val)"
      nullable
  >
    <div class="relative mt-1">
      <div
        class="relative w-full cursor-default overflow-hidden rounded-sm bg-layer-02 text-left border border-border-strong focus-within:border-interactive-01 sm:text-sm h-8 flex items-center"
      >
        <ComboboxInput
          class="w-full border-none py-1.5 pl-3 pr-10 text-xs leading-5 text-text-primary bg-transparent focus:outline-none font-mono placeholder-text-tertiary"
          :display-value="(person) => (person as string)"
          @change="query = $event.target.value"
          :placeholder="placeholder"
        />
        <ComboboxButton
          class="absolute inset-y-0 right-0 flex items-center pr-2"
        >
          <ChevronsUpDown
            class="h-4 w-4 text-text-tertiary"
            aria-hidden="true"
          />
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
          <div
            v-if="filteredOptions.length === 0 && query !== ''"
            class="relative cursor-default select-none px-4 py-2 text-text-tertiary italic"
          >
            Press Enter to create "{{ query }}"
          </div>

          <ComboboxOption
            v-for="option in filteredOptions"
            as="template"
            :key="String(option.value)"
            :value="option.value"
            v-slot="{ selected, active }"
          >
            <li
              class="relative cursor-default select-none py-2 pl-10 pr-4 font-mono"
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
