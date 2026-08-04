<script setup>
import { ref, computed, onMounted, watch, defineComponent } from 'vue'
import { useRoute, useRouter } from 'vitepress'
import FoodCard from './FoodCard.vue'
import WindowCard from './WindowCard.vue'
import FloorCard from './FloorCard.vue'
import { loadPageData, getCategoryTagClass } from '../utils/dataLoader'

const route = useRoute()
const router = useRouter()

const pageData = ref(null)
const breadcrumbs = ref([])
const contentType = ref('') // 'root', 'canteens', 'drinks', 'canteen', 'floor', 'window', 'shop', 'category'
const currentLevel = ref({})

// 页面加载时获取数据
onMounted(async () => {
  await loadContent()
})

// 路由变化时重新加载
watch(() => route.path, async () => {
  await loadContent()
}, { immediate: true })

async function loadContent() {
  const path = route.path
  // 解析路径确定当前层级
  const parsed = parsePath(path)
  currentLevel.value = parsed
  breadcrumbs.value = generateBreadcrumbs(parsed)

  // 加载对应层级的数据
  pageData.value = await loadPageData(parsed)
  contentType.value = parsed.type
}

function parsePath(path) {
  // 移除 base 路径前缀
  const basePath = '/UCAS-Yanqi-Wiki/'
  let cleanPath = path
  if (path.startsWith(basePath)) {
    cleanPath = path.slice(basePath.length - 1) // 保留开头的 /
  }

  // 解析 food 路径
  if (cleanPath === '/food/' || cleanPath === '/food') {
    return { type: 'root', path: '/food/' }
  }

  const parts = cleanPath.split('/').filter(Boolean)
  if (parts[0] !== 'food') {
    return { type: 'unknown', path }
  }

  if (parts.length === 1) {
    return { type: 'root', path: '/food/' }
  }

  if (parts[1] === '食堂') {
    if (parts.length === 2) {
      return { type: 'canteens', path: '/food/食堂/' }
    }
    if (parts.length === 3) {
      return { type: 'canteen', canteen: parts[2], path: `/food/食堂/${parts[2]}/` }
    }
    if (parts.length === 4) {
      return { type: 'floor', canteen: parts[2], floor: parts[3], path: `/food/食堂/${parts[2]}/${parts[3]}/` }
    }
    if (parts.length === 5) {
      return { type: 'window', canteen: parts[2], floor: parts[3], window: parts[4], path: `/food/食堂/${parts[2]}/${parts[3]}/${parts[4]}/` }
    }
  }

  if (parts[1] === '饮品') {
    if (parts.length === 2) {
      return { type: 'drinks', path: '/food/饮品/' }
    }
    if (parts.length === 3) {
      return { type: 'shop', shop: parts[2], path: `/food/饮品/${parts[2]}/` }
    }
    if (parts.length === 4) {
      return { type: 'category', shop: parts[2], category: parts[3], path: `/food/饮品/${parts[2]}/${parts[3]}/` }
    }
  }

  return { type: 'unknown', path }
}

function generateBreadcrumbs(level) {
  const crumbs = [{ text: '饮食', path: '/food/' }]

  switch (level.type) {
    case 'root':
      break
    case 'canteens':
      crumbs.push({ text: '食堂', path: '/food/食堂/' })
      break
    case 'canteen':
      crumbs.push({ text: '食堂', path: '/food/食堂/' })
      crumbs.push({ text: level.canteen, path: level.path })
      break
    case 'floor':
      crumbs.push({ text: '食堂', path: '/food/食堂/' })
      crumbs.push({ text: level.canteen, path: `/food/食堂/${level.canteen}/` })
      crumbs.push({ text: level.floor, path: level.path })
      break
    case 'window':
      crumbs.push({ text: '食堂', path: '/food/食堂/' })
      crumbs.push({ text: level.canteen, path: `/food/食堂/${level.canteen}/` })
      crumbs.push({ text: level.floor, path: `/food/食堂/${level.canteen}/${level.floor}/` })
      crumbs.push({ text: level.window, path: level.path })
      break
    case 'drinks':
      crumbs.push({ text: '饮品', path: '/food/饮品/' })
      break
    case 'shop':
      crumbs.push({ text: '饮品', path: '/food/饮品/' })
      crumbs.push({ text: level.shop, path: level.path })
      break
    case 'category':
      crumbs.push({ text: '饮品', path: '/food/饮品/' })
      crumbs.push({ text: level.shop, path: `/food/饮品/${level.shop}/` })
      crumbs.push({ text: level.category, path: level.path })
      break
  }

  return crumbs
}

function navigateTo(path) {
  router.go(path)
}

// BreadcrumbItem 子组件
const BreadcrumbItem = defineComponent({
  name: 'BreadcrumbItem',
  props: {
    crumb: { type: Object, required: true },
    isLast: { type: Boolean, required: true }
  },
  emits: ['click'],
  setup(props, { emit }) {
    function onClick() {
      if (!props.isLast) {
        emit('click', props.crumb.path)
      }
    }
    return { onClick }
  },
  template: `
    <span class="breadcrumb-item">
      <a v-if="!isLast" class="breadcrumb-link" @click="onClick">{{ crumb.text }}</a>
      <span v-else class="breadcrumb-current">{{ crumb.text }}</span>
      <span v-if="!isLast" class="breadcrumb-separator">/</span>
    </span>
  `
})
</script>

<template>
  <div class="custom-main-content">
    <!-- 面包屑导航 -->
    <nav class="breadcrumb" aria-label="面包屑">
      <BreadcrumbItem v-for="(crumb, index) in breadcrumbs" :key="crumb.path" :crumb="crumb" :is-last="index === breadcrumbs.length - 1" @click="navigateTo" />
    </nav>

    <!-- 搜索和排序栏 -->
    <div class="toolbar">
      <div class="search-box">
        <input type="text" class="search-input" placeholder="搜索菜品、窗口、饮品..." />
      </div>
      <select class="sort-select">
        <option value="rating">综合评分 ↓</option>
        <option value="reviews">评价数量 ↓</option>
        <option value="price-asc">价格 ↑</option>
        <option value="price-desc">价格 ↓</option>
      </select>
    </div>

    <!-- 内容区域 -->
    <div class="card-grid" v-if="pageData">
      <!-- 根级别：食堂、饮品两大板块 -->
      <FloorCard v-if="contentType === 'root'" :items="pageData" @navigate="navigateTo" />

      <!-- 食堂列表 -->
      <FloorCard v-else-if="contentType === 'canteens'" :items="pageData" @navigate="navigateTo" />

      <!-- 单个食堂的楼层列表 -->
      <FloorCard v-else-if="contentType === 'canteen'" :items="pageData" @navigate="navigateTo" :show-icon="true" />

      <!-- 楼层的窗口列表 -->
      <WindowCard v-else-if="contentType === 'floor'" :items="pageData" @navigate="navigateTo" />

      <!-- 窗口的菜品列表 -->
      <FoodCard v-else-if="contentType === 'window'" :items="pageData" :context="currentLevel" />

      <!-- 饮品店列表 -->
      <FloorCard v-else-if="contentType === 'drinks'" :items="pageData" @navigate="navigateTo" :icon="'☕'" />

      <!-- 单个饮品店的品类列表 -->
      <FloorCard v-else-if="contentType === 'shop'" :items="pageData" @navigate="navigateTo" :show-icon="true" />

      <!-- 品类下的饮品列表 -->
      <FoodCard v-else-if="contentType === 'category'" :items="pageData" :context="currentLevel" is-drink />
    </div>

    <!-- 加载状态 -->
    <div v-else-if="pageData === null" class="loading">加载中...</div>

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <p>暂无数据</p>
    </div>
  </div>
</template>

<style scoped>
.loading,
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--vp-c-text-2);
  font-size: 16px;
}
</style>