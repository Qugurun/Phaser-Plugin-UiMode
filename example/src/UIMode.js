/**
 * Phaser 3 UIMode Plugin
 * Version: 1.0.0
 * Author: WitGames (https://wit.games/)
 * License: MIT
 */

import "phaser";

//=============================================================
Phaser.Scene.prototype.setUiMode = function (value, unitType = "px") {
    this._uiMode = value;
    this._uiUnitType = unitType;
    return this;
};

//-------------------------------------------------------------
Phaser.Scene.prototype.getUiMode = function () {
    return this._uiMode || false;
};

//-------------------------------------------------------------
Phaser.Scene.prototype.setUnitType = function (unitType) {
    this._uiUnitType = unitType;
    return this;
};
//-------------------------------------------------------------

Phaser.Scene.prototype.getUnitType = function () {
    return this._uiUnitType || "px";
};

//=============================================================
Object.defineProperty(Phaser.GameObjects.GameObject.prototype, 'offsetX', {
    get() {
        return this.data_ui.offsetX || 0;
    },
    set(value) {
        this.data_ui.offsetX = value;
    },
    enumerable: true,
    configurable: true
});

//-------------------------------------------------------------
Object.defineProperty(Phaser.GameObjects.GameObject.prototype, 'offsetY', {
    get() {
        return this.data_ui.offsetY || 0;
    },
    set(value) {
        this.data_ui.offsetY = value;
    },
    enumerable: true,
    configurable: true
});

//=============================================================
Phaser.GameObjects.GameObject.prototype.setOffset = function (offsetX = 0, offsetY) {
    if (!this.scene) return;
    this.data_ui.offsetX = offsetX;
    this.data_ui.offsetY = offsetY || offsetX;
    return this;
};

//-------------------------------------------------------------
Phaser.GameObjects.GameObject.prototype.setOffsetX = function (offset) {
    if (!this.scene) return;
    this.data_ui.offsetX = offset;
    return this;
};

//-------------------------------------------------------------
Phaser.GameObjects.GameObject.prototype.setOffsetY = function (offset) {
    if (!this.scene) return;
    this.data_ui.offsetY = offset;
    return this;
};

//-------------------------------------------------------------
Phaser.GameObjects.GameObject.prototype.getOffsetX = function () {
    if (!this.scene) return;
    return this.data_ui.offsetX || 0;
};

//-------------------------------------------------------------
Phaser.GameObjects.GameObject.prototype.getOffsetY = function () {
    if (!this.scene) return;
    return this.data_ui.offsetY || 0;
};

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
                // patch add
                const originalAdd = Object.create(this.add);
                const customAdd = {};
                for (const key in originalAdd) {
                    if (typeof originalAdd[key] === 'function') {
                        customAdd[key] = function (...args) {

                            const obj = originalAdd[key].apply(originalAdd, args);
                            const { width, height } = this.game.config;
                            if (this._uiMode) {
                                if (this._uiUnitType === "px") {
                                    obj.data_ui = {
                                        relX: obj.x / width,
                                        relY: obj.y / height,
                                        offsetX: 0,
                                        offsetY: 0,
                                    };
                                } else if (this._uiUnitType === "%") {
                                    obj.data_ui = {
                                        relX: obj.x,
                                        relY: obj.y,
                                        offsetX: 0,
                                        offsetY: 0,
                                    };
                                }
                            }

                            return obj;
                        }.bind(this);
                    } else {
                        customAdd[key] = originalAdd[key];
                    }
                }

                this.add = customAdd;

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
                        const newX = (object.data_ui.relX * this.game.width) + object.data_ui.offsetX;
                        const newY = (object.data_ui.relY * this.game.height) + object.data_ui.offsetY;
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