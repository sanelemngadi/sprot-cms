import { SprotGraphicsContext } from "../context/graphics.js";
import { SprotHtmlBaseElement } from "../elements/base.js";
import { SprotEventObjectFactory } from "../events/factory.js";
import { SprotState } from "../utils/interfaces.js";
import { SprotEventStateElement } from "../utils/states/setstate.js";
import { SPROTPoint, SPROTRect, SPROTSize } from "../utils/utils.js";

class DrawElement{
    constructor(
        private elements: SprotHtmlBaseElement[]
    ){
        this.elements = elements;
    }

    operations = (gc: SprotGraphicsContext):void => {
        for(let element of this.elements){
            if(!element.isShown()){
                continue;
            }
            element.onPaintElement(gc);
        }
    }
}

class SprotResizeElement{
    private eventFactory: SprotEventObjectFactory;
    constructor(){
        this.eventFactory = new SprotEventObjectFactory();
    }

    resize = (size: SPROTSize, elements: SprotHtmlBaseElement[]) => {

        // things that needs to happen here, if we size the parent we need to notify
        // all children, and if we size the children we alse need to notify the parent
        // by doing so we will be able to make the elements that size well

        // so we only need to send the sizing event and then the element will tell all its children and parents
        for(let element of elements){
            if(!element.isShown()){
                continue;
            }
            // recursively resize child elements
            const children = element.getChildren() as SprotHtmlBaseElement[];
            if(children.length > 0){
                const sizeElements = new SprotResizeElement();
                sizeElements.resize(size, children);
            }

            // this.sizeElement(size, element);
            this.eventFactory.dispatch({
                type: "resize", payload: {
                    activeElement: element,
                    size
                }
            })
        }
    }

    // sizeElement = (parentSize: SPROTSize, childElement: SprotHtmlBaseElement) =>{
    //     childElement.onSizeEvent(new SprotSizeEvent(parentSize));
    // }
}

// in canvas we need to add body tag, then body tag will handle all the elements

export class SprotDesignBoard{
    private ctx: CanvasRenderingContext2D | null;
    private backgroundColor: string;
    private elements: SprotHtmlBaseElement[];

    // actions
    private event: SprotEventStateElement;
    private sizing: SprotResizeElement;

    constructor(private canvas: HTMLCanvasElement){
        this.canvas = canvas;
        this.backgroundColor = "silver";
        this.elements = [];
        this.event = new SprotEventStateElement();
        this.sizing = new SprotResizeElement();

        this.ctx = canvas.getContext("2d");
        if(this.ctx){
            this.ctx.fillStyle = this.backgroundColor;
            this.ctx.fillRect(canvas.offsetLeft, canvas.offsetTop, 
                canvas.width, canvas.height);
        }
        this.bindEvents();
    }

    bindEvents = ():void => {
        this.canvas.addEventListener("mousedown", this.onMouseLeftDown);
        this.canvas.addEventListener("mouseup", this.onMouseLeftUp);
        this.canvas.addEventListener("mousemove", this.onMouseMove);
        this.canvas.addEventListener("resize", this.onSize);
        // this.canvas.addEventListener()
        window.addEventListener("resize", this.onSize);
    }

    onMouseLeftDown = (event: MouseEvent): void => {
        const pt = this.calcUnscrollPos(new SPROTPoint(event.clientX, event.clientY));
        this.event.setEventState(SprotState.PRESSED, pt, this.elements);
    };
    
    onMouseMove = (event: MouseEvent): void => {
        const pt = this.calcUnscrollPos(new SPROTPoint(event.clientX, event.clientY));
        this.event.setEventState(SprotState.HOVERED, pt, this.elements); 
    };
    
    onMouseLeftUp = (event: MouseEvent): void => {
        const pt = this.calcUnscrollPos(new SPROTPoint(event.clientX, event.clientY));
        this.event.setEventState(SprotState.RELEASED, pt, this.elements); 
    };

    onSize = (/*event: UIEvent*/): void => {
        // console.log("resize, ", window.innerWidth);
        this.sizing.resize(new SPROTSize(this.canvas.width - 10*2, this.canvas.height), 
            this.elements);

        this.Refresh();
    }

    private calcUnscrollPos(point: SPROTPoint): SPROTPoint{
        return new SPROTPoint(
            point.getX() + window.scrollX - this.canvas.offsetLeft,
            point.getY() + window.scrollY - this.canvas.offsetTop);
    }

    Refresh(){
        if(!this.ctx){
            return;
        }
        this.ctx.clearRect(this.canvas.offsetLeft, this.canvas.offsetTop, 
            this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(this.canvas.offsetLeft, this.canvas.offsetTop, 
            this.canvas.width, this.canvas.height);
        this.ctx.fill();

        this.PaintDesignBoard(); // we trigger a repaint
    }

    RefreshRect(rect:SPROTRect){
        if(!this.ctx){
            return;
        }
        this.ctx.clearRect(rect.getX(), rect.getY(), rect.getWidth(), rect.getHeight());

        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(rect.getX(), rect.getY(), rect.getWidth(), rect.getHeight());
        this.ctx.fill();

        this.PaintDesignBoard(); // we trigger a repaint
    }

    PaintDesignBoard = ():void => {
        if(!this.ctx){
            return;
        }

        const gc = SprotGraphicsContext.create(this.ctx);
        if(gc){
            const drawings = new DrawElement(this.elements);
            drawings.operations(gc);
        }
    }

    getSize():SPROTSize{
        return new SPROTSize(this.canvas.width, this.canvas.height);
    }

    getPosition(): SPROTPoint{
        return new SPROTPoint(this.canvas.offsetLeft, this.canvas.offsetTop);
    }

    // must only be able to add only the body element, the headers will be add by plugins
    addElement = (element: SprotHtmlBaseElement)=> {
        this.elements.push(element);
    }
}