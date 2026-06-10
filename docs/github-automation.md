# GitHub 自动化工具介绍

> 版本：v0.1  
> 状态：草案  
> 定位：本文件介绍围绕 GitHub 工作流可接入的自动化、质量、安全和 AI 工具，以及推荐使用方式。  
> 相关文档：[总纲](./github.md) / [研发协作规范](./github-standard.md) / [工作流介绍](./github-workflow.md)

---

## 1. 自动化工具的定位

自动化工具用于把研发流程中的重复性、标准化、可验证工作固化下来，降低人工沟通和人工检查成本。

自动化工具应服务于以下目标：

1. 在提交前发现低级问题。
2. 在 PR 阶段自动完成构建、测试、安全和依赖检查。
3. 在合并后自动生成构建产物和部署测试环境。
4. 在发布前提供稳定的质量门禁。
5. 在日常协作中自动汇总 Issue、PR、Review 和 Actions 状态。
6. 用 AI 工具辅助代码生成、审查、总结和测试，但不替代人工责任人。

---

## 2. 工具分层

建议将自动化工具分为五层。

| 层级 | 工具 | 主要作用 |
|---|---|---|
| 本地提交前 | pre-commit、lint、unit test | 在提交前发现格式、测试、密钥和大文件问题 |
| PR 阶段 | GitHub Actions、CodeQL、Dependabot、Secret scanning | 在合并前完成质量和安全检查 |
| 合并后 | GitHub Actions、构建脚本、部署脚本 | 自动构建、部署测试环境、上传产物 |
| 发布阶段 | GitHub Actions、Environments、Release workflow | 发布审批、打包、部署、回滚 |
| AI / Agent | Copilot、Claude Code GitHub Actions | 辅助编码、审查、总结、测试生成、报告生成 |

---

## 3. pre-commit：本地提交前检查

### 3.1 适用场景

pre-commit 用于在代码提交前执行轻量检查，减少低级问题进入远程仓库。

适合检查：

- 代码格式。
- Lint。
- 单元测试。
- 类型检查。
- Secret 检查。
- 大文件检查。
- 提交信息检查。

### 3.2 使用原则

- pre-commit 应尽量快速，避免严重影响开发体验。
- pre-commit 是本地防线，不能替代 CI。
- 关键检查必须在 CI 中再次执行。
- 不应依赖开发者手动执行关键验证。

### 3.3 推荐检查项

```text
format check
lint
type check
unit test
secret scan
large file check
commit message check
```

---

## 4. GitHub Actions：CI/CD 自动化底座

### 4.1 GitHub Actions 的定位

GitHub Actions 是 GitHub 生态中的自动化执行平台，可用于：

- PR 检查。
- 自动化测试。
- 构建。
- 静态分析。
- 安全扫描。
- 依赖检查。
- 打包。
- 部署。
- 定时任务。
- 自动报告。

### 4.2 常见触发方式

| 触发方式 | 适用场景 |
|---|---|
| `pull_request` | PR 检查、测试、扫描 |
| `push` | 合并后构建、集成部署 |
| `workflow_dispatch` | 手动触发构建、发布、修复任务 |
| `schedule` | 每日/每周巡检、日报、依赖扫描 |
| `release` | 正式发布流程 |
| `issue_comment` | 通过评论触发 AI / Agent 工作流 |

### 4.3 PR 检查示例

```yaml
name: PR Check

on:
  pull_request:
    types: [opened, synchronize, reopened]

permissions:
  contents: read
  pull-requests: read
  security-events: write

jobs:
  test:
    runs-on: ubuntu-latest
    timeout-minutes: 20
    steps:
      - uses: actions/checkout@v4
      - name: Run tests
        run: |
          echo "Run project tests here"
```

### 4.4 Actions 安全原则

必须遵守：

- `GITHUB_TOKEN` 权限最小化。
- 每个 workflow 显式声明 `permissions`。
- 第三方 Action 尽量 pin 到版本或 commit SHA。
- PR from fork 不允许直接访问 secrets。
- 生产部署必须走 Environment Approval。
- self-hosted runner 不允许跑不可信 PR。
- artifact 设置保留周期。
- workflow 设置 timeout。
- 并发任务设置 concurrency，避免重复部署。
- 对 AI Action 设置最大轮数、触发条件和成本限制。

### 4.5 平台配置检查

Branch Protection、Repository Rulesets、Required reviewers、Required status checks、Environment required reviewers 等配置属于平台侧状态，普通本地 Git 仓库无法可靠判断。

如果团队允许配置即代码，可以在仓库中维护 `.github/settings.yml`、Terraform / OpenTofu 或等价配置文件，用于声明期望状态。示例：

```yaml
branches:
  - name: main
    protection:
      required_pull_request_reviews:
        required_approving_review_count: 1
        require_code_owner_reviews: true
      required_status_checks:
        strict: true
        contexts:
          - ci
```

但该文件只能表示期望状态，不能证明配置已应用到 GitHub。需要确认实际状态时，应使用 GitHub UI 或 API：

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

如果 API 返回权限不足，不应直接判定未配置，应由仓库管理员确认。

### 4.6 游戏项目中的 Actions 建议

游戏项目可在 Actions 或等效 CI 中增加：

- 配置表校验。
- 本地化 key 检查。
- 资源引用检查。
- 包体大小检查。
- Unity / Unreal 构建 smoke test。
- 自动化 PlayMode / EditMode 测试。
- 性能基线对比。
- 构建产物上传。

对于 Unreal 等构建资源消耗较高的项目，建议使用 self-hosted runner 或内部构建机，并限制触发条件。

---

## 5. CodeQL：代码安全与静态分析

### 5.1 CodeQL 的定位

CodeQL 用于对代码进行静态分析，发现潜在安全漏洞、缺陷模式和不符合约束的代码。

适合用于：

- PR 阶段安全扫描。
- main / develop 定期扫描。
- 高风险模块扫描。
- 自定义规则检测。

### 5.2 使用原则

- 高风险语言和核心仓库应启用 CodeQL。
- 严重问题应阻断合并。
- 误报需要记录和豁免。
- 自定义规则应逐步建设。
- CodeQL 不能替代人工安全审查。

### 5.3 游戏项目扩展方向

游戏项目可根据需要扩展规则：

- 主线程阻塞调用。
- 不合理内存申请。
- 不安全资源加载。
- 网络同步敏感逻辑。
- 安全敏感接口调用。
- 性能高风险代码模式。

---

## 6. Dependabot：依赖治理

### 6.1 Dependabot 的定位

Dependabot 用于自动发现依赖漏洞和可升级版本，并自动创建升级 PR。

适合用于：

- 第三方库漏洞修复。
- GitHub Actions 版本升级。
- 包管理依赖升级。
- 安全补丁提醒。

### 6.2 使用原则

- 安全升级优先处理。
- 重大版本升级必须人工评估。
- 依赖 PR 必须跑完整 CI。
- 关键依赖版本应锁定。
- 依赖升级不应自动绕过 Review。

### 6.3 能力区分

| 能力 | 作用 | 是否自动改主分支 |
|---|---|---|
| Vulnerability alerts / Dependabot alerts | 发现依赖漏洞并提醒维护者 | 否 |
| Dependabot security updates / automated security fixes | 对可修复漏洞自动创建安全升级 PR | 否 |
| Dependabot version updates | 按 `.github/dependabot.yml` 定期检查依赖或 GitHub Actions 新版本并创建 PR | 否 |

Vulnerability alerts 是告警能力；Dependabot security updates 是安全修复 PR 能力。二者都不会绕过 CI、Review 或 Branch Protection。

可用 GitHub API 启用前两项：

```bash
gh api --method PUT repos/<owner>/<repo>/vulnerability-alerts
gh api --method PUT repos/<owner>/<repo>/automated-security-fixes
```

可用以下命令确认状态：

```bash
gh api repos/<owner>/<repo>/vulnerability-alerts --include
gh api repos/<owner>/<repo>/automated-security-fixes --include
```

如果需要定期检查 GitHub Actions 版本，可添加 `.github/dependabot.yml`：

```yaml
version: 2
updates:
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
```

### 6.4 处理流程

```text
Dependabot 创建 PR
  ↓
CI 自动运行
  ↓
开发或负责人检查变更说明
  ↓
必要时本地验证
  ↓
Review 通过
  ↓
合并
```

---

## 7. Secret scanning 与密钥治理

### 7.1 目标

防止密钥、令牌、证书和密码进入仓库历史。

### 7.2 规则

禁止提交：

- API Key。
- Access Token。
- SSH 私钥。
- 数据库密码。
- 云服务密钥。
- 内部账号密码。
- 未脱敏日志。

必须使用：

- GitHub Secrets。
- GitHub Environments。
- OIDC。
- 云厂商临时凭证。
- 内部密钥管理服务。

### 7.3 泄漏处理流程

一旦发现密钥泄漏，应立即：

1. 撤销或轮换泄漏密钥。
2. 检查是否被使用。
3. 清理仓库历史或限制访问。
4. 创建安全事件记录。
5. 补充防护规则。

---

## 8. GitHub Copilot：AI 编程助手

### 8.1 Copilot 的定位

Copilot 适合作为开发者日常编码辅助工具，用于：

- 代码补全。
- 模板代码生成。
- 测试用例初稿。
- 代码解释。
- 小范围重构建议。
- PR 辅助说明。

### 8.2 使用原则

必须遵守：

- Copilot 只能辅助开发，不能替代开发者理解代码。
- 采纳建议前必须阅读和确认。
- 生成测试后必须检查断言是否有效。
- 不得让 Copilot 生成或处理敏感密钥。
- 关键逻辑必须人工 Review。
- AI 生成内容导致的问题由采纳者负责。

### 8.3 仓库上下文

建议维护：

```text
.github/copilot-instructions.md
```

内容可包含：

- 技术栈。
- 编码规范。
- 测试规范。
- 命名规范。
- 禁止事项。
- 项目架构约束。
- 性能要求。

---

## 9. Claude Code GitHub Actions：AI Agent 自动化

### 9.1 Claude Code GitHub Actions 的定位

Claude Code GitHub Actions 可通过 GitHub 事件触发，让 Claude 在 Issue 或 PR 中执行自动化任务。

适合用于：

- Issue 总结。
- PR 总结。
- PR 辅助审查。
- 小范围功能实现。
- Bug 修复建议。
- 测试生成。
- 构建失败分析。
- 日报或周报生成。

不适合直接用于：

- 绕过人工审查的自动合并。
- 生产发布决策。
- 大型架构重构最终决策。
- 处理未授权敏感信息。
- 核心玩法、商业化、网络同步、安全敏感逻辑的最终判断。

### 9.2 推荐触发方式

初期建议使用手动评论触发：

```text
@claude review this PR
@claude summarize this issue
@claude implement this small task
@claude generate tests for this change
```

不建议一开始对所有 PR 自动触发，避免：

- 评论噪音过多。
- 成本不可控。
- Reviewer 依赖 AI 而弱化人工判断。

### 9.3 基础配置示例

```yaml
name: Claude Code

on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]

permissions:
  contents: write
  pull-requests: write
  issues: write

jobs:
  claude:
    if: contains(github.event.comment.body, '@claude')
    runs-on: ubuntu-latest
    timeout-minutes: 30
    steps:
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          claude_args: "--max-turns 5"
```

### 9.4 安全要求

必须遵守：

- API Key 必须存储在 GitHub Secrets。
- workflow 必须显式声明最小权限。
- 设置 `max-turns`，避免失控迭代。
- 设置 job timeout。
- 重要变更必须人工确认。
- 不允许 Claude 绕过分支保护。
- 不允许 Claude 自动合并生产分支。
- 不允许 Claude 访问不必要的 secrets。

### 9.5 仓库上下文：CLAUDE.md

接入 Claude 的仓库建议包含：

```text
CLAUDE.md
```

模板：

```markdown
# CLAUDE.md

## 项目背景

## 技术栈

## 常用命令

## 编码规范

## 测试规范

## 禁止修改范围

## 安全要求

## PR 审查重点

## AI 输出要求
每次修改后必须说明：
- 修改了什么
- 为什么修改
- 如何验证
- 有什么风险
```

---

## 10. 自动日报 / 周报工具

### 10.1 数据来源

日报和周报应基于事实数据生成：

- Issue。
- PR / MR。
- Commit。
- Review。
- Actions / CI 结果。
- Release。

不建议依赖人工维护一个长期 todo issue。

### 10.2 推荐输出

日报可包含：

1. 昨日完成事项。
2. 昨日提交或合并的 PR。
3. 昨日参与的 Review。
4. 当前阻塞。
5. 今日计划。
6. 风险提醒。

### 10.3 Prompt 示例

```text
请基于昨天 00:00 到 23:59 的 GitHub 数据生成日报：
1. 我完成了哪些 Issue？
2. 我提交或合并了哪些 PR？
3. 我参与了哪些 Review？
4. 当前有哪些阻塞？
5. 今天计划处理哪些任务？

要求：
- 只基于 Issue、PR、Commit、Review 和 Actions 结果总结；
- 不编造未发生的工作；
- 输出为中文 Markdown。
```

---

## 11. GitHub REST API 自动化规范

面向日报机器人、Issue 聚合、PR 统计、自动分派工具等内部自动化工具，建议遵守 GitHub REST API 最佳实践。

### 11.1 基本原则

- 优先使用 Webhook，避免频繁轮询。
- 所有请求必须认证。
- 控制并发。
- 写操作限速。
- 正确处理 rate limit。
- 支持重试和指数退避。
- 使用分页 Link header。
- 使用 ETag / 条件请求。
- 不手动解析 URL。
- 记录错误。
- 连续错误要熔断。
- 不在日志中打印 token。

### 11.2 自动化工具规则

```text
自动化工具不得以高频轮询方式扫描所有仓库。
自动化工具必须支持 GitHub API 速率限制处理。
自动化工具的写操作必须具备幂等性。
自动化工具必须记录操作审计日志。
自动化工具不得使用个人长期 token 作为生产凭证。
```

---

## 12. 自动化工具落地顺序

建议按以下顺序接入：

### 第一阶段：基础质量门禁

- pre-commit。
- lint。
- unit test。
- PR Check Action。
- 分支保护。

### 第二阶段：安全与依赖治理

- Secret scanning。
- Dependabot。
- CodeQL。
- Actions 权限最小化。

### 第三阶段：构建与发布自动化

- 自动构建。
- 自动上传 artifact。
- 测试环境部署。
- release workflow。
- 手动审批 gate。

### 第四阶段：AI 辅助协作

- Copilot instructions。
- CLAUDE.md。
- Claude Code 手动触发。
- PR 总结。
- Issue 总结。
- 日报/周报自动化。

### 第五阶段：高级自动化

- 自动化 QA。
- 性能回归。
- 日志分析。
- 崩溃聚类。
- 发布风险分析。
- 项目级 Agent 协作。

---

## 13. 自动化工具接入 Checklist

新项目接入自动化工具时，应检查：

- [ ] pre-commit 或本地检查已配置。
- [ ] PR 阶段 CI 已配置。
- [ ] 核心分支已启用状态检查。
- [ ] workflow 显式配置 `permissions`。
- [ ] Secrets 未硬编码在 workflow 中。
- [ ] workflow 设置 timeout。
- [ ] 生产部署需要人工审批。
- [ ] Dependabot 已配置或有替代方案。
- [ ] CodeQL 已配置或有替代方案。
- [ ] 如接入 Copilot，已配置 instructions。
- [ ] 如接入 Claude Code，已配置 `CLAUDE.md`。
- [ ] AI Action 设置了触发条件和最大轮数。
- [ ] 自动化工具错误有告警或人工处理流程。
