import { Scene } from 'phaser';

export default class GameUi extends Scene {
    constructor() {
        super('GameUi');
    }

    create() {
        this.setUiMode(true);

        // life

        const life1 = this.add.image(0, 0, "atlas", "life_on.png").setOffset(50, 50);
        const life2 = this.add.image(0, 0, "atlas", "life_on.png").setOffset(100, 50);
        const life3 = this.add.image(0, 0, "atlas", "life_off.png").setOffset(150, 50);

        // coin
        const panel = this.add.image(1, 0, "atlas", "panel.png").setOrigin(1, 0.5).setOffset(-50, 50);
        const styleLabelPanel = { "color": "#000000", "fontFamily": "DimboRegular", "fontSize": "30px" };
        const panelLabel = this.add.text(1, 0, "2403", styleLabelPanel).setOrigin(0.5, 0.5).setOffset(-135, 50);
        const coin = this.add.image(1, 0, "atlas", "coin.png").setOrigin(0.5, 0.5).setOffset(-50, 50);

        // button
        const button = this.add.image(0.5, 1, "atlas", "button.png").setOrigin(0.5, 0.5).setOffsetY(-100);
        const styleLabelButton = { "color": "#ffffff", "fontFamily": "DimboRegular", "fontSize": "50px" };
        const buttonLabel = this.add.text(0.5, 1, "Start", styleLabelButton).setOrigin(0.5, 0.5).setOffsetY(-100);

        // logo
        const logo = this.add.image(1, 1, "atlas", "phaser.png").setScale(0.25).setOrigin(1, 1).setOffset(-20, -20);
    }
}



