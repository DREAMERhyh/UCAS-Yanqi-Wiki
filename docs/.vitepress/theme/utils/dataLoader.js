// 数据加载工具函数

// 根据分类获取标签样式类
export function getCategoryTagClass(category) {
  const map = {
    '川湘菜': 'tag-sichuan',
    '面食': 'tag-noodle',
    '米饭套餐': 'tag-rice',
    '小吃': 'tag-snack',
    '粥品': 'tag-porridge',
    '咖啡': 'tag-coffee',
    '茶饮': 'tag-tea',
    '奶茶': 'tag-coffee',
    '水果茶': 'tag-tea'
  }
  return map[category] || 'tag-default'
}

// 生成导航结构（用于侧边栏）
export async function generateNavStructure() {
  // 这里可以在构建时预生成，运行时直接返回静态结构
  // 暂时返回基础结构，实际数据由 VitePress 侧边栏配置生成
  return [
    {
      text: '食堂',
      items: [
        {
          text: '西区一食堂',
          items: [
            { text: '一楼', items: [] },
            { text: '二楼', items: [] },
            { text: '三楼', items: [] }
          ]
        },
        {
          text: '西区二食堂',
          items: [
            { text: '一楼', items: [] },
            { text: '二楼', items: [] }
          ]
        },
        { text: '东区三食堂', items: [] },
        { text: '东区四食堂', items: [] },
        { text: '西区五食堂', items: [] }
      ]
    },
    {
      text: '饮品',
      items: [
        { text: '咖啡角', items: [] },
        { text: '西区奶茶店', items: [] },
        { text: '东区咖啡厅', items: [] }
      ]
    }
  ]
}

// 根据当前层级加载页面数据
export async function loadPageData(level) {
  const baseUrl = '/UCAS-Yanqi-Wiki/food/'

  switch (level.type) {
    case 'root':
      return [
        { text: '食堂', path: '/food/食堂/', icon: '🍚', count: 5, description: '五大食堂，覆盖全校区' },
        { text: '饮品', path: '/food/饮品/', icon: '☕', count: 3, description: '咖啡、奶茶、茶饮一应俱全' }
      ]

    case 'canteens':
      return [
        { text: '西区一食堂', path: '/food/食堂/西区一食堂/', count: 3, description: '三层楼，窗口丰富' },
        { text: '西区二食堂', path: '/food/食堂/西区二食堂/', count: 2, description: '两层楼，主打米饭套餐' },
        { text: '东区三食堂', path: '/food/食堂/东区三食堂/', count: 0, description: '待完善' },
        { text: '东区四食堂', path: '/food/食堂/东区四食堂/', count: 0, description: '待完善' },
        { text: '西区五食堂', path: '/food/食堂/西区五食堂/', count: 0, description: '待完善' }
      ]

    case 'canteen':
      // 返回该食堂的楼层列表
      return getCanteenFloors(level.canteen)

    case 'floor':
      // 返回该楼层的窗口列表
      return getFloorWindows(level.canteen, level.floor)

    case 'window':
      // 返回该窗口的菜品列表
      return getWindowDishes(level.canteen, level.floor, level.window)

    case 'drinks':
      return [
        { text: '咖啡角', path: '/food/饮品/咖啡角/', icon: '☕', count: 2, description: '咖啡、茶饮、小食' },
        { text: '西区奶茶店', path: '/food/饮品/西区奶茶店/', icon: '🧋', count: 1, description: '奶茶、水果茶' },
        { text: '东区咖啡厅', path: '/food/饮品/东区咖啡厅/', icon: '☕', count: 0, description: '待完善' }
      ]

    case 'shop':
      return getShopCategories(level.shop)

    case 'category':
      return getCategoryDrinks(level.shop, level.category)

    default:
      return []
  }
}

// 获取食堂楼层数据
function getCanteenFloors(canteen) {
  const floorsMap = {
    '西区一食堂': [
      { text: '一楼', path: '/food/食堂/西区一食堂/一楼/', count: 2, description: '川湘风味、老北京炸酱面' },
      { text: '二楼', path: '/food/食堂/西区一食堂/二楼/', count: 2, description: '盖浇饭、麻辣香锅' },
      { text: '三楼', path: '/food/食堂/西区一食堂/三楼/', count: 2, description: '风味小吃、营养粥铺' }
    ],
    '西区二食堂': [
      { text: '一楼', path: '/food/食堂/西区二食堂/一楼/', count: 1, description: '黄焖鸡米饭' },
      { text: '二楼', path: '/food/食堂/西区二食堂/二楼/', count: 1, description: '饺子馄饨' }
    ],
    '东区三食堂': [
      { text: '一楼', path: '/food/食堂/东区三食堂/一楼/', count: 0, description: '待完善' }
    ],
    '东区四食堂': [
      { text: '一楼', path: '/food/食堂/东区四食堂/一楼/', count: 0, description: '待完善' },
      { text: '二楼', path: '/food/食堂/东区四食堂/二楼/', count: 0, description: '待完善' }
    ],
    '西区五食堂': [
      { text: '一楼', path: '/food/食堂/西区五食堂/一楼/', count: 0, description: '待完善' },
      { text: '二楼', path: '/food/食堂/西区五食堂/二楼/', count: 0, description: '待完善' },
      { text: '三楼', path: '/food/食堂/西区五食堂/三楼/', count: 0, description: '待完善' }
    ]
  }
  return floorsMap[canteen] || []
}

// 获取楼层窗口数据
function getFloorWindows(canteen, floor) {
  const windowsMap = {
    '西区一食堂': {
      '一楼': [
        {
          name: '01窗口-川湘风味',
          path: '/food/食堂/西区一食堂/一楼/01窗口-川湘风味/',
          category: '川湘菜',
          description: '主营川菜和湘菜，口味偏辣，花椒和辣椒用料十足'
        },
        {
          name: '02窗口-老北京炸酱面',
          path: '/food/食堂/西区一食堂/一楼/02窗口-老北京炸酱面/',
          category: '面食',
          description: '正宗老北京炸酱面，酱香浓郁，配菜新鲜'
        }
      ],
      '二楼': [
        {
          name: '01窗口-盖浇饭',
          path: '/food/食堂/西区一食堂/二楼/01窗口-盖浇饭/',
          category: '米饭套餐',
          description: '多款盖浇饭可选，米饭免费加'
        },
        {
          name: '02窗口-麻辣香锅',
          path: '/food/食堂/西区一食堂/二楼/02窗口-麻辣香锅/',
          category: '小吃',
          description: '自选食材，麻辣鲜香，按份称重'
        }
      ],
      '三楼': [
        {
          name: '01窗口-风味小吃',
          path: '/food/食堂/西区一食堂/三楼/01窗口-风味小吃/',
          category: '小吃',
          description: '煎饼果子、肉夹馍等早餐小吃'
        },
        {
          name: '02窗口-营养粥铺',
          path: '/food/食堂/西区一食堂/三楼/02窗口-营养粥铺/',
          category: '粥品',
          description: '多种营养粥品，养胃暖心'
        }
      ]
    },
    '西区二食堂': {
      '一楼': [
        {
          name: '01窗口-黄焖鸡米饭',
          path: '/food/食堂/西区二食堂/一楼/01窗口-黄焖鸡米饭/',
          category: '米饭套餐',
          description: '招牌黄焖鸡，鸡肉软烂入味'
        }
      ],
      '二楼': [
        {
          name: '01窗口-饺子馄饨',
          path: '/food/食堂/西区二食堂/二楼/01窗口-饺子馄饨/',
          category: '面食',
          description: '手工饺子馄饨，皮薄馅大'
        }
      ]
    }
  }
  return windowsMap[canteen]?.[floor] || []
}

// 获取窗口菜品数据（带评价）
async function getWindowDishes(canteen, floor, window) {
  const dishesMap = {
    '西区一食堂': {
      '一楼': {
        '01窗口-川湘风味': [
          { name: '宫保鸡丁', price: '15元', period: '午/晚', rating: 3.83, reviewsCount: 3 },
          { name: '鱼香肉丝', price: '14元', period: '午/晚', rating: 4.0, reviewsCount: 2 }
        ],
        '02窗口-老北京炸酱面': [
          { name: '炸酱面', price: '12元', period: '午/晚', rating: 4.2, reviewsCount: 5 },
          { name: '牛肉面', price: '16元', period: '午/晚', rating: 4.5, reviewsCount: 3 }
        ]
      },
      '二楼': {
        '01窗口-盖浇饭': [
          { name: '番茄鸡蛋盖饭', price: '12元', period: '午/晚', rating: 4.1, reviewsCount: 4 },
          { name: '红烧肉盖饭', price: '18元', period: '午/晚', rating: 4.6, reviewsCount: 6 }
        ],
        '02窗口-麻辣香锅': [
          { name: '荤素搭配香锅', price: '20元', period: '午/晚', rating: 4.3, reviewsCount: 5 },
          { name: '全素香锅', price: '15元', period: '午/晚', rating: 4.0, reviewsCount: 3 }
        ]
      },
      '三楼': {
        '01窗口-风味小吃': [
          { name: '煎饼果子', price: '8元', period: '早/午', rating: 4.4, reviewsCount: 7 },
          { name: '肉夹馍', price: '10元', period: '早/午', rating: 4.2, reviewsCount: 5 }
        ],
        '02窗口-营养粥铺': [
          { name: '皮蛋瘦肉粥', price: '6元', period: '早/午/晚', rating: 4.3, reviewsCount: 6 },
          { name: '八宝粥', price: '5元', period: '早/午/晚', rating: 4.1, reviewsCount: 4 }
        ]
      }
    },
    '西区二食堂': {
      '一楼': {
        '01窗口-黄焖鸡米饭': [
          { name: '黄焖鸡米饭', price: '16元', period: '午/晚', rating: 4.4, reviewsCount: 8 }
        ]
      },
      '二楼': {
        '01窗口-饺子馄饨': [
          { name: '猪肉白菜饺', price: '12元', period: '午/晚', rating: 4.3, reviewsCount: 6 },
          { name: '鲜肉馄饨', price: '10元', period: '午/晚', rating: 4.1, reviewsCount: 4 }
        ]
      }
    }
  }

  const dishes = dishesMap[canteen]?.[floor]?.[window] || []
  return dishes.map(dish => ({
    ...dish,
    reviewsPath: `/UCAS-Yanqi-Wiki/food/食堂/${canteen}/${floor}/${window}/${dish.name}-reviews.json`
  }))
}

// 获取饮品店品类
function getShopCategories(shop) {
  const categoriesMap = {
    '咖啡角': [
      { text: '咖啡类', path: '/food/饮品/咖啡角/咖啡类/', count: 3, description: '美式、拿铁、卡布奇诺' },
      { text: '茶饮类', path: '/food/饮品/咖啡角/茶饮类/', count: 2, description: '茉莉绿茶、柠檬红茶' }
    ],
    '西区奶茶店': [
      { text: '奶茶类', path: '/food/饮品/西区奶茶店/奶茶类/', count: 2, description: '珍珠奶茶、杨枝甘露' }
    ],
    '东区咖啡厅': [
      { text: '待完善', path: '/food/饮品/东区咖啡厅/待完善/', count: 0, description: '暂无数据' }
    ]
  }
  return categoriesMap[shop] || []
}

// 获取品类下的饮品
async function getCategoryDrinks(shop, category) {
  const drinksMap = {
    '咖啡角': {
      '咖啡类': [
        { name: '美式咖啡', price: '18元', period: '全天', rating: 4.5, reviewsCount: 4 },
        { name: '拿铁', price: '22元', period: '全天', rating: 4.6, reviewsCount: 5 },
        { name: '卡布奇诺', price: '22元', period: '全天', rating: 4.4, reviewsCount: 3 }
      ],
      '茶饮类': [
        { name: '茉莉绿茶', price: '15元', period: '全天', rating: 4.2, reviewsCount: 3 },
        { name: '柠檬红茶', price: '16元', period: '全天', rating: 4.3, reviewsCount: 4 }
      ]
    },
    '西区奶茶店': {
      '奶茶类': [
        { name: '珍珠奶茶', price: '14元', period: '全天', rating: 4.1, reviewsCount: 6 },
        { name: '杨枝甘露', price: '18元', period: '全天', rating: 4.7, reviewsCount: 8 }
      ]
    }
  }

  const drinks = drinksMap[shop]?.[category] || []
  return drinks.map(drink => ({
    ...drink,
    reviewsPath: `/UCAS-Yanqi-Wiki/food/饮品/${shop}/${category}/${drink.name}-reviews.json`
  }))
}

// 加载评价数据
export async function loadReviews(reviewsPath) {
  try {
    const response = await fetch(reviewsPath)
    if (response.ok) {
      return await response.json()
    }
  } catch (error) {
    console.warn('Failed to load reviews:', error)
  }
  return []
}

// 计算平均评分
export function calculateAverageRating(reviews) {
  if (!reviews || reviews.length === 0) return 0
  const sum = reviews.reduce((acc, r) => acc + (r.评分 || 0), 0)
  return Math.round((sum / reviews.length) * 10) / 10
}

// 格式化评分显示（支持半星）
export function formatRating(rating) {
  return rating.toFixed(1)
}