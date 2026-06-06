/# 📖 My Blog — 使用指南

## 目录

- [快速开始](#快速开始)
- [写文章](#写文章)
- [文章 Frontmatter 字段](#文章-frontmatter-字段)
- [Markdown 语法支持](#markdown-语法支持)
- [管理后台](#管理后台)
- [评论系统配置](#评论系统配置)
- [暗色模式](#暗色模式)
- [搜索功能](#搜索功能)
- [RSS 订阅](#rss-订阅)
- [部署上线](#部署上线)
- [目录结构说明](#目录结构说明)
- [常见问题](#常见问题)

---

## 快速开始

```bash
# 1. 进入项目目录
cd Desktop/Blog

# 2. 安装依赖（首次使用）
npm install

# 3. 启动开发服务器
npm run dev
```

浏览器打开 `http://localhost:3000` 即可看到博客。

```bash
# 生产构建（生成静态文件到 .next/）
npm run build

# 启动生产服务器
npm run start
```

---

## 写文章

### 在哪里写

所有文章存放在 `content/posts/` 目录下，以 `.md` 为后缀。一篇 Markdown 文件就是一篇博客文章。

```
content/
├── posts/                    ← 这里放已发布/即将发布的文章
│   ├── hello-world.md
│   ├── my-second-post.md
│   └── ...
└── drafts/                   ← 这里放草稿
    └── work-in-progress.md
```

### 创建一篇新文章

在 `content/posts/` 下新建一个 `.md` 文件，例如 `my-article.md`：

```markdown
---
title: "我的第一篇文章"
date: "2026-06-06"
tags: ["技术", "前端", "React"]
description: "这是一篇关于 React 开发的文章，分享了我在项目中的实践经验。"
coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&q=80"
author: "张三"
---

## 引言

这里开始写正文...

## 第一节

正文内容...

### 小节标题

更多内容...
```

> **注意**：Markdown 文件顶部的 `---` 包裹部分叫做 **Frontmatter**，用于设置文章元信息。

### 文件名规则

- 文件名会成为文章的唯一标识（slug）
- 例如 `hello-world.md` → 访问路径为 `/posts/hello-world`
- 建议使用英文+连字符命名，方便 SEO

---

## 文章 Frontmatter 字段

| 字段 | 必需 | 类型 | 说明 |
|------|------|------|------|
| `title` | ✅ | string | 文章标题 |
| `date` | ✅ | string | 发布日期，格式 `YYYY-MM-DD` |
| `tags` | ✅ | string[] | 标签数组，如 `["前端", "React"]` |
| `description` | ❌ | string | 文章摘要，不写则会自动截取正文前 120 字 |
| `coverImage` | ❌ | string | 封面图 URL，推荐 1200×630 像素 |
| `author` | ❌ | string | 作者名，默认 "Anonymous" |
| `draft` | ❌ | boolean | 设为 `true` 则为草稿，不在首页显示 |

### 示例

```yaml
---
title: "Next.js 最佳实践 2026"
date: "2026-06-15"
tags: ["Next.js", "React", "前端"]
description: "总结了在 Next.js 项目中的最佳实践和经验教训"
coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80"
author: "张三"
draft: false
---
```

---

## Markdown 语法支持

博客支持完整的 **GitHub Flavored Markdown (GFM)**，并且代码块有语法高亮。

### 标题

```markdown
## 二级标题
### 三级标题
#### 四级标题
```

二级标题会自动出现在文章右侧的目录导航中（TOC）。

### 文本样式

```markdown
**粗体文字**
*斜体文字*
~~删除线~~
`行内代码`
```

### 链接与图片

```markdown
[链接文字](https://example.com)

![图片描述](https://example.com/image.jpg)
```

### 引用

```markdown
> 这是一段引用文字。
> 可以多行。
```

### 列表

```markdown
- 无序列表项 1
- 无序列表项 2
  - 嵌套项

1. 有序列表项 1
2. 有序列表项 2
```

### 任务列表

```markdown
- [x] 已完成的任务
- [ ] 待完成的任务
```

### 表格

```markdown
| 列 A | 列 B | 列 C |
|------|------|------|
| 数据 | 数据 | 数据 |
| 数据 | 数据 | 数据 |
```

### 代码块（语法高亮）

````markdown
```javascript
const greeting = "Hello World"
console.log(greeting)
```

```python
def hello():
    print("Hello World")
```

```css
.selector {
  color: blue;
}
```
````

支持的语言高亮由 Shiki 提供，覆盖 200+ 种编程语言。

### 分割线

```markdown
---
```

---

## 管理后台

### 访问

浏览器打开 `http://localhost:3000/admin`

### 登录

默认密码：**`admin123`**

> 修改密码：编辑 `components/admin/AdminDashboard.tsx`，找到 `ADMIN_PASSWORD` 变量并修改。

### 功能

| 功能 | 说明 |
|------|------|
| 📊 统计面板 | 显示已发布文章数、草稿数、标签数、总阅读量 |
| 📝 已发布列表 | 查看所有公开文章的标题、日期、标签 |
| 📄 草稿列表 | 查看 `content/drafts/` 下的草稿 |
| 🚀 快速创建 | 提供 Frontmatter 模板，复制即可使用 |
| 📁 文件指引 | 提示各内容目录的位置和用途 |

### 草稿管理

方式一：在 Frontmatter 中设 `draft: true`

```yaml
---
title: "还在写..."
date: "2026-06-20"
tags: ["草稿"]
draft: true
---
```

方式二：把 `.md` 文件放到 `content/drafts/` 目录下。

两种方式的草稿都不会出现在首页、标签页和 RSS 中，只能在后台看到。

---

## 评论系统配置

评论使用 **Giscus**，基于 GitHub Discussions，完全免费。

### 配置步骤

1. 确保你的 GitHub 仓库是**公开的**
2. 在仓库 Settings → Features 中启用 **Discussions**
3. 安装 [Giscus App](https://github.com/apps/giscus) 到你的仓库
4. 访问 [giscus.app](https://giscus.app) 填写配置：
   - 仓库名：`你的用户名/你的仓库名`
   - Discussion 分类：选择或新建一个分类（如 "Comments"）
5. 获取 `data-repo-id` 和 `data-category-id`
6. 编辑 `components/posts/GiscusComments.tsx`：

```typescript
script.setAttribute('data-repo', '你的用户名/你的仓库名')
script.setAttribute('data-repo-id', 'R_xxx')         // 从 giscus.app 获取
script.setAttribute('data-category', 'Comments')
script.setAttribute('data-category-id', 'DIC_xxx')    // 从 giscus.app 获取
```

重新构建后，每篇文章底部就会自动显示评论区，支持亮/暗模式自动切换。

---

## 暗色模式

### 切换方式

点击导航栏右侧的 ☀️/🌙/🖥️ 图标，三种模式循环切换：

| 图标 | 模式 | 说明 |
|------|------|------|
| ☀️ Sun | 亮色 | 始终使用亮色主题 |
| 🌙 Moon | 暗色 | 始终使用暗色主题 |
| 🖥️ Monitor | 跟随系统 | 根据操作系统设置自动切换 |

浏览器会记住你的选择，下次访问自动恢复。

---

## 搜索功能

### 怎么搜索

访问 `/search` 页面，或点击导航栏的 **Search** 按钮。

### 搜索范围

- 文章标题（权重最高）
- 文章摘要
- 标签
- 正文摘要

### 特点

- 模糊搜索：不需要精确匹配，拼错一两个字也能找到
- 实时过滤：输入即搜索，无需按回车
- 300ms 防抖：不会频繁触发搜索

---

## RSS 订阅

### 订阅地址

```
http://localhost:3000/api/rss
```

### 如何使用

用任意 RSS 阅读器订阅上面的地址即可。支持的阅读器包括：

- [Feedly](https://feedly.com)
- [Inoreader](https://www.inoreader.com)
- [NetNewsWire](https://netnewswire.com)（Mac/iOS）
- [Fluent Reader](https://hyliu.me/fluent-reader/)（桌面端）

RSS Feed 包含最近 20 篇文章的标题、摘要、发布日期和标签。

### 订阅入口

网站右上角有 RSS 图标链接，底部也有订阅入口。

---

## 部署上线

### 推荐：Vercel（免费，一键部署）

1. 把项目推送到 GitHub：

```bash
cd Desktop/Blog
git init
git add .
git commit -m "Initial commit"
# 在 GitHub 创建仓库后：
git remote add origin https://github.com/你的用户名/你的仓库名.git
git push -u origin main
```

2. 访问 [vercel.com](https://vercel.com)，用 GitHub 登录
3. 点击 **New Project** → 选择你的仓库 → **Deploy**
4. 等待几分钟，你的博客就上线了！

Vercel 免费版特性：
- 自动 HTTPS
- 全球 CDN
- 每次推送自动部署
- 自定义域名支持

### 其他部署方式

也支持部署到任何支持 Node.js 的平台：

```bash
npm run build
npm run start
```

---

## 目录结构说明

```
Desktop/Blog/
│
├── app/                          # 📄 页面和 API 路由
│   ├── layout.tsx               #   根布局（包裹所有页面）
│   ├── page.tsx                 #   首页
│   ├── posts/[slug]/page.tsx    #   文章详情页
│   ├── tags/page.tsx            #   标签列表页
│   ├── tags/[tag]/page.tsx      #   标签筛选页
│   ├── search/page.tsx          #   搜索页
│   ├── about/page.tsx           #   关于页
│   ├── admin/page.tsx           #   后台管理页
│   ├── api/                     #   API 路由
│   │   ├── rss/route.ts         #     RSS 生成
│   │   ├── views/route.ts       #     阅读量接口
│   │   ├── search-index/route.ts #    搜索索引
│   │   └── admin/               #     后台数据接口
│   ├── sitemap.ts               #   自动站点地图
│   └── globals.css              #   全局样式
│
├── components/                   # 🧩 React 组件
│   ├── layout/                  #   布局组件（Header, Footer）
│   ├── posts/                   #   文章组件（卡片、网格、内容渲染、评论）
│   ├── ui/                      #   UI 组件（主题切换、标签、分页、搜索框）
│   └── admin/                   #   后台组件
│
├── content/                      # 📝 内容目录
│   ├── posts/                   #   文章 Markdown 文件
│   ├── drafts/                  #   草稿 Markdown 文件
│   └── views.json               #   阅读量数据（自动生成）
│
├── lib/                          # 🔧 工具函数
│   ├── posts.ts                 #   文章读取、解析、筛选、分页
│   ├── markdown.ts              #   Markdown → HTML 渲染
│   └── views.ts                 #   阅读量读写
│
├── public/                       # 🖼️ 静态资源
│   └── images/                  #   本地图片存放处
│
├── package.json                  # 项目配置
├── tsconfig.json                 # TypeScript 配置
├── next.config.ts                # Next.js 配置
└── postcss.config.mjs           # PostCSS 配置
```

---

## 常见问题

### Q: 文章没有出现在首页？

检查以下几点：
- Frontmatter 中 `draft` 是否为 `true`（设为 `false` 或不写）
- 文件是否放在 `content/posts/`（不是 `content/drafts/`）
- 文件是否为 `.md` 后缀
- 重启开发服务器刷新缓存

### Q: 如何修改博客名称？

编辑 `app/layout.tsx`：
```typescript
export const metadata: Metadata = {
  title: {
    default: '你的博客名称',
    template: '%s | 你的博客名称',
  },
  description: '你的博客描述',
}
```

同时修改 `app/page.tsx` 中的 Hero 区域文字。

### Q: 如何更换网站图标（favicon）？

替换 `public/favicon.ico` 文件，或者放一个 `public/icon.png`。

### Q: 图片不显示？

- 确保图片 URL 可以公开访问
- 本地图片放 `public/images/`，引用时用 `/images/xxx.jpg`
- `next.config.ts` 中已配置允许所有外部域名

### Q: 代码高亮不工作？

代码块需要指定语言：

````markdown
```python    ← 指定语言
print("hello")
```
````

没有指定语言的代码块不会高亮。

### Q: 如何添加新页面？

在 `app/` 下创建新文件夹和 `page.tsx`：

```
app/
└── 新页面/
    └── page.tsx
```

然后通过 `http://localhost:3000/新页面` 访问。

### Q: 如何修改每页显示的文章数？

编辑 `app/page.tsx`，修改 `getPaginatedPosts` 的第二个参数：

```typescript
const { posts, totalPages } = getPaginatedPosts(currentPage, 12) // 每页 12 篇
```

### Q: 构建报错怎么办？

```bash
# 清除缓存重试
rm -rf .next
npm run build
```
