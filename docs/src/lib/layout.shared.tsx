import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { gitConfig } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <div>
        <p className="dark:text-white font-mono">
          @wanner.work/<span className="font-bold pl-0.5">rules</span>
        </p>
      </div>,
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
