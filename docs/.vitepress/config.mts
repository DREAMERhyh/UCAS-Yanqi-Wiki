import { defineConfig } from "vitepress";
import { readdirSync, statSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import { cpSync } from "fs";

const docsDir = join(__dirname, "..");

interface SidebarItem {
  text: string;
  link?: string;
  items?: SidebarItem[];
}

function normalizePath(path: string): string {
  return path.replace(/\\/g, "/");
}

function scanDirectory(basePath: string, relativePath: string): SidebarItem[] {
  const items: SidebarItem[] = [];
  const fullPath = join(basePath, relativePath);

  try {
    const entries = readdirSync(fullPath, { withFileTypes: true });
    const dirs = entries.filter((entry) => entry.isDirectory());

    for (const dir of dirs) {
      const dirName = dir.name;
      if (dirName === "reviews" || dirName.startsWith(".")) continue;

      const itemPath = normalizePath(join(relativePath, dirName));
      const itemFullPath = join(basePath, itemPath);
      const indexPath = join(itemFullPath, "index.md");

      if (statSync(indexPath).isFile()) {
        const subItems = scanDirectory(basePath, itemPath);
        const item: SidebarItem = {
          text: dirName,
          link: `/${itemPath}/`,
        };

        if (subItems.length > 0) {
          item.items = subItems;
        }

        items.push(item);
      }
    }
  } catch {
    // 忽略无法读取的目录
  }

  return items;
}

const foodSidebar = scanDirectory(docsDir, "饮食");

export default defineConfig({
  title: "UCAS 雁栖湖校园指南",
  description: "由国科大学子共建的雁栖湖校区生存与生活指南",

  vite: {
    plugins: [
      {
        name: "serve-admin-files",
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            // 本地开发时支持 /admin/ 路径
            if (req.url && req.url.startsWith("/admin/")) {
              const fs = require("fs");
              const path = require("path");
              const adminPath = path.join(__dirname, "..", "admin");
              let filePath = path.join(adminPath, req.url.slice("/admin/".length) || "index.html");
              
              if (!filePath || filePath.endsWith("/")) {
                filePath += "index.html";
              }

              if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
                filePath = path.join(filePath, "index.html");
              }

              if (fs.existsSync(filePath)) {
                const ext = path.extname(filePath);
                const contentTypeMap: Record<string, string> = {
                  ".html": "text/html; charset=utf-8",
                  ".yml": "text/yaml; charset=utf-8",
                  ".yaml": "text/yaml; charset=utf-8",
                  ".js": "application/javascript",
                };
                res.setHeader("Content-Type", contentTypeMap[ext] || "application/octet-stream");
                res.end(fs.readFileSync(filePath));
              } else {
                next();
              }
            } else {
              next();
            }
          });
        },
      },
      {
        name: "copy-admin-for-cms",
        apply: "build",
        enforce: "pre",
        async writeBundle() {
          const adminSrc = join(__dirname, "..", "admin");
          const adminDest = join(__dirname, "dist", "admin");

          if (existsSync(adminSrc)) {
            if (!existsSync(adminDest)) {
              mkdirSync(adminDest, { recursive: true });
            }
            cpSync(adminSrc, adminDest, { recursive: true });
            console.log("CMS admin files copied to dist/admin/");
          }
        },
      },
    ],
  },

  themeConfig: {
    nav: [
      { text: "首页", link: "/" },
      { text: "饮食", link: "/饮食/" },
      { text: "生活设施", link: "/生活设施/" },
      { text: "学习与课程", link: "/学习与课程/" },
      { text: "周边与出行", link: "/周边与出行/" },
      { text: "内容投稿", link: "/admin/", target: "_self" },
    ],

    sidebar: {
      "/饮食/": foodSidebar,
    },
  },
});
