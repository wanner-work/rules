export interface Options {
  skipValidation: boolean
}

export default function saveUser(userId: string, options: Options): string {
  return options.skipValidation ? userId : `${userId}:validated`
}
