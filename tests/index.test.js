jest.setTimeout(30000)
const createAsanaActionsWorkflow = require('../src/asana-actions-workflow')
const githubFixture = require('./fixtures/github')
const core = require('./github-core')

const getPR = (number) =>
  githubFixture.find((gh) => gh.context.payload.pull_request.number === number)

const createGithub = (number) => {
  const github = getPR(number)
  const getOctokit = () => {
    return {
      pulls: {
        update: (newBody) => {
          expect(newBody).toEqual(github.newBody)
          return {
            status: 200,
          }
        },
      },
    }
  }
  return {
    getOctokit,
    ...github,
  }
}

describe('Asana Actions Workflow', () => {
  it('Should do nothing if no Asana ID present in PR', async () => {
    await createAsanaActionsWorkflow(core, createGithub(1230))
  })

  it('Should link open PR with Asana task', async () => {
    await createAsanaActionsWorkflow(core, createGithub(1234))
  })

  it('Should link open PR with Asana task with Fixes prefix', async () => {
    await createAsanaActionsWorkflow(core, createGithub(1239))
  })

  it('Should complete Asana task', async () => {
    await createAsanaActionsWorkflow(core, createGithub(1235))
  })

  it('Should link edited PR with Asana task', async () => {
    await createAsanaActionsWorkflow(core, createGithub(1236))
  })

  it('Should do nothing if PR is already linked', async () => {
    await createAsanaActionsWorkflow(core, createGithub(1237))
  })

  it('Should do nothing if PR does not use a valid prefix', async () => {
    await createAsanaActionsWorkflow(core, createGithub(1238))
  })

  it('Should move multiple tasks to Under Review section', async () => {
    await createAsanaActionsWorkflow(core, createGithub(1240))
  })

  it('Should move one task to Under Review section and no-op for invalid section', async () => {
    await createAsanaActionsWorkflow(core, createGithub(1250))
  })

  it('Should not update task section if its a draft', async () => {
    await createAsanaActionsWorkflow(core, createGithub(1260))
  })

  it('Should update task milestone with v21.08.20', async () => {
    await createAsanaActionsWorkflow(core, createGithub(1300))
  })

  it('Should update task milestone with v21.08.20x', async () => {
    await createAsanaActionsWorkflow(core, createGithub(1301))
  })

  it('Should replace milestone v21.08.20 by v21.08.30', async () => {
    await createAsanaActionsWorkflow(core, createGithub(1303))
  })

  it('Should link milestone v21.08.20 in multiple tasks', async () => {
    await createAsanaActionsWorkflow(core, createGithub(1304))
  })

  it('Should clean task milestone', async () => {
    await createAsanaActionsWorkflow(core, createGithub(1307))
  })

  it('Should update task milestone with v21.08.20-genesis', async () => {
    await createAsanaActionsWorkflow(core, createGithub(1302))
  })
})
