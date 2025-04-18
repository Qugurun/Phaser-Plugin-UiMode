[![Page Views Count](https://badges.toozhao.com/badges/01JRF7P6GTKZSJV50TXAPFGT96/green.svg)](https://badges.toozhao.com/stats/01JRF7P6GTKZSJV50TXAPFGT96 "Get your own page views count badge on badges.toozhao.com")

# Phaser-Plugin-UiMode 2.0.2
The plugin introduces an adaptive interface for HUD system to Phaser 3, enabling easy creation of responsive scenes.

![preview.gif](https://github.com/Qugurun/Phaser-Plugin-UiMode/blob/main/preview.gif)


[Live example - uiMode](https://qugurun.github.io/phaser-uimode/index.html "UiMode") →

# UIMode Plugin Installation Guide

## **Step 1: Import the Plugin**

Add the `UIMode` plugin import to your Phaser 3 game configuration file:

```js
import UIMode from './UIMode'; // Adjust the path if needed
```

## **Step 2: Add to Phaser Config**

Include the plugin in the `global` plugins section of your Phaser game configuration:

```js
const config = {
	// ... other settings
    plugins: {
        global: [{
            key: 'UIMode',
            plugin: UIMode,
            start: true
        }],
    },
	// ... other settings
};
```
# API Documentation

## Scene Methods

### `setUiMode(enabled)`
Enables or disables UI mode for the scene.

**Parameters:**
- `enabled` (Boolean) - `true` to enable UI mode, `false` to disable

**Example:**
```js
// Enable UI mode
this.setUiMode(true);
```

### `getUiMode()`

Gets the current UI mode state.

**Returns:**

- For mode check: `Boolean` - `true` if UI mode is enabled

**Example:**
```js
const isUiMode = this.getUiMode(); // Returns boolean
```

---
## Camera Methods

### `autoCenter(value)`

Enables/disables automatic XY centering of the game area.

**Parameters:**

- `value` (Boolean) - `true` to enable, `false` to disable

**Example:**
```js
create() {
    this.cameras.main.autoCenter(true);
}
```

### `autoCenterX(value)`

Enables/disables automatic X-axis centering of the game area.

**Parameters:**

- `value` (Boolean) - `true` to enable, `false` to disable

**Example:**
```js
create() {
    this.cameras.main.autoCenterX(true);
}
```

### `autoCenterY(value)`

Enables/disables automatic Y-axis centering of the game area.

**Parameters:**

- `value` (Boolean) - `true` to enable, `false` to disable

**Example:**
```js
create() {
    this.cameras.main.autoCenterY(true);
}
```

### `setCenter()`

One-time camera centering (XY) without auto-update.

**Example:**
```js
create() {
    this.cameras.main.setCenter();
}
```

### `setCenterX()`

One-time camera X-axis centering without auto-update.

**Example:**
```js
create() {
    this.cameras.main.setCenterX();
}
```

### `setCenterY()`

One-time camera Y-axis centering without auto-update.

**Example:**
```js
create() {
    this.cameras.main.setCenterY();
}
```

---
## Object Methods

These methods work only in UI scenes.

### `setOffset(offsetX, offsetY)`

Sets XY position offset in pixels.

**Parameters:**

- `offsetX` (Number) - X offset in pixels
- `offsetY` (Number) - Y offset in pixels

**Example:**
```js
create() {
    this.setUiMode(true);
    const image = this.add.image(0, 1, "imageKey");
    image.setOffset(-50, 50);
}
```


### `setOffsetX(offset)`

Sets X position offset in pixels.

**Parameters:**

- `offset` (Number) - X offset in pixels

**Example:**
```js
create() {
    this.setUiMode(true);
    const image = this.add.image(0, 1, "imageKey");
    image.setOffsetX(-50);
}
```


### `setOffsetY(offset)`

Sets Y position offset in pixels.

**Parameters:**

- `offset` (Number) - Y offset in pixels

**Example:**
```js
create() {
    this.setUiMode(true);
    const image = this.add.image(0, 1, "imageKey");
    image.setOffsetY(50);
}
```


### `getOffsetX()`

Returns the **X position offset** of the object in pixels.

#### **Returns:**

- `number` – The current X offset value in pixels.

**Example:**
```js
create() {  
    this.setUiMode(true);
    const image = this.add.image(0, 0, "imageKey");  
    image.setOffsetX(20);  
    const offsetX = image.getOffsetX(); // Returns 20  
    console.log(offsetX);  
}
```


### `getOffsetY()`

Returns the **Y position offset** of the object in pixels.

#### **Returns:**

- `number` – The current Y offset value in pixels.

**Example:**
```js
create() {  
    this.setUiMode(true);
    const image = this.add.image(0, 0, "imageKey");  
    image.setOffsetY(30);  
    const offsetY = image.getOffsetY(); // Returns 30  
    console.log(offsetY);  
}  
```


### `update(t, dt)`

Called automatically every frame (if enabled) to handle object updates.

Parameters:
- `t` (number) - Current timestamp
- `dt` (number) - Delta time since last frame in milliseconds

**Example:**
```js
create() {
    const obj = this.add.sprite(100, 100, 'spriteKey');
    obj.update = function(t, dt) {
        // Custom update logic
        this.x += dt * 0.1; // Move right at 0.1px/ms
    };
}
```


### `onResize()`

Automatically triggered when the game canvas resizes. Useful for responsive UI adjustments.

**Example:**
```js
create() {
    const button = this.add.image(100, 100, 'button');
    button.onResize = function() {
        // Reposition when screen resizes
        console.log("Resize!");
    };
}
```

---
## UI Mode Behavior

When the scene is in UI mode (`setUiMode(true)`), it uses **normalized coordinates** for positioning elements relative to the viewport:

#### Key Principles:

1. **X-Axis (Horizontal):**
    
    - `0` = 0% (left edge of the viewport)
    - `1` = 100% (right edge of the viewport)
    - `0.5` = 50% (center)
        
2. **Y-Axis (Vertical):**
    
    - `0` = 0% (top edge of the viewport)
    - `1` = 100% (bottom edge of the viewport)
    - `0.5` = 50% (middle)

**Example:**
```js
// Places an image at the top-left corner (0%, 0%)
this.add.image(0, 0, "image");

// Centers an object (50% X, 50% Y)
this.add.image(0.5, 0.5, "centeredImage");

// Positions an object at the right edge (100% X) and 25% from the top
this.add.image(1, 0.25, "rightAlignedImage");
```

#### Key Features:

- **Automatic Responsiveness:** Objects maintain their relative positions when the window is resized.
- **Offsets (`setOffset`)** are still defined in pixels and apply on top of percentage-based positions:

```js
    this.setUiMode(true);
	// Object at 50% X but shifted 100px left
    const obj = this.add.image(0.5, 0, "icon");
    obj.setOffsetX(-100); // Pixels!
```

- **Camera Behavior:** In UI mode, the camera automatically adjusts to the viewport, making methods like `autoCenter()` unnecessary.

#### Coordinate System Visualization:

```js
(0,0) —— X —— (1,0)
 |               |
 Y               Y
 |               |
(0,1) —— X —— (1,1)
```

---
### `game.updateEdges(scene)`

Forces an update of the scene's boundary variables. While these values are automatically updated during window resizing, manual camera movements require explicit updates to maintain accuracy.

#### Description

Updates the following scene properties with current camera-relative boundaries:

- `scene.left` - Leftmost visible X-coordinate
- `scene.top` - Topmost visible Y-coordinate
- `scene.right` - Rightmost visible X-coordinate
- `scene.bottom` - Bottommost visible Y-coordinate
#### When to Use

Call this method after:

- Manual camera position changes (`scrollX`/`scrollY`)

**Example:**
```js
update() {
    // Manual camera movement
    this.cameras.main.scrollX -= 1.0;
    
    // Update boundary values
    this.game.updateEdges(this);
    
    // Position object at current left-top edge
    this.bar.setPosition(this.left, this.top);
}
```

---
### `game.resize()`

Triggers a complete recalculation of the game's layout and camera parameters. While this method is automatically called during browser window resizing, it can be manually invoked when forced layout updates are required.

#### Description

Performs a full refresh of:

- Viewport dimensions
- Camera bounds and scroll positions
- Scene boundary calculations (updates `scene.left`/`right`/`top`/`bottom`)
  
**Example:**
```js
this.game.resize();
```

### `game.width` | `game.width`

Return the current logical dimensions of the game's playable area, automatically updated during resize browser.

#### Description

- **`game.width`**  
    Current width of the game's visible area in pixels  
    _Equivalent to `game.config.width` adjusted for scaling_
- **`game.width`**  
    Current height of the game's visible area in pixels  
    _Equivalent to `game.config.height` adjusted for scaling_

---
#### Roadmap
