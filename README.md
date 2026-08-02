# 王皓月交互作品集

这是从 `作品集网站备份_2026-07-31_180419` 恢复的交互作品集项目，包含 3D 指路牌、精选作品、作品分类、项目详情、关于我等页面。

## 本地预览

```bash
pnpm install --frozen-lockfile
pnpm dev
```

本地访问：

```text
http://localhost:3000/
```

## GitHub Pages 发布

本项目已配置 GitHub Pages 自动部署：

- `.github/workflows/deploy-github-pages.yml`
- `next.config.ts` 静态导出配置
- `public/.nojekyll`
- `pnpm build:github`

发布步骤：

1. 在 GitHub 新建一个公开仓库，例如 `haoyue-interactive-portfolio`。
2. 将本项目推送到该仓库的 `main` 分支。
3. 打开仓库的 `Settings -> Pages`。
4. 在 `Build and deployment` 中选择 `GitHub Actions`。
5. 等待 `Actions` 里的 `Deploy to GitHub Pages` 工作流完成。

完成后，访问地址通常是：

```text
https://你的GitHub用户名.github.io/仓库名/
```

如果仓库名是 `你的GitHub用户名.github.io`，访问地址则是：

```text
https://你的GitHub用户名.github.io/
```

## Git 推送命令示例

```bash
git init
git add .
git commit -m "Restore interactive portfolio"
git branch -M main
git remote add origin https://github.com/你的GitHub用户名/haoyue-interactive-portfolio.git
git push -u origin main
```

## 静态构建验证

```bash
pnpm build:github
```

构建产物会输出到 `out/`，GitHub Actions 会自动上传并发布该目录。
