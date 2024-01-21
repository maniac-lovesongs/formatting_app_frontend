import observerManager from "./ObserverManager";

class AppManager{
    /**************************************************************/
    constructor() {
        this.state = {
            "font": null,
            "style": null
        };       
        this.panels = {
            'font picker': false
        };
        this.modes = {
            'list': false,
        }
    }
    /**************************************************************/
    setStyle(s){
        this.state.style = s; 
        observerManager.notify(["style"]);
    }
    /**************************************************************/
    setFont(f){
        this.state.font = f; 
        observerManager.notify(["font"]);
    }
    /**************************************************************/
    getStyle(){
        return this.state.style;
    }
    /**************************************************************/
    getFont(){
        return this.state.font;
    }
}

const appManager = new AppManager();
export default appManager;