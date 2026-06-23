import Phaser from "phaser";
import { GAME_AUTHOR, GAME_TITLE } from "../meta";

type CardId = "attack" | "defense" | "talisman";

type Card = {
  id: CardId;
  name: string;
  cost: number;
  description: string;
  damage?: number;
  block?: number;
  color: number;
};

const MAX_PLAYER_HP = 50;
const MAX_ENEMY_HP = 40;
const MAX_ENERGY = 3;
const ENEMY_ATTACK = 8;

const CARDS: Card[] = [
  { id: "attack", name: "攻击", cost: 1, damage: 6, description: "造成 6 点伤害", color: 0x9d4238 },
  { id: "defense", name: "防御", cost: 1, block: 5, description: "获得 5 点格挡", color: 0x2f6b78 },
  { id: "talisman", name: "灵符", cost: 2, damage: 10, description: "造成 10 点伤害", color: 0xb5852f },
];

type BattleSceneData = {
  playerHp?: number;
  playerBlock?: number;
  enemyHp?: number;
  energy?: number;
  feedback?: string;
};

export default class BattleScene extends Phaser.Scene {
  private playerHp = MAX_PLAYER_HP;
  private playerBlock = 0;
  private enemyHp = MAX_ENEMY_HP;
  private energy = MAX_ENERGY;
  private feedback = "";
  private resolving = false;

  constructor() {
    super("BattleScene");
  }

  init(data: BattleSceneData = {}) {
    this.playerHp = data.playerHp ?? MAX_PLAYER_HP;
    this.playerBlock = data.playerBlock ?? 0;
    this.enemyHp = data.enemyHp ?? MAX_ENEMY_HP;
    this.energy = data.energy ?? MAX_ENERGY;
    this.feedback = data.feedback ?? "";
    this.resolving = false;
  }

  create() {
    const { width, height } = this.scale;

    this.drawScene(width, height);
    this.drawHeader();
    this.drawCombatant(284, 304, "巡夜人", this.playerHp, MAX_PLAYER_HP, this.playerBlock, "player");
    this.drawCombatant(930, 286, "渊灯古神", this.enemyHp, MAX_ENEMY_HP, 0, "enemy");
    this.drawHand(width, height);
    this.drawFeedback();
    this.drawBattleResult(width, height);
  }

  private drawScene(width: number, height: number) {
    this.add.rectangle(width / 2, height / 2, width, height, 0x071314);
    this.add.circle(1010, 126, 74, 0xf5dca5, 0.2);

    for (let x = 90; x < width; x += 150) {
      this.add.rectangle(x, 382, 28, 162, 0x14342e, 0.74);
      this.add.triangle(x, 280, -54, 36, 0, -34, 54, 36, 0x1d4a42, 0.72);
    }

    this.add.rectangle(width / 2, height - 96, width, 192, 0x040706, 0.76);
    this.add.rectangle(width / 2, 54, width, 108, 0x03100f, 0.5);
    this.add.rectangle(width / 2, 334, 980, 326, 0x051211, 0.24).setStrokeStyle(1, 0x9fd9bf, 0.22);
  }

  private drawHeader() {
    this.add.text(52, 24, GAME_TITLE, {
      color: "#f5dca5",
      fontFamily: "Georgia, serif",
      fontSize: "34px",
      shadow: { blur: 8, color: "#000000", fill: true, offsetY: 2 },
    });

    this.add.text(54, 70, `作者：${GAME_AUTHOR} · 第 1 战 · 月下山门`, {
      color: "#cfe7d6",
      fontFamily: "Microsoft YaHei, sans-serif",
      fontSize: "18px",
      shadow: { blur: 6, color: "#000000", fill: true },
    });

    this.add.rectangle(924, 108, 184, 42, 0x061817, 0.62).setStrokeStyle(1, 0xf5dca5, 0.42);
    this.add.text(850, 96, `意图：触手 ${ENEMY_ATTACK}`, {
      color: "#f5dca5",
      fontFamily: "Microsoft YaHei, sans-serif",
      fontSize: "18px",
      shadow: { blur: 5, color: "#000000", fill: true },
    });
  }

  private drawCombatant(
    x: number,
    y: number,
    name: string,
    hp: number,
    maxHp: number,
    block: number,
    side: "player" | "enemy",
  ) {
    this.add.ellipse(x, y + 174, 270, 48, 0x020605, 0.48);

    if (side === "player") {
      this.drawHero(x, y);
    } else {
      this.drawEnemy(x, y);
    }

    this.add.text(x, y + 174, name, {
      color: "#efe7d2",
      fontFamily: "Microsoft YaHei, sans-serif",
      fontSize: "22px",
      fontStyle: "bold",
      shadow: { blur: 6, color: "#000000", fill: true },
    }).setOrigin(0.5);

    this.drawHealthBar(x - 146, 486, hp, maxHp, 288);
    this.add.text(x - 146, 516, `格挡 ${block}`, {
      color: "#cfe7d6",
      fontFamily: "Microsoft YaHei, sans-serif",
      fontSize: "16px",
      shadow: { blur: 4, color: "#000000", fill: true },
    });
  }

  private drawHero(x: number, y: number) {
    this.drawAura(x, y, 0x77e8dc, 0xf5dca5);
    this.add.triangle(x, y + 38, -72, 142, 0, -104, 72, 142, 0x2b7f71).setDepth(10);
    this.add.circle(x, y - 116, 32, 0xefe7d2).setDepth(11);
    this.add.triangle(x, y - 152, -46, 24, 0, -40, 46, 24, 0x111816).setDepth(12);
    this.add.line(x + 58, y - 18, -98, 68, 92, -18, 0xfff4bd, 0.86).setLineWidth(8).setDepth(13);
  }

  private drawEnemy(x: number, y: number) {
    this.drawAura(x, y, 0x6d4cff, 0xc018ff);
    this.add.ellipse(x, y - 4, 138, 228, 0x2b0b3d).setDepth(10);
    this.add.circle(x - 32, y - 74, 14, 0xff4fd8).setDepth(11);
    this.add.circle(x + 32, y - 74, 14, 0xff4fd8).setDepth(11);

    for (let index = 0; index < 5; index += 1) {
      this.add
        .line(x, y + 64, 0, 0, (index - 2) * 34, 150, 0x8f34ff, 0.7)
        .setLineWidth(7)
        .setDepth(9);
    }
  }

  private drawAura(x: number, y: number, primary: number, secondary: number) {
    this.add.ellipse(x, y + 54, 214, 326, secondary, 0).setStrokeStyle(2, secondary, 0.34).setDepth(7);
    this.add.ellipse(x, y + 44, 190, 300, primary, 0.08).setDepth(7);
  }

  private drawHealthBar(x: number, y: number, hp: number, maxHp: number, width: number) {
    const percent = Phaser.Math.Clamp(hp / maxHp, 0, 1);

    this.add.rectangle(x - 8, y, width + 16, 28, 0x070a09, 0.78).setOrigin(0, 0.5);
    this.add.rectangle(x, y, width, 18, 0x331313, 0.96).setOrigin(0, 0.5);
    this.add.rectangle(x, y, width * percent, 18, 0xd9553d).setOrigin(0, 0.5);
    this.add.rectangle(x, y, width, 18).setOrigin(0, 0.5).setStrokeStyle(2, 0xf1d29b, 0.82);
    this.add.text(x + width / 2, y, `${hp}/${maxHp}`, {
      color: "#fff5dc",
      fontFamily: "Arial, sans-serif",
      fontSize: "15px",
    }).setOrigin(0.5);
  }

  private drawHand(width: number, height: number) {
    this.add.rectangle(width / 2, height - 86, 880, 208, 0x07100f, 0.72).setStrokeStyle(1, 0xd5c07d, 0.28);
    this.add.text(54, height - 82, `能量 ${this.energy}/${MAX_ENERGY}`, {
      color: "#7ee0cb",
      fontFamily: "Microsoft YaHei, sans-serif",
      fontSize: "22px",
    });

    CARDS.forEach((card, index) => this.drawCard(width / 2 - 224 + index * 228, height - 118, card));
    this.drawEndTurnButton(width - 142, height - 82);
  }

  private drawCard(x: number, y: number, card: Card) {
    const canUse = this.energy >= card.cost && !this.isBattleEnded();
    const container = this.add.container(x, y).setDepth(30);
    const cardWidth = 182;
    const cardHeight = 236;

    container.setSize(cardWidth, cardHeight);
    container.setInteractive(
      new Phaser.Geom.Rectangle(-cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight),
      Phaser.Geom.Rectangle.Contains,
    );

    container.add(this.add.rectangle(8, 10, cardWidth, cardHeight, 0x000000, 0.34));
    container.add(this.add.rectangle(0, 0, cardWidth, cardHeight, 0x101816, canUse ? 0.98 : 0.58));
    container.add(this.add.rectangle(0, -18, cardWidth - 18, 132, card.color, canUse ? 0.34 : 0.16));
    container.add(this.add.rectangle(0, 0, cardWidth, cardHeight, 0xffffff, 0).setStrokeStyle(2, 0xe7c57f, canUse ? 0.92 : 0.42));
    container.add(this.add.circle(-64, -92, 22, 0x071c1a, 0.98).setStrokeStyle(2, 0x7ee0cb, canUse ? 0.95 : 0.4));
    container.add(this.add.text(-64, -92, String(card.cost), {
      color: "#dffbf2",
      fontFamily: "Arial, sans-serif",
      fontSize: "22px",
      fontStyle: "bold",
    }).setOrigin(0.5));
    container.add(this.add.text(0, 12, card.name, {
      color: canUse ? "#f5dca5" : "#8a8272",
      fontFamily: "Microsoft YaHei, sans-serif",
      fontSize: "25px",
      fontStyle: "bold",
    }).setOrigin(0.5));
    container.add(this.add.text(0, 56, card.description, {
      align: "center",
      color: canUse ? "#d8ccb2" : "#777064",
      fixedWidth: cardWidth - 34,
      fontFamily: "Microsoft YaHei, sans-serif",
      fontSize: "16px",
      wordWrap: { width: cardWidth - 34 },
    }).setOrigin(0.5, 0));

    container.on("pointerover", () => container.setScale(1.04));
    container.on("pointerout", () => container.setScale(1));
    container.on("pointerdown", () => this.playCard(card));
  }

  private drawEndTurnButton(x: number, y: number) {
    const button = this.add
      .rectangle(x, y, 168, 54, 0x17322d, 0.94)
      .setStrokeStyle(2, 0xf5dca5, 0.72)
      .setInteractive({ useHandCursor: true });

    this.add.text(x, y, "结束回合", {
      color: "#f5dca5",
      fontFamily: "Microsoft YaHei, sans-serif",
      fontSize: "21px",
      fontStyle: "bold",
    }).setOrigin(0.5);

    button.on("pointerover", () => button.setScale(1.04));
    button.on("pointerout", () => button.setScale(1));
    button.on("pointerdown", () => this.endPlayerTurn());
  }

  private playCard(card: Card) {
    if (this.resolving || this.isBattleEnded()) {
      return;
    }

    if (this.energy < card.cost) {
      this.restartWith({ feedback: "灵力不足。" });
      return;
    }

    this.resolving = true;
    const nextEnergy = this.energy - card.cost;

    if (card.block) {
      this.restartWith({
        playerBlock: this.playerBlock + card.block,
        energy: nextEnergy,
        feedback: `巡夜人获得 ${card.block} 点格挡。`,
      });
      return;
    }

    const damage = card.damage ?? 0;
    const nextEnemyHp = Math.max(0, this.enemyHp - damage);
    this.drawCardEffect(card.id, 930, 286);
    this.time.delayedCall(380, () => {
      this.restartWith({
        enemyHp: nextEnemyHp,
        energy: nextEnergy,
        feedback: nextEnemyHp === 0 ? "渊灯古神被击退。" : `${card.name}造成 ${damage} 点伤害。`,
      });
    });
  }

  private drawCardEffect(cardId: CardId, x: number, y: number) {
    const color = cardId === "talisman" ? 0xffd978 : 0x9afcff;
    const ring = this.add.circle(x, y - 12, 38, 0xffffff, 0).setStrokeStyle(6, color, 0.86).setDepth(90);
    this.tweens.add({
      targets: ring,
      alpha: 0,
      scale: cardId === "talisman" ? 2.8 : 2.1,
      duration: 420,
      ease: "Cubic.easeOut",
      onComplete: () => ring.destroy(),
    });
  }

  private endPlayerTurn() {
    if (this.resolving || this.isBattleEnded()) {
      return;
    }

    const blockedDamage = Math.min(this.playerBlock, ENEMY_ATTACK);
    const hpDamage = ENEMY_ATTACK - blockedDamage;
    const nextPlayerHp = Math.max(0, this.playerHp - hpDamage);
    const feedback =
      nextPlayerHp === 0
        ? "巡夜人倒下了。"
        : hpDamage === 0
          ? `格挡抵消 ${blockedDamage} 点，没有受到伤害。`
          : blockedDamage > 0
            ? `格挡抵消 ${blockedDamage} 点，巡夜人受到 ${hpDamage} 点伤害。`
            : `渊灯古神攻击，巡夜人受到 ${ENEMY_ATTACK} 点伤害。`;

    this.restartWith({
      playerHp: nextPlayerHp,
      playerBlock: 0,
      energy: MAX_ENERGY,
      feedback,
    });
  }

  private restartWith(data: BattleSceneData) {
    this.scene.restart({
      playerHp: data.playerHp ?? this.playerHp,
      playerBlock: data.playerBlock ?? this.playerBlock,
      enemyHp: data.enemyHp ?? this.enemyHp,
      energy: data.energy ?? this.energy,
      feedback: data.feedback ?? this.feedback,
    } satisfies BattleSceneData);
  }

  private drawFeedback() {
    if (!this.feedback) {
      return;
    }

    this.add.rectangle(640, 112, 420, 44, 0x061817, 0.78).setStrokeStyle(1, 0xf5dca5, 0.42);
    this.add.text(640, 112, this.feedback, {
      color: "#f5dca5",
      fontFamily: "Microsoft YaHei, sans-serif",
      fontSize: "18px",
      shadow: { blur: 6, color: "#000000", fill: true },
    }).setOrigin(0.5);
  }

  private drawBattleResult(width: number, height: number) {
    if (!this.isBattleEnded()) {
      return;
    }

    const victory = this.enemyHp <= 0;
    const title = victory ? "夜巡完成" : "夜路未尽";
    const subtitle = victory ? "渊灯古神暂退，山门恢复寂静。" : "巡夜人倒下了，再试一次。";

    this.add.rectangle(width / 2, height / 2, 500, 190, 0x061817, 0.9).setStrokeStyle(2, 0xf5dca5, 0.62).setDepth(100);
    this.add.text(width / 2, height / 2 - 54, title, {
      color: "#f5dca5",
      fontFamily: "Microsoft YaHei, sans-serif",
      fontSize: "34px",
      fontStyle: "bold",
    }).setOrigin(0.5).setDepth(101);
    this.add.text(width / 2, height / 2 - 10, subtitle, {
      align: "center",
      color: "#d8ccb2",
      fixedWidth: 420,
      fontFamily: "Microsoft YaHei, sans-serif",
      fontSize: "18px",
      wordWrap: { width: 420 },
    }).setOrigin(0.5).setDepth(101);

    const button = this.add.rectangle(width / 2, height / 2 + 58, 168, 46, 0xf5dca5, 0.96).setInteractive({ useHandCursor: true }).setDepth(101);
    this.add.text(width / 2, height / 2 + 58, "重新开始", {
      color: "#161815",
      fontFamily: "Microsoft YaHei, sans-serif",
      fontSize: "18px",
      fontStyle: "bold",
    }).setOrigin(0.5).setDepth(102);
    button.on("pointerdown", () => this.scene.restart());
  }

  private isBattleEnded() {
    return this.playerHp <= 0 || this.enemyHp <= 0;
  }
}
