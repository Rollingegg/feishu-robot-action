import * as core from '@actions/core'
import { createTextMessage, FRobot } from './robot'

async function run(): Promise<void> {
  try {
    const uuid = core.getInput('uuid')
    const version = core.getInput('version')
    const secret = core.getInput('secret')
    const text = core.getInput('text')
    const json = core.getInput('json')
    core.info(json)

    const robot = new FRobot(uuid, version, secret)
    if (!text && !json) throw new Error('invalid json data')
    if (text) {
      const res = await robot.send(createTextMessage(text))
      core.debug(res)
    } else if (json) {
      try {
        const res = await robot.send(JSON.parse(json))
        core.debug(res)
      } catch (error) {
        core.setFailed(String(error))
      }
    }
  } catch (error) {
    core.setFailed(String(error))
  }
}

run()
