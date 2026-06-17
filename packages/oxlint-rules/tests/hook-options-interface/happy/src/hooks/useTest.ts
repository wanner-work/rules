import SubOptions from '../types/sub/SubOptions'

export default function useTest(options: SubOptions): { enabled: boolean } {
  return { enabled: options.notify }
}
