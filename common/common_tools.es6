
export function aspectRatio(ratioparam, idEl = "airlayer", idParent = "canvas", customSize) {
    // change ratio to the global ratio store in the app
    let ratio = ratioparam;
    let parent = document.getElementById(idParent);
    let canvas = document.getElementById(idEl);

    /* this is to avoid get values from react flow when using event listeners that do not exist in react
     * get the values from window.object */
    if (customSize === 0) {
        canvas.style.height = "100%";
        canvas.style.width = "100%";
        if(window.canvasRatio === undefined) {
            window.canvasRatio = ratio; // https://stackoverflow.com/questions/19014250/reactjs-rerender-on-browser-resize
        } else {
            ratio = window.canvasRatio;
        }
        let w = canvas.offsetWidth;
        let h = canvas.offsetHeight;
        canvas.style.marginTop = 0 + 'px';
        if (w > ratio * h) {
            canvas.style.width = (ratio * h) + "px";
        } else if (h > w / ratio) {
            let newHeight = w / ratio;
            canvas.style.height = newHeight + "px";
            if (parent/* && parent.offsetHeight - newHeight > 0*/) {
                canvas.style.marginTop = ((parent.offsetHeight - canvas.offsetHeight) / 2 - 5) + 'px';
            }
        }
    } else {
        console.log(customSize);
        canvas.style.height = customSize.height + 'px';
        canvas.style.width = customSize.width + 'px';
    }
}

export function toggleFullScreen(element) {
    if(!element) {
        element = document.documentElement;
    }

    if (isFullScreenOn()) {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
    else if (!element.fullscreenElement && // alternative standard method
        !element.mozFullScreenElement && !element.webkitFullscreenElement && !element.msFullscreenElement) { // current working methods
        if (element.requestFullscreen) {
            element.requestFullscreen();
            document.body.requestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
            document.body.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
            document.body.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            document.body.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }

    }

}

export function isFullScreenOn() {
    return (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
}

export function fullScreenListener(callback, set) {
    if (set) {
        document.addEventListener('webkitfullscreenchange', callback);
        document.addEventListener('mozfullscreenchange', callback);
        document.addEventListener('fullscreenchange', callback);
        document.addEventListener('MSFullscreenChange', callback);
    } else {
        document.removeEventListener('webkitfullscreenchange', callback);
        document.removeEventListener('mozfullscreenchange', callback);
        document.removeEventListener('fullscreenchange', callback);
        document.removeEventListener('MSFullscreenChange', callback);
    }
}
