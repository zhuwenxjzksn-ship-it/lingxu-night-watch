# 灵墟夜行

灵墟夜行是一个 React + Phaser + TypeScript 制作的卡牌战斗游戏原型。玩家扮演巡夜人，在仙侠风格的夜庙场景中使用攻击、防御和灵符卡牌与敌人交战。

## Features

- React 负责启动界面和应用壳层。
- Phaser 负责战斗场景、卡牌交互、角色动画和特效。
- 游戏画面使用 Phaser 程序化生成的背景、角色和卡牌贴图，不依赖外部二进制素材。
- 三张基础卡牌：攻击、防御、灵符。
- 简单的能量、生命、格挡、敌方意图和胜负循环。
- 适合继续扩展成 roguelike deckbuilder 或剧情战斗原型。

## Requirements

- Node.js 20 or newer
- npm

## Getting Started

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite.

## Build

```bash
npm run build
npm run preview
```

## Project Structure

```text
src/
  App.tsx                    React shell and start screen
  game/
    PhaserGame.tsx           Phaser lifecycle wrapper
    meta.ts                  Game title and author metadata
    scenes/BattleScene.ts    Main battle scene
```

## Roadmap

- Add deck draw and discard piles.
- Add more enemy patterns and encounters.
- Add relics, events, and reward screens.
- Add save data for run progress.
- Add keyboard and mobile touch polish.

## License

MIT. See [LICENSE](./LICENSE).
