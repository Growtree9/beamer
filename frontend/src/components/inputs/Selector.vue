<template>
  <div :class="selectorClasses" v-bind="$attrs" data-test="open-trigger" @click="openSelector">
    <span v-if="modelValue === null" :class="placeholderClasses">{{ placeholder }}</span>
    <template v-else>
      <img v-if="modelValue.imageUrl" class="h-7" :src="modelValue.imageUrl" />
      <div class="flex-1"></div>
      <span>{{ modelValue.label }}</span>
    </template>

    <img src="@/assets/images/caret-down.svg" class="h-[1rem] w-[1rem] ml-2" />
  </div>

  <Transition>
    <div
      v-if="opened"
      :class="selectionOverlayClasses"
      data-test="option-list"
      @keyup.esc="closeSelector"
    >
      <span class="text-xl pl-2">{{ label }}</span>
      <BasicInput
        v-model="searchFilter"
        name="searchFilter"
        placeholder="Search"
        :focus-on-mount="true"
        class="flex-[0_0_2.5rem]"
        data-test="search-field"
      />
      <div
        class="flex flex-col gap-2 w-full h-full overflow-y-scroll overflow-x-hidden no-scrollbar"
      >
        <div
          v-for="option in filteredOptions"
          :key="option.label"
          :class="[
            optionClasses,
            option.label === modelValue?.label ? highlightedOptionClasses : '',
          ]"
          data-test="option"
          @click="selectOption(option)"
        >
          <img v-if="displayOptionIcon" class="h-7" :src="option.imageUrl ?? PlaceholderImage" />
          <span>{{ option.label }}</span>
        </div>
      </div>
      <div class="items-end">
        <div
          class="text-3xl cursor-pointer text-sea-green"
          data-test="close-trigger"
          @click="closeSelector"
        >
          &lt;
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

import PlaceholderImage from '@/assets/images/question-mark.svg';
import BasicInput from '@/components/inputs/BasicInput.vue';
import type { SelectorOption } from '@/types/form';

interface Props {
  modelValue: SelectorOption<unknown> | null;
  readonly options: SelectorOption<unknown>[];
  readonly placeholder: string;
  readonly displayOptionIcon?: boolean;
  readonly disabled?: boolean;
  readonly label?: string;
}

interface Emits {
  (e: 'update:modelValue', value: SelectorOption<unknown>): void;
  (e: 'opened'): void;
  (e: 'closed'): void;
}

const props = withDefaults(defineProps<Props>(), {
  displayOptionIcon: true,
  label: undefined,
});
const emits = defineEmits<Emits>();

const opened = ref(false);
const openSelector = () => {
  if (!props.disabled) {
    opened.value = true;
    emits('opened');
  }
};
const closeSelector = () => {
  opened.value = false;
  emits('closed');
};

const searchFilter = ref('');
const filteredOptions = computed(() =>
  props.options.filter((option) =>
    option.label.toLowerCase().includes(searchFilter.value.toLowerCase()),
  ),
);

const selectOption = (option: SelectorOption<unknown>) => {
  emits('update:modelValue', option);
  closeSelector();
};

const selectorConditionalClasses = computed(() =>
  props.disabled
    ? 'text-sea-green bg-transparent border-2 border-sea-green cursor-default'
    : 'text-teal bg-sea-green cursor-text',
);
const selectorClasses = computed(
  () => `flex flex-row items-center justify-end 
  h-10 w-full px-4 rounded-xl shadow-inner
  text text-right ${selectorConditionalClasses.value}`,
);
const placeholderClasses = computed(() => `opacity-25 ${props.disabled ? '' : ' text-black'}`);
const selectionOverlayClasses = `absolute top-0 bottom-0 right-0 left-0
  bg-teal z-20 rounded-b-lg px-4 py-4 md:px-8 md:py-6
  flex flex-col gap-3
`;
const optionClasses = `flex flex-row items-center gap-4 cursor-pointer
  flex-[0_0_2.5rem] w-full px-4 rounded-xl border border-sea-green text-mint text
  hover:border-teal-dark hover:bg-teal-dark
`;
const highlightedOptionClasses = `!text-sea-green font-semibold bg-teal-dark`;
</script>
