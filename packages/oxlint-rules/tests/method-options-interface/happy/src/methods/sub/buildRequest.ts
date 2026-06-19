interface Options {
  includeMetadata: boolean
}

export default function buildRequest(id: string, options: Options): string {
  return options.includeMetadata ? `${id}:meta` : id
}
