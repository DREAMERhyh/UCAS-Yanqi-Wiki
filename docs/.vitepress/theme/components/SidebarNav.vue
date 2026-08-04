<script setup>
import { ref, computed, watch, onMounted, provide, inject } from 'vue'
import { useRoute, useRouter } from 'vitepress'
import { generateNavStructure } from '../utils/dataLoader'
import NavItemRecursive from './NavItemRecursive.vue'

const route = useRoute()
const router = useRouter()

const navStructure = ref(null)
const expandedItems = ref(new Set())
const activePath = ref('')

// 初始化导航结构
onMounted(async () => {
  navStructure.value = await generateNavStructure()
  console.log('导航结构加载完成:', navStructure.value)
})

// 监听路由变化更新高亮
watch(() => route.path, (newPath) => {
  activePath.value = newPath
  expandParents(newPath)
}, { immediate: true })

function expandParents(path) {
  const parts = path.split('/').filter(Boolean)
  let currentPath = ''
  for (const part of parts) {
    currentPath += '/' + part
    expandedItems.value.add(currentPath)
  }
}

function toggleExpand(itemPath) {
  if (expandedItems.value.has(itemPath)) {
    expandedItems.value.delete(itemPath)
  } else {
    expandedItems.value.add(itemPath)
  }
}

function navigateTo(path) {
  if (path !== route.path) {
    router.go(path)
  }
}

// Provide 状态给子组件
provide('expandedItems', expandedItems)
provide('activePath', activePath)
provide('toggleExpand', toggleExpand)
provide('navigateTo', navigateTo)
</script>

<template>
  <nav class="custom-sidebar-nav" aria-label="主导航">
    <div v-if="navStructure">
      <div v-for="section in navStructure" :key="section.text" class="nav-section">
        <div class="nav-section-title">{{ section.text }}</div>
        <NavItemRecursive
          v-for="item in section.items"
          :key="item.text"
          :item="item"
          :parent-path="''"
        />
      </div>
    </div>
    <div v-else class="nav-loading">加载中...</div>
  </nav>
</template>

<style scoped>
.nav-loading {
  padding: 20px;
  text-align: center;
  color: var(--vp-c-text-2);
  font-size: 13px;
}
</style>