import {
    addClass, animation, appendChild, ariaHidden, backdrop, body,
    bootstrapCustomEvent,
    clickEvent, clientWidth, content, createElement, databackdrop, dataDismiss, dataKeyboard, dataTarget,
    dataToggle, DOC,
    emulateTransitionEnd, fixedBottom, fixedTop,
    getAttribute, getBoundingClientRect,
    getElementsByClassName, getTransitionDurationFromElement, globalObject, hasAttribute,
    hasClass,
    hiddenEvent,
    hideEvent, HTML, innerHTML, keyboard, keydownEvent,
    left,
    length, modalOverlay, off,
    offsetWidth,
    on,
    parentNode, passiveHandler,
    preventDefault,
    push,
    queryElement,
    removeClass, resizeEvent, right,
    setAttribute, setFocus,
    showClass,
    showEvent,
    shownEvent, stringModal,
    style,
    supports,
    supportTransitions, target
} from '../utils';
/* Native Javascript for Bootstrap 4 | Modal
-------------------------------------------*/

// MODAL DEFINITION
// ===============
var Modal = function(element, options) { // element can be the modal/triggering button

  // the modal (both JavaScript / DATA API init) / triggering button element (DATA API)
  element = queryElement(element);

    // strings
    var component = 'modal',
      staticString = 'static',
      modalTrigger = 'modalTrigger',
      paddingRight = 'paddingRight',
      modalBackdropString = 'modal-backdrop',
      isAnimating = 'isAnimating',
      // determine modal, triggering element
      btnCheck = element[getAttribute](dataTarget)||element[getAttribute]('href'),
      checkModal = queryElement( btnCheck ),
      modal = hasClass(element,component) ? element : checkModal;

    if ( hasClass(element, component) ) { element = null; } // modal is now independent of it's triggering element

  if ( !modal ) { return; } // invalidate

  // set options
  options = options || {};

  this[keyboard] = options[keyboard] === false || modal[getAttribute](dataKeyboard) === 'false' ? false : true;
  this[backdrop] = options[backdrop] === staticString || modal[getAttribute](databackdrop) === staticString ? staticString : true;
  this[backdrop] = options[backdrop] === false || modal[getAttribute](databackdrop) === 'false' ? false : this[backdrop];
  this[animation] = hasClass(modal, 'fade') ? true : false;
  this[content]  = options[content]; // JavaScript only

  // set an initial state of the modal
  modal[isAnimating] = false;
  
  // bind, constants, event targets and other vars
  var self = this, relatedTarget = null,
    bodyIsOverflowing, scrollBarWidth, overlay, overlayDelay, modalTimer,

    // also find fixed-top / fixed-bottom items
    fixedItems = getElementsByClassName(HTML,fixedTop).concat(getElementsByClassName(HTML,fixedBottom)),

    // private methods
    getWindowWidth = function() {
      var htmlRect = HTML[getBoundingClientRect]();
      return globalObject[innerWidth] || (htmlRect[right] - Math.abs(htmlRect[left]));
    },
    setScrollbar = function () {
      var bodyStyle = globalObject[getComputedStyle](DOC[body]),
          bodyPad = parseInt((bodyStyle[paddingRight]), 10), itemPad;
      if (bodyIsOverflowing) {
        DOC[body][style][paddingRight] = (bodyPad + scrollBarWidth) + 'px';
        modal[style][paddingRight] = scrollBarWidth+'px';
        if (fixedItems[length]){
          for (var i = 0; i < fixedItems[length]; i++) {
            itemPad = globalObject[getComputedStyle](fixedItems[i])[paddingRight];
            fixedItems[i][style][paddingRight] = ( parseInt(itemPad) + scrollBarWidth) + 'px';
          }
        }
      }
    },
    resetScrollbar = function () {
      DOC[body][style][paddingRight] = '';
      modal[style][paddingRight] = '';
      if (fixedItems[length]){
        for (var i = 0; i < fixedItems[length]; i++) {
          fixedItems[i][style][paddingRight] = '';
        }
      }
    },
    measureScrollbar = function () { // thx walsh
      var scrollDiv = DOC[createElement]('div'), widthValue;
      scrollDiv.className = component+'-scrollbar-measure'; // this is here to stay
      DOC[body][appendChild](scrollDiv);
      widthValue = scrollDiv[offsetWidth] - scrollDiv[clientWidth];
      DOC[body].removeChild(scrollDiv);
      return widthValue;
    },
    checkScrollbar = function () {
      bodyIsOverflowing = DOC[body][clientWidth] < getWindowWidth();
      scrollBarWidth = measureScrollbar();
    },
    createOverlay = function() {
      var newOverlay = DOC[createElement]('div');
      overlay = queryElement('.'+modalBackdropString);

      if ( overlay === null ) {
        newOverlay[setAttribute]('class', modalBackdropString + (self[animation] ? ' fade' : ''));
        overlay = newOverlay;
        DOC[body][appendChild](overlay);
      }
      modalOverlay = 1;
    },
    removeOverlay = function() {
      overlay = queryElement('.'+modalBackdropString);
      if ( overlay && overlay !== null && typeof overlay === 'object' ) {
        modalOverlay = 0;
        DOC[body].removeChild(overlay); overlay = null;
      }
    },
    // triggers
    triggerShow = function() {
      setFocus(modal);
      modal[isAnimating] = false;
      bootstrapCustomEvent.call(modal, shownEvent, component, relatedTarget);

      on(globalObject, resizeEvent, self.update, passiveHandler);
      on(modal, clickEvent, dismissHandler);
      on(DOC, keydownEvent, keyHandler);      
    },
    triggerHide = function() {
      modal[style].display = '';
      element && (setFocus(element));
      bootstrapCustomEvent.call(modal, hiddenEvent, component);

      (function(){
        if (!getElementsByClassName(DOC,component+' '+showClass)[0]) {
          resetScrollbar();
          removeClass(DOC[body],component+'-open');
          overlay && hasClass(overlay,'fade') ? (removeClass(overlay,showClass), emulateTransitionEnd(overlay,removeOverlay))
          : removeOverlay();

          off(globalObject, resizeEvent, self.update, passiveHandler);
          off(modal, clickEvent, dismissHandler);
          off(DOC, keydownEvent, keyHandler);
        }
      }());
      modal[isAnimating] = false;
    },
    // handlers
    clickHandler = function(e) {
      if ( modal[isAnimating] ) return;

      var clickTarget = e[target];
      clickTarget = clickTarget[hasAttribute](dataTarget) || clickTarget[hasAttribute]('href') ? clickTarget : clickTarget[parentNode];
      if ( clickTarget === element && !hasClass(modal,showClass) ) {
        modal[modalTrigger] = element;
        relatedTarget = element;
        self.show();
        e[preventDefault]();
      }
    },
    keyHandler = function(e) {
      if ( modal[isAnimating] ) return;

      if (self[keyboard] && e.which == 27 && hasClass(modal,showClass) ) {
        self.hide();
      }
    },
    dismissHandler = function(e) {
      if ( modal[isAnimating] ) return;
      var clickTarget = e[target];

      if ( hasClass(modal,showClass) && ( clickTarget[parentNode][getAttribute](dataDismiss) === component
          || clickTarget[getAttribute](dataDismiss) === component
          || clickTarget === modal && self[backdrop] !== staticString ) ) {
        self.hide(); relatedTarget = null;
        e[preventDefault]();
      }
    };

  // public methods
  this.toggle = function() {
    if ( hasClass(modal,showClass) ) {this.hide();} else {this.show();}
  };
  this.show = function() {
    if ( hasClass(modal,showClass) || modal[isAnimating] ) {return}

    clearTimeout(modalTimer);
    modalTimer = setTimeout(function(){
      modal[isAnimating] = true;
      bootstrapCustomEvent.call(modal, showEvent, component, relatedTarget);

      // we elegantly hide any opened modal
      var currentOpen = getElementsByClassName(DOC,component+' '+showClass)[0];
      if (currentOpen && currentOpen !== modal) {
        modalTrigger in currentOpen && currentOpen[modalTrigger][stringModal].hide();
        stringModal in currentOpen && currentOpen[stringModal].hide();
      }

      if ( self[backdrop] ) {
        !modalOverlay && !overlay && createOverlay();
      }

      if ( overlay && !hasClass(overlay,showClass) ) {
        overlay[offsetWidth]; // force reflow to enable trasition
        overlayDelay = getTransitionDurationFromElement(overlay);
        addClass(overlay, showClass);
      }

      setTimeout( function() {
        modal[style].display = 'block';

        checkScrollbar();
        setScrollbar();

        addClass(DOC[body],component+'-open');
        addClass(modal,showClass);
        modal[setAttribute](ariaHidden, false);

        hasClass(modal,'fade') ? emulateTransitionEnd(modal, triggerShow) : triggerShow();
      }, supportTransitions && overlay && overlayDelay ? overlayDelay : 1);
    },1);
  };
  this.hide = function() {
    if ( modal[isAnimating] || !hasClass(modal,showClass) ) {return}

    clearTimeout(modalTimer);
    modalTimer = setTimeout(function(){
      modal[isAnimating] = true;    
      bootstrapCustomEvent.call(modal, hideEvent, component);
      overlay = queryElement('.'+modalBackdropString);
      overlayDelay = overlay && getTransitionDurationFromElement(overlay);

      removeClass(modal,showClass);
      modal[setAttribute](ariaHidden, true);

      setTimeout(function(){
        hasClass(modal,'fade') ? emulateTransitionEnd(modal, triggerHide) : triggerHide();
      }, supportTransitions && overlay && overlayDelay ? overlayDelay : 2);
    },2)
  };
  this.setContent = function( content ) {
    queryElement('.'+component+'-content',modal)[innerHTML] = content;
  };
  this.update = function() {
    if (hasClass(modal,showClass)) {
      checkScrollbar();
      setScrollbar();
    }
  };

  // init
  // prevent adding event handlers over and over
  // modal is independent of a triggering element
  if ( !!element && !(stringModal in element) ) {
    on(element, clickEvent, clickHandler);
  }
  if ( !!self[content] ) { self.setContent( self[content] ); }
  if (element) { element[stringModal] = self; modal[modalTrigger] = element; }
  else { modal[stringModal] = self; }
};

// DATA API
supports[push]( [ stringModal, Modal, '['+dataToggle+'="modal"]' ] );

export default Modal;
