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

## 和 github-project-check 的区别

- `github-checklist`：输出阶段性 Checklist，偏执行手册。
- `github-project-check`：扫描当前仓库并输出规范检查报告，偏项目审计。

## 注意

如果需要完整扫描当前仓库，请使用：

```text
/github-project-check
```
