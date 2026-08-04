import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5180/UCAS-Yanqi-Wiki/';

test.describe('检查控制台错误', () => {
  test('饮食页面控制台错误', async ({ page }) => {
    const errors = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })
    page.on('pageerror', err => {
      errors.push(err.message)
    })

    await page.goto(`${BASE_URL}food/食堂/西区一食堂/一楼/01窗口-川湘风味/`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    console.log('=== 控制台错误 ===')
    for (const err of errors) {
      console.log('ERROR:', err)
    }

    // 也打印完整的 body
    const bodyHtml = await page.locator('body').innerHTML();
    console.log('=== Body HTML ===')
    console.log(bodyHtml.slice(0, 5000))
  })
})