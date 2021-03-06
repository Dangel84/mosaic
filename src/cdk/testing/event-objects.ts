/** Creates a browser MouseEvent with the specified options. */
// tslint:disable-next-line:no-reserved-keywords
export function createMouseEvent(type: string, x = 0, y = 0) {
    const event = document.createEvent('MouseEvent');

    event.initMouseEvent(type,
        false, /* canBubble */
        false, /* cancelable */
        window, /* view */
        0, /* detail */
        x, /* screenX */
        y, /* screenY */
        x, /* clientX */
        y, /* clientY */
        false, /* ctrlKey */
        false, /* altKey */
        false, /* shiftKey */
        false, /* metaKey */
        0, /* button */
        null /* relatedTarget */);

    return event;
}

/** Creates a browser TouchEvent with the specified pointer coordinates. */
// tslint:disable-next-line:no-reserved-keywords
export function createTouchEvent(type: string, pageX = 0, pageY = 0) {
    // In favor of creating events that work for most of the browsers, the event is created
    // as a basic UI Event. The necessary details for the event will be set manually.
    const event = document.createEvent('UIEvent');
    const touchDetails = { pageX, pageY };

    event.initUIEvent(type, true, true, window, 0);

    // Most of the browsers don't have a "initTouchEvent" method that can be used to define
    // the touch details.
    Object.defineProperties(event, {
        touches: { value: [touchDetails] }
    });

    return event;
}

/** Dispatches a keydown event from an element. */
// tslint:disable-next-line:no-reserved-keywords
export function createKeyboardEvent(type: string, keyCode: number, target?: Element, key?: string,
                                    shiftKey = false, ctrlKey = false, altKey = false) {
    const event = document.createEvent('KeyboardEvent') as any;
    // Firefox does not support `initKeyboardEvent`, but supports `initKeyEvent`.
    const initEventFn = (event.initKeyEvent || event.initKeyboardEvent).bind(event);
    const originalPreventDefault = event.preventDefault;

    initEventFn(type, true, true, window, 0, 0, 0, 0, 0, keyCode);

    // Webkit Browsers don't set the keyCode when calling the init function.
    // See related bug https://bugs.webkit.org/show_bug.cgi?id=16735
    Object.defineProperties(event, {
        keyCode: { get: () => keyCode },
        key: { get: () => key },
        target: { get: () => target },
        shiftKey: { get: () => shiftKey },
        ctrlKey: { get: () => ctrlKey },
        altKey: { get: () => altKey }
    });

    // IE won't set `defaultPrevented` on synthetic events so we need to do it manually.
    event.preventDefault = function() {
        Object.defineProperty(event, 'defaultPrevented', {get: () => true});

        return originalPreventDefault.apply(this, arguments);
    };

    return event;
}

/** Creates a fake event object with any desired event type. */
// tslint:disable-next-line:no-reserved-keywords
export function createFakeEvent(type: string, canBubble = false, cancelable = true) {
    const event = document.createEvent('Event');
    event.initEvent(type, canBubble, cancelable);

    return event;
}
