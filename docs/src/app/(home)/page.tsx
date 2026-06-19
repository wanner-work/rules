'use client'

import Link from 'next/link'
import Beams from '@/components/beams/Beams'

export default function HomePage() {
  return (
    <div className="relative flex flex-col justify-center text-center flex-1 overflow-hidden bg-black">
      <div className="absolute inset-0">
        <Beams
          beamWidth={2}
          beamHeight={15}
          beamNumber={12}
          lightColor="#ffffff"
          speed={2}
          noiseIntensity={1.75}
          scale={0.2}
          rotation={-24}
        />
      </div>
      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-6 py-24">
        <h1 className="text-balance text-4xl text-white font-bold tracking-tight sm:text-5xl md:text-6xl">
          Opinionated rules
          <br />
          for consistent code.
        </h1>
        <p className="max-w-2xl text-balance text-base text-neutral-400 sm:text-lg">
          A small, opinionated rule pack that turns your coding conventions into
          enforced guarantees, so every file in your project follows the same
          pattern.
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-white/80 ring-2 ring-black/10"
          >
            Getting started
          </Link>
          <Link
            target="_blank"
            href="https://github.com/wanner-work/rules"
            className="inline-flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-black/80 ring-2 ring-white/10"
          >
            View source
          </Link>
        </div>
      </div>
    </div>
  )
}
