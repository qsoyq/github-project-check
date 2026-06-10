# 安全政策

## 支持范围

当前仓库维护 GitHub 研发协作规范文档和 Claude Code skills。安全关注重点包括：

- skill 检查规则是否可能误导用户暴露敏感信息。
- GitHub Actions、权限、Secrets、分支保护相关示例是否安全。
- 仓库是否误提交密钥、私钥、未脱敏日志或生产配置。
- AI / Agent 使用说明是否包含越权、绕过审查或泄漏数据风险。

## 报告安全问题

如果发现安全问题，请优先私下联系仓库 owner 或维护团队，不要在公开 Issue、PR、评论中粘贴密钥、token、私钥或漏洞利用细节。

当前仓库 owner 见 `CODEOWNERS`。如果该仓库迁移到组织下，请将本文件中的报告渠道更新为组织安全邮箱或私有安全报告入口。

报告时建议提供：

- 受影响文件路径。
- 风险类型。
- 复现或判断依据。
- 建议修复方式。

不要提供真实密钥值；如必须说明，请只提供脱敏后的前后缀。

## 处理流程

维护者收到报告后应：

1. 确认影响范围。
2. 如涉及真实凭证，立即撤销或轮换。
3. 移除仓库中的敏感内容，必要时处理 Git 历史。
4. 补充 `.gitignore`、CI 检查或文档防护。
5. 在 `docs/postmortems/` 或私有安全记录中沉淀复盘。

## Secrets 要求

禁止将以下内容提交到仓库：

- API Key、Access Token、OAuth token。
- SSH 私钥、证书私钥、`.pem`、`.key`。
- 数据库密码、云服务密钥、服务账号 JSON。
- 未脱敏日志、生产环境配置、内部敏感资料。

需要在自动化中使用凭证时，应使用 GitHub Secrets、GitHub Environments、OIDC 或组织批准的密钥管理服务。

## GitHub 平台侧安全能力

以下状态无法仅通过本地仓库证明，需要管理员通过 GitHub UI 或 API 确认：

- Branch Protection 或 Repository Rulesets 是否覆盖 `main`。
- Required status checks 是否配置。
- CODEOWNERS review 是否被强制要求。
- Secret scanning 是否开启。
- Push protection 是否开启。
- Dependabot alerts 是否开启。
- Code scanning 是否开启。
- GitHub App / Claude Code App 的实际权限范围。

可选检查命令：

```bash
gh auth status
gh api repos/qsoyq/github-project-check/branches/main/protection
gh api repos/qsoyq/github-project-check/rulesets
```

如果 API 返回权限不足或 404，不要直接判断未配置，应由仓库管理员确认。
