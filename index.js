const core = require('@actions/core')
const github = require('@actions/github')
const asana = require('./asana')

try {
  const ASANA_TOKEN = core.getInput('token')
  const PR = github.context.payload.pull_request

  if (!ASANA_TOKEN){
    throw({message: 'ASANA_TOKEN not set'});
  }
  
  const shortId = asana.getAsanaShortId(PR.title)
  if (!shortId) return core.info('no matching asana short id in: ' + PR.title)
  const task = asana.getMatchingAsanaTask(shortId)
  core.info('got matching task: ' + task)
} catch (error) {
  core.error(error.message);
}