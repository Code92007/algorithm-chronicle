#!/usr/bin/env python3
"""Build a pinned, attributed regional-contest archive from XCPCIO public data.

Archived medal bands reproduce the source configuration, not an organizer's
award announcement. Ambiguous formats remain links, never invented results.
"""
import argparse
import concurrent.futures
import datetime as dt
import json
import math
from pathlib import Path
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]
TZ = dt.timezone(dt.timedelta(hours=8))
AC = {'OK', 'AC', 'ACCEPTED', 'CORRECT'}
WRONG = {'WRONG_ANSWER', 'WA', 'TIME_LIMIT_EXCEEDED', 'TL', 'TLE',
         'MEMORY_LIMIT_EXCEEDED', 'ML', 'MLE', 'RUNTIME_ERROR', 'RT', 'RE', 'RTE',
         'OUTPUT_LIMIT_EXCEEDED', 'OL', 'OLE', 'IDLENESS_LIMIT_EXCEEDED', 'IL', 'ILE',
         'REJECTED', 'RJ', 'INCORRECT', 'NO_OUTPUT', 'NO', 'JUDGEMENT_FAILED', 'JE', 'HACKED'}
IGNORED = {'COMPILATION_ERROR', 'CE', 'PRESENTATION_ERROR', 'PE', 'CONFIGURATION_ERROR',
           'SYSTEM_ERROR', 'SE', 'CANCELED', 'SKIPPED', 'IGNORED'}

def status_of(run):
    return str(run.get('status', '')).upper().replace(' ', '_')

def read_url(url, destination):
    if not destination.exists():
        destination.parent.mkdir(parents=True, exist_ok=True)
        subprocess.run(['curl', '-fsSL', '--retry', '2', '--max-time', '40', url,
                        '-o', str(destination)], check=True, capture_output=True)
    return json.loads(destination.read_text())

def localize(x):
    if isinstance(x, dict):
        return x.get('zh-CN') or x.get('zh') or x.get('en') or x.get('en-US') or next(iter(x.values()), '')
    return str(x or '')

def records(x, key):
    if isinstance(x, list):
        return [{**r, '_id': str(r.get(key, r.get('id', i)))} for i, r in enumerate(x)]
    return [{**r, '_id': str(k)} for k, r in x.items()]

def epoch(x):
    x = float(x)
    return x / 1000 if x > 1e11 else x

def rebuild(config, teams, runs):
    """Reproduce explicit bands or the upstream CCPC preset, with judged runs."""
    medal = config.get('medal')
    if not isinstance(medal, dict) and medal != 'ccpc':
        return [], '原档未提供可直接读取的奖牌区间，仅收录赛事索引。'
    group = 'official' if medal == 'ccpc' or 'official' in medal else 'all' if 'all' in medal else None
    if not group:
        return [], '原档奖项分组需人工核对，仅收录赛事索引。'
    ts = records(teams, 'team_id')
    rs = records(runs, 'submission_id')
    unknown = {status_of(r) for r in rs if not r.get('is_ignore')} - AC - WRONG - IGNORED
    if unknown:
        return [], '原档含待判或未识别状态，仅收录赛事索引。'
    duration = epoch(config['end_time']) - epoch(config['start_time'])
    by_id = {}
    for team in ts:
        groups = team.get('group', [])
        if isinstance(groups, str):
            groups = [groups]
        if team.get('official'):
            groups = [*groups, 'official']
        if group != 'all' and (group not in groups or 'unofficial' in groups or team.get('unofficial')):
            continue
        by_id[team['_id']] = {'school': localize(team.get('organization')),
                              'team': localize(team.get('name', team.get('team_name'))),
                              'solved': 0, 'seconds': 0, 'last': 0, '_problems': {}}
    if not by_id or any(not t['school'] for t in by_id.values()):
        return [], '原档学校字段需人工核对，仅收录赛事索引。'
    unit = config.get('options', {}).get('submission_timestamp_unit', 'second')
    mode = config.get('options', {}).get('calculation_of_penalty', 'in_minutes')
    if mode not in {'in_minutes', 'in_seconds', 'accumulate_in_seconds_and_finally_to_the_minute'}:
        return [], '原档罚时规则需人工核对，仅收录赛事索引。'
    seen = set()
    for run in sorted(rs, key=lambda r: (float(r['timestamp']), r['_id'])):
        if run['_id'] in seen:
            continue
        seen.add(run['_id'])
        tid = str(run['team_id'])
        sec = float(run['timestamp']) / (1000 if unit == 'millisecond' else 1)
        if tid not in by_id or not 0 <= sec < duration or run.get('is_ignore'):
            continue
        t = by_id[tid]
        problem = t['_problems'].setdefault(str(run['problem_id']), {'accepted': False, 'wrong': 0})
        if problem['accepted']:
            continue
        status = status_of(run)
        if status in AC:
            problem['accepted'] = True
            t['solved'] += 1
            t['seconds'] += (math.floor(sec / 60) * 60 if mode == 'in_minutes' else sec) + problem['wrong'] * float(config.get('penalty', 1200))
            t['last'] = math.floor(sec / 60)
        elif status in WRONG:
            problem['wrong'] += 1
    rows = list(by_id.values())
    for row in rows:
        if mode == 'accumulate_in_seconds_and_finally_to_the_minute':
            row['seconds'] = math.floor(row['seconds'] / 60) * 60
    rows.sort(key=lambda r: (-r['solved'], r['seconds'], r['last'], r['team']))
    bounds, total = [], 0
    if medal == 'ccpc':
        effective = sum(row['solved'] > 0 for row in rows)
        bounds = [(name, math.ceil(effective * ratio))
                  for name, ratio in [('gold', .1), ('silver', .3), ('bronze', .6)]]
    else:
        for name in ['gold', 'silver', 'bronze']:
            count = medal[group].get(name, 0)
            if not isinstance(count, int) or isinstance(count, bool) or count < 0:
                return [], '原档奖牌配额需人工核对，仅收录赛事索引。'
            total += count
            bounds.append((name, total))
    winners, prev, rank = [], None, 0
    for i, row in enumerate(rows, 1):
        score = (row['solved'], row['seconds'], row['last'])
        if score != prev:
            rank = i
        prev = score
        m = next((name for name, bound in bounds if rank <= bound), None)
        if m and row['solved']:
            winners.append({k: row[k] for k in ['school', 'team', 'solved']} | {
                'rank': rank, 'medal': m, 'penalty': round(row['seconds'] / 60, 2)})
    rule = 'CCPC 预设（解题正式队伍的前 10%、30%、60% 向上取整）' if medal == 'ccpc' else '奖牌配额'
    return winners, f'按社区归档中的 {group} 组及{rule}重建；不是组委会获奖公告。'

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--cache', type=Path, required=True)
    ap.add_argument('--tree', type=Path, required=True)
    ap.add_argument('--offline', action='store_true', help='Only use downloaded, valid JSON files')
    args = ap.parse_args()
    tree = json.loads(args.tree.read_text())
    revision = tree['commit']
    base = f'https://raw.githubusercontent.com/xcpcio/board-data/{revision}/'
    paths = []
    for f in tree['tree']:
        p = f['path']
        if not re.match(r'data/(icpc|ccpc)/[^/]+/[^/]+/config.json$', p):
            continue
        if any(x in p.lower() for x in ['warmup', 'online', 'invitational', 'rehearsal', 'preliminary', 'practice', 'xiaomi', 'girl', 'wfinal', 'vocational', 'gaozhi', 'jiangsu-and-xiangtan']):
            continue
        if re.search(r'onsite\d', p) or '/51st/' in p:
            continue
        paths.append(p)

    def load(path):
        if args.offline:
            return json.loads((args.cache / path).read_text())
        return read_url(base + path, args.cache / path)

    def process(path):
        if args.offline and not (args.cache / path).exists():
            return None
        config = load(path)
        date = dt.datetime.fromtimestamp(epoch(config['start_time']), TZ)
        if date.year > 2025:
            return None
        parts = path.split('/')
        kind = 'CCPC' if parts[1] == 'ccpc' else 'ICPC'
        wf = 'world-finals' == parts[3]
        ed = re.fullmatch(r'(\d+)(?:th|st|nd|rd)', parts[2])
        season = int(ed[1]) + (2014 if kind == 'CCPC' else 1976 if wf else 1975) if ed else int(parts[2])
        title = localize(config.get('contest_name'))
        if not title or '邀请赛' in title:
            return None
        winner_rows = []
        note = '首辑收录原始榜单入口，获奖名单尚未核录。'
        disputed = parts[1:4] == ['icpc', '2020', 'yinchuan']
        if (isinstance(config.get('medal'), dict) or config.get('medal') == 'ccpc') and not disputed:
            try:
                team, run = load(path.replace('config.json', 'team.json')), load(path.replace('config.json', 'run.json'))
                winner_rows, note = rebuild(config, team, run)
            except (ValueError, FileNotFoundError):
                note = '原始提交文件本次未完整取得，仅收录赛事索引。'
        if disputed:
            note = '本场存在公开争议，仅保留赛事索引；参见公共议题中的银川站条目。'
        return {'id': '-'.join(parts[1:4]), 'series': 'WF' if wf else kind,
                'year': season, 'date': date.strftime('%Y-%m-%d'), 'title': title,
                'source': 'https://board.xcpcio.com/' + '/'.join(parts[1:4]),
                'sourceFile': f'https://github.com/xcpcio/board-data/blob/{revision}/{path}',
                'provenance': '社区榜单归档', 'note': note, 'disputed': disputed,
                'winners': winner_rows}

    out, errors = [], []
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as pool:
        jobs = {pool.submit(process, p): p for p in paths}
        for future in concurrent.futures.as_completed(jobs):
            try:
                item = future.result()
                if item:
                    out.append(item)
            except Exception as e:
                errors.append({'path': jobs[future], 'error': str(e)[:200]})
    out.sort(key=lambda r: (r['year'], r['date'], r['id']), reverse=True)
    payload = {'updated': '2026-11-03', 'revision': revision,
               'source': 'https://github.com/xcpcio/board-data',
               'scope': '首辑收录可读取的中国境内 ICPC 区域赛、CCPC 分站与总决赛，以及部分 WF；并非历年全部赛事。',
               'method': '奖牌区间由公开榜单配置和提交记录重建，仅表示社区归档口径，不替代组委会获奖公告。未完成核录的场次只保留原档入口。',
               'contests': out}
    target = ROOT / 'data' / 'contests.json'
    target.write_text(json.dumps(payload, ensure_ascii=False, separators=(',', ':')) + '\n')
    (ROOT / 'docs' / 'import-report.json').write_text(json.dumps({'revision': revision, 'contestCount': len(out), 'medalBandCount': sum(len(c['winners']) for c in out), 'errors': errors}, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'contests': len(out), 'medal_band_rows': sum(len(c['winners']) for c in out), 'error_count': len(errors), 'first_errors': errors[:3]}, ensure_ascii=False))

if __name__ == '__main__':
    main()
