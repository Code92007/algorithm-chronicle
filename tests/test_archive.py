"""Verify medal reconstruction boundaries and the published data contract."""
import copy
import importlib.util
import json
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('archive_import', ROOT / 'scripts/import_archive.py')
archive_import = importlib.util.module_from_spec(spec)
spec.loader.exec_module(archive_import)

class ReconstructionTests(unittest.TestCase):
    def setUp(self):
        self.config = {'start_time': 1700000000, 'end_time': 1700018000,
                       'medal': {'official': {'gold': 1, 'silver': 1, 'bronze': 1}},
                       'penalty': 1200, 'options': {}}
        self.teams = {str(i): {'name': f'Team {i}', 'organization': f'School {i}',
                              'official': True} for i in range(1, 5)}
    def run_at(self, team, problem, sec, status='AC', **extra):
        return {'team_id': str(team), 'problem_id': problem, 'timestamp': sec,
                'status': status, **extra}
    def rebuild(self, runs):
        return archive_import.rebuild(self.config, self.teams, runs)[0]
    def test_wrong_attempts_and_compilation_presentation_errors(self):
        rows = self.rebuild([self.run_at(1, 'A', 10, 'WA'), self.run_at(1, 'A', 20, 'CE'),
                             self.run_at(1, 'A', 30, 'PE'), self.run_at(1, 'A', 125),
                             self.run_at(2, 'A', 1500)])
        self.assertEqual(rows[0]['school'], 'School 1')
        self.assertEqual(rows[0]['penalty'], 22)
    def test_duplicate_ids_and_submissions_after_solve_do_not_add_score(self):
        run = self.run_at(1, 'A', 60, submission_id='x')
        rows = self.rebuild([run, copy.deepcopy(run), self.run_at(1, 'A', 120)])
        self.assertEqual((rows[0]['solved'], rows[0]['penalty']), (1, 1))
    def test_unofficial_and_out_of_contest_runs_are_excluded(self):
        self.teams['1']['unofficial'] = True
        rows = self.rebuild([self.run_at(1, 'A', 60), self.run_at(2, 'A', -1),
                             self.run_at(3, 'A', 18000), self.run_at(4, 'A', 120)])
        self.assertEqual([r['school'] for r in rows], ['School 4'])
    def test_ties_share_rank_and_medal_including_cutoff(self):
        rows = self.rebuild([self.run_at(1, 'A', 60), self.run_at(2, 'A', 60),
                             self.run_at(3, 'A', 120)])
        self.assertEqual([(r['rank'], r['medal']) for r in rows],
                         [(1, 'gold'), (1, 'gold'), (3, 'bronze')])
    def test_unknown_or_pending_states_do_not_publish_awards(self):
        for status in ['FROZEN', 'JUDGING', 'PARTIALLY_CORRECT', 'NEW_STATUS']:
            with self.subTest(status=status):
                self.assertEqual(self.rebuild([self.run_at(1, 'A', 60, status)]), [])
    def test_missing_medal_configuration_does_not_guess(self):
        self.config['medal'] = 'unknown'
        self.assertEqual(self.rebuild([self.run_at(1, 'A', 60)]), [])
    def test_ccpc_preset_counts_only_official_teams_that_solved(self):
        self.config['medal'] = 'ccpc'
        self.teams = {str(i): {'name': str(i), 'organization': str(i), 'official': True}
                      for i in range(1, 12)}
        self.teams['11']['unofficial'] = True
        rows = self.rebuild([self.run_at(i, 'A', i * 60) for i in range(1, 12)])
        self.assertEqual([r['medal'] for r in rows],
                         ['gold', 'silver', 'silver', 'bronze', 'bronze', 'bronze'])
    def test_accumulate_seconds_before_rounding_and_millisecond_units(self):
        self.config['options'] = {'calculation_of_penalty': 'accumulate_in_seconds_and_finally_to_the_minute',
                                  'submission_timestamp_unit': 'millisecond'}
        rows = self.rebuild([self.run_at(1, 'A', 61000), self.run_at(1, 'B', 119000)])
        self.assertEqual(rows[0]['penalty'], 3)
    def test_no_output_is_a_penalized_attempt(self):
        rows = self.rebuild([self.run_at(1, 'A', 10, 'NO_OUTPUT'), self.run_at(1, 'A', 60)])
        self.assertEqual(rows[0]['penalty'], 21)

class PublishedArchiveTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.archive = json.loads((ROOT / 'data/contests.json').read_text())
        cls.contests = {c['id']: c for c in cls.archive['contests']}
    def test_ids_sources_and_rows_are_well_formed(self):
        self.assertEqual(len(self.contests), len(self.archive['contests']))
        self.assertGreaterEqual(len(self.contests), 78)
        for c in self.contests.values():
            self.assertRegex(c['date'], r'^20\d{2}-\d{2}-\d{2}$')
            self.assertTrue(c['source'].startswith('https://'))
            self.assertTrue(c['note'])
            for w in c['winners']:
                self.assertTrue(w['school'])
                self.assertIn(w['medal'], ['gold', 'silver', 'bronze'])
                self.assertTrue(w['rank'] is None or w['rank'] > 0)
    def test_disputed_result_is_not_adjudicated_by_importer(self):
        c = self.contests['icpc-2020-yinchuan']
        self.assertEqual(c['year'], 2020)
        self.assertEqual(c['date'], '2021-05-16')
        self.assertTrue(c['disputed'])
        self.assertEqual(c['winners'], [])
    def test_official_wf_edition_and_actual_date_stay_distinct(self):
        c = self.contests['icpc-46th-world-finals']
        self.assertEqual(c['year'], 2022)
        self.assertTrue(c['date'].startswith('2024-'))
        self.assertEqual(c['provenance'], '官方赛果')
    def test_official_wf_medal_counts_and_unrecorded_fields(self):
        for edition, count in [(46, 12), (47, 16), (48, 12), (49, 12)]:
            c = self.contests[f'icpc-{edition}th-world-finals']
            self.assertEqual(c['provenance'], '官方赛果')
            self.assertEqual(len(c['winners']), count)
        c = self.contests['icpc-48th-world-finals']
        self.assertEqual((c['winners'][0]['school'], c['winners'][0]['rank']), ('北京大学', 1))
        self.assertIsNone(c['winners'][1]['rank'])
    def test_frozen_source_revision_is_recorded(self):
        revision = self.archive['revision']
        self.assertRegex(revision, r'^[0-9a-f]{40}$')
        for c in self.contests.values():
            self.assertIn(revision, c['sourceFile'])

if __name__ == '__main__':
    unittest.main()
