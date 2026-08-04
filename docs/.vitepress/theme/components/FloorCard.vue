<script setup>
defineProps({
  items: { type: Array, required: true },
  showIcon: { type: Boolean, default: false },
  icon: { type: String, default: '' }
})

defineEmits(['navigate'])

function navigateTo(path) {
  $emit('navigate', path)
}
</script>

<template>
  <div class="card-grid">
    <article
      v-for="item in items"
      :key="item.text || item.name"
      class="card floor-card"
      @click="navigateTo(item.path)"
    >
      <div v-if="showIcon && (item.icon || icon)" class="floor-icon">
        {{ item.icon || icon }}
      </div>

      <div v-if="item.text" class="floor-number">{{ item.text }}</div>
      <div v-else-if="item.name" class="floor-number">{{ item.name }}</div>

      <div v-if="item.text || item.name" class="floor-name">
        {{ item.description || item.count + ' 个子项' }}
      </div>

      <div v-if="item.count !== undefined && item.count > 0" class="floor-count">
        {{ item.count }} 个子项
      </div>
    </article>
  </div>
</template>

<style scoped>
.floor-card {
  cursor: pointer;
  text-align: center;
}

.floor-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.9;
}

.floor-number {
  font-size: 28px;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  margin-bottom: 8px;
}

.floor-name {
  font-size: 14px;
  color: var(--vp-c-text-2);
  margin-bottom: 8px;
}

.floor-count {
  font-size: 12px;
  color: var(--vp-c-text-3);
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  padding: 4px 12px;
  border-radius: 12px;
  display: inline-block;
}
</style>