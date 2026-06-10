# GitHub Project Check Rules

本文件定义 `github-project-check` 的风险分级、整改优先级和判断边界。该文件应随 skill 一起分发。

---

## 1. 状态标记

- ✅ 通过：本地检查符合要求。
- ⚠️ 需要确认：本地无法判断，或存在潜在风险，需要人工或平台 API 确认。
- ❌ 不符合：本地可确认缺失或明显不符合。
- ➖ 不适用：当前项目类型不需要该项。

---

## 2. 整体风险等级

### Low

满足以下情况可评为 Low：

- 基础文件基本齐全。
- 无明显密钥或敏感文件风险。
- PR / Issue / CI 至少具备基础入口。
- 缺失项主要是文档完善或 AI 接入优化。

### Medium

满足以下情况之一可评为 Medium：

- 多个协作基础文件缺失。
- PR 或 Issue 模板不完整。
- CI 存在但缺少 `permissions` 或 `timeout-minutes`。
- 缺少 CODEOWNERS 或 SECURITY.md。
- 文档沉淀不足。
- AI 接入上下文不完整。

### High

满足以下情况之一应评为 High：

- 存在疑似真实密钥、私钥或生产配置。
- 生产部署 workflow 存在但没有明显人工审批或 environment gate。
- 没有 PR / MR 协作入口。
- 没有任何 CI / 自动化检查，且项目已进入正式交付阶段。
- workflow 明显打印 secrets。
- self-hosted runner 运行不可信 PR 且可能接触 secrets。
- 多个 P0 问题同时存在。

---

## 3. 整改优先级

### P0：必须整改

涉及安全、生产、主线质量门禁或明显高风险：

- 疑似密钥或私钥进入仓库。
- workflow 打印 secrets。
- 生产部署没有审批或 environment gate。
- PR from fork 可访问生产 secrets。
- 核心分支缺少任何可见保护说明，且平台侧也未确认。
- 仓库存在 `.github/settings.yml` 等期望配置，但长期未同步或平台侧实际配置与期望不一致。
- 正式项目没有 PR / MR 流程。
- 正式项目没有任何质量检查。

### P1：建议整改

影响协作效率、可追溯性、审查质量：

- 缺少 PR 模板。
- 缺少 Issue 模板。
- 缺少 CODEOWNERS。
- 缺少 SECURITY.md。
- workflow 未声明 `permissions`。
- workflow 未设置 `timeout-minutes`。
- README 缺少关键章节。
- 缺少发布流程说明。
- 缺少回滚方案说明。

### P2：可选优化

提升体验、自动化程度或 AI 接入质量：

- 添加 `CLAUDE.md`。
- 添加 `.github/copilot-instructions.md`。
- 添加 ADR 目录。
- 添加自动日报或周报能力。
- 添加更细粒度的文档目录。
- 添加 AI 使用声明。
- 添加 GitHub Actions concurrency。

---

## 4. 判断边界

### 不要编造平台配置

本地仓库看不到的平台配置，不能直接判断为未配置。应输出：

> 需要平台侧确认。

例如：

- Branch Protection。
- Repository Rulesets。
- Required status checks。
- Required reviewers。
- CODEOWNERS 是否被强制要求。
- Secret scanning。
- Push protection。
- Dependabot alerts。
- Code scanning。
- Environment required reviewers。
- 团队权限。

### 配置即代码的边界

如果仓库存在 `.github/settings.yml`、Terraform / OpenTofu 或其他 GitHub 配置即代码文件，只能说明仓库声明了期望状态。检查报告可以把它作为“本地有保护期望配置”的通过项或线索，但仍不能据此判断 GitHub 平台已实际启用对应规则。

需要确认实际状态时，优先使用 GitHub UI 或以下 `gh` CLI / GitHub API：

```bash
gh auth status
gh api repos/<owner>/<repo>/branches/<branch>/protection
gh api repos/<owner>/<repo>/rulesets
# Vulnerability alerts / Dependabot alerts: 204 表示已启用，404 可能表示未启用或权限不足。
gh api repos/<owner>/<repo>/vulnerability-alerts --include
# Dependabot security updates / automated security fixes: 204 表示已启用。
gh api repos/<owner>/<repo>/automated-security-fixes --include
```

如需启用依赖漏洞告警和自动安全修复 PR，可由拥有 Admin 权限的账号执行：

```bash
gh api --method PUT repos/<owner>/<repo>/vulnerability-alerts
gh api --method PUT repos/<owner>/<repo>/automated-security-fixes
```

说明：Vulnerability alerts / Dependabot alerts 负责发现依赖漏洞并提醒；Dependabot security updates / automated security fixes 负责在有可修复漏洞时自动创建安全升级 PR，不会自动绕过 CI、Review 或分支保护。

如果 API 返回 404、空列表或权限不足，不要直接判断未配置，应标记为“需要管理员或更高权限确认”。

### 不要打印敏感内容

如果发现疑似密钥，只报告：

- 文件路径。
- 风险类型。
- 建议处理方式。

不要复述密钥值或文件内容。

### GitLab 项目兼容

如果目标项目是 GitLab 项目，应给出映射建议：

| GitHub | GitLab |
|---|---|
| Pull Request | Merge Request |
| GitHub Actions | GitLab CI |
| Branch Protection | Protected Branches |
| GitHub Secrets | CI/CD Variables |
| CODEOWNERS | CODEOWNERS |
| Issues / Projects | Issues / Boards |

### AI 接入判断

不要因为缺少 `CLAUDE.md` 就判定项目不合格。应视为 AI 接入准备不足，通常为 P2 或 P1，除非项目明确要求接入 Claude Code。

### README 判断

README 不需要与模板完全一致。只要能说明项目用途、启动、测试、构建和负责人，即可视为基本可用。
