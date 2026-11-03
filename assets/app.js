import { platforms, issues, sources, milestones, updated } from '../data/editorial.js';

const main = document.querySelector('main');
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeRead = key => { try { return localStorage.getItem(key); } catch { return null; } };
const safeWrite = (key, value) => { try { localStorage.setItem(key, value); } catch {} };
const href = route => `#${route}`;
const link = (route, label, cls = '') => `<a class="${cls}" href="${escape(href(route))}">${label}</a>`;
const external = (url, label) => `<a href="${escape(url)}" target="_blank" rel="noopener noreferrer">${escape(label)} ↗</a>`;
const medals = { gold:'金牌', silver:'银牌', bronze:'铜牌' };
const seriesNames = { ICPC:'ICPC', CCPC:'CCPC', WF:'世界总决赛' };
const stationAliases = {yinchuan:'银川',nanjing:'南京',jinan:'济南',chengdu:'成都',shanghai:'上海',shenyang:'沈阳',hangzhou:'杭州',hongkong:'香港',macau:'澳门',kunming:'昆明',wuhan:'武汉',xian:'西安',hefei:'合肥',harbin:'哈尔滨',zhengzhou:'郑州',chongqing:'重庆',qinhuangdao:'秦皇岛',guilin:'桂林',weihai:'威海',guangzhou:'广州',shenzhen:'深圳',changchun:'长春',mianyang:'绵阳'};
const contestTerms = c => `${c.title} ${c.year} ${c.date} ${seriesNames[c.series]} ${stationAliases[c.id.split('-').at(-1)]||''} ${c.winners.map(w=>`${w.school} ${w.team}`).join(' ')}`.toLocaleLowerCase();
let archive = { contests: [], revision: '', method: '' };
let archiveFailed = false;
let activeContest = null;
let toastTimer;
let searchIndex = [];

if (safeRead('chronicle-theme') === 'dark') document.documentElement.dataset.theme = 'dark';
document.documentElement.style.setProperty('--reading-size', `${Math.min(24, Math.max(16, Number(safeRead('chronicle-font')) || 18))}px`);
updateThemeLabel();

function updateThemeLabel() {
  const button = document.querySelector('[data-action=theme]');
  const dark = document.documentElement.dataset.theme === 'dark';
  button.textContent = dark ? '日读' : '夜读';
  button.setAttribute('aria-label', dark ? '切换日读模式' : '切换夜读模式');
}
function toast(message) {
  const node = document.getElementById('toast');
  clearTimeout(toastTimer); node.textContent = message; node.classList.add('visible');
  toastTimer = setTimeout(() => node.classList.remove('visible'), 2000);
}
function heading(number, title, description, extra = '') {
  return `<header class="page-heading"><span class="eyebrow">${number}</span><h1>${title}</h1><p>${description}</p>${extra}</header>`;
}
function breadcrumb(label, route, current) {
  return `<div class="breadcrumb">${link('/', '总览')}<span>/</span>${link(route, escape(label))}<span>/</span><span>${escape(current)}</span></div>`;
}
function sourceList(ids = sources.map(s => s.id), catalog = false) {
  return `<ol class="source-list ${catalog ? 'source-catalog' : ''}">${ids.map((id,i) => {
    const s = sources.find(s => s.id === id);
    if (!s) return '';
    return `<li class="source-item"><span class="source-index">${String(i+1).padStart(2,'0')}</span><div>${external(s.url, s.title)}<br><small>${escape(s.publisher)} · ${escape(s.type)}</small><p>${escape(s.note)}</p></div></li>`;
  }).join('')}</ol>`;
}
function chronology(rows) {
  return `<div class="milestone-list">${rows.map(m => `<div class="milestone-row"><time>${escape(m.date)}</time><p>${escape(m.text)}</p></div>`).join('')}</div>`;
}
function renderHome() {
  const hasData = archive.contests.length;
  const recent = [
    {date:'2024',title:'北京大学在阿斯塔纳获 WF 冠军',text:'第 48 届世界总决赛 · 官方赛果',route:'/contest/icpc-48th-world-finals'},
    {date:'2021',title:'银川站的成绩与规则执行争议',text:'公开讨论、材料入口与记录边界',route:'/issue/yinchuan-2021'},
    {date:'2010',title:'Codeforces：从首轮比赛开始',text:'平台列传 · 第五篇',route:'/platform/codeforces'},
  ];
  const last = safeRead('chronicle-last');
  let resume = '';
  try { const r = JSON.parse(last); if(r?.route && r?.title && /^\/(platform|issue|contest)\/[a-z0-9-]+$/.test(r.route)) resume = link(r.route, `继续阅读：${escape(r.title)} →`, 'text-link'); } catch {}
  main.innerHTML = `<section class="hero"><div class="hero-copy"><div class="eyebrow">算法竞赛的记录与回望</div><h1>算竞纪事</h1><p class="hero-subtitle">从题库到赛场</p><p class="hero-description">记录在线评测平台的沿革，<br>整理历年赛事与奖项，留存公共讨论。<br>以简短的文字，连接散落的竞赛史料。</p><div class="hero-actions">${link('/platforms','翻开此书 <span>→</span>','primary')}${link('/about','编纂说明 <span>↗</span>','text-link')}</div><div class="hero-footnote">平台 · 赛事 · 议题 &nbsp; / &nbsp; 首辑 ${updated}</div>${resume ? `<div style="margin-top:15px">${resume}</div>`:''}</div><div class="book-art" aria-label="书页装帧：UVa 于 1997 年开放，Codeforces 于 2010 年举办首轮，洛谷于 2013 年创建，北京大学于 2024 年获 WF 冠军"><div class="book-page"><div class="book-inner"><div class="book-title"><strong>竞赛沿革</strong><span>首辑 · 总览</span></div><div class="book-columns" aria-hidden="true"><div class="book-column"><span class="book-year">1997</span><span class="book-words">UVa 公开评测</span></div><div class="book-column"><span class="book-year">2010</span><span class="book-words">CF 首轮</span></div><div class="book-column"><span class="book-year">2013</span><span class="book-words">洛谷创建</span></div><div class="book-column"><span class="book-year">2024</span><span class="book-words">北大获世界冠军</span></div></div><div class="book-bottom"><span>平台有沿革 · 赛事有年表</span><div class="stamp" aria-hidden="true"><span>算</span><span>竞</span><span>纪</span><span>事</span></div></div></div></div><span class="book-caption" aria-hidden="true">从一份提交，到一段共同的记忆</span></div><span class="hero-edition">VOLUME I &nbsp; / &nbsp; AN OPEN CHRONICLE</span></section>
  <section class="section"><div class="section-heading"><h2>全书目录 <small>CONTENTS</small></h2><span class="small-cap">三卷 · 持续编纂</span></div><div class="volumes">${[
    {n:'卷一',title:'平台列传',text:'从早期高校题库，到定期比赛与学习社区。',meta:`${platforms.length} 个平台 · 按时间阅读`,route:'/platforms'},
    {n:'卷二',title:'赛事年表',text:'按赛季与赛站检索 ICPC、CCPC 和世界总决赛。',meta:hasData ? `${archive.contests.length} 场赛事索引 · 来源逐场标注` : '赛事档案 · 来源逐场标注',route:'/contests'},
    {n:'卷三',title:'公共议题',text:'记录争议的经过、材料与回应，注明尚未核实之处。',meta:`${issues.length} 个条目 · 事实与说法分列`,route:'/issues'},
  ].map(v => link(v.route,`<span class="volume-no">${v.n}</span><div class="volume-title"><h3>${v.title}</h3><span>↗</span></div><p>${v.text}</p><span class="volume-meta">${v.meta}</span>`,'volume')).join('')}</div></section>
  <section class="section timeline-section"><div class="section-heading"><h2>时间的线索 <small>SELECTED MILESTONES</small></h2>${link('/sources','循源查阅 <span>→</span>','text-link')}</div><div class="timeline">${milestones.map(m => link(m.route,`<span class="timeline-year">${m.year}</span><h3>${m.label}</h3><p>${m.text}</p>`,'timeline-point')).join('')}</div></section>
  <section class="section home-bottom"><div><div class="section-heading"><h2>选读 <small>FROM THE ARCHIVE</small></h2></div>${recent.map(r => link(r.route,`<span class="entry-date">${r.date}</span><div><h3>${r.title}</h3><p>${r.text}</p></div><span class="arrow">↗</span>`,'entry-row')).join('')}</div><aside class="editor-note"><span class="eyebrow">关于这份记录</span><h3>有出处，也有留白。</h3><p>官方公告、原始榜单与社区讨论，分别注明来源。没有核实的结论，不用推测补齐。<br><br>这是首辑，收录范围仍在扩充。现有年表以中国境内赛站为主，尚未覆盖东亚全部赛站与所有年份。</p>${link('/about','查看收录范围 <span>→</span>','text-link')}</aside></section>`;
}
function renderPlatforms() {
  main.innerHTML = `<div class="page-shell">${heading('卷一 / PLATFORMS','平台列传','题库、比赛与社区各有来路。这里按可核对的时间线索，简记七个平台的早期记录与后续变化。')}<div class="platform-grid">${platforms.map((p,i) => link(`/platform/${p.id}`,`<span class="platform-year ${p.year.length>4?'long':''}">${p.year}</span><span class="small-cap">${String(i+1).padStart(2,'0')} / ${p.region}</span><h2>${p.name}</h2><p>${p.deck}</p><div class="card-foot"><span>${p.tag} · ${p.sources.length} 份参考资料</span><span>阅读全文 ↗</span></div>`,'platform-card')).join('')}</div></div>`;
}
function recordReading(route, title) { safeWrite('chronicle-last',JSON.stringify({route,title})); }
function readingAside(collection, kind, current) {
  return `<aside class="reading-aside"><div class="aside-sticky"><div class="aside-label">${kind==='platform'?'本卷目录':'议题目录'}</div>${collection.map(p => link(`/${kind}/${p.id}`,escape(p.short||p.title),p.id===current?'active':'')).join('')}<div class="reading-controls"><button data-action="font-smaller" aria-label="减小正文字号">A−</button><button data-action="font-larger" aria-label="增大正文字号">A＋</button><button data-action="bookmark" data-route="/${kind}/${current}">${isBookmarked(`/${kind}/${current}`)?'已收藏':'收藏'}</button></div></div></aside>`;
}
function nextArticles(collection, kind, id) {
  const i=collection.findIndex(p=>p.id===id), prev=collection[i-1], next=collection[i+1];
  return `<div class="article-next">${prev?link(`/${kind}/${prev.id}`,`← ${escape(prev.short||prev.title)}`):link(kind==='platform'?'/platforms':'/issues','← 返回本卷')}${next?link(`/${kind}/${next.id}`,`${escape(next.short||next.title)} →`):link('/','回到总览 →')}</div>`;
}
function renderPlatform(id) {
  const p=platforms.find(p=>p.id===id); if(!p)return renderNotFound();
  recordReading(`/platform/${id}`,p.name);
  main.innerHTML=`<div class="page-shell">${breadcrumb('平台列传','/platforms',p.short)}<div class="reading-layout">${readingAside(platforms,'platform',id)}<article><header class="article-header"><span class="eyebrow">平台列传 / ${p.year}</span><h1>${p.name}</h1><p class="deck">${p.deck}</p><div class="article-meta"><span>${p.region} · ${p.tag}</span><span>${p.sources.length} 份参考资料</span><span>核录于 ${updated}</span></div></header><div class="article-body">${p.paragraphs.map(t=>`<p>${t}</p>`).join('')}<h2>沿革简表</h2>${chronology(p.milestones)}<h2>参考资料</h2>${sourceList(p.sources)}</div>${nextArticles(platforms,'platform',id)}</article></div></div>`;
}
function renderIssues() {
  main.innerHTML=`<div class="page-shell">${heading('卷三 / PUBLIC DISCUSSIONS','公共议题','简记公开事件，附上原始材料。对讨论中的不同说法注明归属，对未能核验的内容保留边界。')}<div class="notice">首辑收录 NOIP 暂停与恢复、银川站争议，以及一则 AI 规则沿革。仅有讨论入口的条目，不据此判断责任。</div>${issues.map(p=>link(`/issue/${p.id}`,`<div class="issue-year">${p.year}</div><div><span class="tag">${p.category}</span> <span class="tag red">${p.status}</span><h2>${p.title}</h2><p>${p.deck}</p></div><span class="arrow">↗</span>`,'issue-card')).join('')}</div>`;
}
function renderIssue(id) {
  const p=issues.find(p=>p.id===id);if(!p)return renderNotFound();
  recordReading(`/issue/${id}`,p.title);
  main.innerHTML=`<div class="page-shell">${breadcrumb('公共议题','/issues',p.year)}<div class="reading-layout">${readingAside(issues,'issue',id)}<article><header class="article-header"><span class="eyebrow">公共议题 / ${p.year}</span><h1>${p.title}</h1><p class="deck">${p.deck}</p><div class="article-meta"><span>${p.category}</span><span>${p.status}</span><span>核录于 ${updated}</span></div></header><div class="article-body"><h2>事件简记</h2>${p.facts.map(t=>`<p>${t}</p>`).join('')}<h2>讨论与材料</h2><p>${p.context}</p><h2>时间线</h2>${chronology(p.timeline)}<section class="case-boundary"><span class="eyebrow">记录边界</span><p>${p.boundary}</p></section><h2>来源与讨论入口</h2>${sourceList(p.sources)}</div>${nextArticles(issues,'issue',id)}</article></div></div>`;
}
function renderContests(params) {
  const years=[...new Set(archive.contests.map(c=>c.year))].sort((a,b)=>b-a);
  const year=params.get('year')||'all';
  const series=params.get('series')||'all';
  main.innerHTML=`<div class="page-shell">${heading('卷二 / CONTEST CHRONICLE','赛事年表','以赛季归档，另列实际比赛日期。覆盖部分 ICPC 中国境内区域赛与 EC Final、CCPC 分站与总决赛，以及世界总决赛。',`<span class="page-count">${archive.contests.length} 场赛事索引 · ${archive.contests.filter(c=>c.winners.length).length} 场附奖项或奖牌区间 · 首辑持续补录</span>`)}${archiveFailed?'<div class="notice">赛事文件加载失败。请刷新页面，或从史料索引访问原始榜单。</div>':''}<form class="filters" id="contest-filters"><label class="filter-field">赛季年份<select name="year" aria-label="赛季年份"><option value="all">全部年份</option>${years.map(y=>`<option value="${y}" ${String(y)===year?'selected':''}>${y} 赛季</option>`).join('')}</select></label><label class="filter-field">赛事系列<select name="series" aria-label="赛事系列"><option value="all">全部赛事</option>${Object.entries(seriesNames).map(([k,v])=>`<option value="${k}" ${k===series?'selected':''}>${v}</option>`).join('')}</select></label><label class="filter-field filter-search">查找赛站或学校<input name="q" type="search" value="${escape(params.get('q')||'')}" placeholder="如：南京、清华大学" aria-label="查找赛站或学校"></label><label class="filter-check"><input type="checkbox" name="recorded" ${params.get('recorded')==='1'?'checked':''}>仅看已收录名单</label></form><div id="contest-results" aria-live="polite"></div><div class="notice"><strong>收录口径</strong><br>${escape(archive.method)} 首辑以中国境内赛站为主，未覆盖东亚全部赛站；缺少的年份不表示当年没有比赛。${link('/sources','查看史料索引 →')}</div></div>`;
  const form=document.getElementById('contest-filters');
  form.addEventListener('submit',e=>e.preventDefault());
  form.addEventListener('input',()=>updateContestResults(true));
  updateContestResults(false);
}
function updateContestResults(updateURL) {
  const form=document.getElementById('contest-filters');if(!form)return;
  const p=new URLSearchParams(new FormData(form));
  if(form.elements.recorded.checked)p.set('recorded','1');else p.delete('recorded');
  if(updateURL)history.replaceState(null,'',`#/contests?${p}`);
  const q=(p.get('q')||'').trim().toLocaleLowerCase();
  const list=archive.contests.filter(c=>(p.get('year')==='all'||String(c.year)===p.get('year'))&&(p.get('series')==='all'||c.series===p.get('series'))&&(!p.has('recorded')||c.winners.length)&&(!q||contestTerms(c).includes(q)));
  document.getElementById('contest-results').innerHTML=`<div class="results-count">找到 ${list.length} 场赛事${q?' · 学校检索仅覆盖已收录名单':''}</div>${list.length?list.map(c=>link(`/contest/${c.id}`,`<div class="contest-date">${c.year}<small>${c.date}<br>实际比赛日期</small></div><div><div class="contest-meta"><span class="tag ${c.series==='WF'?'red':''}">${seriesNames[c.series]}</span><small>${escape(c.provenance)}</small></div><h2>${escape(c.title)}</h2><p>${c.winners.length?(c.provenance==='官方赛果'?'收录官方资料中列出的奖牌获得学校。':'按社区榜单配置重建奖牌区间，可查学校、队名与成绩。'):escape(c.note)}</p></div><div class="contest-count">${c.winners.length?`<strong>${c.winners.length}</strong>${c.provenance==='官方赛果'?'条奖项记录':'条榜单记录'}`:'仅收录入口'} &nbsp; ↗</div>`,'contest-card')).join(''):`<div class="empty"><h3>暂无匹配记录</h3><p>可以更换年份或关键词。未收录不表示当年没有赛事。</p><button data-action="reset-filters">清除筛选</button></div>`}`;
}
function renderContest(id) {
  const c=archive.contests.find(c=>c.id===id);if(!c)return renderNotFound();
  activeContest=c;recordReading(`/contest/${id}`,c.title);
  const official=c.provenance==='官方赛果';
  main.innerHTML=`<div class="page-shell">${breadcrumb('赛事年表','/contests',`${c.year} 赛季`)}<header class="article-header"><span class="eyebrow">${seriesNames[c.series]} / ${c.year} 赛季</span><h1>${escape(c.title)}</h1><div class="article-meta"><span>实际比赛：${c.date}</span><span>${escape(c.provenance)}</span><span>核录于 ${updated}</span></div></header><div class="notice">${escape(c.note)}${c.disputed?` ${link('/issue/yinchuan-2021','参见相关公共议题 →')}`:''}</div>${c.winners.length?`<div class="contest-summary">${Object.entries(medals).map(([key,name])=>`<div><strong>${c.winners.filter(w=>w.medal===key).length}</strong>${official?name+'记录':name+'区间队伍'}</div>`).join('')}<div><strong>${new Set(c.winners.map(w=>w.school)).size}</strong>所学校</div></div><div class="table-tools"><div class="medal-tabs" role="group" aria-label="筛选奖项"><button data-medal="all" class="active" aria-pressed="true">全部</button>${Object.entries(medals).map(([k,v])=>`<button data-medal="${k}" aria-pressed="false">${v}</button>`).join('')}</div><input id="school-search" type="search" placeholder="查找学校或队伍" aria-label="查找学校或队伍"><button class="export-button" data-action="export">导出 CSV ↗</button></div><div class="results-count" id="medal-count"></div><div class="table-wrap"><table><caption class="visually-hidden">${official?'官方奖项记录':'社区榜单奖牌区间'}：${escape(c.title)}</caption><thead><tr><th scope="col">名次</th><th scope="col">学校 / 队伍</th><th scope="col">${official?'奖项':'榜单区间'}</th><th scope="col">解题数</th><th scope="col">罚时（分钟）</th></tr></thead><tbody id="medal-rows"></tbody></table></div>`:`<div class="empty"><h3>本场暂仅收录原始入口</h3><p>名单与奖项核录完成前，不根据名次或比例推定获奖。</p></div>`}<div class="source-list"><div class="source-item"><span class="source-index">01</span><div>${external(c.source,official?'官方赛果来源':'查看社区原始榜单')}<p>${official?'名单按该版官方资料记录。':'社区榜单可能与组委会最终获奖公告存在差异。'}</p></div></div>${c.sourceFile?`<div class="source-item"><span class="source-index">02</span><div>${external(c.sourceFile,'查看固定版本的原始配置')}<p>档案版本：${escape(archive.revision.slice(0,12))}。后续上游改动不会自动改写本页。</p></div></div>`:''}</div><div class="article-next">${link(`/contests?year=${c.year}`,`← 返回 ${c.year} 赛季`)}${link('/sources','查看史料索引 →')}</div></div>`;
  if(c.winners.length){document.getElementById('school-search').addEventListener('input',()=>updateMedals());updateMedals();}
}
function filteredWinners() {
  const selected=document.querySelector('[data-medal].active')?.dataset.medal||'all';
  const q=(document.getElementById('school-search')?.value||'').trim().toLocaleLowerCase();
  return (activeContest?.winners||[]).filter(w=>(selected==='all'||w.medal===selected)&&(!q||`${w.school} ${w.team}`.toLocaleLowerCase().includes(q)));
}
function updateMedals() {
  const rows=filteredWinners();
  document.getElementById('medal-count').textContent=`显示 ${rows.length} 条记录${activeContest.provenance==='官方赛果'?' · “—”表示未核录该项数据':' · 奖牌区间按来源配置重建'}`;
  document.getElementById('medal-rows').innerHTML=rows.length?rows.map(w=>`<tr><td class="rank">${w.rank??'—'}</td><td class="school">${escape(w.school)}${w.team?`<span class="team-name">${escape(w.team)}</span>`:''}</td><td><span class="medal ${w.medal}">${medals[w.medal]}</span></td><td>${w.solved??'—'}</td><td>${w.penalty??'—'}</td></tr>`).join(''):'<tr><td colspan="5">没有匹配的学校或队伍。</td></tr>';
}
function renderSources() {
  main.innerHTML=`<div class="page-shell">${heading('附录 / SOURCES','史料索引','优先采用平台、主办方与高校的公开资料。社区档案和讨论材料单独标注，来源类别不代表对其全部内容的认可。')}<div class="notice">核录日期：${updated}。动态网页可能改版，部分知乎、微博及 CCF 页面可能要求登录或限制访问；未读到的原文不作事实转述。每场赛事的具体来源另列于详情页。</div>${sourceList(undefined,true)}<section class="about-content"><h2>如何提交勘误</h2><p>请附上条目名称、需要修正的句子，以及支持修正的原始公告或榜单。项目发布后，可通过仓库 Issue 或 Pull Request 提交。</p><p>对于争议事件，补充质疑材料时也应提供可获得的回应材料；对无法证实的结论，保留未核实标记。</p></section></div>`;
}
function renderAbout() {
  main.innerHTML=`<div class="page-shell">${heading('关于 / EDITORIAL NOTE','编纂说明','采用“平台列传 + 赛事年表 + 公共议题”的结构。目录借用史书形式，正文使用简短现代汉语。')}<div class="about-content"><div class="scope-grid"><div class="scope-item"><strong>${platforms.length}</strong><span>个平台的沿革</span></div><div class="scope-item"><strong>${archive.contests.length}</strong><span>场赛事索引</span></div><div class="scope-item"><strong>${issues.length}</strong><span>个公共议题</span></div></div><h2>写什么，如何写</h2><p>每条记录尽量只回答：何时、何地、发生了什么、依据是什么。不为平台或人物排名，不以传闻补充动机。</p><h2>当前收录范围</h2><p>首辑记载七个在线评测平台。赛事档案覆盖 2020—2025 年的部分 ICPC 中国境内区域赛、CCPC 分站及总决赛、部分 WF；尚未覆盖东亚全部国家和地区的赛站，也不是历年完整获奖数据库。</p><p>年表中的年份表示赛季或官方届次所用年份。实际比赛日期另列，避免将延期举办的 WF 与区域赛误归到同一年。</p><h2>奖项的口径</h2><p>标记“官方赛果”的记录来自官方公布的获奖资料。标记“社区榜单归档”的记录来自固定版本的 XCPCIO 数据，其中的奖牌区间按公开配置和提交记录重建，不替代组委会最终获奖文件。</p><p>原档不完整、分组或规则尚不能确认的场次，仅提供索引。没有收录名单，不表示该场没有颁奖；没有收录某站，不表示当年没有举办。</p><h2>争议如何记录</h2><p>事件经过、讨论材料和记录边界分别列示。持质疑立场的材料目录会注明立场，讨论帖不作为正式裁决。尚未核实的原页只提供入口，不转述具体回答或结论。</p><h2>继续补录</h2><p>后续可扩充更早年份、东亚其他赛站、完整获奖文件和平台沿革。每次补录均保留来源、核录日期与修订记录。</p>${link('/sources','查看全部参考资料 <span>→</span>','text-link')}</div></div>`;
}
function renderNotFound() {
  main.innerHTML=`<div class="page-shell"><div class="empty"><span class="eyebrow">此页尚未收录</span><h1 style="margin:20px 0;font-size:38px">书页未找到</h1><p>链接可能有误，也可以检索全书。</p><div style="margin-top:25px">${link('/','返回总览 →','text-link')} <button data-action="search">搜索全书</button></div></div></div>`;
}
function render() {
  const raw=location.hash.slice(1)||'/';
  const [path,query='']=raw.split('?');
  const params=new URLSearchParams(query);
  activeContest=null;
  document.querySelector('nav').classList.remove('open');document.querySelector('[data-action=menu]').setAttribute('aria-expanded','false');document.querySelector('[data-action=menu]').setAttribute('aria-label','展开导航');
  const section=path==='/'?'home':path.startsWith('/platform')?'platforms':path.startsWith('/contest')?'contests':path.startsWith('/issue')?'issues':path==='/sources'?'sources':'';
  for(const a of document.querySelectorAll('[data-nav]')){if(a.dataset.nav===section)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');}
  if(path==='/')renderHome();else if(path==='/platforms')renderPlatforms();else if(path.startsWith('/platform/'))renderPlatform(path.split('/')[2]);else if(path==='/contests')renderContests(params);else if(path.startsWith('/contest/'))renderContest(path.split('/')[2]);else if(path==='/issues')renderIssues();else if(path.startsWith('/issue/'))renderIssue(path.split('/')[2]);else if(path==='/sources')renderSources();else if(path==='/about')renderAbout();else renderNotFound();
  document.title=path==='/'?'算竞纪事 · 从题库到赛场':`${main.querySelector('h1')?.textContent||'总览'} · 算竞纪事`;
  window.scrollTo({top:0,behavior:'instant'});
}
function isBookmarked(route) {try{return JSON.parse(safeRead('chronicle-bookmarks')||'[]').includes(route);}catch{return false;}}
function openSearch() {const d=document.getElementById('search-dialog');if(!d.open)d.showModal();search('');document.getElementById('global-search').value='';document.getElementById('global-search').focus();}
function search(value) {
  const q=value.trim().toLocaleLowerCase();
  const items=q?searchIndex.filter(i=>i.search.includes(q)).slice(0,30):[];
  document.getElementById('search-results').innerHTML=!q?'<p class="search-hint">可以试试：Codeforces、南京、北京大学、银川。</p>':items.length?items.map(i=>link(i.route,`<span>${escape(i.kind)}</span><strong>${escape(i.title)}</strong><p>${escape(i.deck)}</p>`,'search-result')).join(''):'<p class="search-hint">没有找到相关条目。试试更短的关键词。</p>';
}
document.addEventListener('click',event=>{
  if(event.target.closest('.skip')){event.preventDefault();main.focus({preventScroll:true});main.scrollIntoView();return;}
  const medal=event.target.closest('[data-medal]');if(medal){for(const b of document.querySelectorAll('[data-medal]')){b.classList.toggle('active',b===medal);b.setAttribute('aria-pressed',String(b===medal));}updateMedals();return;}
  if(event.target.closest('#search-results a'))document.getElementById('search-dialog').close();
  const button=event.target.closest('[data-action]');if(!button)return;
  const action=button.dataset.action;
  if(action==='search')openSearch();
  if(action==='close-search')document.getElementById('search-dialog').close();
  if(action==='theme'){const theme=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=theme;safeWrite('chronicle-theme',theme);updateThemeLabel();}
  if(action==='menu'){const opened=document.querySelector('nav').classList.toggle('open');button.setAttribute('aria-expanded',String(opened));button.setAttribute('aria-label',opened?'收起导航':'展开导航');}
  if(action==='font-smaller'||action==='font-larger'){const current=parseInt(getComputedStyle(document.documentElement).getPropertyValue('--reading-size'))||18;const size=Math.min(24,Math.max(16,current+(action==='font-larger'?1:-1)));document.documentElement.style.setProperty('--reading-size',`${size}px`);safeWrite('chronicle-font',String(size));toast(`正文字号 ${size}px`);}
  if(action==='bookmark'){let entries=[];try{entries=JSON.parse(safeRead('chronicle-bookmarks')||'[]');}catch{}const route=button.dataset.route;const exists=entries.includes(route);entries=exists?entries.filter(e=>e!==route):[...entries,route];safeWrite('chronicle-bookmarks',JSON.stringify(entries));button.textContent=exists?'收藏':'已收藏';toast(exists?'已取消收藏':'已保存到本机收藏');}
  if(action==='reset-filters'){location.hash='/contests';}
  if(action==='export'&&activeContest){const cell=v=>`"${String(v??'').replace(/^[=+@-]/,"'$&").replaceAll('"','""')}"`;const lines=[['名次','学校','队伍','奖项或区间','解题数','罚时（分钟）','来源','口径'],...filteredWinners().map(w=>[w.rank,w.school,w.team,medals[w.medal],w.solved,w.penalty,activeContest.source,activeContest.note])];const blob=new Blob(['\ufeff'+lines.map(r=>r.map(cell).join(',')).join('\r\n')],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`${activeContest.id}.csv`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('已导出当前筛选记录');}
});
document.getElementById('global-search').addEventListener('input',e=>search(e.target.value));
document.getElementById('search-dialog').addEventListener('click',e=>{if(e.target===e.currentTarget){const r=e.currentTarget.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.currentTarget.close();}});
document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openSearch();}});
window.addEventListener('hashchange',()=>{render();main.focus({preventScroll:true});});

try {const response=await fetch(new URL('../data/contests.json',import.meta.url));if(!response.ok)throw new Error('archive');archive=await response.json();}catch{archiveFailed=true;}
searchIndex=[...platforms.map(p=>({kind:'平台列传',title:p.name,deck:p.deck,route:`/platform/${p.id}`,search:`${p.name} ${p.short} ${p.year} ${p.deck} ${p.paragraphs.join(' ')}`.toLocaleLowerCase()})),...issues.map(p=>({kind:'公共议题',title:p.title,deck:p.deck,route:`/issue/${p.id}`,search:`${p.title} ${p.year} ${p.facts.join(' ')}`.toLocaleLowerCase()})),...archive.contests.map(c=>({kind:`赛事年表 · ${c.year}`,title:c.title,deck:`${c.date} · ${c.provenance}`,route:`/contest/${c.id}`,search:contestTerms(c)}))];
render();
