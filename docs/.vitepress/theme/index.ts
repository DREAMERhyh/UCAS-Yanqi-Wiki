import DefaultTheme from 'vitepress/theme';
import { h } from 'vue';
import ReviewList from './components/ReviewList.vue';
import type { Theme } from "vitepress";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component("ReviewList", ReviewList);
  },
} satisfies Theme;