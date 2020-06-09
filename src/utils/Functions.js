import { STORAGE_KEYS } from "utils/Definitions";

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