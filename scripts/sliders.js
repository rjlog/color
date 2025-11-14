import { tsvToRgb } from './color.js';

const rgbSliders = {
    red: document.querySelector("#slider-red"),
    green: document.querySelector("#slider-green"),
    blue: document.querySelector("#slider-blue"),
};

const valueSlider = document.querySelector("#value-slider");

const rgbInputs = {
    red: document.querySelector("#red-input"),
    green: document.querySelector("#green-input"),
    blue: document.querySelector("#blue-input"),
};

const valueInput = document.querySelector("#value-input");

function updateRgbSliderBackgrounds(rgb) {
    rgbSliders.red.style.background = `linear-gradient(to right, rgb(0, ${rgb[1]}, ${rgb[2]}), rgb(255, ${rgb[1]}, ${rgb[2]}))`;
    rgbSliders.green.style.background = `linear-gradient(to right, rgb(${rgb[0]}, 0, ${rgb[2]}), rgb(${rgb[0]}, 255, ${rgb[2]}))`;
    rgbSliders.blue.style.background = `linear-gradient(to right, rgb(${rgb[0]}, ${rgb[1]}, 0), rgb(${rgb[0]}, ${rgb[1]}, 255))`;
}

function updateValueSliderBackground(turn, saturation) {
    for (let x = 0; x < canvasWidth; x++) {
        const [r, g, b] = tsvToRgb(turn, saturation, x / (canvasWidth - 1)).map(c => c * 255);
        const index = x * 4;
        imageData.data[index] = r;
        imageData.data[index + 1] = g;
        imageData.data[index + 2] = b;
        imageData.data[index + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
}


export function updateRgbInput(rgb) {
    rgbSliders.red.value = rgb[0];
    rgbSliders.green.value = rgb[1];
    rgbSliders.blue.value = rgb[2];

    rgbInputs.red.value = rgb[0];
    rgbInputs.green.value = rgb[1];
    rgbInputs.blue.value = rgb[2];

    updateRgbSliderBackgrounds(rgb);
}

export function updateValueInput(turn, saturation, value) {
    valueSlider.value = value;
    valueInput.value = value;
    updateValueSliderBackground(turn, saturation);
}

export function initSliders(handleRgbInputChange, handleValueInputChange) {
    updateValueSliderBackground(0, 0)
    Object.values(rgbSliders).forEach(slider => slider.addEventListener("input", () => {
        const rgb = Object.values(rgbSliders).map(s => parseInt(s.value, 10));
        rgbInputs.red.value = rgb[0];
        rgbInputs.green.value = rgb[1];
        rgbInputs.blue.value = rgb[2];
        updateRgbSliderBackgrounds(rgb);
        handleRgbInputChange(rgb.map(val => val / 255));
    }));

    Object.values(rgbInputs).forEach(input => input.addEventListener("input", () => {
        let rgb = [
            parseInt(rgbInputs.red.value),
            parseInt(rgbInputs.green.value),
            parseInt(rgbInputs.blue.value)
        ];

        rgb = rgb.map(v => Math.max(0, Math.min(255, v || 0)));

        rgbSliders.red.value = rgb[0];
        rgbSliders.green.value = rgb[1];
        rgbSliders.blue.value = rgb[2];

        updateRgbSliderBackgrounds(rgb);
        handleRgbInputChange(rgb.map(val => val / 255));
    }));

    valueSlider.addEventListener("input", () => {
        const value255 = parseInt(valueSlider.value, 10);
        valueInput.value = value255;
        handleValueInputChange(value255 / 255);
    });

    valueInput.addEventListener("input", () => {
        let value255 = parseInt(valueInput.value, 10);
        value255 = Math.max(0, Math.min(255, value255 || 0));
        valueSlider.value = value255;
        handleValueInputChange(value255 / 255);
    });
}

const canvas = document.querySelector("#value-slider-bg-canvas");
const canvasWidth = canvas.width;
canvas.height = 1;
const canvasHeight = canvas.height;
const ctx = canvas.getContext("2d");
const imageData = ctx.createImageData(canvasWidth, canvasHeight);