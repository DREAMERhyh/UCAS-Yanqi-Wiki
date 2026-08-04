import { defineConfig } from 'vitepress'
import fs from 'fs'
import path from 'path'

// 扫描 food 目录生成导航结构
function generateSidebar() {
  const foodDir = path.resolve(__dirname, '../../food')
  const sidebar = []

  // 食堂线
  const canteensDir = path.join(foodDir, '食堂')
  if (fs.existsSync(canteensDir)) {
    const canteenItems = []
    const canteens = fs.readdirSync(canteensDir).sort()
    for (const canteen of canteens) {
      const canteenPath = path.join(canteensDir, canteen)
      if (!fs.statSync(canteenPath).isDirectory()) continue

      const floorItems = []
      const floors = fs.readdirSync(canteenPath).sort()
      for (const floor of floors) {
        const floorPath = path.join(canteenPath, floor)
        if (!fs.statSync(floorPath).isDirectory()) continue

        const windowItems = []
        const windows = fs.readdirSync(floorPath).sort()
        for (const window of windows) {
          const windowPath = path.join(floorPath, window)
          if (!fs.statSync(windowPath).isDirectory()) continue

          windowItems.push({
            text: window,
            link: `/food/食堂/${canteen}/${floor}/${window}/`
          })
        }

        if (windowItems.length > 0) {
          floorItems.push({
            text: floor,
            items: windowItems,
            collapsed: true
          })
        }
      }

      if (floorItems.length > 0) {
        canteenItems.push({
          text: canteen,
          items: floorItems,
          collapsed: true
        })
      }
    }

    if (canteenItems.length > 0) {
      sidebar.push({
        text: '食堂',
        items: canteenItems,
        collapsed: false
      })
    }
  }

  // 饮品线
  const drinksDir = path.join(foodDir, '饮品')
  if (fs.existsSync(drinksDir)) {
    const drinkItems = []
    const shops = fs.readdirSync(drinksDir).sort()
    for (const shop of shops) {
      const shopPath = path.join(drinksDir, shop)
      if (!fs.statSync(shopPath).isDirectory()) continue

      const categoryItems = []
      const categories = fs.readdirSync(shopPath).sort()
      for (const category of categories) {
        const categoryPath = path.join(shopPath, category)
        if (!fs.statSync(categoryPath).isDirectory()) continue

        categoryItems.push({
          text: category,
          link: `/food/饮品/${shop}/${category}/`
        })
      }

      drinkItems.push({
        text: shop,
        items: categoryItems,
        collapsed: true
      })
    }

    if (drinkItems.length > 0) {
      sidebar.push({
        text: '饮品',
        items: drinkItems,
        collapsed: false
      })
    }
  }

  return [
    {
      text: '饮食',
      items: sidebar,
      collapsed: false
    }
  ]
}

export default defineConfig({
  title: '雁栖湖校园指南',
  description: '国科大雁栖湖校区生活指南',
  lang: 'zh-CN',
  base: '/UCAS-Yanqi-Wiki/',

  head: [
    ['link', { rel: 'icon', href: '/favicon.svg' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }]
  ],

  themeConfig: {
    // 不显示顶部导航栏
    nav: [],

    // 侧边栏配置
    sidebar: generateSidebar(),

    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/DREAMERhyh/UCAS-Yanqi-Wiki' }
    ],

    // 页脚
    footer: {
      message: '由国科大学子共同维护',
      copyright: 'Copyright © 2024-present UCAS Yanqi Wiki Contributors'
    },

    // 编辑链接
    editLink: {
      pattern: 'https://github.com/DREAMERhyh/UCAS-Yanqi-Wiki/edit/master/docs/:path',
      text: '在 GitHub 上编辑此页'
    },

    // 搜索
    search: {
      provider: 'local'
    },

    // 大纲
    outline: {
      level: [2, 3],
      label: '页面导航'
    },

    // 最后更新时间
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'short'
      }
    },

    // 返回顶部
    returnToTopLabel: '返回顶部',

    // 侧边栏菜单标签
    sidebarMenuLabel: '菜单',

    // 暗色模式切换标签
    darkModeSwitchLabel: '深色模式',

    // 光标模式切换标签
    lightModeSwitchTitle: '切换到浅色模式'
  },

  // Vite 配置
  vite: {
    plugins: [
      {
        name: 'copy-food-json',
        buildStart() {
          this.addWatchFile(path.resolve(__dirname, '../food/**/*.json'))
        },
        generateBundle() {
          // 这个插件在构建时复制 JSON 文件
        },
        async closeBundle() {
          // 构建完成后复制 JSON 文件
          const fs = await import('fs/promises')
          const path = await import('path')
          const srcDir = path.resolve(__dirname, '../food')
          const destDir = path.resolve(__dirname, '../.vitepress/dist/food')

          async function copyDir(src, dest) {
            const entries = await fs.readdir(src, { withFileTypes: true })
            await fs.mkdir(dest, { recursive: true })
            for (const entry of entries) {
              const srcPath = path.join(src, entry.name)
              const destPath = path.join(dest, entry.name)
              if (entry.isDirectory()) {
                await copyDir(srcPath, destPath)
              } else if (entry.name.endsWith('.json')) {
                await fs.copyFile(srcPath, destPath)
              }
            }
          }

          await copyDir(srcDir, destDir)
        }
      }
    ],
    publicDir: path.resolve(__dirname, '../../public'),
    build: {
      rollupOptions: {
        output: {
          assetFileNames: (assetInfo) => {
            if (assetInfo.name?.endsWith('.json')) {
              return 'food/[name]-[hash][extname]'
            }
            return 'assets/[name]-[hash][extname]'
          }
        }
      }
    },
    assetsInclude: ['**/*.json']
  }
})