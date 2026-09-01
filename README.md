# pst's Blog

个人博客源码，记录科研、项目实践、论文阅读与技术学习。

- 站点：https://pppppst.github.io
- 源码：`pppppst/pst-blog`
- 发布：`pppppst/pppppst.github.io`

## 功能

- 首页个人介绍与独立 `/blog/` 文章流
- 分类、标签、归档、友链和碎碎念
- 本地搜索、Atom RSS、sitemap、robots.txt 和文章 OG 分享图
- 可选 Giscus 文章及碎碎念评论、评论邮件通知与评论触发重建
- 暗色/阅读模式、PJAX、图片懒加载、灯箱、字数统计和访问统计
- GitHub Actions 双仓自动部署、搜索引擎推送和 Pages 失败重试

## 本地开发

需要 Node.js 20 与 pnpm 10。

```bash
pnpm install
pnpm run server
pnpm run build
pnpm test
pnpm run verify
```

## GitHub 配置

### 1. 发布与 Pages

在源码仓 `pppppst/pst-blog` 创建细粒度 PAT `PAGES_DEPLOY_TOKEN`：仅授权发布仓
`pppppst/pppppst.github.io` 的 **Contents: Read and write**、**Workflows: Read and write**。
若发布仓 `main` 有分支保护，需要允许该令牌推送，或把自动部署纳入保护规则。

发布仓设置 `Settings → Pages → Build and deployment → Deploy from a branch`，分支选择
`main`、目录选择 `/ (root)`。首次推送源码仓 `main` 后，确认 Pages 可访问，再启用后续集成。

### 2. 评论与按需重建

发布仓启用 Discussions、安装 Giscus App 并创建评论分类。在 [giscus.app](https://giscus.app/zh-CN)
生成配置，把 `repo_id`、`category_id` 写入根目录 `_config.butterfly.yml`，再把同文件的
`comments.use` 改为 `Giscus`。未完成这一步时评论保持关闭。

源码仓 `pppppst/pst-blog` 需要：

- Secrets：`PAGES_DEPLOY_TOKEN`；启用碎碎念评论计数时再配置 `GH_DISCUSSION_TOKEN`
  （细粒度 PAT：发布仓 **Discussions: Read-only**、**Metadata: Read-only**）

发布仓 `pppppst/pppppst.github.io` 需要：

- Secrets：`SOURCE_DEPLOY_PAT`（细粒度 PAT：源码仓 **Contents: Read and write**；classic PAT：`repo` scope）、`SMTP_SERVER`、`SMTP_PORT`、
  `SMTP_USERNAME`、`SMTP_PASSWORD`、`MAIL_FROM`、`MAIL_TO`、`BAIDU_SITE`、`BAIDU_TOKEN`
- Variables：`ENABLE_COMMENT_EMAIL`、`ENABLE_COMMENT_REBUILD`、`ENABLE_SEARCH_PING`、`ENABLE_PAGES_RETRY`

按需逐项把 Variables 设为 `true`：先 `ENABLE_COMMENT_EMAIL`，再
`ENABLE_COMMENT_REBUILD`，最后按需要启用百度提交 `ENABLE_SEARCH_PING` 和 Pages 重试
`ENABLE_PAGES_RETRY`。每启用一项，先手动运行对应 workflow 验证；暂时不用的复杂功能保持未启用。

## 来源与许可

站点框架基于 [SpeechlessPanda/blog-s-code](https://github.com/SpeechlessPanda/blog-s-code) 定制；未复制其文章、碎碎念、友链或个人资料。当前内置 Butterfly 5.5.4 快照的 `package.json` 与仓库内许可证文本均标明 Apache-2.0，相关许可文件已原样保留。
