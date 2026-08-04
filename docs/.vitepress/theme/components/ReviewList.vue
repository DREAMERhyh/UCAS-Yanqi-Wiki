<script setup>
import { ref, onMounted } from 'vue'
import StarRating from './StarRating.vue'
import { loadReviews } from '../utils/dataLoader'

defineProps({
  reviewsPath: { type: String, required: true }
})

defineEmits(['close'])

const reviews = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  await fetchReviews()
})

async function fetchReviews() {
  loading.value = true
  error.value = null
  try {
    reviews.value = await loadReviews(props.reviewsPath)
  } catch (e) {
    error.value = e.message
    reviews.value = []
  } finally {
    loading.value = false
  }
}

function close() {
  $emit('close')
}
</script>

<template>
  <div class="review-list">
    <div class="review-list-header">
      <h4>评价列表</h4>
      <button class="close-btn" @click="close" aria-label="关闭评价列表">×</button>
    </div>

    <div v-if="loading" class="review-loading">加载评价中...</div>

    <div v-else-if="error" class="review-error">加载失败：{{ error }}</div>

    <div v-else-if="reviews.length === 0" class="review-empty">暂无评价，快来抢沙发！</div>

    <div v-else class="review-items">
      <article
        v-for="(review, index) in reviews"
        :key="index"
        class="review-item"
      >
        <header class="review-header">
          <span class="review-author">{{ review.评价人 }}</span>
          <StarRating :rating="review.评分" :show-count="false" :size="14" />
          <time class="review-time">{{ review.时间 }}</time>
        </header>
        <p class="review-content">{{ review.内容 }}</p>
      </article>
    </div>
  </div>
</template>

<style scoped>
.review-list {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--vp-c-divider);
  animation: slideDown 0.2s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.review-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.review-list-header h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.close-btn {
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: var(--vp-c-text-3);
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  border-radius: 4px;
  transition: background var(--transition-fast), color var(--transition-fast);
}

.close-btn:hover {
  background: var(--vp-c-divider);
  color: var(--vp-c-text-1);
}

.review-loading,
.review-error,
.review-empty {
  text-align: center;
  padding: 24px;
  color: var(--vp-c-text-2);
  font-size: 13px;
}

.review-error {
  color: var(--vp-c-danger);
}

.review-item {
  padding: 12px 0;
  border-bottom: 1px solid var(--vp-c-divider);
}

.review-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.review-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.review-author {
  font-weight: 500;
  color: var(--vp-c-text-1);
  font-size: 13px;
}

.review-time {
  font-size: 12px;
  color: var(--vp-c-text-3);
  margin-left: auto;
}

.review-content {
  font-size: 13px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin: 0;
}
</style>