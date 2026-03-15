"use client";

import dynamic from "next/dynamic";

const JSONValidator = dynamic(() => import("@/components/JSONValidator"), {
  ssr: false,
  loading: () => (
    <div className="h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-gray-500">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        <p className="text-sm font-medium tracking-widest uppercase">Initializing IDE...</p>
      </div>
    </div>
  )
});

export default function Home() {
  return (
    <main>
      <JSONValidator />
    </main>
  );
}
