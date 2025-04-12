/**
 * Phaser 3 UIMode Plugin
 * Version: 2.0.2
 * Author: Qugurun (tg:qugurun), WitGames (https://wit.games/)
 * License: MIT
 */

import "phaser";

//=============================================================
Phaser.Scene.prototype.setUiMode = function (value) {
    this.uiMode = value;
    return this;
};

//-------------------------------------------------------------
Phaser.Scene.prototype.getUiMode = function () {
    return this.uiMode || false;
};

//=============================================================
Object.defineProperty(Phaser.GameObjects.GameObject.prototype, 'offsetX', {
    get() {
        return this._offsetX || 0;
    },
    set(value) {
        this._offsetX = value;
    },
    enumerable: true,
    configurable: true
});

//-------------------------------------------------------------
Object.defineProperty(Phaser.GameObjects.GameObject.prototype, 'offsetY', {
    get() {
        return this._offsetY || 0;
    },
    set(value) {
        this._offsetY = value;
    },
    enumerable: true,
    configurable: true
});
//=============================================================
Object.defineProperty(Phaser.GameObjects.Text.prototype, 'offsetX', {
    get() {
        return this._offsetX || 0;
    },
    set(value) {
        this._offsetX = value;
    },
    enumerable: true,
    configurable: true
});

//-------------------------------------------------------------
Object.defineProperty(Phaser.GameObjects.Text.prototype, 'offsetY', {
    get() {
        return this._offsetY || 0;
    },
    set(value) {
        this._offsetY = value;
    },
    enumerable: true,
    configurable: true
});
//=============================================================
Object.defineProperty(Phaser.GameObjects.Container.prototype, 'offsetX', {
    get() {
        return this._offsetX || 0;
    },
    set(value) {
        this._offsetX = value;
    },
    enumerable: true,
    configurable: true
});

//-------------------------------------------------------------
Object.defineProperty(Phaser.GameObjects.Container.prototype, 'offsetY', {
    get() {
        return this._offsetY || 0;
    },
    set(value) {
        this._offsetY = value;
    },
    enumerable: true,
    configurable: true
});
//=============================================================
Phaser.GameObjects.GameObject.prototype.setOffset = function (offsetX = 0, offsetY) {
    if (!this.scene) return;
    this._offsetX = offsetX;
    this._offsetY = offsetY || offsetX;
    return this;
};

Phaser.GameObjects.Text.prototype.setOffset = Phaser.GameObjects.GameObject.prototype.setOffset;
Phaser.GameObjects.Container.prototype.setOffset = Phaser.GameObjects.GameObject.prototype.setOffset;

//-------------------------------------------------------------
Phaser.GameObjects.GameObject.prototype.setOffsetX = function (offset) {
    if (!this.scene) return;
    this._offsetX = offset;
    return this;
};

Phaser.GameObjects.Text.prototype.setOffsetX = Phaser.GameObjects.GameObject.prototype.setOffsetX;
Phaser.GameObjects.Container.prototype.setOffsetX = Phaser.GameObjects.GameObject.prototype.setOffsetX;

//-------------------------------------------------------------
Phaser.GameObjects.GameObject.prototype.setOffsetY = function (offset) {
    if (!this.scene) return;
    this._offsetY = offset;
    return this;
};

Phaser.GameObjects.Text.prototype.setOffsetY = Phaser.GameObjects.GameObject.prototype.setOffsetY;
Phaser.GameObjects.Container.prototype.setOffsetY = Phaser.GameObjects.GameObject.prototype.setOffsetY;

//-------------------------------------------------------------
Phaser.GameObjects.GameObject.prototype.getOffsetX = function () {
    if (!this.scene) return;
    return this._offsetX || 0;
};

Phaser.GameObjects.Text.prototype.getOffsetX = Phaser.GameObjects.GameObject.prototype.getOffsetX;
Phaser.GameObjects.Container.prototype.getOffsetX = Phaser.GameObjects.GameObject.prototype.getOffsetX;


//-------------------------------------------------------------
Phaser.GameObjects.GameObject.prototype.getOffsetY = function () {
    if (!this.scene) return;
    return this._offsetY || 0;
};

Phaser.GameObjects.Text.prototype.getOffsetY = Phaser.GameObjects.GameObject.prototype.getOffsetY;
Phaser.GameObjects.Container.prototype.getOffsetY = Phaser.GameObjects.GameObject.prototype.getOffsetY;
//=============================================================
export default class UiMode extends Phaser.Plugins.BasePlugin {
    constructor(pluginManager) {
        super(pluginManager);

        this.resize = this.resize.bind(this);

        function _updateBounds(scene, camera) {
            scene.left = camera.scrollX;
            scene.top = camera.scrollY;
            scene.right = camera.scrollX + scene.game.width;
            scene.bottom = camera.scrollY + scene.game.height;
            return camera;
        }

        function _centerCamera(camera, axis = 'both') {
            const scene = camera.scene;
            const game = scene.game;
            const { width, height } = game.config;

            if (axis === 'x' || axis === 'both') {
                camera.scrollX = -scene.game.width / 2 + width / 2;
            }

            if (axis === 'y' || axis === 'both') {
                camera.scrollY = -scene.game.height / 2 + height / 2;
            }

            return _updateBounds(scene, camera);
        }

        Object.assign(Phaser.Cameras.Scene2D.Camera.prototype, {
            autoCenter(enable) {
                this._ui_plugin_center = enable;
                _centerCamera(this);
                return enable ? _centerCamera(this) : this;
            },

            autoCenterX(enable) {
                this._ui_plugin_centerX = enable;
                return enable ? _centerCamera(this, 'x') : this;
            },

            autoCenterY(enable) {
                this._ui_plugin_centerY = enable;
                return enable ? _centerCamera(this, 'y') : this;
            },

            setCenter() {
                return _centerCamera(this);
            },

            setCenterX() {
                return _centerCamera(this, 'x');
            },

            setCenterY() {
                return _centerCamera(this, 'y');
            }
        });

        //=============================================================
        function patchScene(sceneClass) {
            //-------------------------------------------------------------
            // Init
            const originalInit = sceneClass.prototype.init;

            sceneClass.prototype.init = function (...args) {
                this.game.resize(this);
                if (originalInit) {
                    originalInit.apply(this, arguments);
                }
            };

            //-------------------------------------------------------------
            // Create
            const originalCreate = sceneClass.prototype.create;
            sceneClass.prototype.create = function (...args) {
                this.game.resize(this)
                if (originalCreate) {
                    originalCreate.apply(this, arguments);
                    this.game.resize(this);
                }
            };
            //-------------------------------------------------------------
            // Update
            const originalUpdate = sceneClass.prototype.update;
            sceneClass.prototype.update = function (time, deltaTime) {
                this.children.list.forEach(function (child) {
                    if (child.update) {
                        child.update(time, deltaTime);
                    }
                });
                if (originalUpdate) {
                    originalUpdate.apply(this, arguments);
                }
            }
        }

        //-------------------------------------------------------------
        for (const scene of this.game.config.sceneConfig) {
            patchScene(scene);
        }
    }

    //=============================================================
    init() {
        window.addEventListener('resize', this.resize);
        this.game.resize = this.resize;
        this.game.updateEdges = this.updateEdges;
        window.game = this.game;
    }

    //=============================================================
    updateEdges(scene) {
        const camera = scene.cameras.main;

        if (camera) {
            scene.left = camera.scrollX;
            scene.top = camera.scrollY;
            scene.right = camera.scrollX + scene.game.width;
            scene.bottom = camera.scrollY + scene.game.height;
        }
    }

    update() {
        function resizeChildren(children) {
            children.forEach(function (child) {
                if (child.onResize) {
                    child.onResize();
                }

                if (child.type === "Container" || child.type === "Layer") {
                    resizeChildren(child.list);
                }
            });
        }

        this.game.scene.scenes.forEach(scene => {
            const camera = scene.cameras.main;

            if (camera) {
                //-------------------------------------------------------------
                if (camera.onResize) {
                    camera.onResize(scene);
                }
                //-------------------------------------------------------------
                if (camera._ui_plugin_center) {
                    camera.scrollX = -scene.game.width / 2 + scene.game.config.width / 2;
                    camera.scrollY = -scene.game.height / 2 + scene.game.config.height / 2;
                }

                //-------------------------------------------------------------
                if (camera._ui_plugin_centerX) {
                    camera.scrollX = -scene.game.width / 2 + scene.game.config.width / 2;
                }

                //-------------------------------------------------------------
                if (camera._ui_plugin_centerY) {
                    camera.scrollY = -scene.game.height / 2 + scene.game.config.height / 2;
                }

                //-------------------------------------------------------------
                this.updateEdges(scene)
                //-------------------------------------------------------------

                resizeChildren(scene.children.list)

                //-------------------------------------------------------------
                if (scene.getUiMode()) {
                    scene.children.list.forEach(object => {
                        if (object.uiMode == undefined) {
                            object.uiMode = true;
                            object.uiX = object.x;
                            object.uiY = object.y;
                        }

                        const newX = (object.uiX * this.game.width) + (object._offsetX || 0);
                        const newY = (object.uiY * this.game.height) + (object._offsetY || 0);

                        object.setPosition(newX, newY);
                    });
                }
            }
        });
    }

    //=============================================================
    resize(scene) {
        const { config, scale } = this.game;
        const MIN_SIZE = 64, MAX_SIZE = 8192;
        const [bw, bh] = [Math.max(1, window.innerWidth), Math.max(1, window.innerHeight)];
        const [roomWidth, roomHeight] = [config.width, config.height];

        //-------------------------------------------------------------
        const isWider = bw / bh > roomWidth / roomHeight;
        const newWidth = isWider ? roomHeight * bw / bh : roomWidth;
        const newHeight = isWider ? roomHeight : roomWidth * bh / bw;

        //-------------------------------------------------------------
        this.game.width = Phaser.Math.Clamp(newWidth, MIN_SIZE, MAX_SIZE);
        this.game.height = Phaser.Math.Clamp(newHeight, MIN_SIZE, MAX_SIZE);

        //-------------------------------------------------------------
        const zoom = bh / this.game.height;

        scale.setZoom(isFinite(zoom) && zoom > 0 ? zoom : 1);
        scale.resize(this.game.width, this.game.height);
        scale.refresh();

        this.update();
    }
}