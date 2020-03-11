import {BSN, DOC, querySelectorAll, supports} from "./utils";

/* Native Javascript for Bootstrap | Initialize Data API
--------------------------------------------------------*/
export default BSN.initCallback = (lookUp) => {
	lookUp = lookUp || DOC;
	for (let [name, constructor, selector] of supports) {
		for (let el of lookUp[querySelectorAll](selector)) {
			if(!el[name]){
				el[name] = new constructor(el);
			}
		}
	}
};
