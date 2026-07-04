# 蒋芷颖 | 艺术与科技 个人简介网站

> 艺术与科技专业个人作品集网站 — 融合粒子动画、现代设计与交互体验。

## 技术栈

- HTML5 + CSS3 + JavaScript（纯原生，无框架依赖）
- Canvas 粒子背景动画
- 响应式设计（桌面/平板/手机）
- Intersection Observer 滚动渐显
- CSS 渐变 + 毛玻璃效果

## 项目结构

```
├── index.html              # 主页面
├── style.css               # 样式表
├── script.js               # 交互脚本
├── .nojekyll               # 禁用 GitHub Pages Jekyll 处理
├── .gitignore              # Git 忽略规则
├── images/
│   ├── avatar.jpg          # 个人头像
│   ├── work1.jpg           # 精选作品 1
│   ├── work2.jpg           # 精选作品 2
│   ├── work3.jpg           # 精选作品 3
│   └── work4.jpg           # 精选作品 4
└── README.md               # 项目说明
```

## 本地预览

直接在浏览器中打开 `index.html` 即可，无需构建工具。

## 部署到 GitHub Pages

```bash
# 1. 初始化 Git 仓库
git init

# 2. 添加所有文件（含 .nojekyll）
git add .

# 3. 提交
git commit -m "初始化个人简介网站"

# 4. 重命名分支为 main
git branch -M main

# 5. 关联远程仓库（替换 your-repo-name）
git remote add origin https://github.com/Zeyri/your-repo-name.git

# 6. 推送
git push -u origin main
```

推送后在 GitHub 仓库 **Settings → Pages** 中：
- **Source**: Deploy from a branch
- **Branch**: `main` / `root`
- 点击 Save，等待 1-2 分钟即可访问

> ⚠️ `.nojekyll` 文件必须存在，否则 GitHub Pages 会用 Jekyll 处理，
> 可能导致 CSS/JS 等以下划线开头的文件被忽略。

## 联系方式

- **GitHub:** [github.com/Zeyri](https://github.com/Zeyri)
- **邮箱:** 3209067562@qq.com
- **电话:** 15074984649

## 自定义

- 替换照片：将 `images/avatar.jpg` 替换为你的照片（同名覆盖）
- 修改配色：编辑 `style.css` 中的 CSS 变量（`:root` 部分）
- 更新作品：将 `images/work1.jpg` ~ `work4.jpg` 替换为你的作品图（同名覆盖）
- 修改联系方式：在 `index.html` 的 `#contact` 区域更新邮箱、电话、GitHub 链接
