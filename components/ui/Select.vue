<template>
  <Listbox v-model="selected" :disabled="disabled" as="div" class="relative" v-slot="{ open }">
    <ListboxLabel v-if="label" class="admin-label">
      {{ label }}
    </ListboxLabel>
    <div class="relative" ref="buttonRef">
      <ListboxButton
        :class="[
          compact ? 'py-2 pl-3 pr-8 text-xs' : 'py-3.5 pl-4 pr-10 text-sm',
          'relative w-full cursor-default rounded-xl bg-white text-left border border-slate-200 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/20 transition-all font-bold tracking-tight text-slate-900 shadow-sm'
        ]"
      >
        <span class="block truncate">{{ selectedLabel || placeholder }}</span>
        <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <LucideChevronDown :class="compact ? 'h-4 w-4' : 'h-5 w-5'" class="text-slate-400" aria-hidden="true" />
        </span>
      </ListboxButton>

      <Teleport to="body">
        <div v-if="open" :style="dropdownStyle" class="fixed z-[9999]">
          <div :class="[updateInternalOpen(open)]"></div>
          <transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <ListboxOptions
              static
              :class="[
                compact ? 'text-xs' : 'text-sm',
                'max-h-60 overflow-auto rounded-2xl bg-white py-2 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none border border-slate-100'
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
                    'relative cursor-default select-none transition-colors font-bold tracking-tight ',
                    compact ? 'py-2.5 pl-10 pr-4' : 'py-3.5 pl-12 pr-5'
                  ]"
                >
                  <span :class="[isSelected ? 'text-brand-gold' : 'font-semibold', 'block truncate']">
                    {{ typeof option === 'string' ? option : option.label }}
                  </span>
                  <span
                    v-if="isSelected"
                    class="absolute inset-y-0 left-0 flex items-center"
                    :class="compact ? 'pl-3' : 'pl-4'"
                  >
                    <LucideCheck :class="compact ? 'h-4 w-4' : 'h-5 w-5'" aria-hidden="true" />
                  </span>
                </li>
              </ListboxOption>
            </ListboxOptions>
          </transition>
        </div>
      </Teleport>
    </div>
  </Listbox>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, nextTick, watch } from 'vue';
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

const buttonRef = ref(null);
const dropdownStyle = ref({});
const internalOpen = ref(false);

const updateInternalOpen = (open) => {
  if (internalOpen.value !== open) {
    internalOpen.value = open;
  }
  return '';
};

const updatePosition = () => {
  if (!buttonRef.value || !internalOpen.value) return;
  const rect = buttonRef.value.getBoundingClientRect();
  
  // Only update if position actually changed to avoid jitters
  const newTop = `${rect.bottom + 8}px`;
  const newLeft = `${rect.left}px`;
  const newWidth = `${rect.width}px`;
  
  if (dropdownStyle.value.top !== newTop || 
      dropdownStyle.value.left !== newLeft || 
      dropdownStyle.value.width !== newWidth) {
    dropdownStyle.value = {
      top: newTop,
      left: newLeft,
      width: newWidth,
    };
  }
};

watch(internalOpen, (val) => {
  if (val) {
    nextTick(updatePosition);
  }
});

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

onMounted(() => {
  window.addEventListener('resize', updatePosition);
  window.addEventListener('scroll', updatePosition, true);
});

onUnmounted(() => {
  window.removeEventListener('resize', updatePosition);
  window.removeEventListener('scroll', updatePosition, true);
});
</script>

