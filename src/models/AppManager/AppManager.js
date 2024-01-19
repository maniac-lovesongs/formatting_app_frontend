import fontManager from "../InstaFonts/FontManager";
import InstaStringModel from "../InstaString/InstaStringModel";
import StateModel from "../State/StateModel";
import History from "../History/HistoryManager";
import observerManager from "./ObserverManager";

class AppManager{
    /**************************************************************/
    constructor() {
        this.history = new History();
        this.string = new InstaStringModel(); 
        this.state = new StateModel({
            font: "Sans Serif",
            style: "normal",
            bold: false,
            italic: false,
            selectedText: null,
            availableStyles: fontManager.getAvailableStyles("Sans Serif")
        }); 
        
        this.selectionMade = false;
        this.panels = {
            'font picker': false
        };
        this.modes = {
            'list': false,
        }
        this.clipboard = null; 
        // take a snapshot of the initial state
        this.addToHistory("init");
    }


    /**************************************************************/
    /* String                                                    */
    /**************************************************************/
    insertLineBreak(pos){
        const instaChar =
        this.string.insertLineBreak(pos);
            
        this.addToHistory("inserted character");
        observerManager.notify(["string", "history", "string.cursor"]);
        return instaChar;       
    }
    /**************************************************************/
    insertSingleCharacter(ch, pos) {
        const instaChar =
            this.string.insertSingleCharacter(this.getFont(),
                this.getStyle(),ch, pos);

        this.addToHistory("inserted character");
        observerManager.notify(["string", "history", "string.cursor"]);
        return instaChar;
    }
    /**************************************************************/
    insertFromPaste(str) {
        this.string.paste(str);
        this.selectionMade = this.string.cursor[0] !== this.string.cursor[1]; 
        this.addToHistory("paste");
        observerManager.notify(["string", "history", "string.cursor"]);
    }
    /**************************************************************/
    deleteCharacter(pos) {
        const instaChar = this.string.deleteCharacter(pos);
        this.addToHistory("character deleted");

        observerManager.notify(["string", "history", "string.cursor"]);
        return instaChar;
    }
    /**************************************************************/
    deleteSelection() {
        this.string.deleteSelection();
        this.selectionMade = false;
        this.addToHistory("selection deleted");

        observerManager.notify(["string", "history", "string.cursor"]);
    }
    /**************************************************************/
    deleteAll() {
        this.string.deleteAll();
        this.selectionMade = this.string.cursor[0] !== this.string.cursor[1]; 
        this.addToHistory("delete all");
        observerManager.notify(["string", "history"]);
    }
    /**************************************************************/

    /**************************************************************/
    /* Setters                                                    */
    /**************************************************************/
    setSelectedText(t) {
        this.state.current.selectedText = t; 
        observerManager.notify("state.current.selectedText");
    }
    /**************************************************************/
    setStyle(b, i, clicked) {
        let s = "normal";
        let bold = this.state.current.bold;
        let italic = this.state.current.italic; 

        const availableStyles = this.getAvailableStyles();
        if (b && !i && availableStyles["bold"]) {
            s = "bold"
            bold = b;
            italic = i; 
        }
        else if (!b && i && availableStyles["italic"]) {
            s = "italic"
            bold = b; 
            italic = i; 
        }
        else if (b && i && availableStyles["bold italic"]) {
            s = "bold italic";
            bold = b; 
            italic = i; 
        }
        else if (b && i && !availableStyles["bold italic"]) {
            if (clicked === "bold") {
                s = "bold";
                bold = true; 
                italic = false; 
            }
            else if (clicked === "italic") {
                s = "italic";
                bold = false; 
                italic = true; 
            }

        }
        else if (!b && !i) {
            s = "normal";
            bold = b; 
            italic = i; 
        }

        this.state.current.style = s; 
        this.state.current.bold = bold;
        this.state.current.italic = italic;

        if (this.string.cursor[0] !== this.string.cursor[1]) 
            this.string.editSelection(this.state.current.font,
                this.state.current.style);
        

        this.addToHistory("style changed");
        observerManager.notify(["state", "string", "history"]);
    }
    /**************************************************************/
    setFont(f) {
        this.state.current.font = f; 
        this.state.current.style = f === "Serif" ? "bold" : "normal";
        this.state.current.availableStyles = fontManager.getAvailableStyles(f);

        if (this.string.cursor[0] !== this.string.cursor[1]) 
            this.string.editSelection(this.state.current.font,
                this.state.current.style);
        

        this.addToHistory("font change");
        observerManager.notify(["state", "string", "history"]);
    }    
    /**************************************************************/
    setCursor(start, end) {
        const data = this.string.setCursor(start, end);
        this.selectionMade = start !== end; 
        observerManager.notify(["string",
            "string.cursor",
            "selectionMade",
            "string.substring"]);
    }
    /**************************************************************/
    setPanelOpen(panel) {
        this.panels[panel] = true; 
        observerManager.notify(['panels']);
    }
    /**************************************************************/
    setPanelClosed(panel) {
        this.panels[panel] = false; 
        observerManager.notify(["panels"]);
    }
    /**************************************************************/
    setClipboard(clipboard) {
        this.clipboard = clipboard;
        observerManager.notify(["clipboard"]);
    }

    /**************************************************************/
    /* Getters                                                    */
    /**************************************************************/
    getSelectedText() {
        return this.state.current.selectedText;
    }
    /**************************************************************/
    getFont() {
        return this.state.current.font; 
    }
    /**************************************************************/
    getCursor() {
        return this.string.cursor;
    }
    /**************************************************************/
    getStyle() {
        return this.state.current.style;
    }
    /**************************************************************/
    getIsBold() {
        return this.state.current.bold; 
    }
    /**************************************************************/
    getIsItalic() {
        return this.state.current.italic; 
    }
    /**************************************************************/
    getAvailableStyles() {
        return this.state.current.availableStyles;
    }
    /**************************************************************/
    getString() {
        return this.string.string; 
    }
    /**************************************************************/
    getSelectionMade() {
        return this.string.cursor[0] !== this.string.cursor[1];
    }
    /**************************************************************/
    getValidPos(pos, direction = "backwards") {
        if (direction === "backwards") {
            const [length, i] = this.string.findBeg(pos);
            return i;
        }
        else {
            const i = this.string.findEnd(pos);
            return i;
        }
    }
    /**************************************************************/
    getSubstring(cursor = null) {
        if (cursor === null)
            return this.string.substring;
        return this.getString().slice(cursor[0], cursor[1]);
    }
    /**************************************************************/
    getPanel(panel) {
        return this.panels[panel];
    }
    /**************************************************************/
    getState() {
        return this.state.snapshot();
    }
    /**************************************************************/
    getDefaults() {
        return this.state.defaults;
    }
    /**************************************************************/
    getClipboard(){
        return this.clipboard;
    }

    /**************************************************************/
    /* History                                                    */
    /**************************************************************/
    snapshot() {
        return {
            string: this.string.snapshot(),
            state: this.state.snapshot()
        }
    }
    /**************************************************************/
    addToHistory(action) {
        const snapshot = this.snapshot();
        this.history.addAction({
            action: action,
            snapshot: { ...snapshot }
        });
    }
    /**************************************************************/
    doRedo() {
        const snapshot = this.history.redo().snapshot;
        this.string.setFromSnapshot(snapshot.string);
        this.state.setFromSnapshot(snapshot.state);

        observerManager.notify(["state", "history", "string"]);
    }
    /**************************************************************/
    doUndo() {
        const snapshot = this.history.undo().snapshot;
        this.string.setFromSnapshot(snapshot.string);
        this.state.setFromSnapshot(snapshot.state);

        observerManager.notify(["state", "history", "string"]);
    }
    /**************************************************************/
}

const appManager = new AppManager();
export default appManager;