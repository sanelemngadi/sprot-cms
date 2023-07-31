import { SprotDesignBoard } from "../canvas/canvas.js";
import SPROT from "../utils/defaults.js";
import { SPROTPoint, SPROTSize } from "../utils/utils";

export abstract class SprotEvent<T>{
    type: T;
    skipped: boolean;
    constructor(eventType: T){this.type = eventType; this.skipped = false;}

    Skip(): void {
        this.skipped = true;
    }

    getSkipped() {return this.skipped;}
    SetEventType(type: T){this.type = type;}
    getEventType():T {return this.type;}
}

export type SprotMouseEventType = "mousemove" | "mousedown" | "mouseup" | "mouseenter" 
    | "mouseleave" | "mouseover";
export class SprotMouseEvents extends SprotEvent<SprotMouseEventType>{
    protected pos: SPROTPoint;
    constructor(type: SprotMouseEventType){
        super(type);
        this.pos = SPROT.NULL_POINT;
    }

    getPosition() {return this.pos;}
    setPosition(pt: SPROTPoint){this.pos = pt;} 
}

export type SprotFocusEventType = "killfocus" | "setfocus";
export class SprotFocusEvent extends SprotEvent<SprotFocusEventType>{
    constructor(type: SprotFocusEventType){
        super(type);
    }
}

export type SprotBackgroundEventType = "paint" | "erase";
export class SprotBackgroundEvent extends SprotEvent<SprotBackgroundEventType>{
    private canvas: SprotDesignBoard | null;
    constructor(type: SprotBackgroundEventType){
        super(type);
        this.canvas = null;
    }

    setCanvas(canvas: SprotDesignBoard){this.canvas = canvas;}
    getCanvas(){return this.canvas;}
}

export type SprotSizeEventType = "resize";
export class SprotSizeEvent extends SprotEvent<SprotSizeEventType>{
    private size: SPROTSize;
    constructor(type: SprotSizeEventType){
        super(type);
        this.size = SPROT.NULL_SIZE;
    }

    setSize(size: SPROTSize):void{this.size = size;}
    getSize():SPROTSize {return this.size;}
}



/*

Requirement: one to many relationship,
    I have one object which is SprotHtmlBaseElement class,
    and my subscribers which are event objects

    the SprotHtmlBaseElement class must have the Bind option 
    (done inside object ctor) which takes the callback function and calls it 
    whenever an event is fired and pass object.
*/