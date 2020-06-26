const core = require('@actions/core');
const github = require('@actions/github');
const fetch = require('node-fetch')

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
    const json = response.json()
    console.log(json)
    // `who-to-greet` input defined in action metadata file
    console.log(`Hello ${nameToGreet}!`);
    const time = (new Date()).toTimeString();
    core.setOutput("time", time);
    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`The event payload: ${payload}`);
  } catch (error) {
    core.setFailed(error.message);
  }
} 

run()