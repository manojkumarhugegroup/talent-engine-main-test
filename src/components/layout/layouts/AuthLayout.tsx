"use client"

import Image from "next/image"
import { ReactNode } from "react"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen w-full">
      {/* Left Side (Background + Logo) */}
      <div className="relative hidden w-1/2 lg:flex items-center justify-center bg-blue-700 text-white">
        <Image
          src="/login-bg.jpg"
          alt="Auth Background"
          fill
          className="object-cover opacity-70"
          priority
        />
        <div className="absolute inset-0 bg-blue-900/60" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="flex items-center gap-2">
            <img src="/assets/logos/logo_w.png" alt="Logo" width={450} height={200} />
          </div>
        </div>
      </div>

      {/* Right Side (Form) */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-(--login-bg)">
        {children}
      </div>
    </div>
  )
}
