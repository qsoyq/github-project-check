# github-checklist

用于输出 GitHub 研发协作各阶段 Checklist 的 Claude Code skill。

## 分发方式

该 skill 是自包含的，复制整个目录即可分发：

```text
.claude/skills/github-checklist/
  SKILL.md
  CHECKLISTS.md
  README.md
```

不依赖目标项目中的 `docs/*.md` 才能运行。

## 使用方式

在目标项目仓库中启动 Claude Code 后执行：

```text
/github-checklist
/github-checklist pr
/github-checklist release-pre
/github-checklist hotfix
/github-checklist ai
/github-checklist actions
```

如果不带参数，会输出场景菜单。

## 常用参数

| 参数 | 场景 |
|---|---|
| `new-project` | 新项目接入 |
| `repo` | 仓库初始化 |
| `issue` | Issue 创建 |
| `dev-start` | 开发前 |
| `pre-commit` | 提交前 |
| `pr` | PR 创建 |
| `automation` | 自动化检查 |
| `review` | Code Review |
| `qa` | QA / 验收 |
| `merge` | 合并前 |
| `release-pre` | 发布前 |
| `release-post` | 发布后 |
| `release` | 发布前 + 发布后 |
| `hotfix` | Hotfix |
| `ai` | AI 工具使用 |
| `claude` | Claude Code GitHub Actions 接入 |
| `actions` | GitHub Actions 接入 |
| `security` | 安全治理 |
| `daily-report` | 自动日报 / 周报 |
| `api` | GitHub REST API 自动化 |
| `gitlab` | GitLab 兼容 / 迁移 |
| `pilot` | 试点验收 |

## 轻量检查边界

轻量检查可以查看 `.github/settings.yml` 是否存在，以及是否声明核心分支保护、PR review、Code Owner review、status checks 等期望配置。但它不能证明 GitHub 平台已经应用这些配置。

实际平台状态需要通过 GitHub UI 或 API 确认，例如：

```bash
gh auth status
gh api repos/<owner>/<repo>/branches/<branch>/protection
gh api repos/<owner>/<repo>/rulesets
# Vulnerability alerts / Dependabot alerts: 204 表示已启用，404 可能表示未启用或权限不足。
gh api repos/<owner>/<repo>/vulnerability-alerts --include
# Dependabot security updates / automated security fixes: 200 或 204 表示已启用。
gh api repos/<owner>/<repo>/automated-security-fixes --include
```

依赖安全治理建议：

- Vulnerability alerts / Dependabot alerts 用于发现依赖漏洞并提醒维护者。
- Dependabot security updates / automated security fixes 用于在有可修复漏洞时自动创建安全升级 PR。
- 如需定期检查依赖或 GitHub Actions 版本，配置 `.github/dependabot.yml`。
- Dependabot PR 仍必须经过 CI、Review 和 Branch Protection，不应自动绕过人工审查。

## Commit message 规范

提交前应使用 Conventional Commit 格式：

```text
<type>: <short summary>
```

常用 type：`feat`、`fix`、`docs`、`ci`、`chore`、`refactor`、`test`。

建议 commit message 中使用 `Refs #<issue-id>` 关联 Issue，由 PR 描述使用 `Closes #<issue-id>` 在合并时关闭 Issue。

示例：

```text
chore: add github governance and security baseline

Refs #1
```

## 和 github-project-check 的区别

- `github-checklist`：输出阶段性 Checklist，偏执行手册。
- `github-project-check`：扫描当前仓库并输出规范检查报告，偏项目审计。

## 注意

如果需要完整扫描当前仓库，请使用：

```text
/github-project-check
```
