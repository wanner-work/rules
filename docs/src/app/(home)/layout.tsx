import { HomeLayout } from 'fumadocs-ui/layouts/home'
import baseOptions from '@/methods/baseOptions'

export default function Layout({ children }: LayoutProps<'/'>) {
  return <HomeLayout {...baseOptions(true)}>{children}</HomeLayout>
}
