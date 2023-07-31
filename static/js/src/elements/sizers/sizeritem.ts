import { SprotDesignBoard } from "../../canvas/canvas.js";
import SPROT from "../../utils/defaults.js";
import { SprotDirection, SprotSides } from "../../utils/interfaces.js";
import { SPROTPoint, SPROTRect, SPROTSize } from "../../utils/utils.js";
import { SprotHtmlBaseElement } from "../base.js";
import { SprotFourSides } from "../styles/values.js";

export class SprotSizerFlags{
    private gap: SprotFourSides;
    private index: number;
    private expand: boolean; // in minor exis
    constructor(private flex: number = 1){
        this.flex = flex;
        this.gap = SPROT.MARGIN;
        this.index = 0;
        this.expand = false;
    }

    Margin(allSides: number): SprotSizerFlags;
    Margin(x: number, y: number): SprotSizerFlags;
    Margin(top: number, horizontal: number, bottom: number ): SprotSizerFlags;
    Margin(top: number, right: number, bottom: number, left: number ): SprotSizerFlags;
    Margin(...args:number[]){
        if(args.length === 1){
            this.gap.setTop(args[0]);
        }else if(args.length === 2){
            this.gap.setBoth(args[0], args[1]);
        }else if(args.length === 3){
            this.gap.setThreeSides(args[0], args[1], args[2]);
        }else if(args.length === 4){
            this.gap.setFourSides(args[0], args[1], args[2], args[3]);
        }

        return this;
    };

    Border(side: SprotDirection, border: number): SprotSizerFlags{
        if(side === SprotDirection.Bottom){
            this.gap.bottom = border;
        }else if(side ==SprotDirection.Left){
            this.gap.left = border;            
        }else if(side ==SprotDirection.Right){
            this.gap.right = border;            
        }else if(side ==SprotDirection.Top){
            this.gap.top = border;            
        }else if(side ==SprotDirection.HORIZONTAL){
            this.gap.right = border;            
            this.gap.left = border;            
        }else if(side ==SprotDirection.VERTICAL){
            this.gap.bottom = border;            
            this.gap.top = border;            
        }
        return this;
    }

    Flex(n: number):SprotSizerFlags{
        this.flex = n;
        return this;
    }

    Order(n: number){
        // changes the order of the element and save index here
        this.index = n;
        return this;
    }

    Expand(b: boolean){
        this.expand = b;
        return this;
    }

    getFlex(){return this.flex;}
    isExpanded(){return this.expand;}
    getBorder(){return this.gap;}
    getOrder(){return this.index;}
}

// when we add the element to the size we alter it position and size
// so we need to save these properties so that if we detach the element
// from the sizeritem we can be able to restore it's original transformation
class SavePrevTransformation{
    constructor(public rect: SPROTRect){
        this.rect = rect;
    }
    save(rect: SPROTRect){
        this.rect = rect;
    }
    restore(): SPROTRect{return this.rect;}
}

// create a class that will be reponsible for positioning the element
// inside the sizeritem just incase there is a border
interface SprotConfigure{
    configure(element: SprotHtmlBaseElement | null, flags: SprotSizerFlags): void;
}

class SprotPositionElementInSizerItem implements SprotConfigure{
    private flags: SprotSizerFlags;
    private element: SprotHtmlBaseElement | null;
    constructor(){
        this.flags = new SprotSizerFlags(0);
        this.element = null;
    }
    configure(element: SprotHtmlBaseElement | null, flags: SprotSizerFlags): void {
        this.element = element;
        this.flags = flags;
        const br = new SprotFourSides(0);
        this.setBorder(br);
        // this.setBorder(flags.getBorder());
    }

    setBorder(b: SprotFourSides){
        if(!this.element){
            return;
        }
        let rect = SPROTRect.create(this.element.getPosition(), 
            this.element.getSize());

        rect = rect.deflate(b);
        this.element.transform(rect);
    }

}

export enum SprotSizerItemKind{
    ELEMENT = 1,
    SPACER,
    GAP
}

export class SprotSizerItem{
    private size: SPROTSize;
    private point: SPROTPoint;
    private flags: SprotSizerFlags;
    private element: SprotHtmlBaseElement | null;
    private savedElementTrans: SavePrevTransformation | null;
    private shown: boolean;
    private kind: SprotSizerItemKind;
    
    constructor(size: SPROTSize, flags: SprotSizerFlags = new SprotSizerFlags(0)){
        this.size = size;
        this.point = SPROT.NULL_POINT;
        this.flags = flags;
        this.element = null;
        this.savedElementTrans = null;
        this.shown = true;
        this.kind = SprotSizerItemKind.ELEMENT;
    }
    
    static createFromElement(element: SprotHtmlBaseElement, 
        flags: SprotSizerFlags = new SprotSizerFlags(0)){
            const sizerItem = new SprotSizerItem(element.getSize(), flags);
            const rect = SPROTRect.create(element.getPosition(), element.getSize());
            sizerItem.savedElementTrans = new SavePrevTransformation(rect);
            sizerItem.Show(element.isShown());
            sizerItem.setElement(element);
            return sizerItem;
    }

    setKind(k: SprotSizerItemKind){this.kind = k;}
    getKind(): SprotSizerItemKind{return this.kind;}
        
    detachElement(): SprotHtmlBaseElement | null{
        if(this.element && this.savedElementTrans){
            const rect = this.savedElementTrans.restore();
            this.element.setPosition(rect.getPosition());
            this.element.setSize(rect.getSize());
            this.savedElementTrans = null;
            return this.element;
        }
        return null;
    }
    
    setElement(element: SprotHtmlBaseElement){
        this.element = element;
        this.Show(element.isShown());
    }
    
    setFlags(flags: SprotSizerFlags){this.flags = flags;}
    getFlags(){return this.flags;}
    getRect() {
        const rect = SPROTRect.create(this.point, this.size);
        return rect;
    }

    getPosition(){return this.point;}
    setPosition(p: SPROTPoint){
        this.point = p;
        if(this.element){
            this.element.setPosition(p);
        }
    }

    getSize(){return this.size;}
    getMinSize(){
        if(this.kind === SprotSizerItemKind.ELEMENT && this.element){
            return this.element.getSize();
        }
        return this.getSize();
    }
    setSize(size:SPROTSize){
        this.size = size;
        if(this.element){
            this.element.setSize(size);
        };
        this.config();
    }

    hasElement(): boolean{return this.element !== null;}
    getElement():SprotHtmlBaseElement | null {return this.element;}

    isShown():boolean {return this.shown;}
    Show(b: boolean){this.shown = b;}

    configureElement(conf: SprotPositionElementInSizerItem){
        conf.configure(this.element, this.flags);
    }

    config(){
        const c = new SprotPositionElementInSizerItem();
        this.configureElement(c);
    }
}