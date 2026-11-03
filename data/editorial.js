export const updated = '2026.11.03';

export const sources = [
  { id: 'uva-paper', title: 'Competitive Learning in Informatics: The UVa Online Judge Experience', publisher: 'Olympiads in Informatics，2008，第 2 卷', url: 'https://ioi.te.lv/oi/pdf/INFOL035.pdf', type: '研究文献', note: '系统建设者对 UVa OJ 的回顾，含 1997 年开放及首份提交记录。' },
  { id: 'poj-pku', title: '程序在线评测（POJ）系统', publisher: '北京大学计算机实验教学中心', url: 'https://center.pku.edu.cn/zxts/pojxt/index.htm', type: '高校资料', note: '校方介绍 POJ 的教学用途，并列举 2003—2006 年的赛事。页面中的规模数字属于当时记录。' },
  { id: 'spoj', title: 'Goodbye Pyramid', publisher: 'SPOJ', url: 'https://www.spoj.com/', type: '平台公告', note: '平台对 2004 年启动、评测集群更换和 2015 年旧集群退役的说明。' },
  { id: 'hdu', title: '十年的专注与坚守，只为一个育人梦', publisher: '杭州电子科技大学', url: 'https://www.hdu.edu.cn/news/2014/0520/c8223a187978/page.htm', type: '高校资料', note: '2014 年校方报道记载：刘春英于 2005 年牵头搭建杭电 ACM 在线测试系统。' },
  { id: 'cf-first', title: 'Codeforces Beta Round 1', publisher: 'Codeforces', url: 'https://codeforces.com/contest/1', type: '原始赛页', note: '首轮比赛及其题目档案。' },
  { id: 'cf-ten', title: 'Codeforces 10 years!', publisher: 'Codeforces / Mike Mirzayanov', url: 'https://codeforces.com/10years', type: '平台回顾', note: '创办者的十周年回顾及平台众筹说明。' },
  { id: 'atcoder-first', title: 'AtCoder Regular Contest 001', publisher: 'AtCoder', url: 'https://atcoder.jp/contests/arc001', type: '原始赛页', note: '2012 年 4 月赛页保留了因服务器故障取消比赛的公告。' },
  { id: 'atcoder-company', title: 'Company', publisher: 'AtCoder', url: 'https://atcoder.jp/company?lang=en', type: '机构资料', note: '记载公司成立日期为 2012 年 6 月 20 日。公司成立与赛事上线是不同事件。' },
  { id: 'luogu', title: '关于洛谷', publisher: '洛谷帮助中心', url: 'https://help.luogu.com.cn/about-us', type: '平台资料', note: '记载洛谷创建日期及运营公司成立时间。' },
  { id: 'noip-pause', title: 'CCF 关于暂停 NOIP 竞赛的公告', publisher: '中国计算机学会', url: 'https://www.ccf.org.cn/c/2019-08-16/668158.shtml', type: '正式公告', note: '2019 年 8 月 16 日公告；原文以“由于某种原因”说明暂停，未给出具体原因。原站可能限制访问。' },
  { id: 'noip-resume', title: 'CCF 关于恢复 NOIP 竞赛的公告', publisher: 'NOI 官网 / 中国计算机学会', url: 'https://www.noi.cn/xw/2020-01-21/715520.shtml', type: '正式公告', note: '2020 年 1 月 21 日宣布恢复 NOIP。' },
  { id: 'noip-report', title: '全国青少年信息学奥林匹克联赛停办或殃及少儿编程创业者', publisher: 'IT之家', url: 'https://www.ithome.com/0/439/761.htm', type: '新闻报道', note: '仅用于佐证当时知乎讨论的存在，不采用其升学政策表述。' },
  { id: 'yinchuan-statement', title: 'The 2020 ICPC Asia Yinchuan Regional Programming Contest', publisher: '赛事题面 / Codeforces Gym', url: 'https://codeforces.com/gym/104022/attachments/download/17741/yinchuan-2020-onsite-statement.pdf', type: '原始题面', note: '题面记载实际比赛日期为 2021 年 5 月 16 日。' },
  { id: 'yinchuan-index', title: '银川站公开材料目录', publisher: 'awesome-iupc2021 社区仓库', url: 'https://github.com/awesome-iupc2021/awesome-iupc2021', type: '社区材料', note: '由持质疑立场的社区成员整理，包含知乎讨论、代码比对和回应入口；不是独立调查或裁决。' },
  { id: 'yinchuan-question', title: '关于银川站成绩的知乎讨论', publisher: '知乎', url: 'https://www.zhihu.com/question/459857672', type: '讨论原页', note: '链接由公开材料目录定位；本次未能直接读取知乎正文，不转述具体回答。' },
  { id: 'yinchuan-response', title: '银川站回应相关的知乎讨论', publisher: '知乎', url: 'https://www.zhihu.com/question/460422916', type: '讨论原页', note: '仅保留讨论入口；问题标题不作为事实裁决。知乎可能要求登录。' },
  { id: 'yinchuan-weibo', title: '2021 年 5 月 28 日回应入口', publisher: '微博（社区目录所列）', url: 'https://m.weibo.cn/detail/4641772397658140', type: '待核原页', note: '保留与质疑材料并列的回应入口，本次未核验原文，不据此总结调查结论。' },
  { id: 'ai-rule', title: 'AtCoder Rules against Generative AI — Version 20251003', publisher: 'AtCoderInfo', url: 'https://info.atcoder.jp/entry/llm-rules-en-20251003', type: '版本规则', note: '历史规则版本。只用于说明 2025 年 10 月的规则，不作为当前全部赛事的参赛指引。' },
  { id: 'xcpcio', title: 'XCPCIO / board-data', publisher: 'XCPCIO 社区', url: 'https://github.com/xcpcio/board-data', type: '社区档案', note: '赛事索引、配置和提交记录来源。年表固定到具体 Git 提交，奖牌区间按该版本重建。' },
  { id: 'wf2024', title: 'World Finals 2024', publisher: 'ICPC News', url: 'https://news.icpc.global/wf2024/', type: '官方赛果', note: '确认 2024 年阿斯塔纳世界总决赛冠军为北京大学 Naive Birds 队。' },
  { id: 'wf2025', title: '49th ICPC World Finals Baku — Final Scoreboard', publisher: 'ICPC World Finals', url: 'https://worldfinals.icpc.global/scoreboard/2025/finals/', type: '官方榜单', note: '2025 年巴库世界总决赛最终排名与奖牌标记，可交叉核对社区存档。' },
  { id: 'wf-brochure', title: 'ICPC World Finals Baku 2025 Brochure — Recent medal winners', publisher: 'ICPC', url: 'https://icpc.global/community/history/brochures/world-finals-2025-brochure.pdf', type: '官方手册', note: '第 22 页列出 2021—2024 届 WF 奖牌学校。本书核录其中 2022—2024 届；未核录的名次、解题数与罚时留空。' },
  { id: 'ccpc-results', title: '历年比赛结果', publisher: 'CCPC', url: 'https://www.iccpc.cn/results', type: '官方索引', note: 'CCPC 官方成绩与获奖文件入口。与社区榜单有差异时，应核对对应赛站的最终获奖文件。' },
];

export const platforms = [
  {
    id: 'uva', name: 'UVa Online Judge', short: 'UVa', year: '1997', region: '西班牙', tag: '早期在线评测',
    deck: '从大学课程走向公开题库。',
    paragraphs: ['1997 年，UVa Online Judge 向外部用户开放。建设者的回顾文章记载，系统首份提交的时间为 4 月 15 日 14:31:48 UTC。', '系统最初服务于巴利亚多利德大学的算法教学，随后提供公开题库和在线评测。这一记录说明了早期 OJ 与大学课程之间的联系。'],
    milestones: [{date:'1997.04.15',text:'开放初期的首份提交留下时间记录。'},{date:'2008',text:'建设者发表回顾文章，记录系统的教学与竞赛用途。'}], sources: ['uva-paper'],
  },
  {
    id: 'poj', name: '北京大学 Online Judge', short: 'POJ', year: '2000年代', region: '中国', tag: '高校题库',
    deck: '校内教学、训练与公开竞赛共用的评测系统。',
    paragraphs: ['北京大学计算机实验教学中心自主研发 POJ，用于程序设计教学、练习和在线比赛。校方介绍列出了 2003 年以来的北京大学程序设计竞赛记录。', '2004 年、2005 年的 ACM 亚洲区预选赛网上预赛也使用了该系统。本条以校方列举的赛事为时间依据，尚未核录精确的建站日期。'],
    milestones: [{date:'2003',text:'校方资料列有当年北京大学程序设计竞赛。'},{date:'2004—2005',text:'承载 ACM 亚洲区预选赛网上预赛。'}], sources: ['poj-pku'],
  },
  {
    id: 'spoj', name: 'Sphere Online Judge', short: 'SPOJ', year: '2004', region: '波兰', tag: '多语言评测',
    deck: '题库之外，也留下了评测硬件更换的记录。',
    paragraphs: ['SPOJ 于 2004 年开始运行。平台回顾记载，早期使用的评测机器名为 Cones，随后换为 Pyramid 集群。', '2015 年 3 月 2 日，Pyramid 完成最后一次评测并退役。迁移期间，平台通过抽样重测调整运行时间，尽量保持不同硬件下的时限关系。'],
    milestones: [{date:'2004',text:'平台开始运行。'},{date:'2012',text:'Cube 集群开始承担评测任务。'},{date:'2015.03.02',text:'Pyramid 集群退役。'}], sources: ['spoj'],
  },
  {
    id: 'hdu', name: '杭州电子科技大学 OJ', short: 'HDU', year: '2005', region: '中国', tag: '高校题库',
    deck: '围绕高校集训建设的在线测试系统。',
    paragraphs: ['杭州电子科技大学 2014 年的校方报道记载，刘春英于 2005 年牵头搭建杭电 ACM 在线测试系统。', '该系统与学校的竞赛训练同步建设。这里采用校方记载的搭建年份，不把学校开始参加 ACM 竞赛的年份写作 OJ 的创建年份。'],
    milestones: [{date:'2005',text:'刘春英牵头搭建杭电 ACM 在线测试系统。'},{date:'2014',text:'校方报道回顾系统建设经过。'}], sources: ['hdu'],
  },
  {
    id: 'codeforces', name: 'Codeforces', short: 'CF', year: '2010', region: '俄罗斯', tag: '竞赛与社区',
    deck: '定期比赛、评分系统与社区文章并行发展。',
    paragraphs: ['2010 年，Mike Mirzayanov 创办 Codeforces。首轮 Beta Round 1 的赛页保留了 Theatre Square、Spreadsheet 等题目。', '十周年回顾记载，平台当时已举办七百余场轮次及公开比赛，评测提交超过六千万次。创办者同时发起众筹，用于支持平台运行与开发。'],
    milestones: [{date:'2010.02.19',text:'举办 Codeforces Beta Round 1。'},{date:'2020',text:'发布十周年回顾，并开展平台众筹。'}], sources: ['cf-first','cf-ten'],
  },
  {
    id: 'atcoder', name: 'AtCoder', short: 'AtCoder', year: '2012', region: '日本', tag: '系列竞赛',
    deck: '从早期赛页到持续更新的竞赛规则。',
    paragraphs: ['2012 年 4 月，ARC 001 因服务器故障取消；原赛页保留了公告，题目作为练习开放。同年 6 月 20 日，AtCoder 公司成立。', '平台后来组织 ABC、ARC、AGC 等系列竞赛。2025 年 10 月公布的生成式 AI 规则版本，对这些系列赛中的 AI 使用作出限制。'],
    milestones: [{date:'2012.04',text:'ARC 001 因服务器故障取消，题目保留为练习。'},{date:'2012.06.20',text:'AtCoder 公司成立。'},{date:'2025.10.03',text:'发布一版适用于 ABC、ARC、AGC 的生成式 AI 规则。'}], sources: ['atcoder-first','atcoder-company','ai-rule'],
  },
  {
    id: 'luogu', name: '洛谷', short: '洛谷', year: '2013', region: '中国', tag: '题库与学习社区',
    deck: '以中文题库、训练工具和社区承载竞赛学习。',
    paragraphs: ['洛谷帮助中心记载，洛谷创建于 2013 年 6 月 15 日，提供算法题库、在线评测、社区与学习功能。', '2018 年，上海洛谷网络科技有限公司成立。平台还发展出网校、题目练习和面向机构的服务；网站创建与公司成立分别记载。'],
    milestones: [{date:'2013.06.15',text:'洛谷创建并开始运营。'},{date:'2018',text:'上海洛谷网络科技有限公司成立。'}], sources: ['luogu'],
  },
];

export const issues = [
  {
    id: 'noip-2019', year: '2019—2020', category: '赛事调整', status: '公告可核对', title: 'NOIP 的暂停与恢复',
    deck: '2019 年宣布暂停，2020 年宣布恢复。暂停公告没有说明具体原因。',
    facts: ['2019 年 8 月 16 日，CCF 宣布 NOIP 普及组及提高组从当年起暂停。公告使用“由于某种原因”的表述。', '2020 年 1 月 21 日，CCF 宣布恢复 NOIP；公告提到可能获得有关部门的经费资助。'],
    context: '当时的新闻报道记录了知乎上的相关讨论。讨论涉及备赛安排及赛事后续，但这些讨论不能补充为暂停公告未说明的原因。',
    boundary: '不把“暂停”写成永久停办，也不根据恢复公告倒推出暂停的唯一原因。',
    timeline: [{date:'2019.08.16',text:'CCF 发布暂停公告。'},{date:'2020.01.21',text:'CCF 发布恢复公告。'}], sources:['noip-pause','noip-resume','noip-report'],
  },
  {
    id: 'yinchuan-2021', year: '2021', category: '赛务争议', status: '裁决文件未核录', title: '银川站的成绩与规则执行争议',
    deck: '保留比赛、质疑材料和回应入口；不把讨论帖作为裁决。',
    facts: ['2020 赛季 ICPC 银川区域赛于 2021 年 5 月 16 日举行，日期见原始题面。', '赛后，知乎出现围绕部分队伍成绩与规则执行的讨论。社区材料目录汇集了代码比对、讨论帖及回应链接。'],
    context: '材料目录由持质疑立场的社区成员整理。本条仅记载公开讨论及材料入口的存在。知乎与微博原页本次未能完整核验，因此不转述具体回答，不总结回应结论。',
    boundary: '首辑尚未核录可据以定性的正式裁决文件，不认定具体人员或队伍违规。年表中该场仅保留索引。',
    timeline:[{date:'2021.05.16',text:'银川区域赛举行，属于 2020 赛季。'},{date:'2021.05',text:'公开讨论与材料整理出现；回应入口另列。'}], sources:['yinchuan-statement','yinchuan-index','yinchuan-question','yinchuan-response','yinchuan-weibo'],
  },
  {
    id: 'atcoder-ai-2025', year: '2025', category: '规则沿革', status: '历史版本', title: '生成式 AI 的参赛边界',
    deck: '以 AtCoder 的一份历史规则为例，记录允许与禁止的范围。',
    facts:['2025 年 10 月 3 日版规则原则上禁止在进行中的 ABC、ARC、AGC 使用生成式 AI，并为规定格式的题面翻译保留例外。', '该版本也适用于上述赛事的非计分参与者，不适用于赛后练习；AHC 另有规则。'],
    context:'这是规则沿革条目。当前首辑未核录对应的知乎热议原帖，因此不标记为“知乎热议”，也不归纳未经来源支持的公众立场。',
    boundary:'这里只介绍 2025 年 10 月的历史版本。不同系列、时间和比赛的规则不可直接互相套用。',
    timeline:[{date:'2025.10.03',text:'AtCoder 发布该版生成式 AI 规则。'}], sources:['ai-rule'],
  },
];

export const milestones = [
  {year:'1997',label:'UVa 开放',text:'公开题库与在线评测。',route:'/platform/uva'},
  {year:'2004',label:'SPOJ 运行',text:'多语言在线评测平台。',route:'/platform/spoj'},
  {year:'2010',label:'Codeforces 首轮',text:'定期比赛与评分。',route:'/platform/codeforces'},
  {year:'2012',label:'AtCoder 早期赛事',text:'系列竞赛的早期记录。',route:'/platform/atcoder'},
  {year:'2013',label:'洛谷创建',text:'中文题库与学习社区。',route:'/platform/luogu'},
  {year:'2024',label:'北京大学获 WF 冠军',text:'阿斯塔纳世界总决赛。',route:'/contests?series=WF&year=2024'},
];
