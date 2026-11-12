# LookPanel

Your network, at a glance.

LookPanel brings IP information, connectivity checks, leak detection and service status into a clear network diagnostics dashboard. It supports light and dark themes, English and Chinese, and mobile layouts.

[Website domain](https://lookpanel.com) · [Maintainer on GitHub](https://github.com/Rockyzsu) · [Email](mailto:yagamil@hotmail.com) · [中文](README.md)

## Tools

| Task                         | Features                                                        |
| ---------------------------- | --------------------------------------------------------------- |
| Inspect network exits        | IP, location, ISP, ASN, maps and per-site egress                |
| Check connection quality     | Website reachability, upload/download tests and global Ping     |
| Review privacy exposure      | DNS / WebRTC leaks, browser fingerprints and consistency checks |
| Investigate service issues   | AI connectivity, official status feeds and incidents            |
| Look up registration records | WHOIS / RDAP for domains, IPs and ASNs                          |

Results depend on local connectivity and third-party services. IP classifications, reputation scores and environment checks are diagnostic references, not official platform decisions.

## Run locally

Use Node.js 24 or later and pnpm 10.32.1.

```bash
pnpm install --frozen-lockfile
cp .env.example .env
```

Edit `.env`, then run the frontend and API in separate terminals:

```bash
# Terminal 1
pnpm dev
```

```bash
# Terminal 2
pnpm exec wrangler dev --env local --var LOCAL_DEV:true --assets ./public --ip 127.0.0.1 --port 8787
```

Open `http://127.0.0.1:8787`. API-backed features require both processes. On Windows PowerShell, use `Copy-Item .env.example .env`. Edit an existing configuration rather than overwriting it.

## Site configuration

Set branding, titles, descriptions, footer links and contact details in `.env`; see `.env.example` for all supported `VITE_*` variables. Empty optional links and contact methods are hidden. Unconfigured titles use the existing translations; configured text applies to both languages.

These are public, build-time values. Restart development or rebuild after changes. Keep secrets out of `VITE_*`. The local `.env` is excluded from Git.

## Deploy to Cloudflare

Cloudflare Workers + Static Assets hosts the frontend and API together.

1. Push the project to your GitHub repository and import it into Cloudflare **Workers & Pages**.
2. Use Node.js 24 and pnpm 10.32.1. Set the build command to `pnpm build` and the deploy command to `pnpm deploy`.
3. Add your public `VITE_*` configuration to the build environment. Worker runtime secrets do not update an already-built frontend.
4. Verify the assigned deployment address, then connect `lookpanel.com` as a custom domain.

Core queries need no application API keys. Starting global Ping measurements requires Turnstile configuration; Tianditu maps are optional. See [Deployment and configuration](docs/deploy.en.md) for Pages and self-hosting options.

## Development checks

```bash
pnpm build
pnpm test
pnpm lint
```

Built with React, TypeScript, Vite, Tailwind CSS and Cloudflare Workers. Browsers with native WebMCP support can access structured diagnostic tools provided by the page.

## Maintainer and feedback

Maintained by [Rockyzsu](https://github.com/Rockyzsu). Contact [yagamil@hotmail.com](mailto:yagamil@hotmail.com) for feedback and collaboration. Redact IP addresses, precise locations and fingerprint identifiers before sharing screenshots.

## Attribution and license

LookPanel is based on [One IP](https://github.com/zhihui-hu/one-ip), with changes to branding, presentation and site configuration.

Data sources include Net.Coffee, ip-api, Globalping, IANA / RDAP and official platform status feeds. Browser diagnostics use FingerprintJS and CreepJS; see [dependency notes](vendor/browser-diagnostics/README.md). The Claude environment dictionary references [FuckClaude](https://github.com/LinXiaoTao/FuckClaude); related files are in `vendor/claude-environment/`.

Distributed under [AGPL-3.0](LICENSE). Third-party resources retain their respective licenses.
