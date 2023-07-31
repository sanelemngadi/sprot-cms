import { SprotDesignBoard } from "../canvas/canvas.js";
import { SprotGraphicsContext } from "../context/graphics.js";
import { SprotBrush, SprotPen } from "../context/tools.js";
import { SprotSizeEvent } from "../events/event.js";
import { SprotEventHandler } from "../events/evthandlers.js";
import SPROT from "../utils/defaults.js";
import { SprotBlockElementName, SprotState, SprotInlineElementName } from "../utils/interfaces.js";
import { SPROTPoint, SPROTRect, SPROTSize,  
    SprotCornerRadius, SprotTransformationInDirection } from "../utils/utils.js";
import { SprotBoxModel, SprotConstructBoxModel } from "./settings/boxmodel.js";
import { SprotBoxSizer } from "./sizers/boxsizer.js";
import { SprotHightlightSizer } from "./sizers/drawsizer.js";

interface SprotStyle{
    pen: SprotPen,
    brush: SprotBrush
};

interface SprotStyleStates{
    normal: SprotStyle,
    hover: SprotStyle,
    focus: SprotStyle,
    active: SprotStyle,
    disabled: SprotStyle,
}

class SprotStateStyle{
    private pen: SprotPen;
    private HoverPen: SprotPen;

    private brush: SprotBrush;
    private hoverBrush: SprotBrush;
    constructor(){
        this.pen = new SprotPen("black");
        this.HoverPen = new SprotPen("black");
        this.brush = new SprotBrush("black");
        this.hoverBrush = new SprotBrush("black");
    }

    getHoverPen(): SprotPen{return this.HoverPen;}
    setHoverPen(p: SprotPen){this.HoverPen = p;}

    getPen(): SprotPen{return this.pen;}
    setPen(p: SprotPen){this.pen = p;}

    getHoverBrush(): SprotBrush{return this.hoverBrush;}
    setHoverBrush(b: SprotBrush){this.hoverBrush = b;}
    
    getBrush(): SprotBrush{return this.brush;}
    setBrush(b: SprotBrush){this.brush = b;}
}

// have class for styles

export abstract class SprotHtmlBaseElement extends SprotEventHandler{
    protected type: "block" | "inline";
    protected children: SprotHtmlBaseElement[];
    protected innerText: string;
    protected borderRadius: SprotCornerRadius;
    protected styleStates: SprotStateStyle; 
    protected eventState: SprotState;
    protected sizer: SprotBoxSizer | null;
    protected shown: boolean;
    protected boxModel: SprotBoxModel;
    protected drawBoxModel: SprotConstructBoxModel;
    protected enabled: boolean;
    protected focused: boolean;
    
    constructor(
        protected parent: SprotHtmlBaseElement | SprotDesignBoard, 
        protected canvas: SprotDesignBoard,        
        protected name: SprotBlockElementName | SprotInlineElementName,
        protected position: SPROTPoint = SPROT.NULL_POINT,
        protected size: SPROTSize = SPROT.NULL_SIZE
        ){
        super(); // call base class ctor

        this.type = "block";
        this.children = [];
        this.innerText = "";
        this.name = "div";
        this.parent = parent;
        this.size = size;
        this.position = this.relativePosition(position);
        this.canvas = canvas;
        this.borderRadius = new SprotCornerRadius();
        this.sizer = null;
        this.shown = true;
        this.enabled = true;
        this.boxModel = new SprotBoxModel(this);
        this.focused = false;

        if(this.parent instanceof SprotHtmlBaseElement){
            this.parent.appendChildElement(this);
        }

        this.styleStates = new SprotStateStyle();
        this.eventState = SprotState.DEFAULT;

        if(this.type === "block"){
            this.size = this.parent.getSize();
        }

        this.drawBoxModel = new SprotConstructBoxModel(this);

        this.addEventListener("mouseenter", ()=>{this.Refresh();});
        this.addEventListener("mouseleave", ()=>{this.Refresh();});
        // this.addEventListener("", ()=>{this.Refresh();});
    }

    // when you set position it must be relative to the parent
    relativePosition(pos: SPROTPoint): SPROTPoint{
        const parentPos = this.parent.getPosition();
        return new SPROTPoint(parentPos.getX() + pos.getX(), 
            parentPos.getY() + pos.getY());
    }

    getRelativePosition () {
        return this.relativePosition(this.position);
    }

    

    getParent = (): SprotHtmlBaseElement | SprotDesignBoard => {return this.parent;}
    getChildren():SprotHtmlBaseElement | SprotHtmlBaseElement[] | string {
        return this.children;
    }

    getBoxModel(){return this.boxModel;}

    getName ():string{return this.name;}
    getType():string {return this.type;}
    getCanvas():SprotDesignBoard {return this.canvas;}


    setInnerText(text: string){
        this.innerText = text;
    }

    appendChildElement(child: SprotHtmlBaseElement){
        this.children.push(child);
    }

    getHighestMinHeight(): number{
        let size = this.getSize().getHeight();

        if(Array.isArray(this.children)){
            for(let child of this.children){
                const height = child.getSize().getHeight();
                size += height;
            }
        }
        return size;
    }

    isShown():boolean {return this.shown;}
    Show(b: boolean){this.shown = b;}

    isEnabled() {return this.enabled;}
    Enable(n: boolean){this.enabled = n;}

    hasFocus(){return this.focused;}
    setFocus(f: boolean){this.focused = f;}

    setSizer(sizer: SprotBoxSizer){
        this.sizer = sizer;
        this.sizer.setContainingElement(this);

        this.addustSizer();
    }

    private addustSizer(){
        if(!this.sizer){
            return;
        }
        const size = this.getSize();
        let major = SprotTransformationInDirection.getSizeMajorDir(
            this.sizer.getOrientation(), size
        );
        let minor = SprotTransformationInDirection.getSizeMinorDir(
            this.sizer.getOrientation(), size
        );
            
        this.sizer.setDimension(this.getPosition(), size);
        this.sizer.getFirstDir(major, minor);
        this.sizer.setSizer();        
    }

    setPosition = (p: SPROTPoint) => {this.position = p;};
    getPosition = (): SPROTPoint => {return this.position;}

    setSize = (s: SPROTSize) => {
        this.size = s;
    };
    getSize = (): SPROTSize => {return this.size;}
    transform(r: SPROTRect){
        this.position = r.getPosition();
        this.size = r.getSize();
    }

    getRect(){return SPROTRect.create(this.position, this.size);}

    getPen (): SprotPen{return this.styleStates.getPen();}
    setPen(pen: SprotPen){this.styleStates.setPen(pen);}

    getBrush():SprotBrush{return this.styleStates.getBrush();};
    setBrush(b: SprotBrush){this.styleStates.setBrush(b);}

    getHoverPen (): SprotPen{return this.styleStates.getHoverPen();}
    setHoverPen(pen: SprotPen){this.styleStates.setHoverPen(pen);}

    getHoverBrush():SprotBrush{return this.styleStates.getHoverBrush();};
    setHoverBrush(b: SprotBrush){this.styleStates.setHoverBrush(b);}

    getEventState():SprotState{return this.eventState;}
    setEventState(s:SprotState){this.eventState = s;}
    hasEventState(s:SprotState){return this.eventState === s;}

    Refresh(){
        const rect = SPROTRect.create(this.getPosition(), this.getSize());
        this.canvas.Refresh();
    }


    getBorderRadius(): SprotCornerRadius {return this.borderRadius;}
    setBorderRadius(br: SprotCornerRadius){this.borderRadius = br;}

    onPaintElement = (gc: SprotGraphicsContext) => {
        if(Array.isArray(this.children)){
            const children = this.children;
            for(let element of children){
                element.onPaintElement(gc);
            }
        }

        const rect = SPROTRect.create(this.getRelativePosition(), this.size);
        const r = 0;
        const br = new SprotCornerRadius(r,r,r,r);

        switch (this.getEventState()) {
            case SprotState.DEFAULT:
                gc.setPen(this.getPen());
                gc.setBrush(this.getBrush());
                break;
            case SprotState.HOVERED:
                gc.setPen(this.getHoverPen());
                gc.setBrush(this.getHoverBrush());
            default:
                break;
        }
        gc.drawBorderRadiusRect(rect, br);
        // gc.drawBorderRadiusRect(rect.deflate(20), br);

        // draw focus circle
        if(this.focused){
            gc.setPen(new SprotPen("red"));
            gc.drawRect(rect.deflate(10));
            gc.setPen(new SprotPen("white"));
        }

        this.drawBoxModel.drawModel(gc);
        SprotHightlightSizer.hightlight(gc, this.sizer, true);
    }

    onSizeEvent = (event: SprotSizeEvent): void => {
        if(this.type === "block" && this.size.getWidth() <= -1){
            this.size.Width(event.getSize().getWidth());
        }

        // console.log("Onsize event inside element");
        this.addustSizer();
    }
}

export abstract class SprotBlockElement extends SprotHtmlBaseElement{
    constructor(
        protected parent: SprotHtmlBaseElement | SprotDesignBoard, 
        protected canvas: SprotDesignBoard,
        protected name: SprotBlockElementName,
        protected position: SPROTPoint = SPROT.NULL_POINT,
        protected size: SPROTSize = SPROT.NULL_SIZE
    ){
        super(parent, canvas, name, position, size);
    }
}

export abstract class SprotInlineElement extends SprotHtmlBaseElement{
    constructor(
        protected parent: SprotHtmlBaseElement | SprotDesignBoard, 
        protected canvas: SprotDesignBoard,
        protected name: SprotInlineElementName,
        protected position: SPROTPoint = SPROT.NULL_POINT,
        protected size: SPROTSize = SPROT.NULL_SIZE
    ){
        super(parent, canvas, name, position, size);
    }
}