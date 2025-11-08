"use client";

import dynamic from "next/dynamic";

const NeonParticlesBg = dynamic(() => import("@/components/NeonParticlesBg"), {
  ssr: false,
});

export default function ClientBackground() {
  return <NeonParticlesBg />;
}
