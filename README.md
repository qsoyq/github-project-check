# github-project-check

`github-project-check` 是一套面向研发团队的 GitHub 协作治理规范与 Claude Code skills，用于检查项目仓库是否具备基本的 GitHub / GitLab 协作治理能力，并输出结构化整改报告。

本仓库既包含给团队阅读的规范文档，也包含可以通过 npm / npx 分发到其他项目的 Claude Code skills。

## 项目简介

本项目解决的问题：

- 统一团队对 GitHub / GitLab 协作治理的基本检查标准。
- 帮助项目快速发现 README、Issue、PR、CODEOWNERS、CI、安全和 AI 上下文缺口。
- 将检查逻辑封装成 Claude Code skill，方便在任意目标仓库中执行。
- 支持通过 `npx` 将内置 skills 安装到目标项目的 `.claude/skills/` 目录。
- 区分本地静态检查和 GitHub 平台侧配置确认，避免误判 Branch Protection、Secret scanning 等不可见状态。

当前内置两个 skill：

| Skill | 作用 |
|---|---|
| `github-project-check` | 扫描当前仓库并输出规范检查报告。 |
| `github-checklist` | 按场景输出研发协作 Checklist。 |

## 技术栈

本仓库以文档、Claude Code skill 和轻量安装 CLI 为主：

- Markdown：规范文档、README、模板和 skill 说明。
- YAML：GitHub Issue 模板配置、Settings app / Probot settings 期望配置、GitHub Actions workflow。
- Claude Code skills：`.claude/skills/*/SKILL.md` 及随 skill 分发的检查资料。
- Node.js：npm / npx CLI 安装脚本和最小本地验证脚本。
- GitHub Actions：基础仓库治理检查和 CLI 行为验证。

当前没有应用服务、前端构建或长期运行进程。

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
bin/
  github-project-check.js      # npx 安装 CLI
scripts/
  test-install.js              # CLI 本地验证脚本
docs/                          # GitHub 研发协作规范文档
CODEOWNERS                     # 代码所有者
CONTRIBUTING.md                # 贡献指南
SECURITY.md                    # 安全政策
package.json                   # npm package 配置
```

## 使用方式

### 通过 npx 安装 skills

在目标项目仓库目录执行：

```bash
npx github-project-check install
```

安装后会生成或补齐以下目录结构：

```text
.claude/
  skills/
    github-checklist/
      SKILL.md
      CHECKLISTS.md
      README.md
    github-project-check/
      SKILL.md
      CHECKLIST.md
      RULES.md
      REPORT_TEMPLATE.md
      README.md
```

默认目标目录是当前工作目录。也可以显式指定目标项目：

```bash
npx github-project-check install --target /path/to/target-project
```

如果希望安装到 Claude Code 用户级全局 skills 目录，可以把 target 指向用户 HOME 目录：

```bash
npx github-project-check install --target "$HOME"
```

如果跳过 npm registry、直接从 GitHub 安装到用户级全局 skills 目录：

```bash
npx github:qsoyq/github-project-check install --target "$HOME"
```

安装结果会位于：

```text
~/.claude/skills/
```

本仓库本地验证时可以执行：

```bash
npx . install --target /tmp/test-claude-skills
```

如果不写 `install`，CLI 也会默认执行安装：

```bash
npx github-project-check --target /path/to/target-project
```

也可以跳过 npm registry，直接从 GitHub 仓库安装。适合 npm 包尚未发布、需要验证某个分支，或希望直接使用仓库最新版本的场景：

```bash
# 使用默认分支
npx github:qsoyq/github-project-check install

# 使用指定分支、tag 或 commit
npx github:qsoyq/github-project-check#main install
npx github:qsoyq/github-project-check#v0.1.0 install
npx github:qsoyq/github-project-check#<commit-sha> install
```

如果目标环境不支持 `github:` spec，也可以使用 GitHub HTTPS URL：

```bash
npx git+https://github.com/qsoyq/github-project-check.git install
```

### 已存在同名 skill 时的处理策略

安装脚本默认是安全策略：如果目标项目中已经存在同名 skill，则跳过，不覆盖已有文件。

可选参数：

| 参数 | 行为 |
|---|---|
| `--dry-run` | 只打印计划操作，不写入文件。 |
| `--force` | 删除并重新安装本工具管理的同名 skill 目录。 |
| `--backup` | 先把已有同名 skill 目录改名为 `*.backup-<timestamp>`，再安装新版本。 |

示例：

```bash
# 查看会发生什么，不实际写入
npx github-project-check install --target /path/to/project --dry-run

# 覆盖本工具管理的同名 skill 目录
npx github-project-check install --target /path/to/project --force

# 备份已有同名 skill 后重新安装
npx github-project-check install --target /path/to/project --backup
```

安装脚本只会处理以下目录，不会删除整个 `.claude/skills/`：

```text
.claude/skills/github-checklist/
.claude/skills/github-project-check/
```

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

### 手动分发 skill

如果暂不使用 npm / npx，两个 skill 仍可整体复制到其他仓库：

```text
.claude/skills/github-project-check/
.claude/skills/github-checklist/
```

目标项目中的 `docs/*.md` 只能作为补充上下文，不能成为 skill 运行的必需依赖。

## 本地启动

本项目没有需要启动的服务。

维护文档和 CLI 时可使用：

```bash
git status --short
npm install
npm test
```

如需在临时目标目录中验证安装结果：

```bash
npx . install --target /tmp/test-claude-skills --force
find /tmp/test-claude-skills/.claude/skills -maxdepth 2 -type f | sort
```

## 测试方式

当前基础验证分为三类：

1. **仓库治理检查**：由 `.github/workflows/ci.yml` 执行，检查关键治理文件、skill 自包含文件、模板、README 章节、settings 期望配置、敏感文件名和大文件风险。
2. **CLI 行为验证**：执行 `npm test`，覆盖默认安装、重复安装跳过、`--force`、`--backup` 和 `--dry-run`。
3. **人工抽样验证**：在 Claude Code 中执行 `/github-project-check` 或 `/github-checklist`，确认输出符合预期。

提交 PR 前建议确认：

```bash
npm test
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
- `npx . install --target <tmp-dir>` 能正确安装两个内置 skills。

## 构建方式

当前项目无编译构建步骤。

npm package 可通过以下命令进行本地打包预检：

```bash
npm pack --dry-run
```

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
- 涉及 `.github/`、`.claude/skills/`、`bin/`、`scripts/`、`docs/` 的变更需要 owner 审查。
- 自动化检查失败时不应合并。

## 发布流程

当前发布以 npm / npx 分发和 skill 目录分发为主：

1. 创建 Issue 或在 PR 中说明发布目的。
2. 更新相关文档、skill 文件、CLI 或测试。
3. 运行本地检查：

   ```bash
   npm test
   npm pack --dry-run
   ```

4. 等待 GitHub Actions 通过。
5. 由 owner Review。
6. 合并到 `main`。
7. 如需要发布到 npm，确认包名、版本号和发布权限后执行：

   ```bash
   npm version patch
   npm publish --access public
   ```

8. 创建 GitHub Release / tag，并在 `docs/release/` 中记录重要发布说明。
9. 通知使用者通过 `npx github-project-check install --backup` 或 `--force` 重新安装。

回滚方式：

- 对文档、skill 或 CLI 变更，优先通过 revert PR 回滚。
- 对 npm 包问题，发布修复版本；如影响严重，可按 npm 规则 deprecate 问题版本。
- 对已分发的 skill，通知使用者恢复到上一个已验证版本或使用备份目录。

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
