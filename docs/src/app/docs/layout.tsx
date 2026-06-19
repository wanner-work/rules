import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import SOURCE from '@/constants/SOURCE'
import baseOptions from '@/methods/baseOptions'

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <DocsLayout tree={SOURCE.loader.getPageTree()} {...baseOptions(false)}>
      {children}
    </DocsLayout>
  )
}
