<script setup>
import { ref } from 'vue'
import StarRating from './StarRating.vue'
import ReviewList from './ReviewList.vue'
import { getCategoryTagClass } from '../utils/dataLoader'

defineProps({
  items: { type: Array, required: true },
  context: { type: Object, default: () => ({}) },
  isDrink: { type: Boolean, default: false }
})

const emit = defineEmits(['navigate'])

function navigateTo(path) {
  if (path) {
    emit('navigate', path)
  }
}

function getTagClass(category) {
  return getCategoryTagClass(category)
}

function toggleReviews(item) {
  if (item.reviewsPath) {
    item.showReviews = !item.showReviews
  }
}
</script>

<template>
  <div class="card-grid">
    <article
      v-for="item in items"
      :key="item.name"
      class="card food-card"
      @click="navigateTo(item.reviewsPath ? null : item.path)"
    >
      <div class="card-header">
        <h3 class="card-title">{{ item.name }}</h3>
        <span v-if="item.category" :class="['tag', getTagClass(item.category)]">{{ item.category }}</span>
      </div>

      <div class="card-meta">
        <span class="meta-item">
          <span class="meta-label">💰</span>
          <span class="meta-value">{{ item.price }}</span>
        </span>
        <span class="meta-item">
          <span class="meta-label">🕐</span>
          <span class="meta-value">{{ item.period }}</span>
        </span>
      </div>

      <!-- 评分区域 -->
      <div class="card-rating" @click.stop="toggleReviews(item)">
        <StarRating
          :rating="item.rating || 0"
          :reviews-count="item.reviewsCount || 0"
          :show-count="true"
        />
        <span v-if="item.reviewsCount > 0" class="review-toggle-hint">点击查看评价</span>
      </div>

      <!-- 评价列表（展开/折叠） -->
      <ReviewList
        v-if="item.showReviews"
        :reviews-path="item.reviewsPath"
        @close="item.showReviews = false"
      />
    </article>
  </div>
</template>

<style scoped>
.food-card {
  cursor: pointer;
}

.food-card:has(.review-list) {
  cursor: default;
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
}

.card-header .card-title {
  margin: 0;
  flex: 1;
}

.card-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--vp-c-divider);
}

.review-toggle-hint {
  font-size: 11px;
  color: var(--vp-c-text-3);
  margin-left: 4px;
}
</style>