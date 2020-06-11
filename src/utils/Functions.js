import { STORAGE_KEYS } from "utils/Definitions";

const { ipcRenderer } = window.require("electron");

export const getScrollbarWidth = () => { //by https://stackoverflow.com/a/13382873
    // Creating invisible container
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll'; // forcing scrollbar to appear
    outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
    document.body.appendChild(outer);

    // Creating inner element and placing it in the container
    const inner = document.createElement('div');
    outer.appendChild(inner);

    // Calculating difference between container's full width and the child width
    const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);

    // Removing temporary elements from the DOM
    outer.parentNode.removeChild(outer);

    return scrollbarWidth;
}

export const makeCancelable = (promise) => { //by  istarkov (https://github.com/facebook/react/issues/5465#issuecomment-157888325)
    let hasCanceled_ = false;

    const wrappedPromise = new Promise((resolve, reject) => {
        promise.then(
            val => hasCanceled_ ? reject({isCanceled: true}) : resolve(val),
            error => hasCanceled_ ? reject({isCanceled: true}) : reject(error)
        );
    });

    return {
        promise: wrappedPromise,
        cancel() {
            hasCanceled_ = true;
        },
    };
};

export const normalizeString = (string) => { //by Lewis Diamond (https://stackoverflow.com/a/37511463)
    return string.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

export const clearAuthLocalStorage = () => {
    localStorage.removeItem(STORAGE_KEYS.SERVER);
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
};

export const downloadFile = (url, fileName, onProgress) => {
    return new Promise(resolve => {
        ipcRenderer.send("download-tmp-file", {
            url: url,
            fileName: fileName
        });

        if(onProgress) {
            ipcRenderer.on("download-tmp-file-progress", (event, arg) => {
                arg.percent *= 100.0;
                onProgress(arg);
            });
        }

        ipcRenderer.on("download-tmp-file", (event, arg) => {
            resolve(arg);
        })
    });
};

export const downloadYoutubeVideo = (id, fileName, onProgress) => {
    return new Promise(resolve => {
        ipcRenderer.send("download-youtube-video", {
            url: "http://www.youtube.com/watch?v=" + id,
            fileName: fileName
        });

        if(onProgress) {
            ipcRenderer.on("download-youtube-video-progress", (event, arg) => {
                onProgress(arg);
            });
        }

        ipcRenderer.on("download-youtube-video", (event, arg) => {
            resolve(arg);
        })
    });
};