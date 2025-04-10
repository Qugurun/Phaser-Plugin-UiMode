import Phaser from "phaser";

export default class Game extends Phaser.Scene {

	constructor() {
		super("Game");
	}

	create() {
		// camera
		this.cameras.main.autoCenter(true);

		// background
		const background = this.add.image(512, 384, "atlas", "background.jpg").setOrigin(0);
		background.onResize = function () {
			this.setPosition(this.scene.left, this.scene.top);
			this.setDisplaySize(this.scene.game.width, this.scene.game.height);
		}

		//background cloud
		const cloud = this.add.image(0, 0, "atlas", "cloud_background.png").setOrigin(1, 1);
		cloud.onResize = function () {
			this.setPosition(this.scene.right, this.scene.bottom);
		}

		//tree right
		const tree_right = this.add.image(0, 0, "atlas", "tree_right.png").setOrigin(1, 0);
		tree_right.onResize = function () {
			this.setScale(this.scene.game.height / this.height);
			this.setPosition(this.scene.right, this.scene.top);
		}
		this.tree_right = tree_right;

		//tree left
		const tree_left = this.add.image(0, 0, "atlas", "tree_left.png").setOrigin(0);
		tree_left.onResize = function () {
			this.setScale(this.scene.game.height / this.height);
			this.setPosition(this.scene.left, this.scene.top);
		}
		this.tree_left = tree_left;

		// logo spine
		const logo = this.add.spine(
			this.game.config.width / 2,
			this.game.config.height / 2,
			"logo_data",
			"logo_atlas"
		);
		logo.setScale(0.5);
		logo.animationState.setAnimation(0, "animation", true);

		// ui
		this.scene.launch('GameUi');
	}
}
