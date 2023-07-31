import { SprotDesignBoard } from "../canvas/canvas.js";
import { SprotMouseEvents } from "../events/eventobject.js";
import SPROT from "../utils/defaults.js";
import { SPROTPoint, SPROTSize } from "../utils/utils.js";
import { SprotBlockElement, SprotHtmlBaseElement } from "./base.js";

export class SprotSectionElement extends SprotBlockElement{
    private dataset: string[];
    constructor(
        protected parent: SprotHtmlBaseElement | SprotDesignBoard,
        protected canvas: SprotDesignBoard,
        protected position: SPROTPoint = SPROT.NULL_POINT,
        protected size: SPROTSize = SPROT.NULL_SIZE
    ){
        super(parent, canvas, "section", position, size);
        this.dataset = [];

        this.addEventListener("mousemove", this.onMotion);
    }

    onMotion(){
        console.log("base element motion");
        
        // event.Skip();
    }

    pushData = (data: string): void => {this.dataset.push(data);};
}