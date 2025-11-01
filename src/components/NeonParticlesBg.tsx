"use client";

import Particles from "react-tsparticles";
import type { Engine } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";

export default function NeonParticlesBg() {
  const init = async (engine: Engine) => {
    await loadSlim(engine); 
  };

  return (
    <Particles
      id="neon-bg"
      init={init}
      options={{
        fullScreen: { enable: true, zIndex: -1 },
        background: { color: "#000000" },
        fpsLimit: 60,
        detectRetina: true,
        particles: {
          number: { value: 120, density: { enable: true, area: 800 } },
          color: { value: "#39ff14" },                
          links: {
            enable: true,
            distance: 130,
            color: "#2aff0a",
            opacity: 0.25,
            width: 1,
          },
          move: { enable: true, speed: 0.7, outModes: { default: "out" } },
          size: { value: { min: 1, max: 2.2 } },
          opacity: { value: { min: 0.2, max: 0.6 } },
          glow: { enable: false }, 
          shadow: {
            enable: true,
            color: "#39ff14",
            blur: 3,
          },
        },
        interactivity: {
          events: { onHover: { enable: true, mode: "repulse" }, resize: true },
          modes: { repulse: { distance: 100, duration: 0.3 } },
        },
      }}
    />
  );
}
