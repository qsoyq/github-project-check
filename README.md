# github-project-check

`github-project-check` 是一套面向研发团队的 GitHub 协作治理规范与 Claude Code skills，用于检查项目仓库是否具备基本的 GitHub / GitLab 协作治理能力，并输出结构化整改报告。

本仓库既包含给团队阅读的规范文档，也包含可以复制到其他项目中使用的 Claude Code skill。

## 项目简介

本项目解决的问题：

- 统一团队对 GitHub / GitLab 协作治理的基本检查标准。
- 帮助项目快速发现 README、Issue、PR、CODEOWNERS、CI、安全和 AI 上下文缺口。
- 将检查逻辑封装成 Claude Code skill，方便在任意目标仓库中执行。
- 区分本地静态检查和 GitHub 平台侧配置确认，避免误判 Branch Protection、Secret scanning 等不可见状态。

当前内置两个 skill：

| Skill | 作用 |
|---|---|
| `github-project-check` | 扫描当前仓库并输出规范检查报告。 |
| `github-checklist` | 按场景输出研发协作 Checklist。 |

## 技术栈

本仓库以文档和 Claude Code skill 为主：

- Markdown：规范文档、README、模板和 skill 说明。
- YAML：GitHub Issue 模板配置、Settings app / Probot settings 期望配置、GitHub Actions workflow。
- Claude Code skills：`.claude/skills/*/SKILL.md` 及随 skill 分发的检查资料。
- GitHub Actions：基础仓库治理检查。

当前没有应用运行时代码、包管理器依赖或构建产物。

## 仓库结构

```text
.github/
  ISSUE_TEMPLATE/              # Issue 模板
  PULL_REQUEST_TEMPLATE.md     # PR 模板
  settings.yml                 # GitHub 平台治理期望配置
  workflows/                   # GitHub Actions
.claude/skills/
  github-project-check/        # 项目规范检查 skill
  github-checklist/            # 阶段 Checklist skill
docs/                          # GitHub 研发协作规范文档
CODEOWNERS                     # 代码所有者
CONTRIBUTING.md                # 贡献指南
SECURITY.md                    # 安全政策
```

## 使用方式

### 使用 github-project-check

在目标项目仓库中启动 Claude Code 后执行：

```text
/github-project-check
```

该 skill 会基于 `.claude/skills/github-project-check/` 内置的 `CHECKLIST.md`、`RULES.md` 和 `REPORT_TEMPLATE.md` 检查当前仓库，并输出结构化报告。

### 使用 github-checklist

在目标项目仓库中启动 Claude Code 后执行：

```text
/github-checklist
/github-checklist pr
/github-checklist release-pre
/github-checklist hotfix
/github-checklist ai
/github-checklist actions
```

如果不带参数，会输出可用场景菜单。

### 分发 skill

两个 skill 都应保持自包含，可以整体复制到其他仓库：

```text
.claude/skills/github-project-check/
.claude/skills/github-checklist/
```

目标项目中的 `docs/*.md` 只能作为补充上下文，不能成为 skill 运行的必需依赖。

## 本地启动

本项目没有需要启动的服务。

本地查看和维护文档即可：

```bash
git status --short
```

如需在目标仓库中验证 skill，请将对应 `.claude/skills/<skill-name>/` 目录复制到目标仓库或用户级 skills 目录，然后在 Claude Code 中执行对应 slash command。

## 测试方式

当前基础验证分为两类：

1. **仓库治理检查**：由 `.github/workflows/ci.yml` 执行，检查关键治理文件、skill 自包含文件、模板、README 章节、settings 期望配置、敏感文件名和大文件风险。
2. **人工抽样验证**：在 Claude Code 中执行 `/github-project-check` 或 `/github-checklist`，确认输出符合预期。

提交 PR 前建议确认：

```bash
git status --short
```

提交信息应使用 Conventional Commit 格式：

```text
<type>: <short summary>
```

常用 type 包括 `feat`、`fix`、`docs`、`ci`、`chore`、`refactor`、`test`。建议 commit message 中使用 `Refs #<issue-id>` 关联 Issue，由 PR 描述使用 `Closes #<issue-id>` 在合并时关闭 Issue。

并检查：

- 没有提交密钥、私钥、token、未脱敏日志。
- 没有提交 `dist/`、`build/`、`node_modules/` 等构建产物。
- skill 目录仍然自包含。
- 文档中的相对链接仍然有效。

## 构建方式

当前项目无编译构建步骤。

如果后续引入脚本、站点生成器或测试框架，应在本节补充：

- 安装依赖命令。
- 本地构建命令。
- CI 中对应的验证步骤。

## 分支策略

当前推荐使用轻量 GitHub Flow：

```text
main
  ↑
feature/<issue-id>-<short-desc>
bugfix/<issue-id>-<short-desc>
docs/<issue-id>-<short-desc>
chore/<issue-id>-<short-desc>
```

规则：

- `main` 保存稳定版本。
- 正式变更通过 PR 合入 `main`。
- PR 应关联 Issue 或说明无需 Issue 的原因。
- 涉及 `.github/`、`.claude/skills/`、`docs/` 的变更需要 owner 审查。
- 自动化检查失败时不应合并。

## 发布流程

当前发布以文档和 skill 目录分发为主：

1. 创建 Issue 或在 PR 中说明发布目的。
2. 更新相关文档和 skill 文件。
3. 运行本地检查并等待 GitHub Actions 通过。
4. 由 owner Review。
5. 合并到 `main`。
6. 如需要对外分发，复制对应 skill 目录或创建 GitHub Release / tag。
7. 在 `docs/release/` 中记录重要发布说明。

回滚方式：

- 对文档或 skill 变更，优先通过 revert PR 回滚。
- 对已分发的 skill，通知使用者恢复到上一个已验证版本。

## 安全要求

禁止提交：

- API Key、Access Token、SSH 私钥。
- 数据库密码、云服务密钥、服务账号凭证。
- `.env`、未脱敏日志、生产配置。
- 大型构建产物或不必要的二进制资产。

安全问题处理见 [SECURITY.md](./SECURITY.md)。

GitHub 平台侧状态需要管理员确认，包括：

- Branch Protection 或 Repository Rulesets。
- `enforce_admins` 是否符合当前协作模式：个人仓库 bootstrap 可用 `false` 允许 admin bypass；团队仓库应使用 `true`。
- Required status checks。
- CODEOWNERS review 是否被强制要求。
- Secret scanning / Push protection。
- Dependabot alerts / Vulnerability alerts。
- Dependabot security updates / automated security fixes。
- Code scanning。

`.github/settings.yml` 只表示期望状态，不能证明平台已应用。

当前仓库还维护 `.github/dependabot.yml`，用于定期检查 GitHub Actions 版本更新。Dependabot 创建的 PR 仍需通过 CI、Review 和 Branch Protection 后才能合并。

## AI 工具使用

本仓库允许使用 Claude Code、Copilot 等 AI 工具辅助文档和规则维护，但必须遵守：

- AI 输出必须由提交者人工确认。
- 不让 AI 处理未授权敏感信息。
- 不让 AI 绕过 CI、Review 或分支保护。
- PR 中必须说明是否使用 AI、AI 参与范围和人工确认内容。

## 相关文档

- [GitHub 研发协作规范总纲](./docs/github.md)
- [GitHub 研发协作规范](./docs/github-standard.md)
- [GitHub 研发工作流介绍](./docs/github-workflow.md)
- [GitHub 自动化工具介绍](./docs/github-automation.md)
- [GitHub 研发协作 Checklist](./docs/github-checklist.md)
- [贡献指南](./CONTRIBUTING.md)
- [安全政策](./SECURITY.md)

## 负责人

当前默认 owner 见 [CODEOWNERS](./CODEOWNERS)。

如果仓库迁移到组织下，请将 `CODEOWNERS` 中的个人账号替换为负责维护该规范和 skills 的团队。