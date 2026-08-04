<script setup>
defineProps({
  rating: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },
  showCount: { type: Boolean, default: true },
  size: { type: Number, default: 18 },
  interactive: { type: Boolean, default: false }
})

const stars = computed(() => {
  const result = []
  const fullStars = Math.floor(props.rating)
  const hasHalfStar = props.rating - fullStars >= 0.5

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      result.push({ type: 'full' })
    } else if (i === fullStars && hasHalfStar) {
      result.push({ type: 'half' })
    } else {
      result.push({ type: 'empty' })
    }
  }
  return result
})
</script>

<template>
  <div class="star-rating" :style="{ '--star-size': size + 'px' }">
    <div class="stars" role="img" :aria-label="`评分 ${rating} 分，共 5 分`">
      <span
        v-for="(star, index) in stars"
        :key="index"
        class="star"
        :class="star.type"
      ></span>
    </div>
    <span v-if="showCount" class="score">{{ rating.toFixed(1) }}</span>
    <span v-if="showCount && reviewsCount > 0" class="count">({{ reviewsCount }}条评价)</span>
  </div>
</template>

<style scoped>
.star-rating {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.stars {
  display: flex;
  gap: 2px;
}

.star {
  width: var(--star-size);
  height: var(--star-size);
  background: var(--star-empty);
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
  transition: background var(--transition-fast);
  flex-shrink: 0;
}

.star.filled {
  background: var(--star-color);
}

.star.half {
  background: linear-gradient(90deg, var(--star-color) 50%, var(--star-empty) 50%);
}

.score {
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  min-width: 2.2em;
  text-align: left;
}

.count {
  font-size: 12px;
  color: var(--vp-c-text-3);
}
</style>