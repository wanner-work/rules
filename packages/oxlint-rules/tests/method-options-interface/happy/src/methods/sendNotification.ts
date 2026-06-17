import type SendNotificationOptions from '../types/SendNotificationOptions'

export default function sendNotification(
  userId: string,
  options: SendNotificationOptions
): string {
  return options.notifyByEmail ? `${userId}:email` : `${userId}:in-app`
}
