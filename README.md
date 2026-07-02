# Doreen's Notes

个人技术博客，基于 [Hexo](https://hexo.io/) 7.x + [NexT](https://theme-next.org/) 7.8 主题，采用 Monorepo + GitHub Actions 自动部署架构。

---

## 📁 项目结构

```
wadrn.github.io/
├── .github/
│   └── workflows/
│       └── deploy.yml    ← GitHub Actions 自动部署配置
│
├── site/                ← Hexo 源码（提交到 master 分支）
│   ├── _config.yml      ← Hexo 全局配置
│   ├── _config.next.yml ← NexT 主题配置
│   ├── build.js         ← 自定义构建脚本
│   ├── package.json     ← 依赖管理
│   ├── source/
│   │   └── _posts/      ← 📝 Markdown 文章存放目录
│   │       ├── YYYY-MM-DD-标题.md
│   │       └── ...
│   └── themes/
│       └── next/        ← NexT 主题源码
│           └── scripts/
│               └── renderer.js  ← Nunjucks 渲染器（兼容 Swig 模板）
│
├── .gitignore           ← 忽略 public/, node_modules/ 等
└── README.md            ← 本文件
```

**`gh-pages` 分支**（由 GitHub Actions 自动生成和管理，无需手动操作）：

```
gh-pages/
├── index.html           ← 首页
├── 2017/2018/2022/...   ← 文章页面
├── archives/categories/tags/
├── css/js/lib/images/
└── ...                  ← 所有构建产物（GitHub Pages 从此分支读取）
```

---

## ⚡ 快速开始

### 环境要求

- **Node.js** >= 18

### 初始化（首次克隆后）

```bash
# 1. 安装依赖
cd site && npm install

# 2. 本地预览验证
npm run server
# 浏览器打开 http://localhost:4000

# 3. （可选）本地构建检查产物
npm run build
ls ../public/index.html    # 确认生成成功
```

> **首次部署前**：需在 GitHub 仓库 → Settings → Pages 中，将 Source 设为 `gh-pages` 分支、folder 为 `/ (root)`。只需设置一次。

---

## ✍️ 新增文章

### 方式一：手动创建 Markdown 文件（推荐）

在 `site/source/_posts/` 目录下新建 `.md` 文件：

```markdown
---
title: 文章标题
date: 2026-07-02T12:00:00+08:00
categories:
  - FE              # 可选：FE, Algorithm, Reading 等
tags:                # 可选
  - JavaScript
  - hexo
layout: post
permalink: 2026/07/02/my-post-slug/    # 自定义 URL 路径
---

# 正文内容开始

这里是 Markdown 正文...
```

| 字段 | 必填 | 说明 |
|------|:----:|------|
| `title` | ✅ | 文章标题 |
| `date` | ✅ | ISO 8601 格式，用于排序和归档 |
| `permalink` | ✅ | **重要！** 自定义 URL 路径，保持历史 URL 一致性 |
| `categories` | ❌ | 分类（支持多级），用于 `/categories/` 归档 |
| `tags` | ❌ | 标签数组，用于 `/tags/` 归档 |

### 方式二：使用 Hexo 命令创建

```bash
cd site
npx hexo new "我的新文章"
# → 生成 source/_posts/YYYY-MM-DD-我的新文章.md
# → 记得补充 permalink 字段
```

---

## 🚀 发布流程（完整工作流）

### 日常发布 — 只需 3 步

```
┌─────────────────────────────────────────────────────┐
│  Step 1: 写文章                                     │
│                                                     │
│  编辑 site/source/_posts/新文章.md                   │
└─────────────────────┬───────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│  Step 2: 提交 & 推送                                │
│                                                     │
│  git add site/source/_posts/新文章.md                │
│  git commit -m "new post: xxx"                      │
│  git push origin master                             │
└─────────────────────┬───────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│  Step 3: 自动部署（无需额外操作）                     │
│                                                     │
│  GitHub Actions 自动执行：                            │
│  ① npm ci          安装依赖                         │
│  ② npm run build   构建静态文件到 public/            │
│  ③ public/ → gh-pages  推送构建产物                 │
│  ④ GitHub Pages 自动部署                           │
│                                                     │
│  ✅ 约 1-2 分钟后网站更新: wadrn.github.io          │
└─────────────────────────────────────────────────────┘
```

### 本地预览（发布前自检）

```bash
cd site
npm run server        # 启动本地服务器 http://localhost:4000
npm run build         # 构建到 ../public/（仅用于本地检查，不提交）
npm run clean         # 清理构建产物
```

### 手动重新部署

如果需要重新触发部署（如修改了 `_config.yml` 配置）：

1. 打开仓库 **Actions** 页面
2. 选择 **Deploy to GitHub Pages** 工作流
3. 点击 **Run workflow** → **Run workflow**

---

## ⚙️ 配置说明

| 配置文件 | 用途 | 常用修改项 |
|---------|------|-----------|
| `site/_config.yml` | Hexo 全局配置 | 站点标题、URL、日期格式、分页 |
| `site/_config.next.yml` | NexT 主题配置 | 主题风格(scheme)、导航菜单、侧边栏、搜索、Live2D |

修改配置后 `git push` 即可自动触发重新部署。

---

## 🛠 技术栈

| 组件 | 版本 | 说明 |
|------|------|------|
| Hexo | ^7.3.0 | 静态站点生成器 |
| NexT | 7.8.0 | 博客主题 |
| hexo-renderer-marked | ^6.3.0 | Markdown → HTML |
| hexo-renderer-stylus | ^3.0.0 | Stylus → CSS |
| Node.js | >=18 | 运行时环境 |
| GitHub Actions | — | CI/CD 自动部署到 gh-pages |

### 为什么用自定义 `build.js`？

Hexo 7.x + NexT 7.x 存在模板引擎兼容问题（Swig vs Nunjucks），自定义脚本解决：
1. **Swig/Nunjucks 兼容**：`themes/next/scripts/renderer.js` 用 Nunjucks 实现 Swig 模板渲染
2. **插件加载**：手动加载必要的 renderer 插件
3. **Monorepo 支持**：构建产物输出到 `../public/`，由 CI 部署到 `gh-pages`

---

## 📋 常见问题

### Q: 为什么不能用 `hexo generate` 直接构建？
A: Hexo 7.x + NexT 7.x 存在模板引擎兼容问题。`build.js` 封装了完整的兼容处理。

### Q: 新增文章后网站没更新？
A: 依次排查：
1. 是否已 `git push origin master`？
2. 仓库 **Actions** 页面，查看 `Deploy to GitHub Pages` 是否绿色 ✓
3. 如果失败，点击查看日志
4. 成功后 1-2 分钟内 GitHub Pages 完成部署

### Q: 如何回滚到之前的版本？
A: **Actions** 页面找到之前的成功部署记录 → **Re-deploy**；或 `git revert` 后重新推送。

### Q: master 分支为什么没有 public/ 目录？
A: 设计如此。`public/` 在 `.gitignore` 中被忽略，由 GitHub Actions 推送到独立的 `gh-pages` 分支。master 只保留干净源码。

### Q: 如何修改站点标题 / 导航菜单 / 主题配色？
A: 分别编辑 `site/_config.yml`（站点信息）、`site/_config.next.yml` 的 `menu:`（导航）、`scheme:`（配色）。
