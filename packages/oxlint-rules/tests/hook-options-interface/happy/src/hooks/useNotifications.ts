import type Options from '../types/Options'

export default function useNotifications(options: Options): {
  enabled: boolean
} {
  return { enabled: options.notify }
}
