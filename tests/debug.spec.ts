import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5180/UCAS-Yanqi-Wiki/';

test.describe('调试页面结构', () => {
  test('首页 HTML 结构', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // 打印 body 内容
    const bodyHtml = await page.locator('body').innerHTML();
    console.log('=== 首页 Body ===');
    console.log(bodyHtml.slice(0, 3000));
  });

  test('饮食页面 HTML 结构', async ({ page }) => {
    await page.goto(`${BASE_URL}food/`);
    await page.waitForLoadState('networkidle');

    const bodyHtml = await page.locator('body').innerHTML();
    console.log('=== 饮食页 Body ===');
    console.log(bodyHtml.slice(0, 5000));
  });

  test('深层页面 HTML 结构', async ({ page }) => {
    await page.goto(`${BASE_URL}food/食堂/西区一食堂/一楼/01窗口-川湘风味/`);
    await page.waitForLoadState('networkidle');

    const bodyHtml = await page.locator('body').innerHTML();
    console.log('=== 深层页面 Body ===');
    console.log(bodyHtml.slice(0, 8000));

    // 检查具体组件
    const customMain = await page.locator('.custom-main').innerHTML();
    console.log('=== custom-main ===');
    console.log(customMain.slice(0, 5000));
  });

  test('检查 Vue 组件是否挂载', async ({ page }) => {
    await page.goto(`${BASE_URL}food/食堂/西区一食堂/一楼/01窗口-川湘风味/`);
    await page.waitForLoadState('networkidle');

    // 检查是否有 Vue 组件实例
    const vueApp = await page.evaluate(() => {
      const app = document.querySelector('#app');
      return app ? app.__vue_app__ : null;
    });
    console.log('Vue App:', vueApp);

    // 检查 custom-main-content
    const content = await page.locator('.custom-main-content').count();
    console.log('custom-main-content count:', content);

    // 检查 ContentArea 组件
    const contentArea = await page.locator('[data-v-]').count();
    console.log('Vue scoped elements:', contentArea);
  });
});