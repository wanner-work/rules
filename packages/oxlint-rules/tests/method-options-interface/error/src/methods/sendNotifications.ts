interface SendNotificationOptions {
  skipValidation: boolean
}

export default function saveUser(
  userId: string,
  options: SendNotificationOptions
): string {
  return options.skipValidation ? userId : `${userId}:validated`
}
