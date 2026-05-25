#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 解析 YAML frontmatter
function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return { data: {}, content: content };
  
  const frontmatter = match[1];
  const data = {};
  
  frontmatter.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();
      
      if (value === 'true') value = true;
      else if (value === 'false') value = false;
      else if (!isNaN(value) && value !== '') value = Number(value);
      
      data[key] = value;
    }
  });
  
  return { data, content: content.slice(match[0].length).trim() };
}

// 扫描目录下的所有 reviews 文件
function scanReviews(reviewsPath, productPath) {
  const reviews = [];
  
  if (!fs.existsSync(reviewsPath)) return reviews;
  
  const files = fs.readdirSync(reviewsPath);
  
  files.forEach(file => {
    if (!file.endsWith('.md')) return;
    
    const filePath = path.join(reviewsPath, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const { data, content: bodyContent } = parseFrontmatter(content);
    
    reviews.push({
      filename: file,
      author: data.author || '匿名用户',
      date: data.date || '',
      rating: data.rating || 5,
      sweetness_choice: data.sweetness_choice || '',
      ice_choice: data.ice_choice || '',
      content: bodyContent.trim()
    });
  });
  
  return reviews;
}

// 扫描所有品类目录
function generateAllReviews() {
  const docsDir = path.join(__dirname, '..', 'docs');
  const coffeeCornerPath = path.join(docsDir, '饮食', '跨区域品牌与设备', '咖啡角儿');
  
  // 获取所有品类目录
  const entries = fs.readdirSync(coffeeCornerPath, { withFileTypes: true });
  
  entries.forEach(entry => {
    if (!entry.isDirectory() || entry.name === 'reviews') return;
    
    const productPath = entry.name;
    const reviewsPath = path.join(coffeeCornerPath, productPath, 'reviews');
    
    const reviews = scanReviews(reviewsPath, productPath);
    
    if (reviews.length > 0) {
      // 按日期排序（最新的在前）
      reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      // 生成 JSON 文件
      const jsonPath = path.join(coffeeCornerPath, productPath, 'reviews.json');
      fs.writeFileSync(jsonPath, JSON.stringify(reviews, null, 2), 'utf-8');
      console.log(`Generated: ${productPath}/reviews.json (${reviews.length} reviews)`);
    }
  });
  
  console.log('Review data generation complete!');
}

generateAllReviews();