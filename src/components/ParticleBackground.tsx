import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import type { Engine } from "tsparticles-engine";

export function ParticleBackground() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  return (
    <Particles
      className="absolute inset-0 -z-10"
      init={particlesInit}
      options={{
        background: {
          opacity: 0
        },
        particles: {
          number: {
            value: 50,
            density: {
              enable: true,
              value_area: 800
            }
          },
          color: {
            value: ({ theme }) => theme === 'dark' ? "#3B82F6" : "#60A5FA"
          },
          links: {
            enable: true,
            color: ({ theme }) => theme === 'dark' ? "#3B82F6" : "#60A5FA",
            opacity: ({ theme }) => theme === 'dark' ? 0.2 : 0.1
          },
          move: {
            enable: true,
            speed: 1
          },
          size: {
            value: 2
          },
          opacity: {
            value: ({ theme }) => theme === 'dark' ? 0.3 : 0.2
          }
        },
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "grab"
            }
          },
          modes: {
            grab: {
              distance: 140,
              links: {
                opacity: 0.5
              }
            }
          }
        }
      }}
    />
  );
} 