<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vitepress'
import { generateNavStructure } from '../utils/dataLoader'

const route = useRoute()
const router = useRouter()

const navStructure = ref(null)
const expandedItems = ref(new Set())
const activePath = ref('')

// 初始化导航结构
onMounted(async () => {
  navStructure.value = await generateNavStructure()
})

// 监听路由变化更新高亮
watch(() => route.path, (newPath) => {
  activePath.value = newPath
  // 自动展开当前路径对应的父级
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

function isExpanded(itemPath) {
  return expandedItems.value.has(itemPath)
}

function isActive(itemPath) {
  if (!itemPath) return false
  return activePath.value === itemPath || activePath.value.startsWith(itemPath + '/')
}

function hasChildren(item) {
  return item.items && item.items.length > 0
}

function navigateTo(path) {
  if (path !== route.path) {
    router.go(path)
  }
}
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

<script>
// 递归导航项组件 - 使用普通 script 导出
import { computed, defineComponent } from 'vue'

export default {
  components: {
    NavItemRecursive: defineComponent({
      name: 'NavItemRecursive',
      props: {
        item: { type: Object, required: true },
        parentPath: { type: String, required: true }
      },
      setup(props) {
        const itemPath = computed(() => props.parentPath + '/' + props.item.text)
        const hasChild = computed(() => props.item.items && props.item.items.length > 0)
        const expanded = computed(() => isExpanded(itemPath.value))
        const active = computed(() => isActive(props.item.link || itemPath.value))

        function onClick() {
          if (hasChild.value) {
            toggleExpand(itemPath.value)
          } else {
            navigateTo(props.item.link || itemPath.value)
          }
        }

        return { itemPath, hasChild, expanded, active, onClick }
      },
      template: `
        <div class="nav-item">
          <div
            class="nav-item-toggle"
            :class="{
              active: active,
              'has-children': hasChild
            }"
            @click="onClick"
          >
            <span>{{ item.text }}</span>
            <span v-if="hasChild" class="expand-icon">▶</span>
          </div>
          <div v-if="hasChild" class="nav-item-children" :class="{ expanded: expanded }">
            <NavItemRecursive
              v-for="child in item.items"
              :key="child.text"
              :item="child"
              :parent-path="itemPath"
            />
          </div>
        </div>
      `
    })
  }
}
</script>

<style scoped>
.nav-loading {
  padding: 20px;
  text-align: center;
  color: var(--vp-c-text-2);
  font-size: 13px;
}
</style>