#!/usr/bin/env python3
"""Merge explicitly transcribed official awards; never infer rank from ordering."""
import argparse
from html.parser import HTMLParser
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

class Scoreboard(HTMLParser):
    def __init__(self):
        super().__init__(); self.rows=[]; self.row=None; self.cell=None; self.medal=None
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if tag=='tr': self.row=[];self.medal=None
        if tag=='td' and self.row is not None:self.cell=[]
        if tag=='img' and a.get('alt') in ['Gold Medal','Silver Medal','Bronze Medal']:self.medal=a['alt'].split()[0].lower()
    def handle_data(self,data):
        if self.cell is not None:self.cell.append(data)
    def handle_endtag(self,tag):
        if tag=='td' and self.cell is not None:
            if self.row is not None:self.row.append(' '.join(''.join(self.cell).split()))
            self.cell=None
        if tag=='tr' and self.row is not None:
            if self.medal:self.rows.append((self.row,self.medal))
            self.row=None

def main():
    ap=argparse.ArgumentParser();ap.add_argument('--scoreboard-2025',type=Path,required=True);args=ap.parse_args()
    path=ROOT/'data/contests.json';archive=json.loads(path.read_text())
    awards=json.loads((ROOT/'data/official-wf.json').read_text())
    contests={c['id']:c for c in archive['contests']}
    for r in awards['records']:
        c=contests[r['id']]
        c['archiveSource']=c['source'];c['source']=awards['source'];c['provenance']='官方赛果'
        c['note']='奖牌学校按 ICPC 2025 官方手册第 22 页的 Recent medal winners 核录。表内顺序不表示组内名次；未核录的名次、解题数、罚时以“—”表示。'
        c['winners']=[{'school':school,'team':'','medal':medal,'rank':None,'solved':None,'penalty':None} for medal in ['gold','silver','bronze'] for school in r[medal]]
        if c['year']==2024:
            c['winners'][0]['rank']=1;c['winners'][0]['team']='Naive Birds'
    parser=Scoreboard();parser.feed(args.scoreboard_2025.read_text())
    assert len(parser.rows)==12, f'Expected 12 official medal rows, found {len(parser.rows)}'
    translated={'The University of Tokyo':'东京大学','Beijing Jiaotong University':'北京交通大学','Tsinghua University':'清华大学','Peking University':'北京大学','University of Science and Technology of China':'中国科学技术大学','Seoul National University':'首尔大学'}
    winners=[]
    import re
    for row,medal in parser.rows:
        rank=int(row[0]);school=re.sub(r'^\d+\s*','',row[1])
        winners.append({'rank':rank,'school':translated.get(school,school),'team':'','medal':medal,'solved':int(row[2]),'penalty':int(row[3])})
    c=contests['icpc-49th-world-finals'];c['archiveSource']=c['source'];c['source']='https://worldfinals.icpc.global/scoreboard/2025/finals/';c['provenance']='官方赛果'
    c['note']='按 2025 年巴库世界总决赛官方 Final Scoreboard 的名次、奖牌标记、解题数与罚时核录。学校名称部分译为中文，未补写队员姓名。'
    c['winners']=winners
    archive['contests']=list(contests.values());path.write_text(json.dumps(archive,ensure_ascii=False,separators=(',',':'))+'\n')
    print(f'Official WF records: {sum(len(contests[r["id"]]["winners"]) for r in awards["records"])+len(winners)}')

if __name__=='__main__':main()
