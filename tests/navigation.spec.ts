import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5180/UCAS-Yanqi-Wiki/';

test.describe('导航栏功能测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  test('首页加载正常', async ({ page }) => {
    await expect(page.locator('h1, .vp-doc h1, [class*="hero"] h1, .VPHomeHero h1, .home h1')).toBeVisible({ timeout: 10000 });
    const title = page.locator('h1, .vp-doc h1, [class*="hero"] h1, .VPHomeHero h1, .home h1').first();
    const text = await title.textContent();
    console.log('首页标题:', text?.trim());
  });

  test('饮食页面导航栏显示', async ({ page }) => {
    await page.goto(`${BASE_URL}food/`);
    await page.waitForLoadState('networkidle');

    // 检查左侧导航栏是否存在 - 使用更具体的选择器
    const sidebar = page.locator('aside.custom-sidebar');
    await expect(sidebar).toBeVisible({ timeout: 10000 });

    // 检查导航栏内容
    const navItems = page.locator('.custom-sidebar-nav .nav-item-toggle');
    const count = await navItems.count();
    console.log('导航项数量:', count);

    // 打印所有导航项文本
    for (let i = 0; i < count; i++) {
      const text = await navItems.nth(i).textContent();
      console.log(`导航项 ${i}:`, text?.trim());
    }
  });

  test('导航栏层级展开/折叠', async ({ page }) => {
    await page.goto(`${BASE_URL}food/`);
    await page.waitForLoadState('networkidle');

    // 查找"食堂"展开按钮
    const canteenToggle = page.locator('.custom-sidebar-nav .nav-item-toggle:has-text("食堂")').first();
    if (await canteenToggle.count() > 0) {
      await canteenToggle.click();
      await page.waitForTimeout(300);

      // 检查是否展开显示子项
      const childItems = page.locator('.nav-item-children.expanded .nav-item-toggle');
      const childCount = await childItems.count();
      console.log('食堂子项数量:', childCount);

      for (let i = 0; i < childCount; i++) {
        const text = await childItems.nth(i).textContent();
        console.log(`  子项 ${i}:`, text?.trim());
      }
    }
  });

  test('点击导航项跳转', async ({ page }) => {
    await page.goto(`${BASE_URL}food/`);
    await page.waitForLoadState('networkidle');

    // 先展开食堂
    const canteenToggle = page.locator('.custom-sidebar-nav .nav-item-toggle:has-text("食堂")').first();
    if (await canteenToggle.count() > 0) {
      await canteenToggle.click();
      await page.waitForTimeout(300);
    }

    // 点击"西区一食堂"
    const westCanteen = page.locator('.custom-sidebar-nav .nav-item-toggle:has-text("西区一食堂")').first();
    if (await westCanteen.count() > 0) {
      await westCanteen.click();
      await page.waitForTimeout(300);
    }

    // 点击"一楼" - 使用更具体的选择器避免点击到父级
    const firstFloor = page.locator('.nav-item-children .nav-item-toggle:has-text("一楼")').first();
    if (await firstFloor.count() > 0) {
      await firstFloor.click();
      await page.waitForTimeout(300);
    }

    // 点击窗口
    const window01 = page.locator('.nav-item-children .nav-item-toggle:has-text("01窗口-川湘风味")').first();
    if (await window01.count() > 0) {
      await window01.click();
      await page.waitForLoadState('networkidle');

      // 验证URL变化
      console.log('当前URL:', page.url());

      // 检查右侧内容区是否显示菜品卡片
      const foodCards = page.locator('.food-card, .card.food-card, [class*="food-card"]');
      const cardCount = await foodCards.count();
      console.log('菜品卡片数量:', cardCount);
    }
  });

  test('面包屑导航', async ({ page }) => {
    await page.goto(`${BASE_URL}food/食堂/西区一食堂/一楼/01窗口-川湘风味/`);
    await page.waitForLoadState('networkidle');

    const breadcrumb = page.locator('.custom-main-content .breadcrumb, main .breadcrumb').first();
    await expect(breadcrumb).toBeVisible({ timeout: 10000 });

    const links = breadcrumb.locator('a');
    const count = await links.count();
    console.log('面包屑链接数:', count);

    for (let i = 0; i < count; i++) {
      const text = await links.nth(i).textContent();
      const href = await links.nth(i).getAttribute('href');
      console.log(`  面包屑 ${i}:`, text?.trim(), '->', href);
    }
  });

  test('右侧内容区卡片渲染', async ({ page }) => {
    await page.goto(`${BASE_URL}food/食堂/西区一食堂/一楼/01窗口-川湘风味/`);
    await page.waitForLoadState('networkidle');

    // 检查卡片网格
    const cardGrid = page.locator('.custom-main-content .card-grid, main .card-grid').first();
    await expect(cardGrid).toBeVisible({ timeout: 10000 });

    const cards = page.locator('.custom-main-content .card, main .card, .custom-main-content .food-card, main .food-card');
    const count = await cards.count();
    console.log('内容区卡片总数:', count);

    for (let i = 0; i < Math.min(count, 5); i++) {
      const card = cards.nth(i);
      const title = await card.locator('.card-title, h3, h4').first().textContent();
      console.log(`  卡片 ${i}:`, title?.trim());
    }
  });

  test('评分星级显示', async ({ page }) => {
    await page.goto(`${BASE_URL}food/食堂/西区一食堂/一楼/01窗口-川湘风味/`);
    await page.waitForLoadState('networkidle');

    const starRatings = page.locator('.custom-main-content .star-rating, main .star-rating');
    const count = await starRatings.count();
    console.log('星级评分组件数:', count);

    for (let i = 0; i < count; i++) {
      const rating = starRatings.nth(i);
      const score = await rating.locator('.score').textContent();
      const stars = await rating.locator('.star').count();
      console.log(`  评分 ${i}:`, score?.trim(), '星星数:', stars);
    }
  });

  test('评价展开/折叠', async ({ page }) => {
    await page.goto(`${BASE_URL}food/食堂/西区一食堂/一楼/01窗口-川湘风味/`);
    await page.waitForLoadState('networkidle');

    // 点击第一个评分区域展开评价
    const firstRating = page.locator('.custom-main-content .star-rating, main .star-rating').first();
    if (await firstRating.count() > 0) {
      await firstRating.click();
      await page.waitForTimeout(500);

      // 检查评价列表是否显示
      const reviewList = page.locator('.custom-main-content .review-list, main .review-list');
      const count = await reviewList.count();
      console.log('评价列表数:', count);

      if (count > 0) {
        const reviews = reviewList.locator('.review-item');
        const reviewCount = await reviews.count();
        console.log('评价条数:', reviewCount);

        for (let i = 0; i < reviewCount; i++) {
          const author = await reviews.nth(i).locator('.review-author').textContent();
          const content = await reviews.nth(i).locator('.review-content').textContent();
          console.log(`  评价 ${i}:`, author?.trim(), '-', content?.trim().slice(0, 30));
        }
      }
    }
  });

  test('移动端响应式', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${BASE_URL}food/`);
    await page.waitForLoadState('networkidle');

    // 检查汉堡菜单按钮
    const menuBtn = page.locator('.mobile-menu-btn');
    await expect(menuBtn).toBeVisible({ timeout: 10000 });

    // 点击打开侧边栏
    await menuBtn.click();
    await page.waitForTimeout(300);

    const sidebar = page.locator('aside.custom-sidebar.open');
    await expect(sidebar).toBeVisible({ timeout: 5000 });

    // 点击遮罩层关闭
    const overlay = page.locator('.sidebar-overlay.open');
    if (await overlay.count() > 0) {
      // 点击遮罩层时避免被拦截
      await page.evaluate(() => {
        const overlay = document.querySelector('.sidebar-overlay.open');
        if (overlay) overlay.click();
      });
      await page.waitForTimeout(300);
      await expect(sidebar).not.toBeVisible({ timeout: 5000 });
    }
  });
});