import { initCursor, updateCursor } from "./cursor.js";
import { initSliders, updateRgbInput, updateValueInput } from './sliders.js';
import { initColorWheel } from './color-wheel.js';
import { rgbToTsv, tsvToRgb, rgbToHex, hexToRgb } from "./color.js";

const hexDisplay = document.querySelector("#hex-display");

let turn = 0.0
let saturation = 0.0
let value = 0.0
let color

export function handleCursorChange(x, y, distance_center) {
    saturation = -0.553 * Math.cos(0.8 * Math.PI * distance_center) + 0.553;
    turn = 0.5 - 0.5 * Math.atan2(-y, x) / Math.PI;
    color = tsvToRgb(turn, saturation, value)
    updateHash()
    updateRgbInput(color.map(value => Math.round(value * 255)))
    updateValueInput(turn, saturation, Math.round(value * 255))
}


export function handleRgbInputChange(rgb) {
    [turn, saturation, value] = rgbToTsv(rgb)
    updateCursor(turn, saturation)
    updateValueInput(turn, saturation, Math.round(value * 255))
    color = rgb
    updateHash()
}

export function handleValueInputChange(v) {
    value = v
    color = tsvToRgb(turn, saturation, value)
    updateHash()
    updateRgbInput(color.map(value => Math.round(value * 255)))
}

function updateHash() {
    const hex = rgbToHex(color);
    hexDisplay.textContent = '#' + hex;

    if (isDown === false)
        location.hash = hex
}


document.addEventListener('mouseup', () => updateHash());

document.addEventListener('touchend', () => updateHash());

let isDown = false;

document.body.addEventListener('mousedown', function(event) {
    if (event.button === 0) {
        isDown = true;
    }
});

document.body.addEventListener('mouseup', function() {
    isDown = false;
});

document.body.addEventListener('touchstart', function(event) {
    if (event.touches.length > 0) {
        isDown = true;
    }
});

document.body.addEventListener('touchend', function(event) {
    if (event.touches.length === 0) {
        isDown = false;
    }
});

initSliders(handleRgbInputChange, handleValueInputChange)
initColorWheel()
initCursor(handleCursorChange)

color = hexToRgb(location.hash)
if (color) {
    updateRgbInput(color.map(value => Math.round(value * 255)));
    [turn, saturation, value] = rgbToTsv(color)
    updateValueInput(turn, saturation, Math.round(value * 255))
    updateCursor(turn, saturation)
    updateHash()
}