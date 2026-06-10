# 贡献指南

感谢参与 `github-project-check` 仓库维护。本仓库用于沉淀 GitHub 研发协作规范文档和可分发的 Claude Code skills，所有变更都应保持可追踪、可审查、可验证。

## 1. 贡献范围

常见贡献包括：

- 更新 GitHub 研发协作规范文档。
- 完善 `github-project-check` 或 `github-checklist` skill。
- 补充 Issue / PR 模板、CODEOWNERS、CI 等治理配置。
- 修正文档错误、示例不一致或检查规则遗漏。

如变更会影响 skill 的分发方式、检查边界或报告结论，请在 Issue 或 PR 中明确说明原因和影响范围。

## 2. Issue 流程

开始较大改动前，建议先创建或关联 Issue：

- Bug：使用 `.github/ISSUE_TEMPLATE/bug.md`。
- Feature：使用 `.github/ISSUE_TEMPLATE/feature.md`。
- Task：使用 `.github/ISSUE_TEMPLATE/task.md`。

Issue 应说明背景、目标、范围、验收标准、风险和验证方式。

## 3. 分支命名

推荐从 `main` 拉出短生命周期分支：

```text
feature/<issue-id>-<short-desc>
bugfix/<issue-id>-<short-desc>
docs/<issue-id>-<short-desc>
chore/<issue-id>-<short-desc>
```

示例：

```text
docs/12-update-project-check-rules
chore/18-add-ci-governance-check
```

## 4. Commit 规范

建议使用 Conventional Commits：

```text
docs: update github project check rules
ci: add repository governance check
fix: correct checklist output mapping
chore: update repository templates
```

如有对应 Issue，请在提交信息或 PR 中关联：

```text
Refs #123
Closes #123
```

## 5. Pull Request 要求

所有正式变更应通过 PR 进入 `main`。PR 需要填写：

- 变更摘要。
- 关联 Issue。
- 影响范围。
- 验证方式。
- 风险与回滚方案。
- 是否使用 AI 辅助。
- Reviewer 关注点。

涉及 `.github/`、`.claude/skills/`、`docs/` 的变更会命中 `CODEOWNERS`，需要 owner 审查。

## 6. 本地验证

提交 PR 前至少检查：

```bash
git status --short
```

并确认：

- 没有提交 `.env`、私钥、token、未脱敏日志。
- 没有提交 `dist/`、`build/`、`node_modules/` 等构建产物。
- Markdown 链接和相对路径符合当前仓库结构。
- skill 目录保持自包含，不能依赖目标项目的 `docs/*.md` 才能运行。

如修改 `.github/workflows/ci.yml` 中的检查逻辑，请在本地运行同等检查脚本或等待 GitHub Actions 通过。

## 7. Skill 修改规则

`github-project-check` 和 `github-checklist` 都需要能被单独复制到其他仓库使用。

修改 skill 时必须保持：

- `SKILL.md` 能独立说明任务、边界和输出要求。
- `github-project-check` 的 `CHECKLIST.md`、`RULES.md`、`REPORT_TEMPLATE.md` 随 skill 一起分发。
- `github-checklist` 的 `CHECKLISTS.md` 随 skill 一起分发。
- 目标项目中的 `docs/*.md` 只能作为补充上下文，不能成为必需依赖。

## 8. AI 使用要求

可以使用 Claude Code、Copilot 或其他 AI 工具辅助文档和规则维护，但必须遵守：

- AI 输出必须由提交者人工审查。
- 不让 AI 处理未授权敏感信息。
- 不让 AI 绕过 CI、Review 或分支保护。
- 在 PR 模板中说明是否使用 AI、使用范围和人工确认内容。

## 9. 安全注意事项

禁止提交：

- API Key、Access Token、SSH 私钥。
- 数据库密码、云服务密钥、服务账号凭证。
- 未脱敏日志、生产配置、内部敏感资料。
- 大型构建产物或不必要的二进制资产。

发现疑似泄漏时，不要在公开 Issue 或 PR 中复述密钥内容，请按 `SECURITY.md` 处理。
