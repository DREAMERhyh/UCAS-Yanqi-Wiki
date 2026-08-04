<script setup>
defineProps({
  crumb: { type: Object, required: true },
  isLast: { type: Boolean, required: true }
})

defineEmits(['click'])

function onClick() {
  if (!props.isLast) {
    $emit('click', props.crumb.path)
  }
}
</script>

<template>
  <span class="breadcrumb-item">
    <a v-if="!isLast" class="breadcrumb-link" @click="onClick">{{ crumb.text }}</a>
    <span v-else class="breadcrumb-current">{{ crumb.text }}</span>
    <span v-if="!isLast" class="breadcrumb-separator">/</span>
  </span>
</template>

<style scoped>
/* 样式在 custom.css 中定义 */
</style>