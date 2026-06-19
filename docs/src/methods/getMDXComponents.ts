import defaultMdxComponents from 'fumadocs-ui/mdx'
import { MDXComponents } from 'mdx/types'

export default function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    ...components
  } as MDXComponents
}
