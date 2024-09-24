<script setup lang="ts">
interface Props {
  values: string[]
}
const props = defineProps<Props>()
</script>

<template>
  <span v-if="!props.values">データなし</span>
  <span v-else-if="props.values.length >= 2 && props.values[1] && props.values[0]">
    {{ props.values[0] }} 〜 {{ props.values[1] }}</span
  >
  <span v-else-if="props.values.length >= 1 && props.values[0]">{{ props.values[0] }}</span>
  <span v-else>データなし</span>
</template>
