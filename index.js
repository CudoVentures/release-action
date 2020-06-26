const core = require('@actions/core');
const github = require('@actions/github');
const fetch = require('node-fetch')

const generateLines = (items) => items.map(({ title, user: { login } }) => `  - ${title} (${login})`).join('\n')

const run = async () => {
  try {
    const repo = core.getInput('repo');
    const githubToken = process.env.GITHUB_TOKEN
    const dateToday = new Date().toISOString().split('T')[0]
    const prEndpoint = `https://api.github.com/search/issues?q=repo:${repo}+is:pr+is:merged+sort:merged-date+merged:${dateToday}`
    const response = await fetch(prEndpoint, {
      headers: {
        Authorization: `token ${githubToken}`
      }
    });
    if (response.status !== 200) {
        throw new Error('Could not authenticate with repository')
    }
    const json = await response.json()
    const prs = json.items
    
    const features = prs.filter(({ title }) => title.toLowerCase().startsWith('feat'))
    const fixes = prs.filter(({ title }) => title.toLowerCase().startsWith('hotfix') || title.toLowerCase().startsWith('fix'))
    const rest = prs.filter(pr => !features.includes(pr) && !fixes.includes(pr))

    const featuresText = generateLines(features)
    const fixesText = generateLines(fixes)
    const otherText = generateLines(rest)

    const message = 
`
:rocket: *Cudo Console* (${dateToday})

Features:
${featuresText}

Fixes:
${fixesText}

Other Improvements:
${otherText}
`
    console.log(message)
  } catch (error) {
    core.setFailed(error.message);
  }
} 

run()