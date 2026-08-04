<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useData, useRoute } from 'vitepress'
import SidebarNav from './components/SidebarNav.vue'
import ContentArea from './components/ContentArea.vue'

const { frontmatter } = useData()
const route = useRoute()
const isSidebarOpen = ref(false)

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value
}

function closeSidebar() {
  isSidebarOpen.value = false
}

// 监听路由变化关闭侧边栏（移动端）
onMounted(() => {
  // 可以在这里添加键盘快捷键等
})

onUnmounted(() => {
  // 清理
})
</script>

<template>
  <div class="VPLayout">
    <!-- 移动端菜单按钮 -->
    <button class="mobile-menu-btn" @click="toggleSidebar" aria-label="切换菜单">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
    </button>

    <!-- 侧边栏遮罩层 -->
    <div class="sidebar-overlay" :class="{ open: isSidebarOpen }" @click="closeSidebar"></div>

    <!-- 左侧导航栏 -->
    <aside class="custom-sidebar" :class="{ open: isSidebarOpen }">
      <div class="custom-sidebar-header">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
          <path d="M2 17l10 5 10-5"></path>
          <path d="M2 12l10 5 10-5"></path>
        </svg>
        雁栖湖饮食指南
      </div>
      <SidebarNav @navigate="closeSidebar" />
    </aside>

    <!-- 主内容区 -->
    <main class="custom-main">
      <ContentArea />
    </main>
  </div>
</template>

<style scoped>
/* Layout 组件样式已在 custom.css 中定义 */
</style>