# 🏫 雁栖湖校园指南

国科大雁栖湖校区校园生活指南，由同学们共同维护。

基于 **VitePress 1.x** + **Vue 3** 构建的静态站点，部署于 GitHub Pages。

---

## 🚀 快速开始

### 环境要求
- Node.js 18+ (推荐 v20+)
- npm 9+ (随 Node.js 安装)

### 本地开发

```bash
# 1. 克隆仓库
git clone https://github.com/DREAMERhyh/UCAS-Yanqi-Wiki.git
cd UCAS-Yanqi-Wiki

# 2. 安装依赖
npm install

# 3. 启动开发服务器（支持热重载）
npm run dev
# 访问 http://localhost:5173/UCAS-Yanqi-Wiki/

# 4. 构建生产版本
npm run build

# 5. 本地预览构建结果
npm run preview
# 访问 http://localhost:4173/UCAS-Yanqi-Wiki/
```

### 可用脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本到 `docs/.vitepress/dist` |
| `npm run preview` | 预览构建结果 |

---

## 📁 项目结构

```
UCAS-Yanqi-Wiki/
├── package.json                    # 项目配置、依赖、脚本
├── package-lock.json               # 依赖锁文件（提交到 Git）
├── .gitignore                      # Git 忽略规则
├── README.md                       # 项目文档（本文件）
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions 自动部署配置
├── docs/                           # VitePress 文档根目录
│   ├── .vitepress/
│   │   ├── config.mjs              # VitePress 主配置文件
│   │   ├── theme/
│   │   │   ├── index.js            # 主题入口，注册自定义布局
│   │   │   ├── custom.css          # 全局样式（CSS 变量、组件样式、深色模式）
│   │   │   ├── Layout.vue          # 自定义布局（左侧导航 + 右侧内容区）
│   │   │   └── components/         # Vue 3 组合式 API 组件
│   │   │       ├── SidebarNav.vue  # 左侧导航栏（手风琴、高亮、移动端抽屉）
│   │   │       ├── ContentArea.vue # 主内容区（面包屑、搜索排序、动态卡片网格）
│   │   │       ├── FoodCard.vue    # 菜品/饮品卡片（评分、展开评价）
│   │   │       ├── WindowCard.vue  # 窗口卡片（分类标签、简介）
│   │   │       ├── FloorCard.vue   # 楼层/分类/食堂/店铺卡片
│   │   │       ├── StarRating.vue  # 星级评分（支持半星、CSS 渐变实现）
│   │   │       └── ReviewList.vue  # 评价列表（异步加载、展开/折叠动画）
│   │   └── utils/
│   │       └── dataLoader.js       # 数据加载工具（导航生成、页面数据、评价获取）
│   ├── public/
│   │   └── favicon.svg             # 网站图标
│   ├── index.md                    # 网站首页（板块入口）
│   └── food/                       # 🍽️ 饮食板块内容（Markdown + JSON 数据）
│       ├── index.md                # 饮食板块首页
│       ├── 食堂/                   # 食堂线（4 层级：食堂 → 楼层 → 窗口 → 菜品）
│       │   ├── 西区一食堂/         # 3 层楼，6 个窗口，12 道菜品，含评价
│       │   ├── 西区二食堂/         # 2 层楼，2 个窗口，3 道菜品，含评价
│       │   ├── 东区三食堂/         # 占位
│       │   ├── 东区四食堂/         # 占位
│       │   └── 西区五食堂/         # 占位
│       └── 饮品/                   # 饮品线（3 层级：店铺 → 品类 → 饮品）
│           ├── 咖啡角/             # 2 个品类，5 款饮品，含评价
│           ├── 西区奶茶店/         # 1 个品类，2 款饮品，含评价
│           └── 东区咖啡厅/         # 占位
```

---

## 📝 数据格式规范

所有内容文件位于 `docs/food/` 目录，采用 **Markdown + YAML Front Matter** 格式，评价数据为同目录下的 **JSON 文件**。

### 通用规则
- 文件编码：**UTF-8**
- 换行符：**LF**
- Front Matter 不需要 `layout: default`（VitePress 不需要）
- 菜品/饮品文件名建议与 `菜名`/`名称` 字段一致
- 评价文件命名：`<菜品/饮品名>-reviews.json`

---

### 1️⃣ 窗口 index.md（食堂 → 楼层 → 窗口）

```markdown
---
type: 窗口
食堂: 西区一食堂
楼层: 一楼
窗口编号: "01"
窗口名称: 川湘风味
类别: 川湘菜
简介: 主营川菜和湘菜，口味偏辣，花椒和辣椒用料十足
---

# 窗口标题

窗口详细介绍内容...
```

| 字段 | 必填 | 说明 |
|------|------|------|
| `type` | ✅ | 固定值：`窗口` |
| `食堂` | ✅ | 所属食堂名称 |
| `楼层` | ✅ | 所在楼层 |
| `窗口编号` | ✅ | 窗口编号（字符串，如 `"01"`） |
| `窗口名称` | ✅ | 窗口显示名称 |
| `类别` | ✅ | 菜系分类（用于标签颜色） |
| `简介` | ✅ | 一句话简介（卡片显示） |

---

### 2️⃣ 菜品 .md（窗口下的菜品）

```markdown
---
type: 菜品
食堂: 西区一食堂
楼层: 一楼
窗口: "01窗口-川湘风味"
菜名: 宫保鸡丁
价格: 15元
供应时段: 午/晚
---

# 宫保鸡丁

菜品详细介绍、食材、口味特点等...
```

| 字段 | 必填 | 说明 |
|------|------|------|
| `type` | ✅ | 固定值：`菜品` |
| `食堂` | ✅ | 所属食堂 |
| `楼层` | ✅ | 所在楼层 |
| `窗口` | ✅ | 所属窗口（完整文件夹名） |
| `菜名` | ✅ | 菜品名称（卡片标题、评价文件关联） |
| `价格` | ✅ | 价格字符串（如 `"15元"`） |
| `供应时段` | ✅ | 供应时段（如 `"午/晚"`、`"全天"`、`"早/午"`） |

---

### 3️⃣ 饮品店 index.md（饮品 → 店铺）

```markdown
---
type: 饮品店
名称: 咖啡角
位置: 西区活动中心一楼
简介: 校园内唯一的独立咖啡馆，环境安静适合自习
---

# 咖啡角

店铺详细介绍、环境、营业时间等...
```

| 字段 | 必填 | 说明 |
|------|------|------|
| `type` | ✅ | 固定值：`饮品店` |
| `名称` | ✅ | 店铺名称 |
| `位置` | ✅ | 具体位置 |
| `简介` | ✅ | 一句话简介 |

---

### 4️⃣ 饮品 .md（店铺 → 品类 → 饮品）

```markdown
---
type: 饮品
饮品店: 咖啡角
品类: 咖啡类
名称: 美式咖啡
价格: 18元
供应时段: 全天
---

# 美式咖啡

饮品详细介绍...
```

| 字段 | 必填 | 说明 |
|------|------|------|
| `type` | ✅ | 固定值：`饮品` |
| `饮品店` | ✅ | 所属店铺名称 |
| `品类` | ✅ | 所属品类（文件夹名） |
| `名称` | ✅ | 饮品名称 |
| `价格` | ✅ | 价格字符串 |
| `供应时段` | ✅ | 供应时段 |

---

### 5️⃣ 评价数据 `-reviews.json`

与对应的 `.md` 文件同目录，文件名：`<菜品/饮品名>-reviews.json`

```json
[
  {
    "评价人": "张伟",
    "评分": 4.5,
    "时间": "2024-03-15",
    "内容": "宫保鸡丁味道很不错，鸡肉很嫩，花生米酥脆，辣度刚好！"
  },
  {
    "评价人": "李娜",
    "评分": 3.0,
    "时间": "2024-05-22",
    "内容": "今天的感觉一般，鸡肉有些老，辣度比平时重了。"
  }
]
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `评价人` | string | ✅ | 评价者昵称 |
| `评分` | number | ✅ | 1.0 - 5.0，支持一位小数（半星） |
| `时间` | string | ✅ | 日期格式 `YYYY-MM-DD` |
| `内容` | string | ✅ | 评价正文 |

---

## 🎨 界面与交互

| 功能 | 实现 |
|------|------|
| **左侧固定导航栏** | 260px 宽，始终可见，食堂/饮品两大板块，多层级手风琴展开 |
| **右侧主内容区** | 根据导航选中项动态渲染对应层级的卡片网格 |
| **面包屑导航** | 顶部显示完整层级路径（如：饮食 > 食堂 > 西区一食堂 > 一楼 > 01窗口-川湘风味），可点击跳转 |
| **搜索/排序栏** | 搜索框（UI 就绪）+ 排序下拉（评分/评价数/价格） |
| **卡片网格** | 响应式网格，最小列宽 280px，hover 上浮阴影效果 |
| **分类标签** | 8 种预设颜色：川湘菜(红)、面食(橙)、米饭套餐(绿)、小吃(琥珀)、粥品(紫)、咖啡(棕)、茶饮(青)、默认(灰) |
| **星级评分** | 5 星制，支持半星（CSS `linear-gradient` 实现），显示评分数值和评价条数 |
| **评价展开/折叠** | 点击评分区域异步加载 JSON，下拉动画展开，再次点击收起 |
| **移动端适配** | ≤960px 时导航栏变为抽屉式，遮罩层关闭，汉堡菜单按钮 |
| **深色模式** | CSS 变量自动适配，跟随系统或手动切换 |

---

## 🤝 贡献指南

欢迎所有国科大学子共同完善校园指南！

### 添加新内容流程

1. **Fork 仓库** 到个人账号
2. **创建分支**：`git checkout -b feat/添加xxx菜品`
3. **在对应目录下新增文件**：
   - 菜品：`docs/food/食堂/<食堂>/<楼层>/<窗口>/<菜名>.md` + `<菜名>-reviews.json`
   - 饮品：`docs/food/饮品/<店铺>/<品类>/<饮品名>.md` + `<饮品名>-reviews.json`
   - 新窗口/店铺：参考现有 `index.md` 格式创建
4. **提交更改**：
   ```bash
   git add docs/food/...
   git commit -m 'feat: 添加西区一食堂一楼01窗口-麻婆豆腐'
   ```
5. **推送分支**：`git push origin feat/添加xxx菜品`
6. **创建 Pull Request**，描述新增内容

### 提交规范（建议遵循 Conventional Commits）

| 类型 | 说明 | 示例 |
|------|------|------|
| `feat` | 新增菜品/窗口/店铺 | `feat: 添加西区二食堂红烧肉盖饭` |
| `fix` | 修正错别字/数据错误 | `fix: 修正宫保鸡丁价格为15元` |
| `docs` | 文档更新 | `docs: 更新贡献指南` |
| `refactor` | 代码重构（非功能变更） | `refactor: 优化卡片组件样式` |
| `style` | 样式调整 | `style: 调整导航栏间距` |

### 数据维护提示

- ✅ **保持目录结构**：食堂线 4 层、饮品线 3 层，不要随意增减层级
- ✅ **Front Matter 字段完整**：缺少字段会导致卡片显示异常
- ✅ **评价文件同步创建**：新增菜品/饮品时同步创建空的 `-reviews.json`（`[]`）
- ✅ **图片资源**：如需添加图片，放在 `docs/public/images/` 下，引用时用 `/images/xxx.jpg`
- ❌ **不要修改自动生成的文件**：`docs/.vitepress/dist/`、`node_modules/`
- ❌ **不要提交大文件**：单个文件 < 1MB，图片建议压缩后上传

---

## 🔧 技术栈

| 类别 | 技术 | 版本 | 用途 |
|------|------|------|------|
| **SSG** | VitePress | 1.6.x | 静态站点生成 |
| **框架** | Vue | 3.4.x | 组合式 API、响应式 |
| **样式** | 原生 CSS | - | CSS 变量、Flex/Grid、无依赖 |
| **部署** | GitHub Actions + Pages | - | 自动化 CI/CD |
| **包管理** | npm | 10.x | 依赖管理 |

---

## 📦 依赖说明

```json
{
  "devDependencies": {
    "vitepress": "^1.6.0",     // 核心框架
    "vue": "^3.4.0"            // Vue 3 运行时
  }
}
```

**无额外 UI 库、图表库、动画库** —— 纯原生实现，体积极小。

---

## 🌐 部署说明

### GitHub Pages 配置

1. 仓库 Settings → Pages
2. Source：**GitHub Actions**（而非 Deploy from branch）
3. 推送到 `master` 分支触发自动部署

### 工作流 `.github/workflows/deploy.yml`

- 构建环境：Ubuntu Latest + Node 20
- 缓存：`npm` 依赖
- 产物：`docs/.vitepress/dist` 上传为 Pages Artifact
- 部署：`actions/deploy-pages@v4`

### 自定义域名（可选）

在 `docs/public/CNAME` 中添加域名，并配置 DNS CNAME 记录指向 `<username>.github.io`。

---

## 📄 许可证

**MIT License** — 可自由使用、修改、分发。

```
MIT License

Copyright (c) 2024-present UCAS Yanqi Wiki Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 致谢

感谢所有为雁栖湖校园指南贡献内容的国科大学子！

> **项目地址**：https://github.com/DREAMERhyh/UCAS-Yanqi-Wiki
> **在线访问**：https://dreamerhyh.github.io/UCAS-Yanqi-Wiki/