<script setup>
import { computed, inject } from 'vue'

const props = defineProps({
  item: { type: Object, required: true },
  parentPath: { type: String, required: true }
})

// 注入父组件的状态和方法
const expandedItems = inject('expandedItems')
const activePath = inject('activePath')
const toggleExpand = inject('toggleExpand')
const navigateTo = inject('navigateTo')

const itemPath = computed(() => props.parentPath + '/' + props.item.text)
const hasChild = computed(() => props.item.items && props.item.items.length > 0)
const expanded = computed(() => expandedItems.value.has(itemPath.value))
const active = computed(() => {
  const fullPath = props.item.link || itemPath.value
  return activePath.value === fullPath || activePath.value.startsWith(fullPath + '/')
})

function onClick() {
  if (hasChild.value) {
    toggleExpand(itemPath.value)
  } else {
    navigateTo(props.item.link || itemPath.value)
  }
}
</script>

<template>
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
</template>

<style scoped>
/* 样式在父组件 custom.css 中定义 */
</style>