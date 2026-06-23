import { useEffect, useRef } from "react";
import Phaser from "phaser";
import BattleScene from "./scenes/BattleScene";

const BASE_WIDTH = 1280;
const BASE_HEIGHT = 720;

export default function PhaserGame() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!hostRef.current || gameRef.current) {
      return;
    }

    gameRef.current = new Phaser.Game({
      type: Phaser.AUTO,
      parent: hostRef.current,
      width: BASE_WIDTH,
      height: BASE_HEIGHT,
      backgroundColor: "#111816",
      antialias: true,
      antialiasGL: true,
      pixelArt: false,
      powerPreference: "high-performance",
      roundPixels: false,
      render: {
        antialias: true,
        antialiasGL: true,
        pixelArt: false,
        roundPixels: false,
      },
      scene: [BattleScene],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        autoRound: true,
      },
    });

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return <div className="game-host" ref={hostRef} />;
}
