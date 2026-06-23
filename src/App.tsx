import { lazy, Suspense, useState } from "react";
import { GAME_AUTHOR, GAME_TITLE } from "./game/meta";

type Screen = "start" | "battle";

const PhaserGame = lazy(() => import("./game/PhaserGame"));

export default function App() {
  const [screen, setScreen] = useState<Screen>("start");

  if (screen === "battle") {
    return (
      <main className="app-shell app-shell--battle">
        <Suspense fallback={<div className="loading-screen">正在点灯...</div>}>
          <PhaserGame />
        </Suspense>
      </main>
    );
  }

  return (
    <main className="app-shell start-screen">
      <section className="start-panel" aria-labelledby="game-title">
        <p className="eyebrow">React + Phaser Prototype</p>
        <h1 id="game-title">{GAME_TITLE}</h1>
        <p className="author">作者：{GAME_AUTHOR}</p>
        <p className="intro">
          永宁里外，灵墟夜开。点灯入庙，用符箓、剑气和护身诀走过第一段夜路。
        </p>
        <button className="primary-button" type="button" onClick={() => setScreen("battle")}>
          开始夜巡
        </button>
      </section>
    </main>
  );
}
