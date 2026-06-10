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
# Vulnerability alerts / Dependabot alerts: 204 表示已启用，404 可能表示未启用或权限不足。
gh api repos/<owner>/<repo>/vulnerability-alerts --include
# Dependabot security updates / automated security fixes: 204 表示已启用。
gh api repos/<owner>/<repo>/automated-security-fixes --include
```

可选启用依赖漏洞告警和自动安全修复 PR：

```bash
gh api --method PUT repos/<owner>/<repo>/vulnerability-alerts
gh api --method PUT repos/<owner>/<repo>/automated-security-fixes
```

说明：Vulnerability alerts / Dependabot alerts 负责发现依赖漏洞并提醒；Dependabot security updates / automated security fixes 负责在有可修复漏洞时自动创建安全升级 PR，不会自动绕过 CI、Review 或分支保护。若需要定期检查依赖或 GitHub Actions 版本，还应配置 `.github/dependabot.yml`。

可选启用 Branch Protection 的 API 模板如下。执行前必须确认当前账号拥有仓库 Admin 权限，并把 `<owner>`、`<repo>`、`<branch>` 和 required check 名称替换为目标项目实际值：

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
  "enforce_admins": true,
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

说明：API 成功返回只能证明本次请求已被平台接受；后续仍建议用 `gh api repos/<owner>/<repo>/branches/<branch>/protection` 或 GitHub UI 复核实际状态。
