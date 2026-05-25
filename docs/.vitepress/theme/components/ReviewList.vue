<template>
  <div class="review-list">
    <h3 class="review-title">用户评价</h3>
    <div v-if="reviews.length === 0" class="empty-state">
      <p>暂无评价，快来发表第一个评价吧！</p>
    </div>
    <div v-else class="reviews">
      <div
        v-for="review in reviews"
        :key="review.filename"
        class="review-card"
      >
        <div class="review-header">
          <span class="review-author">{{ review.author }}</span>
          <span class="review-date">{{ formatDate(review.date) }}</span>
        </div>
        <div class="review-rating">
          <span v-for="i in 5" :key="i" class="star">
            {{ i <= review.rating ? '★' : '☆' }}
          </span>
        </div>
        <div v-if="review.sweetness_choice || review.ice_choice" class="review-options">
          <span v-if="review.sweetness_choice" class="option-tag">
            甜度：{{ review.sweetness_choice }}
          </span>
          <span v-if="review.ice_choice" class="option-tag">
            冰量：{{ review.ice_choice }}
          </span>
        </div>
        <div class="review-content">{{ review.content }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Review {
  filename: string;
  author: string;
  date: string;
  rating: number;
  sweetness_choice?: string;
  ice_choice?: string;
  content: string;
}

const props = defineProps<{
  product: string;
}>();

// 使用 import.meta.glob 动态导入所有 reviews.json 文件
const reviewModules = import.meta.glob('/饮食/跨区域品牌与设备/咖啡角儿/*/reviews.json');

const reviews = ref<Review[]>([]);

// 根据 product prop 查找对应的 reviews.json
const targetPath = computed(() => `/饮食/跨区域品牌与设备/咖啡角儿/${props.product}/reviews.json`);

(async () => {
  const loader = reviewModules[targetPath.value];
  if (loader) {
    try {
      const module = await loader() as { default: Review[] };
      reviews.value = module.default || [];
    } catch (e) {
      console.warn('Failed to load reviews for:', props.product);
    }
  }
})();

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return dateStr;
  }
}
</script>

<style scoped>
.review-list {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;
}

.review-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
}

.empty-state {
  padding: 2rem;
  text-align: center;
  background: #f9f9f9;
  border-radius: 8px;
  color: #999;
}

.reviews {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.review-card {
  padding: 1rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.review-author {
  font-weight: 600;
  color: #333;
}

.review-date {
  font-size: 0.875rem;
  color: #999;
}

.review-rating {
  margin-bottom: 0.75rem;
}

.star {
  font-size: 1.25rem;
  color: #ffc107;
  margin-right: 2px;
}

.review-options {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.option-tag {
  padding: 0.25rem 0.5rem;
  background: #f0f0f0;
  border-radius: 4px;
  font-size: 0.875rem;
  color: #666;
}

.review-content {
  color: #555;
  line-height: 1.6;
}
</style>