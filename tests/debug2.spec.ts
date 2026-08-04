import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5180/UCAS-Yanqi-Wiki/';

test.describe('检查深层页面路由和内容', () => {
  test('深层页面路径解析', async ({ page }) => {
    const errors = []
    page.on('console', msg => {
      console.log('CONSOLE:', msg.type(), msg.text())
    })
    page.on('pageerror', err => {
      console.log('PAGE ERROR:', err.message)
    })

    await page.goto(`${BASE_URL}food/%E9%A3%9F%E5%A0%82/%E8%A5%BF%E5%8C%BA%E4%B8%80%E9%A3%9F%E5%A0%82/%E4%B8%80%E6%A5%BC/01%E7%AA%97%E5%8F%A3-%E5%B7%9D%E6%B9%98%E9%A3%8E%E5%91%B3/`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const url = page.url()
    console.log('URL:', url)

    const bodyHtml = await page.locator('body').innerHTML();
    console.log('=== Body HTML ===')
    console.log(bodyHtml.slice(0, 8000))
  })
})