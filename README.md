# Bootstrap
Native JavaScript for Bootstrap v4

## Usage
```javascript
import "@prosky/bootstrap/Tab";
import "@prosky/bootstrap/Collapse";
import initCallback from "@prosky/bootstrap/init";

document.addEventListener('DOMContentLoaded',()=>{
    initCallback();
});
```
## Usage with Naja
```javascript
class BootstrapExtension{
    constructor(naja) {
        naja.addEventListener('init',()=>{
            initCallback();
        });
        naja.snippetHandler.addEventListener('afterUpdate',(event)=>{
            let {snippet} = event.detail;
            initCallback(snippet);
        });
    }
}
```
