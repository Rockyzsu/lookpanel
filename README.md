# LookPanel

网络信息，一目了然。

LookPanel 是一个面向日常网络排查的在线诊断平台，将 IP 信息、连接测试、泄漏检测和服务状态集中在一个清晰的面板中。采用蓝白配色，支持深色模式、中英文切换和移动端访问。

[网站域名](https://lookpanel.com) · [维护者 GitHub](https://github.com/Rockyzsu) · [联系邮箱](mailto:yagamil@hotmail.com) · [English](README.en.md)

## 可以做什么

| 场景         | 工具                                             |
| ------------ | ------------------------------------------------ |
| 了解网络出口 | IP 地址、归属地、运营商、ASN、地图与网站分流出口 |
| 检查连接质量 | 网站连通性、下载与上传测速、全球 Ping            |
| 排查隐私暴露 | DNS / WebRTC 泄漏、浏览器指纹、环境一致性        |
| 定位服务问题 | AI 平台访问检测、官方服务状态及故障事件          |
| 查询注册信息 | 域名、IP 与 ASN 的 WHOIS / RDAP 信息             |

检测结果受本地网络和第三方数据源可用性影响。IP 类型、信誉分和环境检测结果用于辅助排查，不代表相关平台的官方判断。

## 本地运行

需要 Node.js 24 或更新版本，以及 pnpm 10.32.1。

```bash
pnpm install --frozen-lockfile
cp .env.example .env
```

编辑 `.env` 中的站点信息，然后在两个终端分别启动：

```bash
# 终端一：前端
pnpm dev
```

```bash
# 终端二：本地 API
pnpm exec wrangler dev --env local --var LOCAL_DEV:true --assets ./public --ip 127.0.0.1 --port 8787
```

打开 `http://127.0.0.1:8787`。单独运行前端无法提供 `/api/*`，服务状态等功能需要同时启动本地 API。Windows PowerShell 中复制配置可使用 `Copy-Item .env.example .env`；已有配置时直接编辑，避免覆盖。

## 自定义站点

页面品牌、标题、描述、页脚和联系方式统一由 `.env` 配置：

| 配置项                                                     | 用途                     |
| ---------------------------------------------------------- | ------------------------ |
| `VITE_SITE_BRAND`                                          | 顶部品牌名               |
| `VITE_SITE_TITLE` / `VITE_SITE_DESCRIPTION`                | 站点标题与描述           |
| `VITE_HOME_TITLE` / `VITE_HOME_HEADING`                    | 首页浏览器标题与页面标题 |
| `VITE_SITE_COPYRIGHT`                                      | 页脚署名                 |
| `VITE_SITE_REPOSITORY_URL`                                 | GitHub 链接              |
| `VITE_SITE_DOCUMENTATION_URL` / `VITE_SITE_COMMERCIAL_URL` | 可选外链                 |
| `VITE_SITE_CONTACT_LABEL` / `VITE_SITE_CONTACT_EMAIL`      | 联系入口名称与邮箱       |
| `VITE_SITE_WECHAT_QR` / `VITE_SITE_WECHAT_HINT`            | 可选微信二维码与提示     |

可选链接或联系方式留空时隐藏相应入口。`VITE_*` 值会写入前端产物，属于公开信息；修改后需重启开发服务或重新构建。`.env` 不提交到 Git，示例配置保留在 `.env.example`。

## 部署到 Cloudflare

推荐使用 Cloudflare Workers + Static Assets，同时托管静态页面和 API，无需单独维护服务器。

1. 将代码推送到自己的 GitHub 仓库，在 Cloudflare **Workers & Pages** 中导入。
2. 构建环境使用 Node.js 24、pnpm 10.32.1；构建命令填写 `pnpm build`，部署命令填写 `pnpm deploy`。
3. 在构建环境变量中设置自己的 `VITE_*` 站点信息。Worker 运行时 Secrets 不会改变已构建的前端标题。
4. 部署后先验证分配的访问地址，再在自定义域中绑定 `lookpanel.com`。

基础查询无需应用 API Key；发起全球 Ping 测量需要配置 Turnstile。天地图为可选配置。Cloudflare Pages、Node.js 自托管和其他配置参见 [部署与配置](docs/deploy.md)。

## 开发检查

```bash
pnpm build
pnpm test
pnpm lint
```

技术栈：React、TypeScript、Vite、Tailwind CSS、Cloudflare Workers。支持原生 WebMCP 的浏览器可使用页面提供的结构化诊断工具。

## 维护与反馈

LookPanel 由 [Rockyzsu](https://github.com/Rockyzsu) 维护，反馈与合作联系 [yagamil@hotmail.com](mailto:yagamil@hotmail.com)。分享问题截图时，请遮盖 IP、精确位置和浏览器指纹等个人信息。

## 来源与许可证

本项目基于 [One IP](https://github.com/zhihui-hu/one-ip) 进行站点品牌、页面样式和配置调整，保留上游来源及许可证说明。

数据来自 Net.Coffee、ip-api、Globalping、IANA / RDAP 与各平台官方状态源。浏览器检测使用 FingerprintJS 和 CreepJS，详见 [浏览器检测依赖说明](vendor/browser-diagnostics/README.md)；Claude 环境检测字典参考 [FuckClaude](https://github.com/LinXiaoTao/FuckClaude)，相关文件位于 `vendor/claude-environment/`。

项目采用 [AGPL-3.0](LICENSE) 许可证；第三方资源遵循各自的许可证。
