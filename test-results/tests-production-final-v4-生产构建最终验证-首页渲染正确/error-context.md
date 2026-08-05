# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\production-final-v4.spec.ts >> 生产构建最终验证 >> 首页渲染正确
- Location: tests\production-final-v4.spec.ts:11:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('h1, .VPHomeHero h1, .home h1, .vp-doc h1').first()
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('h1, .VPHomeHero h1, .home h1, .vp-doc h1').first()

```

```yaml
- complementary:
  - img
  - text: 雁栖湖饮食指南
  - navigation "主导航": 食堂 西区一食堂 ▶ 一楼 二楼 三楼 西区二食堂 ▶ 一楼 二楼 东区三食堂 东区四食堂 西区五食堂 饮品 咖啡角 西区奶茶店 东区咖啡厅
- main
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | const BASE_URL = 'http://localhost:4177/UCAS-Yanqi-Wiki/';
  4  | 
  5  | test.describe('生产构建最终验证', () => {
  6  |   test.beforeEach(async ({ page }) => {
  7  |     await page.goto(BASE_URL);
  8  |     await page.waitForLoadState('networkidle');
  9  |   });
  10 | 
  11 |   test('首页渲染正确', async ({ page }) => {
  12 |     // 首页使用默认 VitePress 布局，查找标题
  13 |     const title = page.locator('h1, .VPHomeHero h1, .home h1, .vp-doc h1').first();
> 14 |     await expect(title).toBeVisible({ timeout: 10000 });
     |                         ^ Error: expect(locator).toBeVisible() failed
  15 |     const text = await title.textContent();
  16 |     console.log('首页标题:', text?.trim());
  17 |     expect(text).toContain('雁栖湖校园指南');
  18 |   });
  19 | 
  20 |   test('饮食页面 - 左侧导航栏显示', async ({ page }) => {
  21 |     await page.goto(`${BASE_URL}food/`);
  22 |     await page.waitForLoadState('networkidle');
  23 | 
  24 |     const sidebar = page.locator('.custom-sidebar');
  25 |     await expect(sidebar).toBeVisible();
  26 | 
  27 |     const navItems = page.locator('.custom-sidebar-nav .nav-item-toggle');
  28 |     const count = await navItems.count();
  29 |     expect(count).toBeGreaterThan(0);
  30 |     console.log('导航项总数:', count);
  31 |   });
  32 | 
  33 |   test('饮食页面 - 右侧内容区卡片渲染', async ({ page }) => {
  34 |     await page.goto(`${BASE_URL}food/`);
  35 |     await page.waitForLoadState('networkidle');
  36 | 
  37 |     const cards = page.locator('.floor-card, .card:has(.card-title)');
  38 |     const count = await cards.count();
  39 |     console.log('内容区卡片总数:', count);
  40 |     expect(count).toBeGreaterThan(0);
  41 |   });
  42 | 
  43 |   test('深层页面 - 面包屑导航', async ({ page }) => {
  44 |     await page.goto(`${BASE_URL}food/%E9%A3%9F%E5%A0%82/%E8%A5%BF%E5%8C%BA%E4%B8%80%E9%A3%9F%E5%A0%82/%E4%B8%80%E6%A5%BC/01%E7%AA%97%E5%8F%A3-%E5%B7%9D%E6%B9%98%E9%A3%8E%E5%91%B3/`);
  45 |     await page.waitForLoadState('networkidle');
  46 | 
  47 |     const breadcrumb = page.locator('.breadcrumb');
  48 |     await expect(breadcrumb).toBeVisible();
  49 | 
  50 |     const links = breadcrumb.locator('a');
  51 |     const count = await links.count();
  52 |     console.log('面包屑链接数:', count);
  53 |     expect(count).toBeGreaterThan(0);
  54 |   });
  55 | 
  56 |   test('深层页面 - 菜品卡片渲染', async ({ page }) => {
  57 |     await page.goto(`${BASE_URL}food/%E9%A3%9F%E5%A0%82/%E8%A5%BF%E5%8C%BA%E4%B8%80%E9%A3%9F%E5%A0%82/%E4%B8%80%E6%A5%BC/01%E7%AA%97%E5%8F%A3-%E5%B7%9D%E6%B9%98%E9%A3%8E%E5%91%B3/`);
  58 |     await page.waitForLoadState('networkidle');
  59 | 
  60 |     const cards = page.locator('.food-card');
  61 |     const count = await cards.count();
  62 |     console.log('菜品卡片数量:', count);
  63 |     expect(count).toBeGreaterThan(0);
  64 |   });
  65 | 
  66 |   test('评分星级显示', async ({ page }) => {
  67 |     await page.goto(`${BASE_URL}food/%E9%A3%9F%E5%A0%82/%E8%A5%BF%E5%8C%BA%E4%B8%80%E9%A3%9F%E5%A0%82/%E4%B8%80%E6%A5%BC/01%E7%AA%97%E5%8F%A3-%E5%B7%9D%E6%B9%98%E9%A3%8E%E5%91%B3/`);
  68 |     await page.waitForLoadState('networkidle');
  69 | 
  70 |     const starRatings = page.locator('.star-rating');
  71 |     const count = await starRatings.count();
  72 |     console.log('星级评分组件数:', count);
  73 |     expect(count).toBeGreaterThan(0);
  74 | 
  75 |     // 验证半星支持
  76 |     for (let i = 0; i < count; i++) {
  77 |       const rating = starRatings.nth(i);
  78 |       const score = await rating.locator('.score').textContent();
  79 |       const stars = await rating.locator('.star').count();
  80 |       console.log(`  评分 ${i}:`, score?.trim(), '星星数:', stars);
  81 |     }
  82 |   });
  83 | });
```