import { Scene } from 'phaser';

export default class Boot extends Scene {
    constructor() {
        super('Boot');
    }

    init() {
        //camera
        this.cameras.main.autoCenterX(true);

        // progressBar
        const progressBar = this.add.rectangle(this.game.config.width / 2, this.game.config.height / 2, 300, 20);
        progressBar.setStrokeStyle(2, 0xffffff);

        //bar
        const bar = this.add.rectangle(progressBar.x - progressBar.width / 2 + 4, progressBar.y, 0, 12, 0xffffff);

        this.load.on('progress', (progress) => {
            bar.width = progress * (progressBar.displayWidth - 8);
        });
    }

    preload() {
        this.load.multiatlas('atlas', 'assets/texture_atlas.json', 'assets');

        this.load.spineJson("logo_data", "assets/spine_4.2_json/logo.json");
        this.load.spineAtlas("logo_atlas", "assets/spine_4.2_json/logo.atlas");

        this.load.font("DimboRegular", "assets/DimboRegular.ttf");
    }

    create() {
        this.scene.start('Game');
    }


}
