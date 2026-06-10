# GitHub 研发协作规范

> 版本：v0.1  
> 状态：草案  
> 定位：本文件定义团队在使用 GitHub 或按 GitHub 模型改造 GitLab 项目时，应遵循的仓库、任务、分支、PR、权限、安全和文档规范。  
> 相关文档：[总纲](./github.md) / [工作流介绍](./github-workflow.md) / [自动化工具介绍](./github-automation.md)

---

## 1. 规范目标

本规范用于统一团队研发协作的基本规则，保证项目具备：

1. 清晰的仓库边界。
2. 可追踪的任务来源。
3. 统一的分支和提交方式。
4. 可靠的 PR / MR 审查机制。
5. 最小权限和密钥安全。
6. 可维护的文档和决策记录。
7. 可兼容 GitLab、GitHub 的协作模型。

本规范中的关键词含义如下：

- **必须**：强制要求，默认不允许例外。
- **禁止**：明确红线，不得违反。
- **应当**：默认要求，特殊情况可经过负责人确认后例外。
- **可以**：建议做法，团队可按项目情况选择。

---

## 2. 仓库规范

### 2.1 仓库命名规范

推荐命名格式：

```text
<业务线>-<项目名>-<模块名>
```

示例：

```text
game-core-server
game-client-unity
game-tools-pipeline
game-config-center
game-docs-design
```

要求：

- 必须使用小写英文。
- 单词之间使用 `-` 分隔。
- 名称应体现业务、项目或模块边界。
- 禁止使用 `test`、`new`、`final`、`demo2` 等无意义命名。
- 避免使用个人姓名、拼音缩写或只有少数人理解的简称。

### 2.2 仓库可见性规范

| 仓库类型 | 推荐可见性 | 说明 |
|---|---|---|
| 业务代码 | Private | 默认私有 |
| 内部工具 | Internal / Private | 根据组织策略决定 |
| 开源 SDK / Demo | Public | 必须审批 |
| 文档仓库 | Private / Internal | 根据内容敏感性决定 |
| 实验项目 | Private | 默认私有，定期清理 |

原则：

> 默认私有，公开必须审批。

### 2.3 仓库基础文件规范

正式仓库应包含以下基础文件或目录：

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

接入 AI 工具的仓库，建议额外包含：

```text
CLAUDE.md
.github/copilot-instructions.md
```

### 2.4 README 规范

每个正式仓库必须包含 `README.md`。README 应至少包含以下内容：

```markdown
# 项目名称

## 项目简介
这个项目解决什么问题。

## 技术栈
语言、框架、引擎、数据库、中间件。

## 本地启动
如何安装依赖、配置环境、启动服务。

## 测试方式
如何运行单元测试、集成测试、构建验证。

## 分支策略
main / develop / feature / release / hotfix 说明。

## 发布流程
如何打包、如何发布、谁审批。

## 相关文档
设计文档、接口文档、部署文档、运行手册链接。

## 负责人
Owner、维护团队、联系方式。
```

### 2.5 大文件与游戏资产规范

GitHub / Git 不适合直接管理所有大型二进制资产。对于必须进入仓库的二进制文件，应通过 Git LFS 管理；对于超大规模美术源文件、DCC 文件、视频、音频、引擎缓存，应优先使用专门资产管理系统、对象存储、Perforce、Plastic SCM 或内部资产平台。

应使用 Git LFS 管理的典型文件类型：

```text
*.psd
*.fbx
*.png
*.wav
*.mp4
*.uasset
*.umap
*.blend
*.tga
```

注意事项：

- 是否使用 Git LFS 不应只按文件大小判断，还应按文件类型、协作方式、冲突风险和 CI 拉取成本判断。
- 大型资产不应无差别进入代码仓库。
- 对存在多人并行编辑风险的二进制资产，应考虑锁定机制或外部资产管理系统。
- CI/CD 流程应避免无必要地全量拉取大型资产。

### 2.6 禁止提交内容

禁止提交以下内容：

- API Key。
- Access Token。
- SSH 私钥。
- 数据库密码。
- 云服务密钥。
- 内部服务账号密码。
- 玩家隐私数据。
- 未脱敏日志。
- 商业合同、财务数据。
- 平台 NDA 材料。
- 未公开版本内容。
- 大型构建产物。
- 本地 IDE 配置。
- 临时调试文件。

强制规则：

> 任何凭证、令牌、密钥不得以明文形式提交到仓库。所有敏感配置必须通过 GitHub Secrets、环境变量、配置中心或密钥管理服务注入。

---

## 3. Issue / Project 任务规范

### 3.1 Issue 的定位

Issue 是任务和需求的最小可追踪单元。所有可执行任务、缺陷、技术调研、发布事项、QA 验证事项都应通过 Issue 记录。

Issue 应回答以下问题：

1. 为什么要做？
2. 要做什么？
3. 不做什么？
4. 谁负责？
5. 怎么验证完成？
6. 与哪些 PR、文档、构建和发布记录相关？

### 3.2 Issue 类型

| 类型 | 用途 |
|---|---|
| Feature | 新功能需求 |
| Bug | 缺陷修复 |
| Tech Task | 技术任务 |
| Refactor | 重构 |
| Research | 技术调研 |
| Design | 设计/策划任务 |
| QA Task | 测试任务 |
| Release Task | 发布任务 |
| Incident | 线上事故 |
| Daily / Weekly Report | 日报/周报聚合 |

### 3.3 Issue 必填字段

建议 Issue 模板包含：

```markdown
## 背景
为什么要做这个任务？

## 目标
这个任务要达成什么？

## 范围
本任务包含哪些内容？

## 不包含范围
明确哪些事情不在本任务内。

## 验收标准
满足什么条件算完成？

## 关联资料
需求文档、设计文档、接口文档、日志、截图、相关 PR。

## 风险
可能影响哪些模块？

## 负责人
Owner / Assignee。

## 截止时间
如有。

## 验证方式
如何测试、如何确认。
```

### 3.4 Issue 状态流

推荐状态流：

```text
Backlog
  ↓
Ready
  ↓
In Progress
  ↓
In Review
  ↓
In QA / Validation
  ↓
Ready for Release
  ↓
Released
  ↓
Closed
```

| 状态 | 含义 | 进入条件 | 退出条件 |
|---|---|---|---|
| Backlog | 待评估 | 初步记录 | 明确优先级和范围 |
| Ready | 可开发 | 验收标准明确 | 分配负责人 |
| In Progress | 开发中 | 已创建分支 | 提交 PR |
| In Review | 审查中 | PR 已创建 | Review 通过 |
| In QA / Validation | 测试中 | 构建和 Review 通过 | QA 或验收通过 |
| Ready for Release | 待发布 | 合入发布分支 | 发布完成 |
| Released | 已发布 | 线上验证通过 | 关闭 Issue |

### 3.5 Label 规范

建议使用统一标签：

```text
type/feature
type/bug
type/task
type/refactor
type/research
type/docs

priority/p0
priority/p1
priority/p2
priority/p3

status/blocked
status/needs-review
status/needs-qa

area/client
area/server
area/tools
area/qa
area/design
area/art
area/ops

risk/high
risk/medium
risk/low
```

### 3.6 个人 Todo 与日报规范

不建议每个人长期维护一个巨大的 todo issue，原因：

- 容易变成手工流水账。
- 与真实 Issue / PR 状态重复。
- 时间久了上下文噪音大。
- 自动化工具难以判断哪些是事实，哪些是计划。

推荐方式：

```text
Issue / PR / Commit / Review / Actions = 事实来源
日报 / 周报 = 自动聚合后的视图
```

日报自动化可以从以下数据生成：

- 昨日关闭的 Issue。
- 昨日创建或更新的 PR。
- 昨日合并的 PR。
- 昨日 Review 记录。
- 昨日提交的 Commit。
- 当前 Blocked Issue。
- 今日计划中的 Ready / In Progress Issue。

可以保留每人每周的 Tracking Issue，但它只作为汇总入口，不作为真实任务来源。

---

## 4. 分支与提交规范

### 4.1 分支模型

#### 模式 A：轻量 GitHub Flow

适合小团队、Web 服务、工具项目：

```text
main
  ↑
feature/xxx
bugfix/xxx
hotfix/xxx
```

规则：

- `main` 永远可发布。
- 所有变更通过 PR。
- PR 通过检查后合并。
- 发布通过 tag 或 release 触发。

#### 模式 B：游戏项目 GitFlow / Release Flow

适合客户端、游戏版本、长周期发布项目：

```text
main
develop
feature/xxx
bugfix/xxx
release/x.y.z
hotfix/x.y.z
experiment/xxx
```

规则：

- `main` 保存线上稳定版本。
- `develop` 为集成分支。
- 功能从 `develop` 拉出。
- 发布前创建 `release/x.y.z`。
- 线上紧急修复从 `main` 拉 `hotfix/x.y.z`。

建议：

> 工具类、服务类项目优先使用 GitHub Flow；游戏客户端、版本制项目、强 QA 项目优先使用 GitFlow / Release Flow。

### 4.2 分支命名规范

推荐格式：

```text
feature/<issue-id>-<short-desc>
bugfix/<issue-id>-<short-desc>
hotfix/<issue-id>-<short-desc>
release/<version>
experiment/<short-desc>
```

示例：

```text
feature/1234-inventory-system
bugfix/1288-login-timeout
hotfix/1301-payment-crash
release/1.6.0
experiment/new-combat-camera
```

### 4.3 Commit 规范

建议采用 Conventional Commits：

```text
feat: add inventory item stack logic
fix: resolve login timeout retry bug
docs: update release checklist
test: add battle damage calculation tests
refactor: simplify matchmaking flow
chore: update dependencies
ci: add build cache for Unity project
```

提交信息应关联 Issue：

```text
feat: add inventory item stack logic

Refs #1234
```

或：

```text
fix: resolve login timeout retry bug

Closes #1288
```

---

## 5. PR / Code Review 规范

### 5.1 PR 必填内容

PR 模板建议包含：

```markdown
## 变更摘要
说明本 PR 做了什么。

## 关联 Issue
Closes #

## 变更类型
- [ ] Feature
- [ ] Bugfix
- [ ] Refactor
- [ ] Docs
- [ ] CI/CD
- [ ] Release
- [ ] Hotfix

## 影响范围
影响哪些模块、系统、接口、配置或资产？

## 验证方式
- [ ] 本地测试通过
- [ ] 单元测试通过
- [ ] 自动化测试通过
- [ ] 构建通过
- [ ] QA 验证
- [ ] 性能验证
- [ ] 安全扫描通过

## 截图 / 日志 / 构建产物
如适用，请附链接。

## 风险与回滚方案
有哪些风险？如何回滚？

## 是否使用 AI 辅助
- [ ] 否
- [ ] 是，使用工具：
说明 AI 参与的范围。

## Reviewer 关注点
希望 reviewer 重点看什么？
```

### 5.2 Code Review 规则

必须遵守：

- 所有代码变更必须通过 PR / MR。
- 禁止直接 push 到 `main` / `develop`。
- 至少 1 名 reviewer 通过后才能合并。
- 高风险模块至少 2 名 reviewer。
- 涉及架构、性能、网络、支付、安全、数据迁移的 PR 必须由 Code Owner 审查。
- 自动化检查失败不得合并。
- PR 作者不得自审自合，除非是明确授权的紧急 hotfix。
- AI 审查意见只能作为参考，不能替代人工审批。

### 5.3 CODEOWNERS 规范

建议为关键目录配置 CODEOWNERS。

示例：

```text
# 默认 owner
* @team/core-maintainers

# 客户端
/client/ @team/client

# 服务端
/server/ @team/server

# CI/CD
/.github/workflows/ @team/devops

# 安全配置
/infra/ @team/security
```

---

## 6. 权限、安全与依赖治理规范

### 6.1 权限原则

必须遵守：

```text
默认最小权限。
按团队授权，不按个人长期授权。
生产分支合并权限只给 Maintainer。
外部协作者必须限制访问范围。
离职、转岗、项目结束后必须回收权限。
```

### 6.2 分支保护

核心分支必须启用：

- 禁止 force push。
- 禁止直接 push。
- 必须通过 PR。
- 必须通过状态检查。
- 必须至少一名 reviewer。
- 高风险仓库需要 CODEOWNERS。
- 管理员是否可绕过要明确。
- release/main 合并需要人工审批。

### 6.3 Secrets 规范

严禁将密钥、令牌、密码、证书、私钥提交到仓库或写入 Actions 日志。

推荐使用：

- GitHub Secrets。
- GitHub Environments。
- OIDC。
- 云厂商临时凭证。
- 内部密钥管理服务。

禁止使用：

- 明文 `.env`。
- 硬编码 token。
- 长期 Access Key。
- 将 secrets 输出到日志。

### 6.4 依赖治理

使用 Dependabot 或等效工具：

- 自动发现依赖漏洞。
- 自动创建升级 PR。
- 安全升级优先处理。
- 重大版本升级必须人工评估。
- 依赖 PR 必须跑完整 CI。
- 关键依赖版本锁定。

### 6.5 CodeQL / 静态分析

建议：

- PR 阶段自动扫描。
- main/develop 定期扫描。
- 高风险语言必须启用。
- 严重问题阻断合并。
- 误报需要记录和豁免。
- 自定义规则逐步建设。

---

## 7. 文档书写与知识沉淀规范

### 7.1 文档原则

文档应遵循：

- 每篇文档只解决 1-2 个核心问题。
- 开头说明适用场景。
- 先给结论，再给细节。
- 每段只表达一个重点。
- 尽量使用列表、表格、步骤。
- 示例优先。
- 术语保持一致。
- 文档必须有 Owner。
- 过期文档要归档或更新。

### 7.2 文档分类

推荐目录：

```text
docs/design/        设计文档
docs/tech/          技术方案
docs/api/           接口文档
docs/ops/           运维文档
docs/release/       发布文档
docs/decisions/     决策记录 ADR
docs/playtests/     测试和试玩记录
docs/postmortems/   故障复盘
```

### 7.3 决策记录 ADR

建议记录关键技术和流程决策：

```text
docs/decisions/0001-use-github-actions-for-ci.md
```

模板：

```markdown
# ADR-0001: 决策标题

## 状态
Proposed / Accepted / Deprecated

## 背景
为什么需要这个决策？

## 决策
我们决定怎么做？

## 原因
为什么这样做？

## 影响
带来什么收益和代价？

## 替代方案
考虑过哪些方案？
```

---

## 8. 规范落地 Checklist

新项目接入时，应至少完成：

- [ ] 仓库命名符合规范。
- [ ] 仓库可见性符合安全要求。
- [ ] README 完整。
- [ ] `.gitignore`、`.gitattributes` 完整。
- [ ] Issue 模板已配置。
- [ ] PR 模板已配置。
- [ ] CODEOWNERS 已配置。
- [ ] 核心分支已启用保护。
- [ ] Secrets 未明文提交。
- [ ] 基础 CI 检查已配置。
- [ ] 文档目录已创建。
- [ ] 如接入 AI，已创建 `CLAUDE.md` 或 Copilot instructions。
