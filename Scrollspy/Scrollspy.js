import {
    active,
    addClass,
    bootstrapCustomEvent, bottom, dataSpy,
    dataTarget,
    getAttribute, getBoundingClientRect,
    getElementsByClassName,
    getElementsByTagName, getScroll,
    globalObject,
    hasClass,
    length,
    offsetHeight, offsetTop,
    on,
    parentNode, passiveHandler,
    push,
    queryElement,
    removeClass, resizeEvent, scrollEvent,
    scrollHeight, scrollTop, stringScrollSpy,
    supports,
    target,
} from '../utils';
/* Native Javascript for Bootstrap 4 | ScrollSpy
-----------------------------------------------*/

// SCROLLSPY DEFINITION
// ====================
const ScrollSpy = function (element, options) {

    // initialization element, the element we spy on
    element = queryElement(element);

    // DATA API
    const targetData = queryElement(element[getAttribute](dataTarget)),
        offsetData = element[getAttribute]('data-offset');

    // set options
    options = options || {};

    // invalidate
    if (!options[target] && !targetData) {
        return;
    }

    // event targets, constants
    let self = this, spyTarget = options[target] && queryElement(options[target]) || targetData,
        links = spyTarget && spyTarget[getElementsByTagName]('A'),
        offset = parseInt(options['offset'] || offsetData) || 10,
        items = [], targetItems = [];
    let scrollOffset;
    const scrollTarget = element[offsetHeight] < element[scrollHeight] ? element : globalObject, // determine which is the real scrollTarget
        isWindow = scrollTarget === globalObject;

    // populate items and targets
    let i = 0;
    const il = links[length];
    for (; i < il; i++) {
        const href = links[i][getAttribute]('href'),
            targetItem = href && href.charAt(0) === '#' && href.slice(-1) !== '#' && queryElement(href);
        if (!!targetItem) {
            items[push](links[i]);
            targetItems[push](targetItem);
        }
    }

    // private methods
    const updateItem = function (index) {
            const item = items[index],
                targetItem = targetItems[index], // the menu item targets this element
                dropdown = item[parentNode][parentNode],
                dropdownLink = hasClass(dropdown, 'dropdown') && dropdown[getElementsByTagName]('A')[0],
                targetRect = isWindow && targetItem[getBoundingClientRect](),

                isActive = hasClass(item, active) || false,

                topEdge = (isWindow ? targetRect[top] + scrollOffset : targetItem[offsetTop]) - offset,
                bottomEdge = isWindow ? targetRect[bottom] + scrollOffset - offset : targetItems[index + 1] ? targetItems[index + 1][offsetTop] - offset : element[scrollHeight],

                inside = scrollOffset >= topEdge && bottomEdge > scrollOffset;

            if (!isActive && inside) {
                if (!hasClass(item, active)) {
                    addClass(item, active);
                    if (dropdownLink && !hasClass(dropdownLink, active)) {
                        addClass(dropdownLink, active);
                    }
                    bootstrapCustomEvent.call(element, 'activate', 'scrollspy', items[index]);
                }
            } else if (!inside) {
                if (hasClass(item, active)) {
                    removeClass(item, active);
                    if (dropdownLink && hasClass(dropdownLink, active) && !getElementsByClassName(item[parentNode], active).length) {
                        removeClass(dropdownLink, active);
                    }
                }
            } else if (!inside && !isActive || isActive && inside) {

            }
        },
        updateItems = function () {
            scrollOffset = isWindow ? getScroll().y : element[scrollTop];
            let index = 0;
            const itl = items[length];
            for (; index < itl; index++) {
                updateItem(index)
            }
        };

    // public method
    this.refresh = function () {
        updateItems();
    };

    // init
    if (!(stringScrollSpy in element)) { // prevent adding event handlers twice
        on(scrollTarget, scrollEvent, self.refresh, passiveHandler);
        on(globalObject, resizeEvent, self.refresh, passiveHandler);
    }
    self.refresh();
    element[stringScrollSpy] = self;
};

// SCROLLSPY DATA API
// ==================
supports[push]( [ stringScrollSpy, ScrollSpy, '['+dataSpy+'="scroll"]' ] );

export default ScrollSpy;
