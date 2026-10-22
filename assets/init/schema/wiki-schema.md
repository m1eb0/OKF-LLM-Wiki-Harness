# LLM Wiki Schema

本文件是仓库 LLM Wiki 的 schema（Karpathy 三层模式的第三层）。
它不是知识内容，而是 Agent 读写知识库的规则。

## Layers

```text
raw/     不可变原始资料
wiki/    OKF v0.1 合成知识 bundle
schema/  本文件：读写、链接、校验规则
```

## Raw rules

- `raw/` 只追加，不修改已摄取文件。
- 每个 raw source 保留原始 URL、日期、作者/来源和采集方式。
- 不在 `raw/` 里做总结；总结属于 `wiki/`。
- 不把密钥、token、完整 cookie、个人隐私写入 raw。
- 代码摘录优先记录 Git 路径和 commit，而不是复制大段代码。

## Wiki rules

- `wiki/` 是 OKF v0.1 bundle。
- 每个非保留 `.md` 文件是一个概念页。
- 每个概念页必须有 YAML frontmatter，且 `type` 非空。
- `index.md` / `log.md` 是保留文件名。
- 子目录 `index.md` 不加 frontmatter；只有根 `index.md` 可以声明 `okf_version`。
- 一个概念只有一个 canonical 页面；其他页面链接它，不复制。
- 使用普通 Markdown 链接表达关系；相对链接优先。
- 外部或内部依据放在 `# Citations`。

## Frontmatter

```yaml
---
type: System | Component | Concept | Decision | Runbook | Playbook | Metric | Incident | Source
title: Display Name
description: One-line summary.
domain: architecture
lifecycle: [develop, operate]
tags: [frontend, caching]
status: active | accepted | draft | needs-review | deprecated
owner: platform
resource: path/or/url
timestamp: 2026-10-22T00:00:00Z
verified_at: 2026-10-22T00:00:00Z
verified_commit: 5ce5521
---
```

`type` 必填；其余字段推荐。允许自定义字段，但不要删除未知字段。

`accepted` 只用于已接受的历史决策（如 ADR）。  
`verified_at` / `verified_commit` 只用于 `status: active` 的代码事实页。`verified_commit` 是最后一次对照代码验证时仓库中代码所在的 commit；不是 wiki 文档 commit。

## Canonical placement

```text
architecture/   系统逻辑、请求路径、组件边界、缓存、认证
platform/       部署拓扑、CI/CD、Cloudflare、cgroup、安全配置
operations/     SLO、值班、runbook、已知问题
product/        用户、内容生命周期、审核、通知
frontend/       路由、页面模式、性能预算、可访问性
backend/        API、读写路径、幂等、worker
data/           schema、迁移、搜索、备份
decisions/      ADR 与设计决策
sources/        外部依据摘要
lifecycle/      跨域导航，只链接 canonical 页面
```

若同一主题同时属于两个目录，按“它主要回答什么问题”选择一个 canonical 位置，另一个只链接。

## Naming

- 目录和文件使用 `kebab-case.md`。
- 概念 ID 是相对 `wiki/` 的路径去掉 `.md`。
- 不在文件名里放日期，除非该概念本身是事件/版本。

## Code Verification Gate

Wiki 不能凭记忆编写。代码是事实来源，`docs/` 是辅助材料。

### 写页面时

1. 先读相关代码/配置，不先凭记忆写。
2. 对每个关键声明记录代码路径或 commit。
3. 写完后重新打开对应代码/配置核对。
4. 记录：

```yaml
verified_at: <ISO 8601>
verified_commit: <git commit>
```

5. 页面必须有 `# Verification` 段，写清验证命令或检查点。

### 代码变化时

如果改动涉及页面的 `resource` 或 `# Code References`：

```text
更新页面
-> 更新 verified_at / verified_commit
-> 更新 # Verification
```

未重新验证时，页面必须改为：

```yaml
status: needs-review
```

不能让 `status: active` 的页面继续保持过时事实。

### 不允许的写法

```text
“我记得是这样”
“文档里大概说”
“应该会走 gateway”
```

除非有代码/配置/实测依据，否则写成 `Planned` / `Unknown`，并降低 status。

## Index and log

- 根 `wiki/index.md` 维护导航；修改结构时同步更新。
- 每个目录的 `index.md` 只做渐进式导航。
- `wiki/log.md` 按 `YYYY-MM-DD` 记录结构变更和重要 page 变更。
- 新概念、删除概念、重命名、canonical 迁移都必须写 log。

## Operations

### Ingest

1. 读取 raw source。
2. 在 `wiki/` 找到相关 canonical 页面。
3. 更新已有页面，而不是复制。
4. 缺页时从 `wiki/templates/` 创建。
5. 补链接和 Citations。
6. 更新 index/log。
7. 运行 `pnpm verify:wiki`。

### Query

1. 先读 `wiki/index.md`。
2. 按 domain/lifecycle/tags 找到候选概念。
3. 读 canonical 页面及其链接。
4. 需要核实时回 raw source。
5. 回答时引用 concept/raw 路径。

### Lint

```bash
pnpm verify:wiki
```

检查：

- 根 index 有 `okf_version`
- 子 index 没有 frontmatter
- 概念页有 `type`
- 保留文件名合法
- 可选：断链、过期 timestamp、缺失 Citations
- `status: active` 必须带 `verified_at` / `verified_commit` 和 `# Verification`

## Gates

提交 wiki 变更前：

```text
[ ] raw source 已记录且未修改旧 raw
[ ] 页面在正确 canonical 目录
[ ] frontmatter type 非空
[ ] index/log 已更新
[ ] citations 存在
[ ] 相关代码已重新打开核对
[ ] verified_at / verified_commit 已更新
[ ] # Verification 已写
[ ] pnpm verify:wiki 通过
```
