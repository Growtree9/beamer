<template>
  <div v-if="message && message.length > 0" class="text-center text-red pb-3 text-sm">
    {{ message }}
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

import { useConfiguration } from '@/stores/configuration';
import { useEthereumProvider } from '@/stores/ethereum-provider';

const ethereumProvider = useEthereumProvider();
const configuration = useConfiguration();
const { chainId } = storeToRefs(ethereumProvider);

const message = computed(() => {
  if (chainId.value > 0 && !configuration.isSupportedChain(chainId.value)) {
    return 'Connected chain is not supported';
  } else {
    return undefined;
  }
});
</script>
