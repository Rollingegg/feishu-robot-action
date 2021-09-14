import { createTextMessage, FRobot } from '../src/robot'
import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import { expect, test } from '@jest/globals'

const uuidMock = process.env.UUID as string
const uuidMockWithSecret = process.env.UUID_WITH_SECRET as string
const secret = process.env.SECRET as string

test('throws invalid version', () => {
  expect(() => new FRobot(uuidMock, '3')).toThrow(
    'invalid version, only support v1 and v2'
  )
})

test('throws invalid uuid(v1)', () => {
  expect(() => new FRobot('foo', '1')).toThrow('uuid length should be 32 in v1')
})

test('throws invalid uuid(v2)', () => {
  expect(() => new FRobot('foo', '2')).toThrow('uuid length should be 36 in v2')
})

test('send simple text v2', async () => {
  const bot = new FRobot(uuidMock)
  const res = await bot.send(createTextMessage('test'))
  expect(JSON.parse(res).StatusCode).toBe(0)
})

test('send data v2', async () => {
  const bot = new FRobot(uuidMock)
  const res = await bot.send(
    JSON.parse('{"msg_type":"text","content":{"text":"test data"}}')
  )
  expect(JSON.parse(res).StatusCode).toBe(0)
})

test('send data with secret but not carrying', async () => {
  const bot = new FRobot(uuidMockWithSecret)
  const res = await bot.send(
    JSON.parse('{"msg_type":"text","content":{"text":"test data"}}')
  )
  expect(JSON.parse(res)).toEqual({
    code: 19021,
    msg: 'sign match fail or timestamp is not within one hour from current time'
  })
})

test('send data with secret', async () => {
  const bot = new FRobot(uuidMockWithSecret, '2', secret)
  const res = await bot.send(
    JSON.parse('{"msg_type":"text","content":{"text":"test data with secret"}}')
  )
  expect(JSON.parse(res).StatusCode).toBe(0)
})

// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', () => {
  process.env['INPUT_VERSION'] = '2'
  process.env['INPUT_UUID'] = uuidMock
  process.env['INPUT_JSON'] =
    '{"msg_type":"post","content":{"post":{"zh_cn":{"title":"飞书机器人","content":[[{"tag":"text","text":"使用文档: "},{"tag":"a","text":"请查看","href":"https://www.feishu.cn/hc/zh-CN/articles/360024984973"}]]}}}}'
  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  }
  console.log(cp.execFileSync(np, [ip], options).toString())
})

// shows how the runner will run a javascript action with env / stdout protocol
test('test runs with secret', () => {
  process.env['INPUT_VERSION'] = '2'
  process.env['INPUT_UUID'] = uuidMockWithSecret
  process.env['INPUT_SECRET'] = secret
  process.env['INPUT_JSON'] =
    '{"msg_type":"post","content":{"post":{"zh_cn":{"title":"飞书机器人","content":[[{"tag":"text","text":"使用文档: "},{"tag":"a","text":"请查看","href":"https://www.feishu.cn/hc/zh-CN/articles/360024984973"}]]}}}}'
  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  }
  console.log(cp.execFileSync(np, [ip], options).toString())
})
