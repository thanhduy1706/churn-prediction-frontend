"use client"

import type React from "react"

import { ReduxProvider } from "@/lib/redux/provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return <ReduxProvider>{children}</ReduxProvider>
}
