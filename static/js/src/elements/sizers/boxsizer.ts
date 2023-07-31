import { SprotDesignBoard } from "../../canvas/canvas.js";
import SPROT from "../../utils/defaults.js";
import { SprotDirection, SprotOrientation } from "../../utils/interfaces.js";
import { SPROTPoint, SPROTRect, SPROTSize, SprotTransformationInDirection } from "../../utils/utils.js";
import { SprotHtmlBaseElement } from "../base.js";
import { SprotSizerFlags, SprotSizerItem, SprotSizerItemKind } from "./sizeritem.js";


interface SprotPositionChildren{
    positionChidlren(children: SprotSizerItem[]): void;
}

class SprotSizerOption{
    private gap: number;
    constructor(private display: "flex" | "inline-flex"){
        this.display = display;
        this.gap = -1;
    }

    Gap(n: number){
        this.gap = n;
    }

    getGap(){return this.gap;}
}

class SprotReposition implements SprotPositionChildren{
    private children: SprotSizerItem[];
    private availSize: SPROTSize;
    private point: SPROTPoint;
    private options: SprotSizerOption;

    constructor(private sizer: SprotBoxSizer, private orient: SprotOrientation, 
        size: SPROTSize, point: SPROTPoint, options: SprotSizerOption){
            this.sizer = sizer;
        this.children = [];
        this.orient = orient;
        this.availSize = size;
        this.point = point;
        this.options = options;
    }

    empty():boolean {return this.children.length === 0;}

    // considerGap(children: SprotSizerItem[]): SprotSizerItem[]{
    //     if(children.length <= 0 || this.options.getGap() <= 0){
    //         return children;
    //     }
    //     const last_indx = children.length - 1;
    //     const elems: SprotSizerItem[] = [];
    //     for(let indx = 0; indx < children.length; indx++){
    //         const element = children[indx];
    //         if(indx !== 0){
    //             const size = new SPROTSize(
    //                 this.options.getGap(),this.options.getGap()
    //             )
    //             const sizerItem = new SprotSizerItem(size);
    //             sizerItem.setKind(SprotSizerItemKind.GAP);
    //             elems.push(sizerItem);
    //         }
    //         elems.push(element);
    //     }

    //     return elems;
    // }

    calcMinSize(): number{
        let size = 0;
        for(let item of this.children){
            if(item.getFlags().getFlex() <= 0){
                size += SprotTransformationInDirection.getSizeMajorDir(
                    this.sizer.getOrientation(), item.getMinSize()
                );
            }
        }
        
        return size;
    }

    positionChidlren(children: SprotSizerItem[]): void {
        this.children = children;
        if(this.empty()){
            return;
        }

        const availMajrDir = SprotTransformationInDirection.getSizeMajorDir(
            this.orient, this.availSize
        );
        const availFlexSize =  Math.abs(availMajrDir - this.calcMinSize());

        const hightMinorDir = SprotTransformationInDirection.getSizeMinorDir(
            this.orient, this.availSize
            ) ;
        const itemMajor = availFlexSize / 4;

        console.log("items:", itemMajor);

        let currentPos = 0;
        const currentPosMinorDir = SprotTransformationInDirection.getPosMinorDir(
            this.orient, this.sizer.getDimension().getPosition()
        );

        for(let i = 0; i < children.length; i++){
            const child = children[i];

            if(!child.isShown()){
                continue;
            }

            let pos = currentPos;
            let posMinorDir = currentPosMinorDir;
            let itemSize = itemMajor;

            if(child.getFlags().getFlex() <= 0){
                itemSize = SprotTransformationInDirection.getSizeMajorDir(
                    this.orient, child.getMinSize()
                );
            }

            if(child.getKind() === SprotSizerItemKind.ELEMENT){
                posMinorDir = 0;
            }
            const point = SprotTransformationInDirection.setPointGivenDir(
                this.orient, pos, posMinorDir
            );

            child.setPosition(point);
            const constructSize = SprotTransformationInDirection.getSizeGivenDir(
                this.orient, itemSize, hightMinorDir
            );
            child.setSize(constructSize);
            currentPos += itemSize;      
        }
    }

    getHighestMinorDir(): number{
        let size = 0;
        for(let child of this.children){
            if(!child.isShown()){
                continue;
            }
            const element = child.getElement();
            if(element === null){
                continue;
            }

            size += SprotTransformationInDirection.getSizeMinorDir(
                this.orient, element.getSize()
            );
        }
        return size;
    }


    setItemDimensions(itemSize: SPROTSize){

    }
}

export class SprotBoxSizer{
    private children: SprotSizerItem[];
    private availableSize: SPROTSize;
    private position: SPROTPoint;
    private containingParent: SprotHtmlBaseElement | SprotDesignBoard | null;
    private options: SprotSizerOption;

    constructor(private orient: SprotOrientation = SprotOrientation.HORIZONTAL){
        this.children = [];
        this.orient = orient;
        this.availableSize = SPROT.NULL_SIZE;
        this.position = SPROT.NULL_POINT;
        this.containingParent = null;
        this.options = new SprotSizerOption("flex");
    }



    add(x: number, y: number, flex: number = 0, 
        borderSides: SprotDirection = SprotDirection.Left ,border: number  = 0, 
        kind: SprotSizerItemKind = SprotSizerItemKind.ELEMENT  
        ){
        const flag = new SprotSizerFlags(flex);
        flag.Border(borderSides, border);
        const size = new SPROTSize(x, y);
        const sizerItem = this.addSpacer(size);
        sizerItem.setFlags(flag);
        sizerItem.setKind(kind);
        if(sizerItem.isShown()){
            this.children.push(sizerItem);
            return sizerItem;
        }
        return null;
    }

    addElement(element: SprotHtmlBaseElement, 
        flags: SprotSizerFlags = new SprotSizerFlags(0)): SprotSizerItem | null{
        const sizerItem = SprotSizerItem.createFromElement(element, flags);
        sizerItem.Show(element.isShown());
        sizerItem.setKind(SprotSizerItemKind.ELEMENT);
        if(sizerItem.isShown()){
            this.children.push(sizerItem);
            return sizerItem;
        }
        return null;
    }

    addSpacer(size: SPROTSize): SprotSizerItem{
        const sizerItem = new SprotSizerItem(size, new SprotSizerFlags(0));
        sizerItem.setKind(SprotSizerItemKind.SPACER);
        this.children.push(sizerItem);
        return sizerItem;
    }
    
    addStretchSpacer(size: SPROTSize): SprotSizerItem{
        const sizerItem = new SprotSizerItem(size, new SprotSizerFlags(1));
        sizerItem.setKind(SprotSizerItemKind.SPACER);
        this.children.push(sizerItem);
        return sizerItem;
    }

    addGap(n: number): SprotSizerItem{
        const size = new SPROTSize(n, n);
        const sizerItem = new SprotSizerItem(size, new SprotSizerFlags(0));
        sizerItem.setKind(SprotSizerItemKind.GAP);
        this.children.push(sizerItem);
        return sizerItem;
    }

    getFirstDir(availSizeMajorDir: number, availSizeMinorDir: number){
        const size = SprotTransformationInDirection.getSizeGivenDir(this.orient, 
            availSizeMajorDir, availSizeMinorDir);
        this.availableSize = size;
    }

    setSizer(){
        const pos = new SprotReposition(this, this.orient, 
            this.availableSize, this.position, this.options);
        this.positionChildren(pos);
    }

    positionChildren(positioning: SprotPositionChildren){
        positioning.positionChidlren(this.children);
    }

    getOrientation(){return this.orient;}
    setDimension(pt: SPROTPoint, sz: SPROTSize){
        this.position = pt;
        this.availableSize = sz;
    }

    getDimension(): SPROTRect{
        return SPROTRect.create(this.position, this.availableSize);
    }

    getContainingElement(): SprotHtmlBaseElement | SprotDesignBoard | null{
        return this.containingParent;
    }

    setContainingElement(element: SprotHtmlBaseElement | SprotDesignBoard){
        // all our child element must have this element as a parent
        for(let child of this.children){
            if(!child.hasElement()){
                continue;
            }
            const parent = child.getElement()?.getParent();
            if(parent && parent !== element){
                throw new Error("all child elements must have this element as a parent");
            }
        }
        this.containingParent = element;
    }

    getChildrenCount(): number{return this.children.length;}
    getChildren() {return this.children;}

    Gap(n: number){
        this.options.Gap(n);
        return this;
    }
}