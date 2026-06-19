import type Options from '../../shared/sub/Options'

export default function useNotifications(options: Options): {
  enabled: boolean
} {
  return { enabled: options.notify }
}
