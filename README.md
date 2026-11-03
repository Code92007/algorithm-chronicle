# 算竞纪事

一份以史书形式编排、以简短现代汉语书写的算法竞赛记录。纯静态网页，无前端框架、无运行时外部依赖，可直接部署到 GitHub Pages 的个人站点或项目子路径。

## 本地运行

需要 Python 3.10 或更新版本，无需安装第三方包。

```sh
python3 scripts/build.py
python3 scripts/serve.py
```

打开 http://127.0.0.1:4173 。不要直接双击 HTML：浏览器的本地文件限制会阻止加载赛事数据。

## 首辑内容

- 平台列传：UVa、POJ、SPOJ、HDU、Codeforces、AtCoder、洛谷。
- 赛事年表：2020—2025 年部分中国境内 ICPC 区域赛、CCPC 分站及总决赛、WF；可以按赛季、系列、学校与赛站查找。
- 公共议题：NOIP 暂停与恢复、银川站争议，以及 AtCoder 历史 AI 规则。
- 全书搜索、日读/夜读、阅读字号、单篇收藏和续读、奖项筛选、CSV 导出。

当前不是完整的东亚历年赛果数据库。没有核录的场次只提供来源入口。UI 对官方赛果、社区榜单重建与仅有索引的记录分别标注。2022—2024 届 WF 奖项核录自 ICPC 官方手册，2025 届核录自官方最终榜单；社区数据不自动提升为正式获奖公告。

## 内容与来源

- `data/editorial.js`：平台与议题正文、史料索引。
- `data/contests.json`：静态赛事数据，包含来源、版本、收录口径。
- `data/official-wf.json`：从 ICPC 官方手册逐项核录的奖牌学校。
- `scripts/import_archive.py`：从固定提交的 XCPCIO 数据生成索引；无法可靠解释的格式不生成奖项。
- `scripts/merge_official.py`：将官方 WF 奖项合入年表。2025 年榜单 HTML 作为显式参数传入，不隐式联网。
- `docs/import-report.json`：社区数据导入结果，官方核录在其后另行合入。
- `docs/EDITORIAL.md`：编纂、来源和后续补录约定。

正文以事实与日期为主。讨论入口本身不是证据或裁决；无法读取的知乎与微博原页不转述具体回答。赛事年份与实际比赛日期分列。名次、罚时等未核录字段使用 `null`，页面显示为“—”。

社区数据基于 [XCPCIO / board-data](https://github.com/xcpcio/board-data)，许可证保留在 `docs/XCPCIO-LICENSE.txt`。官方奖项见 [ICPC 2025 官方手册](https://icpc.global/community/history/brochures/world-finals-2025-brochure.pdf)与 [2025 最终榜单](https://worldfinals.icpc.global/scoreboard/2025/finals/)。逐篇来源也可在网页内查阅。

## 检查

```sh
python3 -m unittest discover -s tests -v
```

数据重建测试覆盖正式组排除、罚时、重复提交、平分、未判定状态和未指定奖项配置；档案检查覆盖届次与日期分离及官方 WF 奖项。

## 后续发布到 GitHub Pages

项目准备了 `.github/workflows/pages.yml`，尚未关联远端或发布。后续创建仓库后，在 Settings → Pages 选择 GitHub Actions，推送 `main` 即可构建并发布。

资源全部使用相对路径，页面导航使用 hash；同时兼容 `username.github.io/` 和 `username.github.io/algorithm-chronicle/`。现有个人主页可继续保留，项目部署位置在推送前决定。

## 许可

项目代码采用 MIT。引用与第三方数据保留各自权利，不复制知乎回答或完整文章。
