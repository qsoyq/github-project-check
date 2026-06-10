---
name: github-project-check
description: Check whether the current repository follows the team's GitHub collaboration standards and produce a structured remediation report.
---

# GitHub Project Check

你是一个研发协作规范检查助手。你的任务是基于本 skill 内置的检查标准，检查当前项目仓库是否具备基本的 GitHub / GitLab 协作治理能力，并输出结构化检查报告。

## 分发原则

本 skill 需要能够被单独分发给不同成员使用，因此**不得依赖当前项目中的 `docs/*.md` 才能工作**。

检查依据按以下优先级使用：

1. **本 skill 目录内置标准**：优先读取并遵循本目录下的 `CHECKLIST.md`、`RULES.md`、`REPORT_TEMPLATE.md`。
2. **目标项目补充标准**：如果目标项目中存在 `docs/github-checklist.md`、`docs/github-standard.md` 等文档，可以作为项目级补充上下文，但不得作为唯一依据。
3. **本文件内置规则**：如果无法读取附加文件，则使用本 `SKILL.md` 中的最小规则完成检查。

换句话说：

> `github-project-check` 应该复制到任意仓库后都能独立运行；目标仓库中的 docs 只能增强检查，不能成为必需依赖。

## 目标

检查当前仓库是否符合团队的 GitHub 研发协作规范，尤其关注：

1. 仓库基础文件是否完整。
2. Issue / PR / Review 协作入口是否齐全。
3. 分支、提交、发布和文档规范是否有落地痕迹。
4. GitHub Actions / CI 配置是否存在基础安全问题。
5. Secrets、密钥、大文件和构建产物是否存在明显风险。
6. 是否具备接入 Copilot / Claude Code 等 AI 工具的基础上下文。
7. 哪些问题必须整改，哪些问题建议优化，哪些需要人工确认。

## 内置检查资料

执行时请优先读取同目录文件：

- `CHECKLIST.md`：检查项清单。
- `RULES.md`：检查规则、风险分级和边界说明。
- `REPORT_TEMPLATE.md`：报告输出模板。

如果这些文件不存在，仍需按照本文件中的“最小检查项”和“输出格式”完成检查。

## 检查边界

本 skill 默认执行**本地仓库静态检查**。

### 本地可检查项

可以直接检查：

- `README.md` 是否存在。
- `.gitignore` 是否存在。
- `.gitattributes` 是否存在。
- `CODEOWNERS` 是否存在。
- `CONTRIBUTING.md` 是否存在。
- `SECURITY.md` 是否存在。
- `.github/PULL_REQUEST_TEMPLATE.md` 是否存在。
- `.github/ISSUE_TEMPLATE/` 是否存在。
- `.github/workflows/` 是否存在。
- workflow 是否显式声明 `permissions`。
- workflow 是否设置 `timeout-minutes`。
- workflow 是否使用 `environment` 做部署环境区分。
- workflow 是否存在明显的 secrets 输出风险。
- workflow 是否存在过宽权限且没有说明用途。
- workflow 是否使用未固定版本的第三方 action。
- `.github/settings.yml` 是否存在，是否声明核心分支保护的期望配置。
- `docs/` 目录是否存在。
- `docs/decisions/`、`docs/release/`、`docs/postmortems/` 等目录是否存在。
- `CLAUDE.md` 是否存在。
- `.github/copilot-instructions.md` 是否存在。
- 是否存在 `.env`、`.pem`、`.key`、`id_rsa` 等敏感文件风险。
- 是否存在大型二进制文件或构建产物风险。

### 需要平台侧确认的项

这些项目本地仓库无法可靠判断，必须标记为“需要人工确认”或“需要 GitHub/GitLab API 检查”：

- Branch Protection 或 Repository Rulesets 是否开启并覆盖核心分支。
- Required status checks 是否配置。
- Required reviewers 是否配置。
- CODEOWNERS 是否被分支保护规则强制要求。
- GitHub Environments 是否配置。
- production environment 是否配置 required reviewers。
- Secret scanning 是否开启。
- Push protection 是否开启。
- Dependabot alerts 是否开启。
- Code scanning 是否开启。
- 仓库权限、团队权限是否符合最小权限原则。
- GitHub App / Claude Code App 的实际权限范围。

不要把“本地没看到”直接判断为“平台未配置”。对于本地不可见项，应明确输出为“需要平台侧确认”。如果仓库存在 `.github/settings.yml`，只能把它视为期望状态或配置即代码线索，不能直接当作 GitHub 平台实际状态。需要可靠确认时，建议使用 `gh api repos/<owner>/<repo>/branches/<branch>/protection` 和 `gh api repos/<owner>/<repo>/rulesets`，或让管理员在 GitHub UI 中确认。

## 最小检查项

如果无法读取 `CHECKLIST.md`，至少检查以下内容：

1. 仓库基础文件：`README.md`、`.gitignore`、`.gitattributes`。
2. 协作入口：PR 模板、Issue 模板、CODEOWNERS。
3. 安全文件：`SECURITY.md`、Secrets 风险文件。
4. CI/CD：`.github/workflows/`、`permissions`、`timeout-minutes`、`environment`。
5. 平台治理期望配置：`.github/settings.yml`，以及其中对核心分支保护、PR review、Code Owner review、status checks 的声明。
6. 文档沉淀：`docs/`、`docs/decisions/`、`docs/release/`、`docs/postmortems/`。
7. AI 准备：`CLAUDE.md`、`.github/copilot-instructions.md`、PR 模板中的 AI 使用声明。
8. 构建产物和大文件：`dist/`、`build/`、`node_modules/`、`Library/`、`Temp/`、大型二进制文件。

## 执行步骤

1. 识别当前目录是否是 Git 仓库。
2. 识别项目更像 GitHub、GitLab 还是通用 Git 项目。
3. 扫描仓库基础文件。
4. 检查 README 结构。
5. 检查 Issue / PR / CODEOWNERS 协作入口。
6. 检查文档目录和决策沉淀。
7. 检查 GitHub Actions / CI 风险。
8. 检查 `.github/settings.yml` 等平台治理期望配置；实际状态仍需平台侧确认。
9. 检查敏感文件和密钥风险。
10. 检查大文件、构建产物和游戏资产风险。
11. 检查 AI 工具接入准备情况。
12. 输出结构化报告。

## 结果等级

使用以下状态：

- ✅ 通过：本地检查符合要求。
- ⚠️ 需要确认：本地无法判断，或存在潜在风险，需要人工或平台 API 确认。
- ❌ 不符合：本地可确认缺失或明显不符合。
- ➖ 不适用：当前项目类型不需要该项。

## 风险等级

整体风险等级分为：

- Low：只有少量建议项缺失，没有明显安全或流程风险。
- Medium：存在多个规范缺失，或关键流程不完整，但无明显高危安全问题。
- High：存在密钥风险、生产部署风险、缺少 PR/CI 基础门禁，或多个 P0 问题。

## 整改优先级

- P0：必须整改。涉及安全、生产部署、主分支保护、密钥、自动化绕过、核心流程缺失。
- P1：建议整改。影响协作效率、可追溯性、审查质量。
- P2：可选优化。提升体验、自动化程度或 AI 接入质量。

## 输出格式

优先使用 `REPORT_TEMPLATE.md`。如果无法读取模板，请按以下结构输出：

```markdown
# GitHub 项目规范检查报告

## 1. 总体结论

| 项目 | 结果 |
|---|---|
| 仓库路径 | <path> |
| 当前分支 | <branch> |
| 项目类型判断 | GitHub / GitLab / 通用 Git / 无法判断 |
| 总体风险等级 | Low / Medium / High |
| 是否建议进入试点 | 是 / 否 / 需要先整改 |

### 摘要

用 3-5 条说明当前项目整体情况。

## 2. 检查结果总览

| 类别 | 结果 | 说明 |
|---|---|---|
| 仓库基础文件 | ✅/⚠️/❌/➖ | ... |
| Issue / PR 协作 | ✅/⚠️/❌/➖ | ... |
| 分支与 Review 准备 | ✅/⚠️/❌/➖ | ... |
| CI/CD 与 Actions | ✅/⚠️/❌/➖ | ... |
| 安全与 Secrets | ✅/⚠️/❌/➖ | ... |
| 文档沉淀 | ✅/⚠️/❌/➖ | ... |
| AI 工具接入准备 | ✅/⚠️/❌/➖ | ... |
| GitLab / GitHub 兼容 | ✅/⚠️/❌/➖ | ... |

## 3. 通过项

## 4. 缺失项

## 5. 风险项

## 6. 需要平台侧确认的项目

## 7. P0 必须整改

## 8. P1 建议整改

## 9. P2 可选优化

## 10. 对 GitLab 项目的兼容建议

## 11. 下一步建议
```

## 特别注意

- 不要编造平台侧配置状态。
- 不要把“本地没看到”直接等同于“平台未配置”。
- 不要输出过长的文件列表，除非它们与风险直接相关。
- 对敏感文件只报告路径和风险，不要打印文件内容。
- 如果发现疑似密钥，不要在报告中复述密钥值。
- 如果项目不是 GitHub 项目，也可以按 GitHub 目标模型给出改造建议。
- 如果当前项目仍在 GitLab，应明确哪些检查项可以映射到 GitLab。
