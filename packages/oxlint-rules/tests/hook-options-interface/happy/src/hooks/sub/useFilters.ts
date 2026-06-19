interface Options {
  includeArchived: boolean
}

export default function useFilters(options: Options): { active: boolean } {
  return { active: !options.includeArchived }
}
