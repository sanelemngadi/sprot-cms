import { SprotHtmlBaseElement } from "../elements/base.js";
import { SPROTPoint } from "../utils/utils.js";
import { SprotFocusEvent, SprotFocusEventType, SprotMouseEventType, SprotMouseEvents } from "./eventobject.js";

export class SprotEventObjectFactory{
    private active: SprotHtmlBaseElement | null;
    private former: SprotHtmlBaseElement | null;
    
    constructor(){
        this.active = null;
        this.former = null;
    }

    dispatch(eventType: SprotMouseEventType | SprotFocusEventType ,  
        active: SprotHtmlBaseElement | null, 
        former: SprotHtmlBaseElement | null, point: SPROTPoint){
        this.active = active;
        this.former = former;

        if(eventType === "killfocus" || eventType === "setfocus"){
            this.focus(eventType);
        }
        else if(eventType === "mouseenter"   || eventType === "mousemove" || 
                eventType === "mouseover" || eventType === "mousedown"  || 
                eventType === "mouseup" || eventType === "mouseleave"
            ){
            this.mousemovement(eventType, point);
        }
    }

    private focus(eventType: SprotFocusEventType){
        const event = new SprotFocusEvent(eventType);
        if(eventType === "setfocus" && this.active && !this.active.hasFocus()){
            this.active.dispatch(event);
            this.active.setFocus(true);
            return;
        }

        else if(eventType === "killfocus" && this.former && this.former.hasFocus()){
            this.former.dispatch(event);
            this.former.setFocus(false);
        }
    }

    private mousemovement(eventType: SprotMouseEventType, point: SPROTPoint){
        const event = new SprotMouseEvents(eventType);
        event.setPosition(point);
        if(eventType === "mouseenter" || eventType === "mousemove" || eventType === "mouseover"){
            if(!this.active){
                return;
            }
            this.active.dispatch(event);
        } 
        else if(eventType === "mouseleave"){
            if(!this.former){
                return;
            }
            this.former.dispatch(event);
        }
        else if(eventType === "mousedown" || eventType === "mouseup"){
            if(this.active && eventType === "mouseup"){
                this.active.setFocus(true);
                this.active.dispatch(event);
            }
            else if(eventType === "mousedown"){
                if(this.active){
                    this.active.dispatch(event);
                }
                if(this.former && this.former.hasFocus() ){
                    this.former.setFocus(false);
                    this.former.dispatch(event);
                }
            }
        }
    }
}
