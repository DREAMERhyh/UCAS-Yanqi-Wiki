const { chromium } = require('playwright');

async function testNavigation() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // 捕获控制台错误
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('❌ Console Error:', msg.text());
    }
  });

  page.on('pageerror', error => {
    console.log('❌ Page Error:', error.message);
  });

  // 导航到首页
  console.log('📍 访问首页...');
  await page.goto('http://localhost:5180/UCAS-Yanqi-Wiki/', { waitUntil: 'networkidle' });

  // 截图首页
  await page.screenshot({ path: 'screenshots/home.png', fullPage: true });
  console.log('📸 首页截图已保存');

  // 检查左侧导航栏是否存在
  const sidebar = await page.$('.custom-sidebar');
  if (sidebar) {
    console.log('✅ 侧边栏存在');
    const sidebarHtml = await sidebar.innerHTML();
    console.log('   侧边栏内容长度:', sidebarHtml.length);
  } else {
    console.log('❌ 侧边栏不存在');
  }

  // 检查导航项
  const navItems = await page.$$('.nav-item-toggle');
  console.log(`📋 导航项数量: ${navItems.length}`);

  for (let i = 0; i < navItems.length; i++) {
    const text = await navItems[i].textContent();
    const classes = await navItems[i].getAttribute('class');
    console.log(`   ${i+1}. "${text.trim()}" [class: ${classes}]`);
  }

  // 点击"食堂"展开
  const canteenToggle = await page.$('text=食堂');
  if (canteenToggle) {
    console.log('\n🔍 点击"食堂"展开...');
    await canteenToggle.click();
    await page.waitForTimeout(500);

    // 检查子项
    const subItems = await page.$$('.nav-item-children .nav-item-toggle');
    console.log(`   子项数量: ${subItems.length}`);
    for (const item of subItems) {
      const text = await item.textContent();
      console.log(`   - ${text.trim()}`);
    }

    await page.screenshot({ path: 'screenshots/sidebar-expanded.png', fullPage: true });
  }

  // 点击"西区一食堂"
  const west1 = await page.$('text=西区一食堂');
  if (west1) {
    console.log('\n🔍 点击"西区一食堂"...');
    await west1.click();
    await page.waitForTimeout(500);

    const floorItems = await page.$$('.nav-item-children .nav-item-children .nav-item-toggle');
    console.log(`   楼层项数量: ${floorItems.length}`);
    for (const item of floorItems) {
      const text = await item.textContent();
      console.log(`   - ${text.trim()}`);
    }
  }

  // 点击"一楼" -> 窗口
  const floor1 = await page.$('text=一楼');
  if (floor1) {
    console.log('\n🔍 点击"一楼"...');
    await floor1.click();
    await page.waitForTimeout(500);

    const windowItems = await page.$$('.nav-item-children .nav-item-children .nav-item-children .nav-item-toggle');
    console.log(`   窗口项数量: ${windowItems.length}`);
    for (const item of windowItems) {
      const text = await item.textContent();
      const href = await item.getAttribute('href');
      console.log(`   - ${text.trim()} [href: ${href}]`);
    }
  }

  // 点击第一个窗口导航
  const firstWindow = await page.$('.nav-item-children .nav-item-children .nav-item-children .nav-item-toggle');
  if (firstWindow) {
    console.log('\n🔍 点击第一个窗口导航...');
    await firstWindow.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    console.log('   当前 URL:', page.url());

    // 检查内容区域
    const contentArea = await page.$('.custom-main-content');
    if (contentArea) {
      const contentHtml = await contentArea.innerHTML();
      console.log('   内容区域长度:', contentHtml.length);

      // 检查面包屑
      const breadcrumb = await page.$('.breadcrumb');
      if (breadcrumb) {
        const bcText = await breadcrumb.textContent();
        console.log('   面包屑:', bcText.trim().replace(/\s+/g, ' '));
      }

      // 检查卡片
      const cards = await page.$$('.card');
      console.log(`   卡片数量: ${cards.length}`);
    }

    await page.screenshot({ path: 'screenshots/window-page.png', fullPage: true });
  }

  // 测试饮品线
  console.log('\n🔍 测试饮品线导航...');
  await page.goto('http://localhost:5180/UCAS-Yanqi-Wiki/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const drinksToggle = await page.$('text=饮品');
  if (drinksToggle) {
    await drinksToggle.click();
    await page.waitForTimeout(500);

    const shopItems = await page.$$('.nav-item-children .nav-item-toggle');
    console.log(`   饮品店数量: ${shopItems.length}`);
    for (const item of shopItems) {
      const text = await item.textContent();
      console.log(`   - ${text.trim()}`);
    }
  }

  // 点击咖啡角
  const coffeeShop = await page.$('text=咖啡角');
  if (coffeeShop) {
    await coffeeShop.click();
    await page.waitForTimeout(500);

    const catItems = await page.$$('.nav-item-children .nav-item-children .nav-item-toggle');
    console.log(`   品类数量: ${catItems.length}`);
    for (const item of catItems) {
      const text = await item.textContent();
      console.log(`   - ${text.trim()}`);
    }
  }

  await browser.close();
  console.log('\n✅ 测试完成');
}

testNavigation().catch(console.error);