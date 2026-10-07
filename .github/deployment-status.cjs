const { execFileSync } = require('node:child_process');
const sha = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const repo = 'https://api.github.com/repos/aimranb/coohosty';
async function json(url) {
  const response = await fetch(url, { headers: { Accept: 'application/vnd.github+json' }, signal: AbortSignal.timeout(20000) });
  if (!response.ok) throw new Error(`GitHub status ${response.status}`);
  return response.json();
}
(async () => {
  const [status, runs] = await Promise.all([json(`${repo}/commits/${sha}/status`), json(`${repo}/actions/runs?head_sha=${sha}`)]);
  const result = { sha, state: status.state, deployments: status.statuses.map(s => ({ context: s.context, state: s.state, description: s.description, url: s.target_url })), workflows: runs.workflow_runs.map(r => ({ id: r.id, name: r.name, status: r.status, conclusion: r.conclusion, url: r.html_url })) };
  for (const run of runs.workflow_runs.filter(r => r.conclusion === 'failure')) {
    const jobs = await json(`${repo}/actions/runs/${run.id}/jobs`);
    result.failedJobs = jobs.jobs.filter(j => j.conclusion === 'failure').map(j => ({ name: j.name, url: j.html_url, steps: j.steps.filter(s => s.conclusion === 'failure').map(s => s.name) }));
  }
  console.log(JSON.stringify(result, null, 2));
})().catch(error => { console.error(error.message); process.exitCode = 1; });
