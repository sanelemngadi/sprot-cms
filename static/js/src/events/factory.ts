import { SprotHtmlBaseElement } from "../elements/base.js";
import SPROT from "../utils/defaults.js";
import { SPROTPoint, SPROTSize } from "../utils/utils.js";
import { SprotBackgroundEventType, SprotFocusEvent, SprotFocusEventType, SprotMouseEventType, SprotMouseEvents, SprotSizeEvent, SprotSizeEventType } from "./eventobject.js";

type SprotDispatchEventsType = SprotMouseEventType | SprotFocusEventType |
SprotSizeEventType | SprotBackgroundEventType;

interface EventPayload{
    point?: SPROTPoint;
    size?: SPROTSize;
    activeElement?: SprotHtmlBaseElement;
    formerElement?: SprotHtmlBaseElement;
}

interface SprotDispatch{
    type: SprotDispatchEventsType,
    payload: EventPayload;
}

interface SprotActionEvent{
    action(dispatch: SprotDispatch): void
}

class SprotPerformResizeEvent implements SprotActionEvent{
    private size: SPROTSize;
    constructor(){
        this.size = SPROT.NULL_SIZE;
    }

    action(dispatch: SprotDispatch): void {
        throw new Error("Method not implemented.");
    }
}

class SprotPerformMouseEvent implements SprotActionEvent{
    constructor(){ }
    action(dispatch: SprotDispatch): void {
        if(!dispatch.payload.point){
            return;
        }
        const event = new SprotMouseEvents(dispatch.type as SprotMouseEventType);
        event.setPosition(dispatch.payload.point);
        if(dispatch.type === "mouseenter" || dispatch.type === "mousemove" || dispatch.type === "mouseover"){
            if(!dispatch.payload.activeElement){
                return;
            }
            dispatch.payload.activeElement.sendEvent(event);
        } 
        else if(dispatch.type === "mouseleave"){
            if(!dispatch.payload.formerElement){
                return;
            }
            dispatch.payload.formerElement.sendEvent(event);
        }
        else if(dispatch.type === "mousedown" || dispatch.type === "mouseup"){
            if(dispatch.payload.activeElement && dispatch.type === "mouseup"){
                dispatch.payload.activeElement.setFocus(true);
                dispatch.payload.activeElement.sendEvent(event);
            }
            else if(dispatch.type === "mousedown"){
                if(dispatch.payload.activeElement){
                    dispatch.payload.activeElement.sendEvent(event);
                }
                if(dispatch.payload.formerElement && dispatch.payload.formerElement.hasFocus() ){
                    dispatch.payload.formerElement.setFocus(false);
                    dispatch.payload.formerElement.sendEvent(event);
                }
            }
        }
    }
}

export class SprotEventObjectFactory{
    private active?: SprotHtmlBaseElement;
    private former?: SprotHtmlBaseElement;
    
    constructor(){ }

    dispatch(dispatch: SprotDispatch){
    // dispatch(eventType: SprotDispatchEventsType , active: SprotHtmlBaseElement | null = null, 
    //     former: SprotHtmlBaseElement | null = null, point: SPROTPoint = SPROT.NULL_POINT, 
    //     size: SPROTSize = SPROT.NULL_SIZE){
        this.active = dispatch.payload.activeElement;
        this.former = dispatch.payload.formerElement;

        if(dispatch.type === "killfocus" || dispatch.type === "setfocus"){
            this.focus(dispatch.type);
        }
        else if(dispatch.type === "mouseenter"   || dispatch.type === "mousemove" || 
                dispatch.type === "mouseover" || dispatch.type === "mousedown"  || 
                dispatch.type === "mouseup" || dispatch.type === "mouseleave"
            ){
            this.mousemovement(dispatch.type, dispatch.payload.point);
        }else if(dispatch.type === "resize"){
            this.resize(dispatch);
        }
    }

    private focus(eventType: SprotFocusEventType){
        const event = new SprotFocusEvent(eventType);
        if(eventType === "setfocus" && this.active && !this.active.hasFocus()){
            this.active.sendEvent(event);
            this.active.setFocus(true);
            return;
        }

        else if(eventType === "killfocus" && this.former && this.former.hasFocus()){
            this.former.sendEvent(event);
            this.former.setFocus(false);
        }
    }

    private mousemovement(eventType: SprotMouseEventType, point?: SPROTPoint){
        if(!point){
            return;
        }
        const event = new SprotMouseEvents(eventType);
        event.setPosition(point);
        if(eventType === "mouseenter" || eventType === "mousemove" || eventType === "mouseover"){
            if(!this.active){
                return;
            }
            this.active.sendEvent(event);
        } 
        else if(eventType === "mouseleave"){
            if(!this.former){
                return;
            }
            this.former.sendEvent(event);
        }
        else if(eventType === "mousedown" || eventType === "mouseup"){
            if(this.active && eventType === "mouseup"){
                this.active.setFocus(true);
                this.active.sendEvent(event);
            }
            else if(eventType === "mousedown"){
                if(this.active){
                    this.active.sendEvent(event);
                }
                if(this.former && this.former.hasFocus() ){
                    this.former.setFocus(false);
                    this.former.sendEvent(event);
                }
            }
        }
    }

    private resize(dispatch: SprotDispatch){
        if(!dispatch.payload.size || !dispatch.payload.activeElement){
            return;
        }
        
        const event = new SprotSizeEvent(dispatch.type as SprotSizeEventType);
        event.setSize(dispatch.payload.size);
        dispatch.payload.activeElement.sendEvent(event);
        // dispatch.payload.activeElement.setSize(dispatch.payload.size);
    }
}
