import crypto from 'crypto'
export function generateSignature(timestamp: number, secret: string): string {
  const key = `${timestamp}\n${secret}`
  const sign = crypto.createHmac('sha256', key).update('').digest('base64')
  return sign
}
