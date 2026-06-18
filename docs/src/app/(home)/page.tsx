import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import SideRays from '@/components/SideRays/SideRays'

export default function HomePage() {
  return (
    <div className="relative flex flex-col justify-center text-center flex-1 overflow-hidden">
      <div className="absolute inset-0">
        <SideRays
          speed={1.9}
          rayColor1="#EAB308"
          rayColor2="#96c8ff"
          intensity={2}
          spread={3}
          origin="top-right"
          tilt={-14}
          saturation={1.35}
          blend={0.79}
          falloff={1.7}
          opacity={1.0}
        />
      </div>
      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-6 py-24">
        <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Opinionated rules
          <br />
          for consistent code.
        </h1>
        <p className="max-w-2xl text-balance text-base text-fd-muted-foreground sm:text-lg">
          A small, opinionated rule pack that turns your coding conventions
          into enforced guarantees, so every file in your project follows the
          same pattern.
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 rounded-md bg-fd-foreground px-5 py-2.5 text-sm font-medium text-fd-background transition-colors hover:bg-fd-foreground/90"
          >
            Read the docs
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
