# GitHub 研发协作 Checklist

> 版本：v0.1  
> 状态：草案  
> 定位：本文档集中整理 GitHub 研发协作规范、工作流和自动化工具中的执行检查项，方便在项目接入、需求开发、PR 审查、发布上线和 AI 工具接入时逐项确认。  
> 相关文档：[总纲](./github.md) / [研发协作规范](./github-standard.md) / [工作流介绍](./github-workflow.md) / [自动化工具介绍](./github-automation.md)

---

## 1. 使用方式

本 Checklist 用于执行阶段快速检查，不替代规范文档和工作流说明。

建议使用方式：

- 新项目接入时，查看「新项目接入 Checklist」。
- 开发需求前，查看「Issue / 开发前 Checklist」。
- 提交 PR 前，查看「提交前 / PR Checklist」。
- Review 时，查看「Code Review Checklist」。
- QA 验收时，查看「QA / 验收 Checklist」。
- 发布前后，查看「发布前 / 发布后 Checklist」。
- 接入自动化或 AI 工具时，查看「自动化工具 / AI 工具 Checklist」。

---

## 2. 新项目接入 Checklist

新项目接入 GitHub 或按 GitHub 模型改造 GitLab 项目时，应至少确认：

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

## 3. 仓库初始化 Checklist

仓库初始化时，应至少完成：

- [ ] 仓库命名符合规范。
- [ ] 仓库可见性符合安全要求。
- [ ] README 完整。
- [ ] `.gitignore` 已配置。
- [ ] `.gitattributes` 已配置。
- [ ] 如有大文件，Git LFS 策略已确认。
- [ ] Issue 模板已配置。
- [ ] PR 模板已配置。
- [ ] CODEOWNERS 已配置。
- [ ] 核心分支已启用保护。
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

## 4. Issue 创建 Checklist

创建 Issue 时，应确认：

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

## 5. 开发前 Checklist

开发人员开始编码前，应确认：

- [ ] Issue 已进入 Ready 或等价状态。
- [ ] Issue 有明确负责人。
- [ ] Issue 有明确验收标准。
- [ ] 需求范围已确认。
- [ ] 不包含范围已确认。
- [ ] 相关设计文档或技术方案已阅读。
- [ ] 基础分支已确认：`main` / `develop` / `release/*`。
- [ ] 工作分支命名符合规范。
- [ ] 本地开发环境可正常运行。
- [ ] 本地测试命令可正常执行。
- [ ] 如使用 AI 工具，已确认 AI 可处理的范围。

---

## 6. 提交前 Checklist

提交代码前，应确认：

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
- [ ] Commit message 符合规范。
- [ ] Commit 已关联 Issue。

---

## 7. PR 创建 Checklist

创建 PR / MR 时，应确认：

- [ ] PR 标题清晰。
- [ ] PR 已关联 Issue。
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

## 8. 自动化检查 Checklist

PR 阶段自动化检查应确认：

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

## 9. Code Review Checklist

Reviewer 审查 PR 时，应确认：

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

## 10. QA / 验收 Checklist

QA 或验收人员应确认：

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

## 11. 合并前 Checklist

PR 合并前，应确认：

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

## 12. 发布前 Checklist

发布前应确认：

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

## 13. 发布后 Checklist

发布后应确认：

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

## 14. Hotfix Checklist

线上紧急修复时，应确认：

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

## 15. AI 工具使用 Checklist

使用 Copilot、Claude Code 或其他 AI / Agent 工具时，应确认：

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

## 16. Claude Code GitHub Actions 接入 Checklist

接入 Claude Code GitHub Actions 时，应确认：

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

## 17. GitHub Actions 接入 Checklist

接入 GitHub Actions 时，应确认：

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

## 18. CodeQL / Dependabot / Secret scanning Checklist

安全和依赖治理应确认：

- [ ] CodeQL 已启用或有替代静态分析工具。
- [ ] CodeQL 扫描范围符合项目技术栈。
- [ ] 严重问题会阻断合并。
- [ ] 误报有记录和豁免机制。
- [ ] Dependabot 已启用或有替代依赖治理工具。
- [ ] Dependabot PR 必须经过 CI 和人工 Review。
- [ ] 重大版本升级不会自动合并。
- [ ] Secret scanning 已启用或有替代扫描机制。
- [ ] 推送保护已启用，如适用。
- [ ] 密钥泄漏有撤销、轮换、审计流程。

---

## 19. 自动日报 / 周报 Checklist

自动日报或周报生成前，应确认：

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

## 20. GitHub REST API 自动化 Checklist

内部自动化工具使用 GitHub API 时，应确认：

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

## 21. GitLab 兼容 / 迁移 Checklist

当前 GitLab 项目按 GitHub 模型改造或迁移时，应确认：

- [ ] GitLab Project 与 GitHub Repository 的映射关系明确。
- [ ] GitLab Issue 与 GitHub Issue 的使用方式已统一。
- [ ] GitLab MR 与 GitHub PR 的模板已统一。
- [ ] GitLab CI 与 GitHub Actions 的职责边界明确。
- [ ] Protected Branches / Branch Protection 规则一致。
- [ ] CODEOWNERS 可复用或已迁移。
- [ ] CI Variables / GitHub Secrets 的迁移方式明确。
- [ ] Git LFS 或资产管理策略明确。
- [ ] 历史仓库是否迁移已评估。
- [ ] 权限、团队、Owner 映射关系明确。
- [ ] 迁移后是否保留 GitLab 只读归档已确认。

---

## 22. 试点验收 Checklist

试点项目在 2-4 周内应达到：

- [ ] 所有需求通过 Issue 管理。
- [ ] 所有代码变更通过 PR / MR。
- [ ] 核心分支启用保护规则。
- [ ] PR 至少通过一项自动化检查。
- [ ] README、PR 模板、Issue 模板齐全。
- [ ] 无明文密钥提交。
- [ ] 自动化日报可以从 Issue / PR / Commit 生成。
- [ ] 团队成员能根据规范独立完成一次需求到发布流程。
- [ ] CI/CD 成本可接受。
- [ ] 自动化检查稳定可靠。
- [ ] AI 工具未产生不可控噪音。
- [ ] 试点问题已形成改进清单。

---

## 23. 快速索引

| 场景 | 应查看 |
|---|---|
| 新项目初始化 | [新项目接入](#2-新项目接入-checklist)、[仓库初始化](#3-仓库初始化-checklist)、[GitHub Actions 接入](#17-github-actions-接入-checklist) |
| 创建需求 | [Issue 创建](#4-issue-创建-checklist)、[开发前](#5-开发前-checklist) |
| 开始开发 | [开发前](#5-开发前-checklist)、[提交前](#6-提交前-checklist) |
| 提交 PR | [PR 创建](#7-pr-创建-checklist)、[自动化检查](#8-自动化检查-checklist) |
| 做 Review | [Code Review](#9-code-review-checklist)、[合并前](#11-合并前-checklist) |
| QA 验收 | [QA / 验收](#10-qa--验收-checklist) |
| 发布版本 | [发布前](#12-发布前-checklist)、[发布后](#13-发布后-checklist) |
| 紧急修复 | [Hotfix](#14-hotfix-checklist) |
| 使用 AI | [AI 工具使用](#15-ai-工具使用-checklist)、[Claude Code 接入](#16-claude-code-github-actions-接入-checklist) |
| 接入 CI/CD | [GitHub Actions 接入](#17-github-actions-接入-checklist)、[自动化检查](#8-自动化检查-checklist) |
| 做安全治理 | [CodeQL / Dependabot / Secret scanning](#18-codeql--dependabot--secret-scanning-checklist) |
| 做日报工具 | [自动日报 / 周报](#19-自动日报--周报-checklist)、[GitHub REST API 自动化](#20-github-rest-api-自动化-checklist) |
| 从 GitLab 迁移 | [GitLab 兼容 / 迁移](#21-gitlab-兼容--迁移-checklist) |
