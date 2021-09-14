import got from 'got'
import * as core from '@actions/core'
import { generateSignature } from './crypto'
import { JsonObject } from './json'

export interface MessageData {
  // text（文本）/ post（富文本）/ image（图片）/ share_chat（分享群名片）/ interactive（消息卡片）
  msg_type: 'text' | 'post' | 'image' | 'share_chat' | 'interactive'
  content: JsonObject
  timestamp?: string
  sign?: string
}

export class FRobot {
  private webhookUrl: string
  private secret?: string
  constructor(uuid: string, versionStr?: string, secret?: string) {
    let version: number
    if (!versionStr) {
      version = 2
    } else {
      version = parseInt(versionStr)
    }
    if (version !== 2 && version !== 1) {
      throw new Error('invalid version, only support v1 and v2')
    }
    if (version == 1 && uuid.length !== 32) {
      throw new Error('uuid length should be 32 in v1')
    }
    if (version == 2 && uuid.length !== 36) {
      throw new Error('uuid length should be 36 in v2')
    }
    this.webhookUrl =
      version === 1
        ? `https://open-hl.feishu.cn/open-apis/bot/hook/${uuid}`
        : `https://open.feishu.cn/open-apis/bot/v2/hook/${uuid}`
    this.secret = secret
  }
  async send(message: MessageData): Promise<string> {
    const { webhookUrl, secret } = this
    if (secret) {
      const timestamp = generateTimestampMatch()
      const sign = generateSignature(parseInt(timestamp), secret)
      message.timestamp = timestamp
      message.sign = sign
    }
    const res = await got.post(webhookUrl, {
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(webhookUrl.search('/v2/') != -1 ? message : { text: message.content.text })
    })
    core.debug(res.body)
    return res.body
  }
}

export function createTextMessage(text: string): MessageData {
  return {
    msg_type: 'text',
    content: {
      text
    }
  }
}
/**
 * generate 10-bits(count on seconds) timestamp to match the hash crypto
 */
function generateTimestampMatch(): string {
  return String(Date.now()).substr(0, 10)
}
