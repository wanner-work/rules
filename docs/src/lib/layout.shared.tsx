import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'
import Navbar from '@/components/navbar/Navbar'
import { gitConfig } from '@/lib/shared'

export function baseOptions(isHomePage: boolean): BaseLayoutProps {
  const options: BaseLayoutProps = {
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`
  }

  if (isHomePage) {
    options.nav = {
      component: Navbar()
    }
  } else {
    options.nav = {
      title: (
        <p className="text-black text-xs flex gap-2 items-center pl-2">
          <span className="opacity-50">wanner.work</span>
          <span className="rotate-30 text-[8px] opacity-50">|</span>
          <span>rules</span>
        </p>
      )
    }
  }

  return options
}
