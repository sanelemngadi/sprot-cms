import SPROT from "../../utils/defaults.js";
import { SprotOrientation } from "../../utils/interfaces.js";
import { SPROTPoint, SPROTRect, SPROTSize } from "../../utils/utils.js";
import { SprotHtmlBaseElement } from "../base.js";

interface SprotFlexbox{
    positionChildElements(childElements: SprotFlexboxItem[]): void;
}

type AlignType = "flex-start" | "flex-end" | "center";
type JustifyType = AlignType | "space-around" | "space-between" | "space-even";

class SprotFlexFlags{
    public alignElements: AlignType;
    public justifyContent: JustifyType;
    public gap: number;

    constructor(private orientation: SprotOrientation){
        this.alignElements = "flex-end";
        this.justifyContent = "flex-end";
        this.gap = 0;
    }

    AlignItems(align: AlignType): SprotFlexFlags{
        this.alignElements = align;
        return this;
    }
    Justify(j: JustifyType){
        this.justifyContent = j;
        return this;
    } 

    Gap(g: number){
        this.gap = g;
        return this;
    }
}

class SprotFlexboxItem{
    constructor(private rect: SPROTRect){
        this.rect = rect;
    }

    createFromElement(element: SprotHtmlBaseElement){
        const rect = SPROTRect.create(element.getPosition(), element.getSize())
        return new SprotFlexboxItem(rect);
    }

    getSize(){return this.rect.getSize();}
    setSize(s: SPROTSize){this.rect.setSize(s);}

    getPosition(){return this.rect.getPosition();}
    setPosition(p: SPROTPoint){this.rect.setPosition(p);}

    getRect() {return this.rect;}
}

export class SprotFlexJustContent implements SprotFlexbox{
    constructor(
        private type: "inline" | "block",
        private flags: SprotFlexFlags,
        private parentSize: number,
        private orientation: SprotOrientation
    ){
        // this.childElements = childElements;
        this.type = type;
        this.flags = flags;
        this.parentSize = parentSize;
        this.orientation = orientation;
    }

    sizeInMajorDir = (size: SPROTSize): number =>{
        if(this.orientation = SprotOrientation.HORIZONTAL){
            return size.getWidth();
        }
        return size.getHeight();
    }

    sizeInMinorDir = (size: SPROTSize): number =>{
        if(this.orientation = SprotOrientation.HORIZONTAL){
            return size.getHeight();
        }
        return size.getWidth();
    }

    setSizeGivenDir = (major: number, minor: number):SPROTSize=> {
        if(this.orientation === SprotOrientation.HORIZONTAL){
            return new SPROTSize(major, minor);
        }
        return new SPROTSize(minor, major);
    }

    pointInMajorDir = (pt: SPROTPoint): number =>{
        if(this.orientation = SprotOrientation.HORIZONTAL){
            return pt.getX();
        }
        return pt.getY();
    }

    pointInMinorDir = (pt: SPROTPoint): number =>{
        if(this.orientation = SprotOrientation.HORIZONTAL){
            return pt.getY();
        }
        return pt.getX();
    }

    positionChildElements(childElements: SprotFlexboxItem[]): void {
        const len = childElements.length;
        const itemSizeMajorDir = this.parentSize / len;
    }

    calculateElementMinSize = (elements: SprotFlexboxItem[]): SPROTSize => {
        if(elements.length <= 0){
            return SPROT.NULL_SIZE;        
        }

        let highestMinorDir = this.sizeInMinorDir(elements[0].getSize());
        let totalMajorDir = 0;
        for(let i = 0; i < elements.length; i++){
            totalMajorDir += this.sizeInMajorDir(elements[i].getSize());
            const minor = this.sizeInMinorDir(elements[i].getSize());
            if(minor > highestMinorDir){
                highestMinorDir = minor;
            }
        }

        return this.setSizeGivenDir(totalMajorDir, highestMinorDir);
    }
}


export class SprotDisplayFlex{
    private flexes: SprotFlexbox[];
    constructor(private childElements: SprotFlexboxItem[], 
        private type: "inline" | "block"
    ){
        this.childElements = childElements;
        this.type = type;
        this.flexes = [];
    }

    position(flexbox: SprotFlexbox ){
        flexbox.positionChildElements(this.childElements);
        this.flexes.push(flexbox);
    }

    positionChildrent(){
        for(let flex of this.flexes){
            flex.positionChildElements(this.childElements);
        }
    }
}