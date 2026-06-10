# GitHub Checklist Library

本文件是 `github-checklist` skill 的内置 Checklist 库。该文件应随 skill 一起分发，不依赖目标项目中的 `docs/*.md`。

---

## 场景索引

| 场景参数 | Checklist |
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
| `hotfix` | Hotfix |
| `ai` | AI 工具使用 |
| `claude` | Claude Code GitHub Actions 接入 |
| `actions` | GitHub Actions 接入 |
| `security` | CodeQL / Dependabot / Secret scanning |
| `daily-report` | 自动日报 / 周报 |
| `api` | GitHub REST API 自动化 |
| `gitlab` | GitLab 兼容 / 迁移 |
| `pilot` | 试点验收 |

---

## new-project：新项目接入 Checklist

- [ ] 项目是否适合接入本规范。
- [ ] 仓库命名是否符合规范。
- [ ] 仓库可见性是否符合安全要求。
- [ ] 是否明确仓库 Owner。
- [ ] 是否明确维护团队。
- [ ] 是否明确项目技术栈。
- [ ] 是否明确分支模型：GitHub Flow 或 GitFlow / Release Flow。
- [ ] 是否明确发布方式。
- [ ] 是否明确 CI/CD 方案。
- [ ] 是否明确 Issue / PR / Review 流程。
- [ ] 是否明确是否接入 AI 工具。
- [ ] 是否明确 GitLab 与 GitHub 的兼容或迁移方式。

---

## repo：仓库初始化 Checklist

- [ ] 仓库命名符合规范。
- [ ] 仓库可见性符合安全要求。
- [ ] README 完整。
- [ ] `.gitignore` 已配置。
- [ ] `.gitattributes` 已配置。
- [ ] 如有大文件，Git LFS 策略已确认。
- [ ] Issue 模板已配置。
- [ ] PR 模板已配置。
- [ ] CODEOWNERS 已配置。
- [ ] 如团队使用配置即代码，`.github/settings.yml` 已声明核心分支保护期望。
- [ ] 核心分支已通过 GitHub UI / API 确认启用保护或 Repository Rulesets。
- [ ] Secrets 未明文提交。
- [ ] 基础 CI 检查已配置。
- [ ] 文档目录已创建。
- [ ] 如接入 Copilot，已创建 `.github/copilot-instructions.md`。
- [ ] 如接入 Claude Code，已创建 `CLAUDE.md`。

推荐基础文件：

```text
README.md
.gitignore
.gitattributes
CODEOWNERS
CONTRIBUTING.md
SECURITY.md
.github/PULL_REQUEST_TEMPLATE.md
.github/ISSUE_TEMPLATE/
.github/workflows/
docs/
```

---

## issue：Issue 创建 Checklist

- [ ] Issue 类型是否明确：Feature / Bug / Tech Task / Refactor / Research / QA Task / Release Task / Incident。
- [ ] 背景是否清楚。
- [ ] 目标是否明确。
- [ ] 范围是否明确。
- [ ] 不包含范围是否明确。
- [ ] 验收标准是否明确。
- [ ] 关联资料是否完整。
- [ ] 风险是否说明。
- [ ] 负责人是否明确。
- [ ] 优先级是否明确。
- [ ] Milestone 是否明确。
- [ ] Label 是否正确。
- [ ] 验证方式是否明确。
- [ ] 如存在依赖，是否已关联其他 Issue / PR / 文档。

---

## dev-start：开发前 Checklist

- [ ] Issue 已进入 Ready 或等价状态。
- [ ] Issue 有明确负责人。
- [ ] Issue 有明确验收标准。
- [ ] 需求范围已确认。
- [ ] 不包含范围已确认。
- [ ] 相关设计文档或技术方案已阅读。
- [ ] 基础分支已确认：`main` / `develop` / `release/*`。
- [ ] 已从基础分支创建工作分支，不直接在受保护分支上开发或提交。
- [ ] 如当前在 `main` / `develop` / `release/*` 且已有 staged / unstaged 变更，已先执行 `git switch -c <type>/<issue-id>-<short-desc>` 承接当前变更。
- [ ] 工作分支命名符合规范，优先使用 `<type>/<issue-id>-<short-desc>`；如无 Issue，PR 中应说明原因。
- [ ] 本地开发环境可正常运行。
- [ ] 本地测试命令可正常执行。
- [ ] 如使用 AI 工具，已确认 AI 可处理的范围。

---

## pre-commit：提交前 Checklist

- [ ] 当前分支已确认。
- [ ] 当前不在受保护分支上提交，例如 `main` / `develop` / `release/*`。
- [ ] 如果当前在受保护分支且已有 staged / unstaged 变更，已先执行 `git switch -c <type>/<issue-id>-<short-desc>` 创建工作分支承接当前变更。
- [ ] 当前工作分支命名符合规范，并关联 Issue ID；如无 Issue，PR 中应说明原因。
- [ ] 只修改了 Issue 范围内的内容。
- [ ] 没有混入无关重构。
- [ ] 没有提交临时调试代码。
- [ ] 没有提交本地 IDE 私有配置。
- [ ] 没有提交构建产物。
- [ ] 没有提交 API Key、Token、密码、私钥等敏感信息。
- [ ] 代码格式化已执行。
- [ ] Lint 已通过。
- [ ] 单元测试已通过。
- [ ] 类型检查已通过，如适用。
- [ ] 本地构建已通过，如适用。
- [ ] 关键功能已手动验证。
- [ ] Commit message 使用 Conventional Commit 格式：`<type>: <short summary>`。
- [ ] Commit type 符合变更类型，例如 `feat`、`fix`、`docs`、`ci`、`chore`、`refactor`、`test`。
- [ ] Commit 已关联 Issue，建议 commit 中使用 `Refs #<issue-id>`；由 PR 描述使用 `Closes #<issue-id>` 关闭 Issue。

---

## pr：PR 创建 Checklist

- [ ] PR 来源分支不是受保护分支，例如 `main` / `develop` / `release/*`。
- [ ] PR 来源分支命名符合规范，优先使用 `<type>/<issue-id>-<short-desc>`。
- [ ] PR 标题清晰。
- [ ] PR 已关联 Issue；如无 Issue，已说明无需 Issue 的原因。
- [ ] 变更摘要已填写。
- [ ] 变更类型已选择。
- [ ] 影响范围已说明。
- [ ] 验证方式已说明。
- [ ] 截图 / 日志 / 构建产物已附上，如适用。
- [ ] 已知风险已说明。
- [ ] 回滚方案已说明。
- [ ] 是否使用 AI 辅助已说明。
- [ ] Reviewer 关注点已说明。
- [ ] PR 粒度合理，没有包含多个无关目标。
- [ ] 如涉及高风险模块，已指定 Code Owner。

---

## automation：自动化检查 Checklist

- [ ] CI workflow 已触发。
- [ ] Lint 通过。
- [ ] 单元测试通过。
- [ ] 构建检查通过。
- [ ] 类型检查通过，如适用。
- [ ] CodeQL / 静态分析通过，如适用。
- [ ] Dependabot / 依赖检查无阻断问题。
- [ ] Secret scanning 无泄漏。
- [ ] 测试覆盖率符合项目要求，如适用。
- [ ] 游戏项目资源检查通过，如适用。
- [ ] 配置表检查通过，如适用。
- [ ] 客户端构建 smoke test 通过，如适用。
- [ ] 失败项已有明确处理结论。
- [ ] 如存在误报，已记录豁免原因和有效期。

---

## review：Code Review Checklist

- [ ] PR 是否符合关联 Issue 的目标。
- [ ] 是否超出任务范围。
- [ ] 代码是否易读、可维护。
- [ ] 命名是否清晰。
- [ ] 错误处理是否合理。
- [ ] 日志是否合理且不泄漏敏感信息。
- [ ] 是否存在安全风险。
- [ ] 是否存在性能风险。
- [ ] 是否影响兼容性。
- [ ] 是否有足够测试。
- [ ] 是否需要补充文档。
- [ ] 是否有回滚方案。
- [ ] 自动化检查是否全部通过。
- [ ] AI 生成或 AI 修改内容是否经过人工确认。
- [ ] 是否存在未解决 blocking comment。

游戏项目额外确认：

- [ ] 是否影响核心玩法。
- [ ] 是否影响战斗手感、镜头、节奏。
- [ ] 是否影响网络同步。
- [ ] 是否影响资源加载。
- [ ] 是否影响内存和性能。
- [ ] 是否影响包体大小。
- [ ] 是否影响多端一致性。
- [ ] 是否影响配置表、数值表或本地化。

---

## qa：QA / 验收 Checklist

- [ ] 验收标准已明确。
- [ ] 测试环境已明确。
- [ ] 测试版本已明确。
- [ ] 测试步骤已记录。
- [ ] 核心功能符合需求。
- [ ] 边界情况已验证。
- [ ] 异常情况已验证。
- [ ] 旧功能回归正常。
- [ ] 日志无明显异常。
- [ ] 性能无明显异常。
- [ ] UI / 交互符合预期。
- [ ] 如是游戏项目，玩法、表现、手感符合验收要求。
- [ ] 截图 / 录屏 / 日志已附上，如适用。
- [ ] 遗留问题已创建 Issue 或记录。
- [ ] 验证结论已回写到 Issue 或 PR。

建议使用评论前缀：

```text
[evidence] 验证证据
[blocker] 阻塞事项
[review] 审查意见
[decision] 决策记录
[handoff] 交接总结
```

---

## merge：合并前 Checklist

- [ ] 关联 Issue 明确。
- [ ] PR 描述完整。
- [ ] 必要自动化检查通过。
- [ ] 人工 Review 通过。
- [ ] 无未解决 blocking comment。
- [ ] 高风险变更已有回滚方案。
- [ ] 如使用 AI，AI 参与范围已说明。
- [ ] 如涉及 CODEOWNERS，Owner 已审批。
- [ ] 如涉及发布或生产环境，负责人已确认。
- [ ] 合并目标分支正确。
- [ ] 合并策略符合项目约定。

---

## release-pre：发布前 Checklist

- [ ] 本版本所有 Issue 状态正确。
- [ ] release branch 或 tag 已创建。
- [ ] 版本号正确。
- [ ] 自动化构建通过。
- [ ] 自动化测试通过。
- [ ] QA 验收通过。
- [ ] 关键风险已确认。
- [ ] 回滚方案已准备。
- [ ] 发布说明已完成。
- [ ] 变更范围已确认。
- [ ] 数据库迁移或配置变更已确认，如适用。
- [ ] 监控和告警已确认。
- [ ] 发布窗口已确认。
- [ ] 相关负责人已审批。
- [ ] 生产部署必须经过 Environment Approval 或等价人工审批机制。

---

## release-post：发布后 Checklist

- [ ] 部署任务成功完成。
- [ ] 线上服务状态正常。
- [ ] 核心功能 smoke test 通过。
- [ ] 错误日志无明显异常。
- [ ] 监控指标无明显异常。
- [ ] 崩溃率、错误率、延迟等关键指标正常。
- [ ] 用户反馈无重大异常。
- [ ] Release note 已更新。
- [ ] 相关 Issue 状态已更新。
- [ ] 如发现问题，已创建 Incident Issue。
- [ ] 如发生回滚、事故或严重缺陷，已安排复盘。

---

## hotfix：Hotfix Checklist

- [ ] 已创建 Hotfix / Incident Issue。
- [ ] 问题影响范围已确认。
- [ ] 修复目标明确且范围最小。
- [ ] 从正确的稳定分支拉出 hotfix 分支。
- [ ] 修复代码已完成。
- [ ] 必要自动化检查通过。
- [ ] 至少一名负责人审批。
- [ ] 发布前回滚方案已确认。
- [ ] 修复发布后线上验证通过。
- [ ] 修复已同步回 develop 或后续开发分支。
- [ ] 事故原因和后续改进已记录。

---

## ai：AI 工具使用 Checklist

- [ ] 当前任务适合 AI 辅助。
- [ ] AI 不会处理未授权敏感信息。
- [ ] AI 不会扩大任务范围。
- [ ] AI 不会绕过 CI、Review、审批和发布流程。
- [ ] AI 生成代码已由开发者阅读和确认。
- [ ] AI 生成测试已确认断言有效。
- [ ] AI 审查意见已由人工判断。
- [ ] PR 中已说明是否使用 AI 辅助。
- [ ] 涉及核心玩法、网络同步、安全、性能、支付、反作弊等高风险内容时，已安排人工重点审查。
- [ ] AI 工具产生的问题由采纳者负责。

---

## claude：Claude Code GitHub Actions 接入 Checklist

- [ ] 仓库是否适合接入 Claude Code。
- [ ] 已创建 `CLAUDE.md`。
- [ ] `CLAUDE.md` 已说明项目背景、技术栈、测试命令和禁止事项。
- [ ] API Key 已存储在 GitHub Secrets。
- [ ] workflow 显式声明最小权限。
- [ ] 已设置触发条件，例如 `@claude`。
- [ ] 已设置 `max-turns`。
- [ ] 已设置 job timeout。
- [ ] 不允许 Claude 自动合并生产分支。
- [ ] 不允许 Claude 绕过分支保护。
- [ ] 不允许 Claude 访问不必要的 secrets。
- [ ] 重要变更必须人工确认。
- [ ] 已评估 API 和 Actions 成本。

---

## actions：GitHub Actions 接入 Checklist

- [ ] workflow 触发条件合理。
- [ ] workflow 显式配置 `permissions`。
- [ ] `GITHUB_TOKEN` 权限最小化。
- [ ] Secrets 未硬编码在 workflow 中。
- [ ] 第三方 Action 版本已固定。
- [ ] workflow 设置 timeout。
- [ ] 并发任务设置 concurrency，如适用。
- [ ] artifact 设置保留周期。
- [ ] PR from fork 不会访问生产 secrets。
- [ ] self-hosted runner 不会运行不可信 PR。
- [ ] 生产部署需要 Environment Approval 或等价人工审批。
- [ ] 失败通知或告警已配置。

---

## security：CodeQL / Dependabot / Secret scanning Checklist

- [ ] CodeQL 已启用或有替代静态分析工具。
- [ ] CodeQL 扫描范围符合项目技术栈。
- [ ] 严重问题会阻断合并。
- [ ] 误报有记录和豁免机制。
- [ ] Dependabot alerts / Vulnerability alerts 已启用或有替代依赖漏洞告警机制。
- [ ] Dependabot security updates / automated security fixes 已启用，或已明确不需要自动安全修复 PR。
- [ ] 如需定期检查依赖或 GitHub Actions 版本，`.github/dependabot.yml` 已配置。
- [ ] Dependabot PR 必须经过 CI 和人工 Review。
- [ ] 重大版本升级不会自动合并。
- [ ] Secret scanning 已启用或有替代扫描机制。
- [ ] 推送保护已启用，如适用。
- [ ] 密钥泄漏有撤销、轮换、审计流程。

---

## daily-report：自动日报 / 周报 Checklist

- [ ] 数据来源是 Issue / PR / Commit / Review / Actions / Release 等事实记录。
- [ ] 不依赖人工维护的长期 todo issue 作为唯一来源。
- [ ] 时间范围明确。
- [ ] 人员范围明确。
- [ ] 仓库范围明确。
- [ ] 输出不编造未发生的工作。
- [ ] 当前阻塞事项能被识别。
- [ ] 今日计划来自明确状态的 Issue。
- [ ] 输出格式稳定，便于复制到日报系统或评论区。

---

## api：GitHub REST API 自动化 Checklist

- [ ] 优先使用 Webhook，避免高频轮询。
- [ ] 所有请求已认证。
- [ ] 不使用个人长期 token 作为生产凭证。
- [ ] 控制并发。
- [ ] 写操作限速。
- [ ] 正确处理 rate limit。
- [ ] 支持 `retry-after`。
- [ ] 支持指数退避。
- [ ] 使用分页 Link header。
- [ ] 使用 ETag / 条件请求，如适用。
- [ ] 不手动解析 URL 推断资源。
- [ ] 错误有日志。
- [ ] 连续错误有熔断或人工介入机制。
- [ ] 日志中不打印 token 或敏感信息。

---

## gitlab：GitLab 兼容 / 迁移 Checklist

- [ ] GitLab Project 与 GitHub Repository 的映射关系明确。
- [ ] GitLab Issue 与 GitHub Issue 的使用方式已统一。
- [ ] GitLab MR 与 GitHub PR 的模板已统一。
- [ ] GitLab CI 与 GitHub Actions 的职责边界明确。
- [ ] Protected Branches / Branch Protection / Repository Rulesets 规则一致。
- [ ] 如使用 `.github/settings.yml` 或等价配置即代码，已确认期望配置与平台实际状态一致。
- [ ] CODEOWNERS 可复用或已迁移。
- [ ] CI Variables / GitHub Secrets 的迁移方式明确。
- [ ] Git LFS 或资产管理策略明确。
- [ ] 历史仓库是否迁移已评估。
- [ ] 权限、团队、Owner 映射关系明确。
- [ ] 迁移后是否保留 GitLab 只读归档已确认。

---

## pilot：试点验收 Checklist

- [ ] 所有需求通过 Issue 管理。
- [ ] 所有代码变更通过 PR / MR。
- [ ] 核心分支已通过 GitHub UI / API 确认启用保护规则或 Repository Rulesets。
- [ ] 如使用 `.github/settings.yml`，已确认期望配置已同步到平台。
- [ ] PR 至少通过一项自动化检查。
- [ ] README、PR 模板、Issue 模板齐全。
- [ ] 无明文密钥提交。
- [ ] 自动化日报可以从 Issue / PR / Commit 生成。
- [ ] 团队成员能根据规范独立完成一次需求到发布流程。
- [ ] CI/CD 成本可接受。
- [ ] 自动化检查稳定可靠。
- [ ] AI 工具未产生不可控噪音。
- [ ] 试点问题已形成改进清单。
