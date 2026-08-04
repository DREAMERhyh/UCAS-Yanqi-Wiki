// 主题入口文件
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    // 注册全局组件
  }
}