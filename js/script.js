(function() {
    'use strict';

    const foodDataEl = document.getElementById('food-data-json');
    const foodStructureEl = document.getElementById('food-structure-json');
    const baseurlEl = document.getElementById('baseurl-json');

    if (!foodDataEl || !foodStructureEl) {
        return;
    }

    let foodData = [];
    let foodStructure = {};
    let baseurl = '';
    let reviewsCache = {};

    try {
        foodData = JSON.parse(foodDataEl.textContent || '[]');
        foodStructure = JSON.parse(foodStructureEl.textContent || '{}');
        if (baseurlEl) {
            baseurl = JSON.parse(baseurlEl.textContent || '{}').baseurl || '';
        }
    } catch (e) {
        console.error('数据解析失败:', e);
        return;
    }

    const navTree = document.getElementById('nav-tree');
    const contentArea = document.getElementById('content-area');
    const searchInput = document.getElementById('search-input');
    const sortSelect = document.getElementById('sort-select');

    let currentPath = [];
    let expandedNodes = new Set();

    function parsePrice(priceStr) {
        if (!priceStr) return 0;
        const match = String(priceStr).match(/[\d.]+/);
        return match ? parseFloat(match[0]) : 0;
    }

    function calcRating(reviews) {
        if (!reviews || reviews.length === 0) return { avg: 0, count: 0 };
        const sum = reviews.reduce((s, r) => s + (parseFloat(r['评分']) || 0), 0);
        return { avg: Math.round((sum / reviews.length) * 10) / 10, count: reviews.length };
    }

    function getStarsHTML(rating) {
        const pct = (rating / 5) * 100;
        return `<span class="stars">
            <span class="stars-bg">★★★★★</span>
            <span class="stars-fg" style="width:${pct}%">★★★★★</span>
        </span>`;
    }

    function getStarsSimple(rating) {
        const full = Math.floor(rating);
        const half = rating - full >= 0.5;
        let result = '★'.repeat(full);
        if (half) result += '☆';
        result += '☆'.repeat(5 - full - (half ? 1 : 0));
        return result;
    }

    function getCategoryTagClass(category) {
        if (!category) return '';
        const c = String(category);
        if (c.includes('川') || c.includes('湘') || c.includes('辣')) return 'tag-spicy';
        if (c.includes('面') || c.includes('粉')) return 'tag-noodle';
        if (c.includes('饭') || c.includes('米') || c.includes('盖浇')) return 'tag-rice';
        if (c.includes('小吃') || c.includes('炸') || c.includes('烤')) return 'tag-snack';
        return '';
    }

    function getCategoryIconCategory(name) {
        if (!name) return '';
        const n = String(name);
        if (n.includes('咖啡')) return 'coffee';
        if (n.includes('茶')) return 'tea';
        if (n.includes('奶茶')) return 'milk-tea';
        if (n.includes('果') || n.includes('汁')) return 'juice';
        return '';
    }

    function parseReviewsPath(item) {
        if (!item || !item.path) return null;
        const parts = item.path.split('/');
        const fileName = parts.pop();
        const baseName = fileName.replace(/\.md$/, '');
        if (baseName === 'index') return null;
        const dirPath = parts.join('/');
        return `${dirPath}/${baseName}-reviews.json`;
    }

    function getReviewsURL(path) {
        if (!path) return null;
        const newPath = path.replace(/^_food\//, 'food/');
        return `${baseurl}/${newPath}`;
    }

    async function loadReviews(item) {
        const cacheKey = item.path;
        if (reviewsCache[cacheKey] !== undefined) {
            return reviewsCache[cacheKey];
        }
        const relPath = parseReviewsPath(item);
        if (!relPath) {
            reviewsCache[cacheKey] = [];
            return [];
        }
        const url = getReviewsURL(relPath);
        try {
            const res = await fetch(url);
            if (!res.ok) {
                reviewsCache[cacheKey] = [];
                return [];
            }
            const data = await res.json();
            reviewsCache[cacheKey] = data || [];
            return reviewsCache[cacheKey];
        } catch (e) {
            reviewsCache[cacheKey] = [];
            return [];
        }
    }

    function buildNavigation() {
        if (!navTree) return;
        navTree.innerHTML = '';

        const ul = document.createElement('ul');
        ul.className = 'nav-level nav-children expanded';

        const rootItem = createNavItem('饮食', '🍽️', ['饮食'], true);
        const rootChildren = document.createElement('ul');
        rootChildren.className = 'nav-children expanded';

        const canteenLi = createNavItem('食堂', '🍚', ['饮食', '食堂'], false, () => {
            const cChildren = document.createElement('ul');
            cChildren.className = 'nav-children';
            const canteens = foodStructure && foodStructure['饮食'] && foodStructure['饮食']['食堂'];
            if (canteens) {
                Object.keys(canteens).forEach(cname => {
                    const cLi = createNavItem(cname, '🏫', ['饮食', '食堂', cname], false, () => {
                        const fChildren = document.createElement('ul');
                        fChildren.className = 'nav-children';
                        const floors = canteens[cname]['楼层'] || [];
                        floors.forEach(fname => {
                            const fLi = createNavItem(fname, '📶', ['饮食', '食堂', cname, fname], false, () => {
                                const wChildren = document.createElement('ul');
                                wChildren.className = 'nav-children';
                                const windows = getWindows(cname, fname);
                                windows.forEach(w => {
                                    const wLabel = `${w['窗口编号'] || ''}${w['窗口名称'] ? ' ' + w['窗口名称'] : ''}` || '窗口';
                                    const wPath = ['饮食', '食堂', cname, fname, w['窗口名称'] || wLabel];
                                    wChildren.appendChild(createNavItem(wLabel, '🍱', wPath, true));
                                });
                                return wChildren;
                            });
                            fChildren.appendChild(fLi);
                        });
                        return fChildren;
                    });
                    cChildren.appendChild(cLi);
                });
            }
            return cChildren;
        });
        rootChildren.appendChild(canteenLi);

        const drinkLi = createNavItem('饮品', '🥤', ['饮食', '饮品'], false, () => {
            const dChildren = document.createElement('ul');
            dChildren.className = 'nav-children';
            const drinks = foodStructure && foodStructure['饮食'] && foodStructure['饮食']['饮品'];
            const shops = (drinks && drinks['饮品店列表']) || [];
            shops.forEach(sname => {
                const sLi = createNavItem(sname, '☕', ['饮食', '饮品', sname], false, () => {
                    const catChildren = document.createElement('ul');
                    catChildren.className = 'nav-children';
                    const categories = getDrinkCategories(sname);
                    categories.forEach(cat => {
                        catChildren.appendChild(createNavItem(cat, '🧋', ['饮食', '饮品', sname, cat], true));
                    });
                    return catChildren;
                });
                dChildren.appendChild(sLi);
            });
            return dChildren;
        });
        rootChildren.appendChild(drinkLi);

        rootItem.appendChild(rootChildren);
        ul.appendChild(rootItem);
        navTree.appendChild(ul);

        handleNavClick(['饮食']);
    }

    function createNavItem(label, icon, path, isLeaf, childrenBuilder) {
        const li = document.createElement('li');
        const item = document.createElement('div');
        item.className = 'nav-item';
        item.dataset.path = JSON.stringify(path);

        const toggle = document.createElement('span');
        toggle.className = 'nav-toggle' + (isLeaf ? ' leaf' : '');
        toggle.innerHTML = '▶';
        item.appendChild(toggle);

        if (icon) {
            const iconSpan = document.createElement('span');
            iconSpan.className = 'nav-icon';
            iconSpan.textContent = icon;
            item.appendChild(iconSpan);
        }

        const labelSpan = document.createElement('span');
        labelSpan.className = 'nav-label';
        labelSpan.textContent = label;
        item.appendChild(labelSpan);

        li.appendChild(item);

        let childrenEl = null;
        if (childrenBuilder && !isLeaf) {
            childrenEl = childrenBuilder();
            if (childrenEl) li.appendChild(childrenEl);
        }

        item.addEventListener('click', function(e) {
            e.stopPropagation();
            const pathStr = JSON.stringify(path);

            if (!isLeaf && childrenEl) {
                if (expandedNodes.has(pathStr)) {
                    expandedNodes.delete(pathStr);
                    toggle.classList.remove('expanded');
                    childrenEl.classList.remove('expanded');
                } else {
                    expandedNodes.add(pathStr);
                    toggle.classList.add('expanded');
                    childrenEl.classList.add('expanded');
                }
            }

            document.querySelectorAll('.nav-item.active').forEach(el => el.classList.remove('active'));
            item.classList.add('active');

            handleNavClick(path);
        });

        return li;
    }

    function getWindows(canteen, floor) {
        return foodData.filter(d => d['type'] === '窗口' && d['食堂'] === canteen && d['楼层'] === floor);
    }

    function getDrinkCategories(shop) {
        const cats = new Set();
        foodData.forEach(d => {
            if (d['type'] === '饮品' && d['饮品店'] === shop && d['品类']) {
                cats.add(d['品类']);
            }
        });
        return Array.from(cats);
    }

    function handleNavClick(path) {
        currentPath = path;
        renderContent(path);
    }

    function renderContent(path) {
        if (!contentArea) return;

        contentArea.innerHTML = '';
        contentArea.appendChild(renderBreadcrumb(path));

        const depth = path.length;

        if (depth === 1 && path[0] === '饮食') {
            contentArea.appendChild(renderRoot());
        } else if (depth === 2 && path[1] === '食堂') {
            contentArea.appendChild(renderCanteens());
        } else if (depth === 2 && path[1] === '饮品') {
            contentArea.appendChild(renderShops());
        } else if (depth === 3 && path[1] === '食堂') {
            contentArea.appendChild(renderFloors(path[2]));
        } else if (depth === 3 && path[1] === '饮品') {
            contentArea.appendChild(renderShopCategories(path[2]));
        } else if (depth === 4 && path[1] === '食堂') {
            contentArea.appendChild(renderWindows(path[2], path[3]));
        } else if (depth === 4 && path[1] === '饮品') {
            contentArea.appendChild(renderDrinks(path[2], path[3]));
        } else if (depth === 5 && path[1] === '食堂') {
            contentArea.appendChild(renderDishes(path[2], path[3], path[4]));
        } else {
            contentArea.appendChild(renderEmpty());
        }
    }

    function renderBreadcrumb(path) {
        const wrap = document.createElement('div');
        wrap.className = 'breadcrumb';
        const icons = ['', '🍽️', '', '🏫', '📶', '🍱'];
        for (let i = 0; i < path.length; i++) {
            if (i > 0) {
                const sep = document.createElement('span');
                sep.className = 'breadcrumb-separator';
                sep.textContent = '›';
                wrap.appendChild(sep);
            }
            const item = document.createElement('span');
            item.className = 'breadcrumb-item' + (i === path.length - 1 ? ' current' : '');
            const prefix = icons[i] ? icons[i] + ' ' : '';
            item.textContent = prefix + path[i];
            if (i < path.length - 1) {
                (function(idx) {
                    item.addEventListener('click', () => {
                        const newPath = path.slice(0, idx + 1);
                        document.querySelectorAll('.nav-item').forEach(n => {
                            try {
                                const p = JSON.parse(n.dataset.path);
                                if (JSON.stringify(p) === JSON.stringify(newPath)) {
                                    n.click();
                                }
                            } catch (e) {}
                        });
                    });
                })(i);
            }
            wrap.appendChild(item);
        }
        return wrap;
    }

    function renderRoot() {
        const wrap = document.createElement('div');
        const title = document.createElement('h3');
        title.className = 'content-title';
        title.innerHTML = '🍽️ 饮食板块概览';
        wrap.appendChild(title);

        const grid = document.createElement('div');
        grid.className = 'root-cards';

        const canteenCount = Object.keys((foodStructure['饮食'] && foodStructure['饮食']['食堂']) || {}).length;
        const shopList = (foodStructure['饮食'] && foodStructure['饮食']['饮品'] && foodStructure['饮食']['饮品']['饮品店列表']) || [];
        const dishCount = foodData.filter(d => d['type'] === '菜品').length;
        const drinkCount = foodData.filter(d => d['type'] === '饮品').length;

        const canteenCard = document.createElement('div');
        canteenCard.className = 'root-card canteen-card';
        canteenCard.innerHTML = `
            <div class="root-card-icon">🍚</div>
            <h3>食堂美食</h3>
            <p>${canteenCount} 个食堂 · ${dishCount} 道菜品</p>
        `;
        canteenCard.addEventListener('click', () => {
            document.querySelectorAll('.nav-item').forEach(n => {
                try {
                    const p = JSON.parse(n.dataset.path);
                    if (p.length === 2 && p[0] === '饮食' && p[1] === '食堂') n.click();
                } catch (e) {}
            });
        });

        const drinkCard = document.createElement('div');
        drinkCard.className = 'root-card drink-card';
        drinkCard.innerHTML = `
            <div class="root-card-icon">🥤</div>
            <h3>特色饮品</h3>
            <p>${shopList.length} 家饮品店 · ${drinkCount} 款饮品</p>
        `;
        drinkCard.addEventListener('click', () => {
            document.querySelectorAll('.nav-item').forEach(n => {
                try {
                    const p = JSON.parse(n.dataset.path);
                    if (p.length === 2 && p[0] === '饮食' && p[1] === '饮品') n.click();
                } catch (e) {}
            });
        });

        grid.appendChild(canteenCard);
        grid.appendChild(drinkCard);
        wrap.appendChild(grid);
        return wrap;
    }

    function renderCanteens() {
        const wrap = document.createElement('div');
        const title = document.createElement('h3');
        title.className = 'content-title';
        title.innerHTML = '🏫 选择食堂';
        wrap.appendChild(title);

        const canteens = (foodStructure['饮食'] && foodStructure['饮食']['食堂']) || {};
        const grid = document.createElement('div');
        grid.className = 'grid-cards';

        Object.keys(canteens).forEach((name, idx) => {
            const info = canteens[name];
            const floors = (info['楼层'] || []).length;
            const winCount = foodData.filter(d => d['type'] === '窗口' && d['食堂'] === name).length;
            const dishCount = foodData.filter(d => d['type'] === '菜品' && d['食堂'] === name).length;

            const card = document.createElement('div');
            card.className = 'shop-card';
            const icons = ['🍚', '🥗', '🍜', '🍱', '🍲'];
            card.innerHTML = `
                <div class="shop-icon">${icons[idx % icons.length]}</div>
                <div class="shop-name">${name}</div>
                <div class="shop-location">📋 ${floors} 层楼 · ${winCount} 个窗口</div>
                <div class="shop-desc">共收录 ${dishCount} 道菜品，点击查看各楼层美食详情</div>
            `;
            card.addEventListener('click', () => {
                document.querySelectorAll('.nav-item').forEach(n => {
                    try {
                        const p = JSON.parse(n.dataset.path);
                        if (p.length === 3 && p[0] === '饮食' && p[1] === '食堂' && p[2] === name) n.click();
                    } catch (e) {}
                });
            });
            grid.appendChild(card);
        });

        wrap.appendChild(grid);
        return wrap;
    }

    function renderShops() {
        const wrap = document.createElement('div');
        const title = document.createElement('h3');
        title.className = 'content-title';
        title.innerHTML = '☕ 选择饮品店';
        wrap.appendChild(title);

        const shopList = (foodStructure['饮食'] && foodStructure['饮食']['饮品'] && foodStructure['饮食']['饮品']['饮品店列表']) || [];
        const grid = document.createElement('div');
        grid.className = 'grid-cards';

        shopList.forEach((name, idx) => {
            const shopInfo = foodData.find(d => d['type'] === '饮品店' && d['名称'] === name);
            const drinkCount = foodData.filter(d => d['type'] === '饮品' && d['饮品店'] === name).length;
            const catCount = getDrinkCategories(name).length;

            const card = document.createElement('div');
            card.className = 'shop-card';
            const icons = ['☕', '🧋', '🍵'];
            card.innerHTML = `
                <div class="shop-icon">${icons[idx % icons.length]}</div>
                <div class="shop-name">${name}</div>
                ${shopInfo && shopInfo['位置'] ? `<div class="shop-location">📍 ${shopInfo['位置']}</div>` : ''}
                <div class="shop-desc">${(shopInfo && shopInfo['简介']) || '暂无介绍'}</div>
                <div class="shop-location">🧋 ${catCount} 个品类 · ${drinkCount} 款饮品</div>
            `;
            card.addEventListener('click', () => {
                document.querySelectorAll('.nav-item').forEach(n => {
                    try {
                        const p = JSON.parse(n.dataset.path);
                        if (p.length === 3 && p[0] === '饮食' && p[1] === '饮品' && p[2] === name) n.click();
                    } catch (e) {}
                });
            });
            grid.appendChild(card);
        });

        wrap.appendChild(grid);
        return wrap;
    }

    function renderFloors(canteenName) {
        const wrap = document.createElement('div');
        const title = document.createElement('h3');
        title.className = 'content-title';
        title.innerHTML = `📶 ${canteenName} · 选择楼层`;
        wrap.appendChild(title);

        const canteens = (foodStructure['饮食'] && foodStructure['饮食']['食堂']) || {};
        const info = canteens[canteenName] || {};
        const floors = info['楼层'] || [];

        const grid = document.createElement('div');
        grid.className = 'floor-cards';

        floors.forEach((fname, idx) => {
            const winCount = foodData.filter(d => d['type'] === '窗口' && d['食堂'] === canteenName && d['楼层'] === fname).length;
            const dishCount = foodData.filter(d => d['type'] === '菜品' && d['食堂'] === canteenName && d['楼层'] === fname).length;

            const card = document.createElement('div');
            card.className = 'floor-card';
            card.innerHTML = `
                <div class="floor-banner">
                    <span class="floor-name">${fname}</span>
                </div>
                <div class="floor-info">
                    <h4>${canteenName} ${fname}</h4>
                    <p>${winCount} 个窗口 · ${dishCount} 道菜品</p>
                </div>
            `;
            card.addEventListener('click', () => {
                document.querySelectorAll('.nav-item').forEach(n => {
                    try {
                        const p = JSON.parse(n.dataset.path);
                        if (p.length === 4 && p[0] === '饮食' && p[1] === '食堂' && p[2] === canteenName && p[3] === fname) n.click();
                    } catch (e) {}
                });
            });
            grid.appendChild(card);
        });

        wrap.appendChild(grid);
        return wrap;
    }

    function renderShopCategories(shopName) {
        const wrap = document.createElement('div');
        const title = document.createElement('h3');
        title.className = 'content-title';
        title.innerHTML = `🧋 ${shopName} · 选择品类`;
        wrap.appendChild(title);

        const categories = getDrinkCategories(shopName);
        if (categories.length === 0) {
            wrap.appendChild(renderEmpty('该饮品店暂未录入品类信息'));
            return wrap;
        }

        const grid = document.createElement('div');
        grid.className = 'category-cards';

        const iconMap = { 'coffee': '☕', 'tea': '🍵', 'milk-tea': '🧋', 'juice': '🧃' };

        categories.forEach(cat => {
            const catClass = getCategoryIconCategory(cat);
            const drinkCount = foodData.filter(d => d['type'] === '饮品' && d['饮品店'] === shopName && d['品类'] === cat).length;
            const icon = iconMap[catClass] || '🥤';

            const card = document.createElement('div');
            card.className = 'category-card ' + catClass;
            card.innerHTML = `
                <div class="category-icon">${icon}</div>
                <div class="category-name">${cat}</div>
                <div style="margin-top:8px;font-size:13px;color:#64748b">${drinkCount} 款饮品</div>
            `;
            card.addEventListener('click', () => {
                document.querySelectorAll('.nav-item').forEach(n => {
                    try {
                        const p = JSON.parse(n.dataset.path);
                        if (p.length === 4 && p[0] === '饮食' && p[1] === '饮品' && p[2] === shopName && p[3] === cat) n.click();
                    } catch (e) {}
                });
            });
            grid.appendChild(card);
        });

        wrap.appendChild(grid);
        return wrap;
    }

    function renderWindows(canteenName, floorName) {
        const wrap = document.createElement('div');
        const title = document.createElement('h3');
        title.className = 'content-title';
        title.innerHTML = `🍱 ${canteenName} ${floorName} · 全部窗口`;
        wrap.appendChild(title);

        const windows = getWindows(canteenName, floorName);
        if (windows.length === 0) {
            wrap.appendChild(renderEmpty('该楼层暂未录入窗口信息'));
            return wrap;
        }

        const grid = document.createElement('div');
        grid.className = 'grid-cards';

        windows.forEach(w => {
            const dishCount = foodData.filter(d => d['type'] === '菜品' && d['食堂'] === canteenName && d['楼层'] === floorName && d['窗口'] && (d['窗口'].includes(w['窗口名称']) || (w['窗口编号'] && d['窗口'].includes(w['窗口编号'])))).length;
            const catClass = getCategoryTagClass(w['类别']);
            const summary = w['简介'] ? w['简介'].slice(0, 20) + (w['简介'].length > 20 ? '...' : '') : '';

            const card = document.createElement('div');
            card.className = 'window-card';
            card.innerHTML = `
                <div class="window-header">
                    <div class="window-name">${w['窗口名称'] || '窗口'}</div>
                    ${w['窗口编号'] ? `<span class="window-number">${w['窗口编号']}号</span>` : ''}
                </div>
                ${w['类别'] ? `<div class="category-tags"><span class="category-tag ${catClass}">${w['类别']}</span></div>` : ''}
                ${summary ? `<div class="window-desc">${summary}</div>` : ''}
                <div style="font-size:13px;color:#64748b;margin-bottom:12px">🍽️ 共 ${dishCount} 道菜品</div>
                ${w['content'] ? `<button class="window-expand-btn" data-expand="0">查看窗口介绍 ▼</button>` : ''}
                ${w['content'] ? `<div class="window-detail">${w['content']}</div>` : ''}
            `;

            card.addEventListener('click', function(e) {
                if (e.target.classList.contains('window-expand-btn')) {
                    e.stopPropagation();
                    const btn = e.target;
                    const detail = card.querySelector('.window-detail');
                    const expanded = btn.dataset.expand === '1';
                    if (expanded) {
                        detail.classList.remove('show');
                        btn.dataset.expand = '0';
                        btn.textContent = '查看窗口介绍 ▼';
                    } else {
                        detail.classList.add('show');
                        btn.dataset.expand = '1';
                        btn.textContent = '收起介绍 ▲';
                    }
                    return;
                }
                document.querySelectorAll('.nav-item').forEach(n => {
                    try {
                        const p = JSON.parse(n.dataset.path);
                        if (p.length === 5 && p[0] === '饮食' && p[1] === '食堂' && p[2] === canteenName && p[3] === floorName && (p[4] === w['窗口名称'] || p[4].includes(w['窗口名称']) || (w['窗口编号'] && p[4].includes(w['窗口编号'])))) {
                            n.click();
                        }
                    } catch (e) {}
                });
            });
            grid.appendChild(card);
        });

        wrap.appendChild(grid);
        return wrap;
    }

    function renderDishes(canteenName, floorName, windowKey) {
        const wrap = document.createElement('div');
        const title = document.createElement('h3');
        title.className = 'content-title';
        title.innerHTML = `🍛 菜品列表`;
        wrap.appendChild(title);

        const dishes = foodData.filter(d => {
            if (d['type'] !== '菜品') return false;
            if (d['食堂'] !== canteenName || d['楼层'] !== floorName) return false;
            const w = d['窗口'] || '';
            return w.includes(windowKey) || (windowKey.includes(w));
        });

        if (dishes.length === 0) {
            wrap.appendChild(renderEmpty('该窗口暂未录入菜品'));
            return wrap;
        }

        const grid = document.createElement('div');
        grid.className = 'grid-cards';

        dishes.forEach(dish => {
            const card = document.createElement('div');
            card.className = 'dish-card';
            card.innerHTML = `
                <div class="dish-header">
                    <div class="dish-name">${dish['菜名'] || '菜品'}</div>
                    ${dish['价格'] ? `<div class="dish-price">${dish['价格']}</div>` : ''}
                </div>
                <div class="dish-meta">
                    ${dish['供应时段'] ? `<span class="dish-time-badge">⏰ ${dish['供应时段']}</span>` : ''}
                </div>
                <div class="rating-section" data-loaded="0">
                    <div class="rating-left">
                        <span class="stars">
                            <span class="stars-bg">★★★★★</span>
                            <span class="stars-fg" style="width:0%">★★★★★</span>
                        </span>
                        <span class="rating-score">--</span>
                    </div>
                    <span class="review-count">加载评价...</span>
                </div>
                <div class="reviews-list"></div>
                ${dish['content'] ? `<div class="dish-desc">${dish['content']}</div>` : ''}
            `;
            grid.appendChild(card);

            const ratingSec = card.querySelector('.rating-section');
            const reviewsList = card.querySelector('.reviews-list');

            loadReviews(dish).then(reviews => {
                const { avg, count } = calcRating(reviews);
                const pct = (avg / 5) * 100;
                const starsFg = ratingSec.querySelector('.stars-fg');
                const scoreEl = ratingSec.querySelector('.rating-score');
                const countEl = ratingSec.querySelector('.review-count');
                if (starsFg) starsFg.style.width = pct + '%';
                if (scoreEl) scoreEl.textContent = count > 0 ? avg.toFixed(1) : '暂无';
                if (countEl) countEl.textContent = count > 0 ? `${count}条评价` : '暂无评价';
                ratingSec.dataset.loaded = '1';
                ratingSec.dataset.reviews = JSON.stringify(reviews);
            });

            ratingSec.addEventListener('click', function() {
                if (reviewsList.classList.contains('expanded')) {
                    reviewsList.classList.remove('expanded');
                    ratingSec.querySelector('.review-toggle-text').textContent = '';
                } else {
                    let reviews = [];
                    try { reviews = JSON.parse(ratingSec.dataset.reviews || '[]'); } catch (e) {}
                    renderReviewsList(reviewsList, reviews);
                    reviewsList.classList.add('expanded');
                }
            });
        });

        wrap.appendChild(grid);
        return wrap;
    }

    function renderDrinks(shopName, categoryName) {
        const wrap = document.createElement('div');
        const title = document.createElement('h3');
        title.className = 'content-title';
        title.innerHTML = `🥤 饮品列表`;
        wrap.appendChild(title);

        const drinks = foodData.filter(d => d['type'] === '饮品' && d['饮品店'] === shopName && d['品类'] === categoryName);
        if (drinks.length === 0) {
            wrap.appendChild(renderEmpty('该品类暂未录入饮品'));
            return wrap;
        }

        const grid = document.createElement('div');
        grid.className = 'grid-cards';

        drinks.forEach(drink => {
            const card = document.createElement('div');
            card.className = 'drink-card-item';
            card.innerHTML = `
                <div class="dish-header">
                    <div class="dish-name">${drink['名称'] || '饮品'}</div>
                    ${drink['价格'] ? `<div class="dish-price">${drink['价格']}</div>` : ''}
                </div>
                <div class="dish-meta">
                    ${drink['供应时段'] ? `<span class="dish-time-badge">⏰ ${drink['供应时段']}</span>` : ''}
                </div>
                <div class="rating-section" data-loaded="0">
                    <div class="rating-left">
                        <span class="stars">
                            <span class="stars-bg">★★★★★</span>
                            <span class="stars-fg" style="width:0%">★★★★★</span>
                        </span>
                        <span class="rating-score">--</span>
                    </div>
                    <span class="review-count">加载评价...</span>
                </div>
                <div class="reviews-list"></div>
                ${drink['content'] ? `<div class="dish-desc">${drink['content']}</div>` : ''}
            `;
            grid.appendChild(card);

            const ratingSec = card.querySelector('.rating-section');
            const reviewsList = card.querySelector('.reviews-list');

            loadReviews(drink).then(reviews => {
                const { avg, count } = calcRating(reviews);
                const pct = (avg / 5) * 100;
                const starsFg = ratingSec.querySelector('.stars-fg');
                const scoreEl = ratingSec.querySelector('.rating-score');
                const countEl = ratingSec.querySelector('.review-count');
                if (starsFg) starsFg.style.width = pct + '%';
                if (scoreEl) scoreEl.textContent = count > 0 ? avg.toFixed(1) : '暂无';
                if (countEl) countEl.textContent = count > 0 ? `${count}条评价` : '暂无评价';
                ratingSec.dataset.loaded = '1';
                ratingSec.dataset.reviews = JSON.stringify(reviews);
            });

            ratingSec.addEventListener('click', function() {
                if (reviewsList.classList.contains('expanded')) {
                    reviewsList.classList.remove('expanded');
                } else {
                    let reviews = [];
                    try { reviews = JSON.parse(ratingSec.dataset.reviews || '[]'); } catch (e) {}
                    renderReviewsList(reviewsList, reviews);
                    reviewsList.classList.add('expanded');
                }
            });
        });

        wrap.appendChild(grid);
        return wrap;
    }

    function renderReviewsList(container, reviews) {
        container.innerHTML = '';
        if (!reviews || reviews.length === 0) {
            const empty = document.createElement('div');
            empty.style.cssText = 'padding:12px 0;font-size:13px;color:#94a3b8;text-align:center;border-top:1px solid var(--border-color);margin-top:8px';
            empty.textContent = '暂无评价，快来成为第一个评价的人吧~';
            container.appendChild(empty);
            return;
        }
        reviews.forEach(r => {
            const item = document.createElement('div');
            item.className = 'review-item';
            const rating = parseFloat(r['评分']) || 0;
            item.innerHTML = `
                <div class="review-header">
                    <div class="review-left">
                        <span class="reviewer-name">${r['评价人'] || '匿名'}</span>
                        <span class="review-stars">${getStarsSimple(rating)}</span>
                    </div>
                    <span class="review-date">${r['时间'] || ''}</span>
                </div>
                <div class="review-content">${r['内容'] || ''}</div>
            `;
            container.appendChild(item);
        });
    }

    function renderEmpty(msg) {
        const div = document.createElement('div');
        div.className = 'empty-state';
        div.innerHTML = `
            <div class="empty-state-icon">📭</div>
            <div class="empty-state-text">${msg || '暂无内容'}</div>
        `;
        return div;
    }

    if (searchInput) {
        searchInput.addEventListener('input', function() {
        });
    }

    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
        });
    }

    document.addEventListener('DOMContentLoaded', function() {
        buildNavigation();
    });

})();
