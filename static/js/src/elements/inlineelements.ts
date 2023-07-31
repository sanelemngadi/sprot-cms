import { SprotDesignBoard } from "../canvas/canvas.js";
import SPROT from "../utils/defaults.js";
import { SprotInlineElementName } from "../utils/interfaces.js";
import { SPROTPoint, SPROTSize } from "../utils/utils.js";
import { SprotHtmlBaseElement, SprotInlineElement } from "./base.js";

class SprotLinkElement extends SprotInlineElement{
    private link: string;
    constructor(
        protected parent: SprotHtmlBaseElement | SprotDesignBoard, 
        protected canvas: SprotDesignBoard,
        protected name: SprotInlineElementName,
        protected position: SPROTPoint = SPROT.NULL_POINT,
        protected size: SPROTSize = SPROT.NULL_SIZE
    ){
        super(parent, canvas, name, position, size);
        this.link = "#";
    }

    setLink = (link: string): void => {this.link = link};
    getLink = (): string => {return this.link;}
}