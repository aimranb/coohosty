(async () => {
  const sha = process.env.GITHUB_SHA;
  if (!sha) throw new Error('GITHUB_SHA is required');
  for (let attempt = 0; attempt < 18; attempt++) {
    const response = await fetch(`https://api.github.com/repos/aimranb/coohosty/commits/${sha}/status`, {
      headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${process.env.GITHUB_TOKEN}` },
      signal: AbortSignal.timeout(20000),
    });
    if (!response.ok) throw new Error(`Deployment status request failed: ${response.status}`);
    const status = await response.json();
    const vercel = status.statuses.find(item => item.context === 'Vercel');
    if (vercel?.state === 'success') { console.log(`Vercel production deployment complete for ${sha}`); return; }
    if (vercel?.state === 'failure' || vercel?.state === 'error') throw new Error(`Vercel deployment failed: ${vercel.description}`);
    console.log('Waiting for the production deployment');
    await new Promise(resolve => setTimeout(resolve, 20000));
  }
  throw new Error('Production deployment did not finish within six minutes');
})().catch(error => { console.error(error.message); process.exitCode = 1; });
