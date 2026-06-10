# github-project-check

用于检查当前仓库是否符合团队 GitHub 研发协作规范的 Claude Code skill。

## 分发方式

该 skill 是自包含的，复制整个目录即可分发：

```text
.claude/skills/github-project-check/
  SKILL.md
  CHECKLIST.md
  RULES.md
  REPORT_TEMPLATE.md
  README.md
```

不依赖目标项目中的 `docs/*.md` 才能运行。

## 使用方式

在目标项目仓库中启动 Claude Code 后执行：

```text
/github-project-check
```

## 检查范围

- 仓库基础文件。
- README。
- Issue / PR 模板。
- CODEOWNERS。
- GitHub Actions。
- Secrets 风险。
- 大文件与构建产物。
- 文档沉淀。
- AI 工具接入准备。
- 需要平台侧确认的项目。

## 注意

该 skill 默认只做本地仓库静态检查。Branch Protection、Repository Rulesets、Secret scanning、Environment Approval、团队权限等平台配置需要 GitHub API、GitLab API 或管理员确认。

如果仓库存在 `.github/settings.yml`、Terraform / OpenTofu 等配置即代码文件，skill 可以检查其中是否声明了核心分支保护、PR review、Code Owner review、status checks 等期望配置。但这些文件只能表示期望状态，不能证明配置已成功应用到 GitHub 平台。

可选平台检查命令：

```bash
gh auth status
gh api repos/<owner>/<repo>/branches/<branch>/protection
gh api repos/<owner>/<repo>/rulesets
```
