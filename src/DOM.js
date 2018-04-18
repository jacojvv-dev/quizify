/**
 * Utilities for DOM element manipulation
 */
export default class DOM {
    /**
     * Creates a new HTML element
     * @param {string} nodeTag the tag of the element to create
     * @param {string} className name of the class to attach to the element
     */
    static CreateElement(nodeTag, className = '', innerText = null) {
        let el = document.createElement(nodeTag);

        // append class if supplied
        if (className && typeof className === typeof '' && className.length > 0)
            el.classList.add(...className.split(' '));
        // set innerText if supplied
        if (innerText && typeof innerText === typeof '' && innerText.length > 0)
            DOM.SetText(el, innerText);

        return el;
    }

    /**
     * Set the innertText property of a DOM element
     * @param {object} el the element to set the innertext of
     * @param {string} text the text to assign to the inner text
     */
    static SetText(el, text) {
        el.innerText = text;
    }

    /**
     * Appends an element to another element
     * @param {object} el element to append the child to
     * @param {object} child element to append
     */
    static AddChild(el, child) {
        el.appendChild(child);
    }
}