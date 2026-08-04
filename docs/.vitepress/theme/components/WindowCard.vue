<script setup>
import { getCategoryTagClass } from '../utils/dataLoader'

defineProps({
  items: { type: Array, required: true }
})

defineEmits(['navigate'])

function navigateTo(path) {
  $emit('navigate', path)
}

function getTagClass(category) {
  return getCategoryTagClass(category)
}
</script>

<template>
  <div class="card-grid">
    <article
      v-for="item in items"
      :key="item.name"
      class="card window-card"
      @click="navigateTo(item.path)"
    >
      <div class="card-header">
        <h3 class="card-title">{{ item.name }}</h3>
        <span :class="['tag', getTagClass(item.category)]">{{ item.category }}</span>
      </div>

      <p class="card-text">{{ item.description }}</p>

      <div class="card-footer">
        <span class="meta-item">点击查看菜品</span>
        <span class="arrow">→</span>
      </div>
    </article>
  </div>
</template>

<style scoped>
.window-card {
  cursor: pointer;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
  font-size: 13px;
}

.arrow {
  color: var(--vp-c-brand-1);
  font-weight: bold;
}
</style>