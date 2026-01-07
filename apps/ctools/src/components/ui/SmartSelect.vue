<script setup lang="ts" generic="T extends string | number | Record<string, any>">
import { computed } from 'vue'
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/vue'
import { Check, ChevronDown } from 'lucide-vue-next'

export interface SelectOption<V> {
    label: string
    value: V
}

const props = defineProps<{
    modelValue: T
    options: (T | SelectOption<T>)[]
    placeholder?: string
    invalid?: boolean
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: T): void
}>()

const normalizedOptions = computed(() => {
    return props.options.map(opt => {
        if (typeof opt === 'object' && opt !== null && 'label' in opt && 'value' in opt) {
            return opt as SelectOption<T>
        }
        return { label: String(opt), value: opt } as SelectOption<T>
    })
})

const selectedLabel = computed(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const found = normalizedOptions.value.find(o => (o.value as any) === (props.modelValue as any))
    return found ? found.label : (props.placeholder || 'Select...')
})
</script>

<template>
  <Listbox :model-value="modelValue" @update:model-value="val => emit('update:modelValue', val)">
    <div class="relative w-full">
      <ListboxButton
        class="relative w-full cursor-default rounded-sm bg-layer-02 py-1.5 pl-3 pr-10 text-left border text-xs focus:outline-none focus:border-interactive-01 transition-colors h-8 flex items-center"
        :class="[
            invalid ? 'border-red-500' : 'border-border-strong hover:border-interactive-02',
            !modelValue && placeholder ? 'text-text-tertiary' : 'text-text-primary'
        ]"
      >
        <span class="block truncate">{{ selectedLabel }}</span>
        <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronDown class="h-4 w-4 text-text-tertiary" aria-hidden="true" />
        </span>
      </ListboxButton>

      <transition
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ListboxOptions
          class="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-sm bg-layer-02 py-1 text-xs shadow-xl ring-1 ring-black/5 focus:outline-none border border-border-subtle"
        >
          <ListboxOption
            v-slot="{ active, selected }"
            v-for="option in normalizedOptions"
            :key="String(option.value)"
            :value="option.value"
            as="template"
          >
            <li
              :class="[
                active ? 'bg-interactive-01 text-white' : 'text-text-primary',
                'relative cursor-default select-none py-2 pl-10 pr-4'
              ]"
            >
              <span
                :class="[
                  selected ? 'font-medium' : 'font-normal',
                  'block truncate'
                ]"
                >{{ option.label }}</span
              >
              <span
                v-if="selected"
                class="absolute inset-y-0 left-0 flex items-center pl-3"
                :class="active ? 'text-white' : 'text-interactive-01'"
              >
                <Check class="h-4 w-4" aria-hidden="true" />
              </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>
