// import { sprotHtmlElement } from "../element.js"
import { sprotHtmlElement } from "../element.js";
import { Orientation, Point, Size, defaultPoint } from "../interfaces.js";
import { SprotSizerItem } from "./sizeritem.js";

export enum AlignItem{
    Center,
    TopOrLeft,
    BottomOrRight
}

export class SprotBoxSizer{
    children: SprotSizerItem[];
    parentSize: Size;
    orientation: Orientation;
    minSize: Size;
    parentPosition: Point;
    containingElement: sprotHtmlElement | null;
    alignItems: AlignItem;
    elementGap: number;

    constructor(orient = Orientation.Horizontal){
        this.children = [];
        this.parentSize = {w: -1, h: -1};
        this.orientation = orient;
        this.minSize = {w: -1, h: -1};
        this.parentPosition = defaultPoint;
        this.containingElement = null;
        this.alignItems = AlignItem.TopOrLeft;
        this.elementGap = 0;
    };

    sizeInMajorDir = (size: Size): number => {
        if(this.orientation == Orientation.Horizontal){
            return size.w; 
        }
        return size.h;
    }

    sizeInMinorDir = (size: Size): number => {
        if(this.orientation == Orientation.Horizontal){
            return size.h;
        }
        return size.w;
    }

    posInMajorDir = (pt: Point): number => {
        if(this.orientation === Orientation.Horizontal){
            return pt.x;
        }
        return pt.y;
    }

    posInMinorDir = (pt:Point): number => {
        if(this.orientation == Orientation.Horizontal){
            return pt.y;
        }
        return pt.x;
    }

    setSizeGivenDir = (major: number, minor: number): Size => {
        if(this.orientation == Orientation.Horizontal){
            return {w: major, h: minor};
        }
        return {w: minor, h: major};
    }

    // calcMinSize is used to calculate the size of the elements combined
    calcMinSize = (): Size => {
        let minSizeMajorDir = 0;
        let highestSizeMinDir = 0;
        for(let i = 0; i < this.children.length; i++){
            const element: SprotSizerItem = this.children[i];
            minSizeMajorDir += this.sizeInMajorDir(element.getSize());

            if(this.sizeInMinorDir(element.getSize()) > highestSizeMinDir){
                highestSizeMinDir = this.sizeInMinorDir(element.getSize());
            }
        }
        return this.setSizeGivenDir(minSizeMajorDir, highestSizeMinDir);
    }

    reportFirstDir = (dir: Orientation, size: number, sizeInOtherDir: number) => {}

    repositionChildren = ()=> {
        if(this.children.length <= 0){
            return;
        }

        let offsetX = 0;
        let offsetY = 0;


        const minSize:Size = this.calcMinSize();

        const itemSizeProportion = this.sizeInMajorDir(this.parentSize) / this.children.length;
        const largestItem = this.sizeInMinorDir(minSize);
        let minMajor = this.sizeInMajorDir(minSize);

        // if the minimum size of children combined is greater that
        // the size of the parent then minSize is the size of the parent element
        if(minMajor >= this.sizeInMajorDir(this.parentSize)){
            minMajor = this.sizeInMajorDir(this.parentSize);
        }
        
        
        if(this.alignItems == AlignItem.Center){
            // offsetX = 0; 

            const totParentWidth = this.sizeInMinorDir(this.parentSize);
            const totChildrenWidth = this.sizeInMinorDir(minSize);

            if(this.orientation === Orientation.Vertical){
                offsetX = (totParentWidth - totChildrenWidth) / 2;
            }else{
                offsetY = (totParentWidth - totChildrenWidth) / 2;
            }
        }

        const len = this.children.length;
        for(let i = 0; i < len; i++){
            const child = this.children[i];

            if(this.orientation === Orientation.Horizontal)
            {
                let gap = this.elementGap;
                if(i === len - 1){
                    gap = 0;
                }
                child.setPoint({
                    x: offsetX + 10 + itemSizeProportion * i, 
                    y: offsetY + 10 + 0
                });
                child.setSize({w: itemSizeProportion - gap, h: largestItem});

            }
            else if(this.orientation === Orientation.Vertical)
            {
                let gap = this.elementGap;
                if(i === len - 1){
                    gap = 0;
                }
                child.setPoint({x: offsetX + 10, 
                    y: offsetY + 10 + itemSizeProportion * i});
                child.setSize({w: largestItem, h: itemSizeProportion - gap});

            }
        }
    }

    addElement = (element: sprotHtmlElement) : void => {
        const sizerItem = new SprotSizerItem();
        sizerItem.setHtmlElement(element);
        this.children.push(sizerItem);
    }

    addItem = (item: SprotSizerItem): void => {
        this.children.push(item);
    }

    justifyContent = (dir: string):void => {

    }

    setAlignItems = (dir: AlignItem): void => {
        this.alignItems = dir;
    }

    addSpacer = (spacer: number):void => {}

    setParentSize = (size: Size): void => {this.parentSize = size;}

    setParentPoint = (pos: Point): void => {this.parentPosition = pos;}

    setContainingElement = (element: sprotHtmlElement | null): void => {
        this.containingElement = element;
    }
    getContainingElement = (): sprotHtmlElement | null => {
        return this.containingElement;
    }

    gap = (gap: number): void => {this.elementGap = gap;}
}