'use strict';

import {
    active,
    addClass,
    bootstrapCustomEvent,
    clickEvent,
    DOC,
    dataToggle,
    getAttribute,
    getElementsByClassName,
    hasClass,
    length,
    on,
    parentNode,
    preventDefault,
    push,
    queryElement,
    removeClass,
    setAttribute,
    supports, target, getElementsByTagName, focusEvent, changeEvent, stringButton, keyupEvent, keydownEvent
} from '../utils';
/* Native Javascript for Bootstrap 4 | Button
---------------------------------------------*/

// BUTTON DEFINITION
// ===================
const Button = function (element) {

    // initialization element
    element = queryElement(element);

    // constant
    let toggled = false, // toggled makes sure to prevent triggering twice the change.bs.button events

        // strings
        component = 'button',
        checked = 'checked',
        LABEL = 'LABEL',
        INPUT = 'INPUT',
        preventScroll = function (e) {
            const key = e.which || e.keyCode;
            key === 32 && e[preventDefault]();
        },
        toggle = function (e) {
            const label = e[target].tagName === LABEL ? e[target] : e[target][parentNode].tagName === LABEL ? e[target][parentNode] : null; // the .btn label

            if (!label) return; //react if a label or its immediate child is clicked

            const labels = getElementsByClassName(label[parentNode], 'btn'), // all the button group buttons
                input = label[getElementsByTagName](INPUT)[0];

            if (!input) return; // return if no input found

            // manage the dom manipulation
            if (input.type === 'checkbox') { //checkboxes
                if (!input[checked]) {
                    addClass(label, active);
                    input[getAttribute](checked);
                    input[setAttribute](checked, checked);
                    input[checked] = true;
                } else {
                    removeClass(label, active);
                    input[getAttribute](checked);
                    input.removeAttribute(checked);
                    input[checked] = false;
                }

                if (!toggled) { // prevent triggering the event twice
                    toggled = true;
                    bootstrapCustomEvent.call(input, changeEvent, component); //trigger the change for the input
                    bootstrapCustomEvent.call(element, changeEvent, component); //trigger the change for the btn-group
                }
            }

            if (input.type === 'radio' && !toggled) { // radio buttons
                // don't trigger if already active (the OR condition is a hack to check if the buttons were selected with key press and NOT mouse click)
                if (!input[checked] || (e.screenX === 0 && e.screenY === 0)) {
                    addClass(label, active);
                    addClass(label, focusEvent);
                    input[setAttribute](checked, checked);
                    input[checked] = true;
                    bootstrapCustomEvent.call(input, changeEvent, component); //trigger the change for the input
                    bootstrapCustomEvent.call(element, changeEvent, component); //trigger the change for the btn-group

                    toggled = true;
                    let i = 0;
                    const ll = labels[length];
                    for (; i < ll; i++) {
                        const otherLabel = labels[i], otherInput = otherLabel[getElementsByTagName](INPUT)[0];
                        if (otherLabel !== label && hasClass(otherLabel, active)) {
                            removeClass(otherLabel, active);
                            otherInput.removeAttribute(checked);
                            otherInput[checked] = false;
                            bootstrapCustomEvent.call(otherInput, changeEvent, component); // trigger the change
                        }
                    }
                }
            }
            setTimeout(function () {
                toggled = false;
            }, 50);
        },
        // private methods
        keyHandler = function (e) {
            const key = e.which || e.keyCode;
            key === 32 && e[target] === DOC.activeElement && toggle(e);
        },
        focusHandler = function (e) {
            addClass(e[target][parentNode], focusEvent);
        },
        blurHandler = function (e) {
            removeClass(e[target][parentNode], focusEvent);
        };

    // init
    if (!(stringButton in element)) { // prevent adding event handlers twice
        on(element, clickEvent, toggle);
        on(element, keyupEvent, keyHandler), on(element, keydownEvent, preventScroll);

        const allBtns = getElementsByClassName(element, 'btn');
        for (let i = 0; i < allBtns.length; i++) {
            let input = allBtns[i][getElementsByTagName](INPUT)[0];
            on(input, focusEvent, focusHandler), on(input, 'blur', blurHandler);
        }
    }

    // activate items on load
    const labelsToACtivate = getElementsByClassName(element, 'btn'), lbll = labelsToACtivate[length];
    for (let i = 0; i < lbll; i++) {
        !hasClass(labelsToACtivate[i], active) && queryElement('input:checked', labelsToACtivate[i])
        && addClass(labelsToACtivate[i], active);
    }
    element[stringButton] = this;
};

// BUTTON DATA API
// =================
supports[push]( [ stringButton, Button, '['+dataToggle+'="buttons"]' ] );

export default Button;
