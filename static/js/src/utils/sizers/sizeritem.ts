import { sprotHtmlElement } from "../element.js";
import { Point, Size, defaultRect } from "../interfaces.js";
import { Rect } from "../rect.js";

export class SprotSizerItem{
    htmlElement: sprotHtmlElement | null;
    rect: Rect;
    constructor(){
        this.htmlElement = null;
        this.rect = defaultRect;
    }

    setHtmlElement = (element: sprotHtmlElement):void =>{
        this.htmlElement = element;
        this.rect = element;
    }

    getElement = ():sprotHtmlElement | null => {
        return this.htmlElement;
    }

    isSpacer = (): boolean => {
        return this.htmlElement === null;
    }

    setSize = (size: Size): void => {
        this.rect.setSize(size);
        this.htmlElement?.setSize(size);
    };
    getSize = (): Size => {return this.rect.getSize();}

    setPoint = (pt: Point):void => {
        this.rect.setPoint(pt);
        this.htmlElement?.setPoint(pt);
    };
    getPoint = (): Point => {return this.rect.getPoint();}

    setRect = (rect: Rect): void => {this.rect = rect;};
    getRect = (): Rect => {return this.rect;}
}