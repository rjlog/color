// TODO: keyboard support for accessibility

import { canvasSize, colorWheelCanvas, radius} from './color-wheel.js';

export const cursor = document.querySelector('#cursor');
const centerX = canvasSize / 2;
const centerY = canvasSize / 2;


export function initCursor(handleCursorChange) {
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
        handleMouseEvent(event, handleCursorChange);
    }
    onmousemove = (event) => {
        if (dragging) {
            handleMouseEvent(event, handleCursorChange);
        }
    }
    if ("ontouchstart" in window) {
        //Touchscreen
        colorWheelCanvas.ontouchstart = (event) => {
            cursor.animate(keyframes, optionsForward);
            dragging = true;
            handleMouseEvent(event.touches[0], handleCursorChange);
        }
        ontouchmove = (event) => {
            if (dragging) {
                handleMouseEvent(event.touches[0], handleCursorChange);
            }
        }
        ontouchend = onmouseup;
    }
}

function handleMouseEvent(event, handleCursorChange) {
    let x = event.clientX - colorWheelCanvas.getBoundingClientRect().left;
    let y = event.clientY - colorWheelCanvas.getBoundingClientRect().top;
    const radiusWheel = radius * canvasSize;
    const dx = centerX - x;
    const dy = centerY - y;
    const distance = Math.hypot(dx, dy);
    if (distance > radiusWheel) {
        x = centerX - dx / distance * radiusWheel;
        y = centerY - dy / distance * radiusWheel;
    }
    cursor.style.left = x + 'px';
    cursor.style.top = y + 'px';
    handleCursorChange(dx, dy, Math.min(distance / radiusWheel, 1))
}




// There's a weird quirk where blue+green can give the same hue as blue+red. Maybe oklab is not good here?
export function updateCursor(turn, saturation) {

    const distance =  Math.acos(1 - saturation / 0.553) / 0.8 / Math.PI;
    const radians = turn * 2 * Math.PI;
    const radiusWheel = radius * canvasSize;
    cursor.style.left = Math.cos(radians) * radiusWheel * distance + canvasSize / 2 + 'px';
    cursor.style.top = Math.sin(radians) * radiusWheel * distance + canvasSize / 2 + 'px';
}

