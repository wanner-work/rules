import type Options from '../shared/Options'

export default function useNotifications(options: Options): {
  enabled: boolean
} {
  return { enabled: options.notify }
}
