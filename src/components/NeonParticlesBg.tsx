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
          number: { value: 45, density: { enable: true, area: 900 } }, // menos puntos
          color: { value: "#39ff14" },
          links: {
            enable: true,
            distance: 95,           
            color: "#39ff14",
            opacity: 0.10,          
            width: 0.6,
          },
          move: {
            enable: true,
            speed: 0.18,           
            direction: "none",
            outModes: { default: "out" }
          },
          size: { value: { min: 1, max: 1.8 } },
          opacity: { value: { min: 0.15, max: 0.35 } },
          shadow: {
            enable: true,
            color: "#39ff14",
            blur: 1.5,             
          },
        },
        interactivity: {
          events: {
            onHover: { enable: false, mode: "none" },
            resize: true,
          },
          modes: {},
        },
        motion: {
          disable: false,
          reduce: { factor: 3, value: true },
        },
      }}
    />
  );
}
