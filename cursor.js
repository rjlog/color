/**
 * TODO: keyboard support for accessibility
 * TODO: hsv and rgb slider values -> rgb values:
 * 
 * function to get the hue and saturation from rgb values to update the cursor
 *
 * rgb point -> oklab -> okhue -> 1D lookup table -> normalised hue
 *
 */

import {colorWheelCanvas, canvasSize, radius, getColor} from "./color-wheel.js";

const cursor = document.querySelector("#cursor");
const centerX = canvasSize / 2;
const centerY = canvasSize / 2;

main()
function main() {
    // Animation
    const computedStyle = window.getComputedStyle(cursor);
    const mousedownSize = 15 + 'px'
    
    const keyframes = [
        { width: computedStyle.width, height: computedStyle.height},
        { width: mousedownSize, height: mousedownSize}
    ];
    const optionsForward = {
        duration: 80,    // Animation duration in milliseconds
        iterations: 1,      // Number of times the animation should repeat
        fill: 'forwards'
    };

    const optionsReverse = {
        duration: 80,    // Animation duration in milliseconds
        iterations: 1,      // Number of times the animation should repeat
        fill: 'forwards',
        direction: 'reverse'
    };

    // Mouse
    let dragging = false;
    onmouseup = () => {
        if (dragging) {
            dragging = false;
            cursor.animate(keyframes, optionsReverse);
        }
    }
    document.body.onblur = onmouseup;
    
    colorWheelCanvas.onmousedown = (event) => {
        cursor.animate(keyframes, optionsForward);
        dragging = true;
        moveWithMouse(event);
    }
    onmousemove = (event) => {
        if (dragging) {
            moveWithMouse(event);
        }
    }
    if ("ontouchstart" in window) {
        //Touchscreen
        colorWheelCanvas.ontouchstart = (event) => {
            cursor.animate(keyframes, optionsForward);
            dragging = true;
            moveWithTouch(event.touches[0]);
        }
        ontouchmove = (event) => {
            if (dragging) {
                moveWithTouch(event.touches[0]);
            }
        }
        ontouchend = onmouseup;
    }
}

function moveWithMouse(event) {
    move(event.clientX, event.clientY);
}

function moveWithTouch(event) {
    move(event.clientX, event.clientY);
}

function move(clientX, clientY) {
    let x = clientX - colorWheelCanvas.getBoundingClientRect().left;
    let y = clientY - colorWheelCanvas.getBoundingClientRect().top;
    const radiusWheel = radius * canvasSize;
    const distance = Math.hypot(centerX - x, centerY - y);
    const dx = centerX - x;
    const dy = centerY - y;
    if (Math.hypot(dx, dy) > radiusWheel) {
        x = centerX - dx / distance * radiusWheel;
        y = centerY - dy / distance * radiusWheel;
    }
    cursor.style.left = x + 'px';
    cursor.style.top = y + 'px';
}