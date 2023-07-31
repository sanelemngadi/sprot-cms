import { SPROTPoint, SPROTSize } from "../utils/utils.js";

// mouse position are: mousedown, up, left down/up, mousemove, mouseenter and mouseleave
export class SprotMouseEvent{
    private pos: SPROTPoint;
    constructor(pos: SPROTPoint){
        this.pos = pos;
    }

    setPosition(pos: SPROTPoint):void{this.pos = pos;}
    getPosition():SPROTPoint {return this.pos;}
}

// size event contains the size of the parent element as we size it
export class SprotSizeEvent{
    private size: SPROTSize;
    constructor(size: SPROTSize){
        this.size = size;
    }

    setSize(size: SPROTSize):void{this.size = size;}
    getSize():SPROTSize {return this.size;}
}