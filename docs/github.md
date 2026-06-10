# 基于 GitHub 的研发协作规范与 AI 自动化工作流方案总纲

> 版本：v0.2  
> 状态：草案  
> 定位：本文档是 GitHub 研发协作规范体系的总纲，用于说明背景、目标、文档结构、阅读顺序和落地路线。  
> 适用对象：研发团队、项目负责人、技术负责人、QA、DevOps、AI/Agent 工具使用者。

---

## 1. 背景

当前部门大多数项目托管在私有部署 GitLab 中，代码管理、任务追踪、评审、CI/CD、发布和文档沉淀存在一定程度的分散。

随着 GitHub Actions、GitHub Advanced Security、GitHub Copilot、Claude Code GitHub Actions 等工具的发展，GitHub 已经不只是代码托管平台，而是可以承载：

- 仓库管理。
- 任务追踪。
- PR / Code Review。
- CI/CD 自动化。
- 安全扫描。
- 依赖治理。
- AI 辅助开发。
- Agent 协作。
- 发布审计。
- 文档沉淀。

因此，有必要参考 GitHub 的最佳实践，建立一套统一的研发协作规范。

本规范不是要求立即替换现有 GitLab，而是以 GitHub 最佳实践作为目标模型，先统一研发协作标准，再根据项目情况分阶段迁移、试点或兼容落地。

---

## 2. 目标

本规范体系希望达成以下目标：

1. 统一仓库结构、命名、权限和基础文件规范。
2. 统一 Issue、PR、Code Review、Release 流程。
3. 建立从需求立项到线上发布的闭环工作流。
4. 引入自动化测试、静态分析、安全扫描和依赖治理。
5. 明确 GitHub Copilot、Claude Code、CodeQL、Dependabot 等工具的使用边界。
6. 降低团队沟通成本，提高交付可追溯性。
7. 为未来 GitHub 试点、GitLab 流程改造或 GitHub/GitLab 混合模式做准备。

---

## 3. 适用范围

适用于：

- 新建项目。
- 计划迁移到 GitHub 的项目。
- 需要按 GitHub 模型改造的 GitLab 项目。
- 需要接入 AI 自动化工具的试点项目。
- 需要统一 Issue、PR、CI/CD、发布流程的项目。

暂不强制适用于：

- 强依赖现有私有 GitLab CI 的历史项目。
- 有特殊合规、安全或隔离要求的项目。
- 大型二进制资产占主导、暂不适合 GitHub 托管的项目。
- 仍处于探索阶段、尚未进入正式工程化管理的临时项目。

---

## 4. 核心原则

1. **Issue 是任务事实来源。** 需求、缺陷、技术任务、发布任务都应可追踪。
2. **PR 是代码变更入口。** 任何生产代码变更都应通过 PR / MR。
3. **Actions 是质量验证底座。** 自动化测试、构建、扫描和发布应尽量流程化。
4. **Branch Protection 是合并红线。** 核心分支必须受到保护。
5. **Secrets 是敏感信息唯一入口。** 禁止明文提交凭证、令牌和密钥。
6. **Code Review 是人工质量把关。** AI 审查不能替代人工审批。
7. **AI 工具只做辅助，不替代责任人。** AI 生成的代码、测试、文档必须由人负责。
8. **文档和决策必须沉淀到仓库。** 重要结论不能只留在聊天记录中。
9. **发布必须可追溯、可回滚、可审计。** 每次发布都应有记录和责任人。
10. **当前 GitLab 项目可按本规范逐步兼容和迁移。** 不要求一次性切换平台。

---

## 5. 文档体系

本规范按“从小到大”的三个维度展开：

1. **规范**：定义每个项目、每个仓库、每个任务、每个 PR 应遵守的基础规则。
2. **工作流**：说明从需求立项到线上发布，整个研发链路如何流转。
3. **自动化工具**：说明如何用 GitHub Actions、CodeQL、Dependabot、Copilot、Claude Code 等工具辅助流程。

对应文档如下：

| 文档 | 定位 | 主要内容 |
|---|---|---|
| [总纲](./github.md) | 说明整体背景、目标、原则和文档结构 | 背景、目标、适用范围、阅读顺序、落地路线 |
| [研发协作规范](./github-standard.md) | 定义团队必须遵守的基础规范 | 仓库、Issue、分支、提交、PR、权限、安全、文档 |
| [研发工作流介绍](./github-workflow.md) | 描述从需求到发布的完整流程 | 需求、任务、开发、PR、Review、QA、发布、复盘 |
| [自动化工具介绍](./github-automation.md) | 描述工具如何辅助流程 | Actions、pre-commit、CodeQL、Dependabot、Copilot、Claude Code |
| [研发协作 Checklist](./github-checklist.md) | 集中整理各阶段执行检查项 | 项目接入、Issue、开发、PR、Review、QA、发布、AI、迁移检查清单 |

---

## 6. 当前 GitLab 现状与 GitHub 目标模型

当前项目大多数位于私有 GitLab，因此规范需要兼容现状，而不是一次性迁移。建议使用以下映射关系理解 GitLab 与 GitHub 的能力对应。

| 能力 | 当前 GitLab | GitHub 目标模型 | 迁移/兼容建议 |
|---|---|---|---|
| 仓库管理 | GitLab Repository | GitHub Repository | 新项目优先按 GitHub 规范创建 |
| 任务管理 | GitLab Issues / Boards | GitHub Issues / Projects | 先统一 Issue 模板和状态流 |
| 合并请求 | Merge Request | Pull Request | 规范可通用，术语可同时标注 MR/PR |
| CI/CD | GitLab CI | GitHub Actions | 短期保留 GitLab CI，试点 Actions |
| 权限 | GitLab Groups / Members | GitHub Org / Teams / Roles | 按团队、项目、角色分层 |
| 代码所有者 | CODEOWNERS | CODEOWNERS | 可直接复用 |
| 分支保护 | Protected Branches | Branch Protection Rules | 规则基本可通用 |
| 密钥管理 | GitLab CI Variables | GitHub Secrets / Environments | 统一禁止明文密钥 |
| 安全扫描 | GitLab Security / 自研工具 | CodeQL / Dependabot / Secret scanning | 试点项目先接入 |
| AI 工具 | 外部工具为主 | Copilot / Claude Code GitHub Actions | 从 PR 审查和 Issue 辅助开始 |

建议采用以下策略：

1. **短期**：不强制迁移 GitLab 项目，先统一分支、Issue、MR/PR、Review、CI/CD、发布和安全规范。
2. **中期**：选择 1-2 个低风险项目试点 GitHub Actions、CodeQL、Dependabot、Claude Code GitHub Actions。
3. **长期**：根据试点结果决定是否扩展到更多项目，或形成 GitLab/GitHub 混合模式。

---

## 7. 三个维度概览

### 7.1 维度一：规范

规范回答的是：

> 每个项目应该遵守哪些基础规则？

它覆盖：

- 仓库命名。
- 仓库可见性。
- README。
- `.github` 目录。
- Issue 模板。
- PR 模板。
- CODEOWNERS。
- 分支保护。
- Git LFS。
- Secrets。
- Security。
- 文档规范。
- 权限规范。

详见：[研发协作规范](./github-standard.md)。

### 7.2 维度二：工作流

工作流回答的是：

> 从一个需求出现，到代码上线，中间应该经过哪些步骤？

它覆盖：

- 需求提出。
- 需求评审。
- 任务拆解。
- Issue 创建。
- 负责人分派。
- 分支创建。
- 编码实现。
- 本地自测。
- PR 创建。
- 自动化检查。
- AI 辅助审查。
- 人工 Code Review。
- QA / 验收验证。
- 合并。
- 自动打包。
- 预发布 / 灰度。
- 线上发布。
- 发布后监控。
- 复盘与文档更新。

详见：[研发工作流介绍](./github-workflow.md)。

### 7.3 维度三：自动化工具

自动化工具回答的是：

> 哪些工作可以交给工具做，工具应该如何接入，边界在哪里？

它覆盖：

- pre-commit。
- GitHub Actions。
- CodeQL。
- Dependabot。
- Secret scanning。
- GitHub Copilot。
- Claude Code GitHub Actions。
- GitHub REST API 自动化。
- 自动日报 / 周报。
- 成本控制。
- 权限控制。
- AI 使用红线。

详见：[自动化工具介绍](./github-automation.md)。

---

## 8. 推荐阅读顺序

### 8.1 给 Leader / 负责人

建议阅读：

1. [总纲](./github.md)
2. [研发工作流介绍](./github-workflow.md)
3. [研发协作规范](./github-standard.md) 中的权限、安全、PR 章节
4. [自动化工具介绍](./github-automation.md) 中的落地顺序和 AI 边界章节

重点关注：

- 是否符合部门现状。
- 是否适合从 GitLab 逐步过渡。
- 哪些规范应强制执行。
- 哪些项目适合先试点。

### 8.2 给开发人员

建议阅读：

1. [研发协作规范](./github-standard.md)
2. [研发工作流介绍](./github-workflow.md)
3. [自动化工具介绍](./github-automation.md) 中的 pre-commit、Actions、Copilot 章节

重点关注：

- Issue 怎么写。
- 分支怎么建。
- Commit 怎么写。
- PR 怎么提。
- Review 要注意什么。
- AI 生成代码如何负责。

### 8.3 给 QA / 测试人员

建议阅读：

1. [研发工作流介绍](./github-workflow.md) 中的 QA / 验收验证、发布后监控章节
2. [研发协作规范](./github-standard.md) 中的 Issue、Label、状态流章节
3. [自动化工具介绍](./github-automation.md) 中的 Actions、自动日报、游戏项目检查章节

重点关注：

- 验收标准如何写。
- 验证证据如何回写。
- QA 阶段如何与 PR、Issue、Actions 关联。

### 8.4 给 DevOps / 工具链负责人

建议阅读：

1. [自动化工具介绍](./github-automation.md)
2. [研发协作规范](./github-standard.md) 中的权限、安全、分支保护章节
3. [研发工作流介绍](./github-workflow.md) 中的发布和 Hotfix 章节

重点关注：

- Actions 权限。
- Secrets 管理。
- CI/CD 分层。
- 发布审批。
- 自动化工具 API 规范。

---

## 9. AI Skill 辅助检查

除了给人阅读的规范和 Checklist，也可以将检查逻辑封装为 Claude Code skill，在具体项目仓库目录中让 AI 按标准执行检查。

当前推荐两个最小可行 skill：

```text
.claude/skills/github-project-check/
  SKILL.md
  CHECKLIST.md
  RULES.md
  REPORT_TEMPLATE.md
  README.md

.claude/skills/github-checklist/
  SKILL.md
  CHECKLISTS.md
  README.md
```

这两个 skill 目录都是自包含的，可以整体复制到不同项目或分发给不同成员使用，不要求目标项目必须包含本规范仓库中的 `docs/*.md`。

### 9.1 github-project-check 的定位

`github-project-check` 是项目体检类 skill，用于检查当前仓库是否符合团队 GitHub 研发协作规范，并输出结构化整改报告。

它主要检查：

- 仓库基础文件是否齐全。
- README 是否包含必要信息。
- Issue / PR 模板是否存在。
- CODEOWNERS 是否存在。
- GitHub Actions workflow 是否存在基础安全风险。
- 是否存在明显敏感文件风险。
- 文档目录是否完整。
- 是否具备接入 Copilot / Claude Code 的基础上下文。
- 哪些项目需要 GitHub API 或管理员进一步确认。

### 9.2 github-checklist 的定位

`github-checklist` 是执行清单类 skill，用于在具体阶段输出对应 Checklist，帮助开发、QA、Reviewer、发布负责人快速确认当前步骤要检查什么。

它主要支持：

- 新项目接入 Checklist。
- 仓库初始化 Checklist。
- Issue 创建 Checklist。
- 开发前 / 提交前 Checklist。
- PR 创建 Checklist。
- Code Review Checklist。
- QA / 验收 Checklist。
- 合并前 Checklist。
- 发布前 / 发布后 Checklist。
- Hotfix Checklist。
- AI 工具使用 Checklist。
- Claude Code / GitHub Actions 接入 Checklist。
- 安全治理 Checklist。
- GitLab 兼容 / 迁移 Checklist。

推荐使用方式：

```text
/github-checklist
/github-checklist pr
/github-checklist release-pre
/github-checklist hotfix
/github-checklist ai
/github-checklist actions
```

如果不带参数，会输出场景菜单。

### 9.3 本地检查与平台检查的边界

该 skill 默认只做本地仓库静态检查。

本地可以检查：

- 文件是否存在。
- 模板是否完整。
- workflow 是否声明 `permissions`。
- workflow 是否设置 `timeout-minutes`。
- `.github/settings.yml` 是否存在，以及是否声明核心分支保护、PR review、Code Owner review、status checks 等期望配置。
- 是否存在 `.env`、`.pem`、`.key` 等敏感文件风险。
- 是否存在 `CLAUDE.md` 和 Copilot instructions。

本地无法可靠判断，必须通过 GitHub API、GitLab API 或管理员确认：

- Branch Protection 或 Repository Rulesets 是否开启并覆盖核心分支。
- Required status checks 是否配置。
- Required reviewers 是否配置。
- CODEOWNERS 是否被分支保护规则强制要求。
- Production Environment Approval 是否配置。
- Secret scanning / Push protection 是否开启。
- Dependabot alerts 是否开启。
- Code scanning 是否开启。
- 团队权限是否符合最小权限原则。

`.github/settings.yml` 只能表示期望状态，不能证明配置已成功应用到 GitHub 平台。可靠确认可使用：

```bash
gh auth status
gh api repos/<owner>/<repo>/branches/<branch>/protection
gh api repos/<owner>/<repo>/rulesets
```

如需要通过 GitHub API 启用单个仓库的核心分支保护，可使用以下模板。执行前必须确认当前账号拥有仓库 Admin 权限，并替换 `<owner>`、`<repo>`、`<branch>` 和 required check 名称：

```bash
gh api \
  --method PUT \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  "/repos/<owner>/<repo>/branches/<branch>/protection" \
  --input - <<'JSON'
{
  "required_status_checks": {
    "strict": true,
    "contexts": [
      "Repository governance check"
    ]
  },
  "enforce_admins": false,
  "required_pull_request_reviews": {
    "required_approving_review_count": 1,
    "require_code_owner_reviews": true,
    "dismiss_stale_reviews": true,
    "require_last_push_approval": true
  },
  "restrictions": null,
  "required_conversation_resolution": true,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "required_linear_history": false,
  "lock_branch": false,
  "allow_fork_syncing": false
}
JSON
```

其中 `enforce_admins: false` 表示管理员可绕过分支保护合并，适用于个人仓库或没有第二个 reviewer 的 bootstrap 阶段；PR 作者仍不能 approve 自己的 PR。团队仓库或已有多个维护者时，应改为 `enforce_admins: true`，让管理员也受保护规则约束。API 返回成功后，仍应通过 GitHub UI 或 `gh api repos/<owner>/<repo>/branches/<branch>/protection` 复核实际状态。

因此，检查报告应区分：

```text
✅ 通过
⚠️ 需要确认
❌ 不符合
➖ 不适用
```

### 9.4 分发方式

将整个 skill 目录复制到目标项目或用户级 skills 目录：

```text
.claude/skills/github-project-check/
.claude/skills/github-checklist/
```

`github-project-check` 目录中的 `CHECKLIST.md`、`RULES.md`、`REPORT_TEMPLATE.md` 是内置检查标准和输出模板。

`github-checklist` 目录中的 `CHECKLISTS.md` 是内置阶段清单库。

目标项目中的 `docs/*.md` 只作为补充上下文，不作为必需依赖。

### 9.5 github-project-check 推荐使用方式

在目标项目仓库中启动 Claude Code 后执行：


```text
/github-project-check
```

预期输出：

- 总体风险等级。
- 检查结果总览。
- 通过项。
- 缺失项。
- 风险项。
- 需要平台侧确认的项目。
- P0 必须整改。
- P1 建议整改。
- P2 可选优化。
- 对 GitLab 项目的兼容建议。
- 下一步建议。

后续可以继续扩展更多 skill，例如：

- `github-actions-security-check`：专门检查 Actions 安全风险。
- `github-ai-readiness-check`：检查项目是否适合接入 AI / Agent 工具。
- `github-release-check`：发布前检查。

---

## 10. 落地路线

### 10.1 阶段一：规范制定

范围：

- 仓库模板。
- Issue 模板。
- PR 模板。
- 分支规范。
- Code Review 规范。
- Secrets 规范。
- README 规范。

产出：

```text
.github/
docs/
README template
PR template
Issue templates
CODEOWNERS template
CLAUDE.md template
```

### 10.2 阶段二：选择 1-2 个项目试点

建议选择：

- 新项目。
- 工具链项目。
- 低风险服务。
- 测试覆盖较好的项目。

不建议一开始选择：

- 最核心业务项目。
- 历史包袱很重的项目。
- 大型资产仓库。
- 发布链路复杂且缺少回滚能力的项目。

### 10.3 阶段三：接入基础自动化

先接入：

- lint。
- test。
- build。
- secret check。
- PR template。
- branch protection。

再接入：

- CodeQL。
- Dependabot alerts / Vulnerability alerts。
- Dependabot security updates / automated security fixes。
- `.github/dependabot.yml` 定期检查依赖或 GitHub Actions 版本。
- Claude Code Action。
- 自动日报。

### 10.4 阶段四：推广到更多项目

根据试点指标决定是否推广。

推广前需要确认：

- 团队是否接受 Issue / PR 工作方式。
- CI/CD 成本是否可控。
- 自动化检查是否稳定。
- AI 工具是否真正减少人工负担。
- 安全和权限是否满足要求。

---

## 11. 试点成功标准

试点项目在 2-4 周内应达到：

- 所有需求通过 Issue 管理。
- 所有代码变更通过 PR。
- 核心分支启用保护规则。
- PR 至少通过一项自动化检查。
- README、PR 模板、Issue 模板齐全。
- 无明文密钥提交。
- 自动化日报可以从 Issue/PR/Commit 生成。
- 团队成员能根据规范独立完成一次需求到发布流程。

---

## 12. 度量指标

| 指标 | 说明 |
|---|---|
| PR 平均审查时间 | 看协作效率 |
| PR 返工次数 | 看需求和代码质量 |
| CI 失败率 | 看代码稳定性 |
| 缺陷逃逸率 | 看测试质量 |
| Issue 按期关闭率 | 看任务管理 |
| 发布失败次数 | 看发布流程 |
| 回滚次数 | 看质量门禁 |
| Secret 泄漏次数 | 看安全治理 |
| 依赖漏洞处理时间 | 看安全响应 |
| AI 生成内容采纳率 | 看 AI 有效性 |
| AI 相关缺陷率 | 看 AI 风险 |

---

## 13. 最终建议

本规范体系应被理解为：

> 以 GitHub 最佳实践为目标模型，统一部门研发协作、任务追踪、代码审查、自动化验证、安全治理和 AI 辅助开发的标准工作流。

它不是单纯的 GitHub 使用说明，也不是要求立即替换 GitLab。

更合理的落地方式是：

1. 先统一规范。
2. 再选择试点。
3. 再接入自动化。
4. 最后根据试点数据推广。

---

## 14. 参考资料

- Agent GitHub Game Dev Workflow: https://agent-github-game-dev-workflow.pages.dev/
- GitHub 仓库最佳实践: https://docs.github.com/zh/repositories/creating-and-managing-repositories/best-practices-for-repositories
- GitHub Docs 写作最佳实践: https://docs.github.com/zh/contributing/writing-for-github-docs/best-practices-for-github-docs
- GitHub REST API 最佳实践: https://docs.github.com/zh/rest/using-the-rest-api/best-practices-for-using-the-rest-api?apiVersion=2026-03-10
- Claude Code GitHub Actions 文档: https://code.claude.com/docs/zh-CN/github-actions
- 《GitHub AI 时代游戏开发团队日常工作流总结报告》
