<template>
  <Listbox v-model="selected" :disabled="disabled" as="div" class="relative">
    <ListboxLabel v-if="label" class="block text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1.5">
      {{ label }}
    </ListboxLabel>
    <div class="relative">
      <ListboxButton
        :class="[
          compact ? 'py-1.5 pl-3 pr-8 text-[9px]' : 'py-4 pl-4 pr-10 text-xs',
          'relative w-full cursor-default rounded-sm bg-gray-50 text-left border border-gray-100 focus:outline-none focus:border-brand-gold transition-colors font-bold tracking-widest uppercase'
        ]"
      >
        <span class="block truncate">{{ selectedLabel || placeholder }}</span>
        <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <LucideChevronDown :class="compact ? 'h-3 w-3' : 'h-4 w-4'" class="text-slate-400" aria-hidden="true" />
        </span>
      </ListboxButton>

      <transition
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ListboxOptions
          :class="[
            compact ? 'text-[9px]' : 'text-xs',
            'absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-sm bg-white py-1 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none'
          ]"
        >
          <ListboxOption
            v-slot="{ active, selected: isSelected }"
            v-for="option in options"
            :key="typeof option === 'string' ? option : option.value"
            :value="typeof option === 'string' ? option : option.value"
            as="template"
          >
            <li
              :class="[
                active ? 'bg-brand-gold/5 text-brand-gold' : 'text-slate-900',
                'relative cursor-default select-none transition-colors font-bold tracking-widest uppercase',
                compact ? 'py-2 pl-8 pr-4' : 'py-3 pl-10 pr-4'
              ]"
            >
              <span :class="[isSelected ? 'text-brand-gold' : 'font-medium', 'block truncate']">
                {{ typeof option === 'string' ? option : option.label }}
              </span>
              <span
                v-if="isSelected"
                class="absolute inset-y-0 left-0 flex items-center"
                :class="compact ? 'pl-2' : 'pl-3'"
              >
                <LucideCheck :class="compact ? 'h-3 w-3' : 'h-4 w-4'" aria-hidden="true" />
              </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>

<script setup>
import { computed } from 'vue';
import {
  Listbox,
  ListboxLabel,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/vue';
import { LucideChevronDown, LucideCheck } from 'lucide-vue-next';

const props = defineProps({
  modelValue: [String, Number, Object],
  options: {
    type: Array,
    required: true,
  },
  label: String,
  placeholder: {
    type: String,
    default: 'Select option',
  },
  disabled: Boolean,
  compact: Boolean,
});

const emit = defineEmits(['update:modelValue']);

const selected = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const selectedLabel = computed(() => {
  const option = props.options.find((o) => 
    typeof o === 'string' ? o === props.modelValue : o.value === props.modelValue
  );
  return typeof option === 'string' ? option : option?.label;
});
</script>
