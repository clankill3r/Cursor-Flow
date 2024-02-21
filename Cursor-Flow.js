/*   C U R S O R - F L O W   - V-1.0

By Doeke Wartena

LICENSE:
    See end of file for license information.

*/
/*

List of cursor types:
https://developer.mozilla.org/en-US/docs/Web/CSS/cursor

auto 
default 
none 
context-menu 
help 
pointer 
progress 
wait 
cell 
crosshair 
text 
vertical-text 
alias 
copy 
move 
no-drop 
not-allowed 
grab 
grabbing 
e-resize 
n-resize 
ne-resize 
nw-resize 
s-resize 
se-resize 
sw-resize 
w-resize 
ew-resize 
ns-resize 
nesw-resize 
nwse-resize 
col-resize 
row-resize 
all-scroll 
zoom-in 
zoom-out
*/
"use strict";


if (document.readyState === "complete" || document.readyState === "interactive") {
    main();
} else {
    document.addEventListener("DOMContentLoaded", main);
}



function main() {

    let mouseX = 0;
    let mouseY = 0;

    let prev_mouses = [[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]];
    let prev_mouses_index = 0;

    let cursor;

    let cursor_moved = true;


    function init() {
        cursor = document.createElement('div');
        cursor.classList.add('CF-cursor');
        document.body.appendChild(cursor);
    }
    init();


    document.documentElement.addEventListener('mouseleave',  function(evt) {
        if (cursor == undefined) return;
        cursor.style.display = 'none';
    });

    document.documentElement.addEventListener('mouseenter',  function(evt) {
        if (cursor == undefined) return;
        cursor.style.display = '';
    });

    document.documentElement.addEventListener('mousemove', function(evt) {
        prev_mouses[prev_mouses_index] = [mouseX, mouseY];
        prev_mouses_index += 1;
        if (prev_mouses_index == 10) {
            prev_mouses_index = 0;
        }
        mouseX = evt.clientX;
        mouseY = evt.clientY;

        cursor_moved = true;

        //
        // cursor based on element interaction
        //

        cursor.classList.remove('pointer');
        cursor.classList.remove('text');
        cursor.classList.remove('default');

        let element_under_cursor = document.elementFromPoint(evt.clientX, evt.clientY);

        let cursor_type_set = false;

        if (element_under_cursor instanceof HTMLTextAreaElement) {
            cursor.classList.add('text');
            // we could be nice and check if we are on the bottom right corner to show
            // the cursor for scaling the text area.
            // But in order to do that correct I need to check it with different browsers
            // and operating systems and so on properly...
            cursor_type_set = true;
        }
        else {
            let is_anchor = false;
            let current = element_under_cursor;
            while (current != null || current != undefined) {
                if (current instanceof HTMLAnchorElement) {
                    is_anchor = true;
                    break;
                }
                current = current.parentNode;
            }

            if (is_anchor) {
                cursor.classList.add('pointer');
                cursor_type_set = true;
            }
        }

        if (!cursor_type_set) {
            cursor.classList.add('default');
        }
    });


    function render_cursor() {

        if (!cursor_moved) {
            requestAnimationFrame(render_cursor);
            return;
        }

        cursor.style.left = mouseX+"px";
        cursor.style.top = mouseY+"px";
        cursor.style.transformOrigin = "0px 0px";

        let oldest_mouse = prev_mouses[(prev_mouses_index + 2) % 10];
        
        let angle_target = Math.atan2(mouseY - oldest_mouse[1], mouseX - oldest_mouse[0]);
        angle_target += Math.PI/2;

        let angle = angle_target;

        cursor.style.transform = `rotate(${angle}rad)`;
        
        cursor_moved = false;

        requestAnimationFrame(render_cursor);
    }

    render_cursor();
};

/*
------------------------------------------------------------------------------
This software is available under 2 licenses -- choose whichever you prefer.
------------------------------------------------------------------------------
ALTERNATIVE A - MIT License
Copyright (c) 2024 Doeke Wartena
Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
------------------------------------------------------------------------------
ALTERNATIVE B - Public Domain (www.unlicense.org)
This is free and unencumbered software released into the public domain.
Anyone is free to copy, modify, publish, use, compile, sell, or distribute this
software, either in source code form or as a compiled binary, for any purpose,
commercial or non-commercial, and by any means.
In jurisdictions that recognize copyright laws, the author or authors of this
software dedicate any and all copyright interest in the software to the public
domain. We make this dedication for the benefit of the public at large and to
the detriment of our heirs and successors. We intend this dedication to be an
overt act of relinquishment in perpetuity of all present and future rights to
this software under copyright law.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
------------------------------------------------------------------------------
*/