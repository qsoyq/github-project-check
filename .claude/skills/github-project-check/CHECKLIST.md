# GitHub Project Check Checklist

本文件是 `github-project-check` skill 的内置检查清单。该文件应随 skill 一起分发，不依赖目标项目的 `docs/*.md`。

---

## 1. 仓库基础文件

- [ ] `README.md` 存在。
- [ ] `.gitignore` 存在。
- [ ] `.gitattributes` 存在。
- [ ] `CODEOWNERS` 存在，或 `.github/CODEOWNERS` 存在。
- [ ] `CONTRIBUTING.md` 存在。
- [ ] `SECURITY.md` 存在。
- [ ] `docs/` 目录存在。

## 2. README 内容

README 建议包含：

- [ ] 项目简介。
- [ ] 技术栈。
- [ ] 本地启动方式。
- [ ] 测试方式。
- [ ] 构建方式。
- [ ] 发布流程。
- [ ] 分支策略。
- [ ] 相关文档链接。
- [ ] 负责人或维护团队。

## 3. Issue / PR 协作入口

- [ ] `.github/ISSUE_TEMPLATE/` 存在。
- [ ] `.github/PULL_REQUEST_TEMPLATE.md` 存在。
- [ ] PR 模板包含变更摘要。
- [ ] PR 模板包含关联 Issue。
- [ ] PR 模板包含影响范围。
- [ ] PR 模板包含验证方式。
- [ ] PR 模板包含风险与回滚方案。
- [ ] PR 模板包含是否使用 AI 辅助。
- [ ] PR 模板包含 Reviewer 关注点。

## 4. 文档沉淀

- [ ] `docs/design/` 存在，或有等价设计文档目录。
- [ ] `docs/tech/` 存在，或有等价技术文档目录。
- [ ] `docs/release/` 存在，或有等价发布文档目录。
- [ ] `docs/decisions/` 存在，或有 ADR / 决策记录机制。
- [ ] `docs/postmortems/` 存在，或有故障复盘目录。

## 5. GitHub Actions / CI

如存在 `.github/workflows/`，检查：

- [ ] workflow 文件存在。
- [ ] workflow 显式声明 `permissions`。
- [ ] job 设置 `timeout-minutes`。
- [ ] 部署 job 使用 `environment`。
- [ ] 生产部署 job 使用 `environment: production` 或等价机制。
- [ ] workflow 不直接打印 secrets。
- [ ] 第三方 action 固定到明确版本或 commit SHA。
- [ ] 如有重复部署风险，配置 `concurrency`。
- [ ] 如使用 self-hosted runner，说明安全边界。

## 6. 安全与敏感信息

检查是否存在风险文件：

- [ ] `.env`。
- [ ] `.env.local`。
- [ ] `.env.production`。
- [ ] `*.pem`。
- [ ] `*.key`。
- [ ] `id_rsa`。
- [ ] `credentials.json`。
- [ ] `service-account.json`。
- [ ] `*.p12`。
- [ ] `*.jks`。
- [ ] 未脱敏日志。

说明：`.env.example` 不应直接判为风险，但需要确认其中没有真实密钥。

## 7. 大文件与构建产物

检查是否存在常见不应入仓内容：

- [ ] `dist/`。
- [ ] `build/`。
- [ ] `target/`。
- [ ] `node_modules/`。
- [ ] `.gradle/`。
- [ ] `Library/`。
- [ ] `Temp/`。
- [ ] `DerivedDataCache/`。
- [ ] 大型二进制文件。

游戏项目额外检查：

- [ ] 是否存在大型资源文件。
- [ ] `.gitattributes` 是否包含 Git LFS 规则。
- [ ] 是否存在资产锁定或外部资产管理说明。

## 8. AI 工具接入准备

- [ ] `CLAUDE.md` 存在。
- [ ] `.github/copilot-instructions.md` 存在。
- [ ] `CLAUDE.md` 包含项目背景。
- [ ] `CLAUDE.md` 包含技术栈。
- [ ] `CLAUDE.md` 包含常用命令。
- [ ] `CLAUDE.md` 包含测试方式。
- [ ] `CLAUDE.md` 包含禁止修改范围。
- [ ] `CLAUDE.md` 包含安全要求。
- [ ] PR 模板包含 AI 使用声明。

## 9. 平台治理配置与确认

本地可检查期望配置：

- [ ] `.github/settings.yml` 存在，如团队使用 Settings app / Probot settings / 等价配置即代码方案。
- [ ] `.github/settings.yml` 声明核心分支保护期望，如 PR review 数量、Code Owner review、状态检查要求等。
- [ ] `CODEOWNERS` 存在，或 `.github/CODEOWNERS` 存在。

以下项目本地无法可靠判断，必须通过 GitHub API、GitLab API 或管理员确认实际平台状态：

- [ ] Branch Protection 或 Repository Rulesets 是否开启并覆盖核心分支。
- [ ] Required status checks 是否配置。
- [ ] Required reviewers 是否配置。
- [ ] CODEOWNERS 是否被分支保护规则强制要求。
- [ ] GitHub Environments 是否配置。
- [ ] production environment 是否配置 required reviewers。
- [ ] Secret scanning 是否开启。
- [ ] Push protection 是否开启。
- [ ] Dependabot alerts / Vulnerability alerts 是否开启。
- [ ] Dependabot security updates / automated security fixes 是否开启。
- [ ] 如需定期检查依赖或 GitHub Actions 版本，`.github/dependabot.yml` 是否存在。
- [ ] Code scanning 是否开启。
- [ ] 仓库权限、团队权限是否符合最小权限原则。
- [ ] GitHub App / Claude Code App 的实际权限范围。

可选 API 检查命令：

```bash
gh auth status
gh api repos/<owner>/<repo>/branches/<branch>/protection
gh api repos/<owner>/<repo>/rulesets
```

说明：`.github/settings.yml` 只能表示期望状态，不能证明配置已成功应用到 GitHub 平台。
