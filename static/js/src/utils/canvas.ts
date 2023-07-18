import { sprotHtmlElement } from "./element.js";
import { SprotGraphicContext } from "./graphiccontext.js";
import { ActionControl, CSSProp, ElementState, Point, Size, defaultPoint } from "./interfaces.js";
import { Rect } from "./rect.js";
import { SprotBoxSizer } from "./sizers/boxsizer.js";
import { SprotSizerItem } from "./sizers/sizeritem.js";

export class DesignBoard {
    private isDragging: boolean;
    private startPos: Point;
    private ctx: CanvasRenderingContext2D | null;
    // private rectangles: Rect[];
    // private element: sprotHtmlElement;
    private elements: sprotHtmlElement[];
    public globalStyles: CSSProp;
    
    constructor(public canvas: HTMLCanvasElement | null) {
        this.isDragging = false;
        this.startPos = {x:-1, y:-1};
        // this.rectangles = [];
        this.globalStyles = {
            "margin": 0,
            "padding": 0,
            "scroll-behavior": "smooth",
            "box-sizing": "border-box",
        };
        // this.element = new sprotHtmlElement(this.globalStyles);
        this.elements = [];

        // bind mouse events
        this.bindEvents();

        // device context
        this.ctx = canvas ? canvas.getContext("2d") : null;
    };

    addGlobalStyles = (styles: CSSProp):void => {
        this.globalStyles = {...this.addGlobalStyles, ...styles};
    }

    isOk = (): boolean =>{
        if(this.canvas){
            return true;
        }
        return false;
    }

    bindEvents = (): void => {
        this.canvas?.addEventListener("mousedown", (event: MouseEvent): void =>{
            this.isDragging = true;
            this.startPos = this.calcUnscrolledPosition({x: event.clientX, y: event.clientY});

            for(let i = 0; i < this.elements.length; i++){
                const elem = this.elements[i];

                // const hittedControl = elem.rectangle.findControlByPosition(this.startPos);

                switch (elem.rectangle.controlsHitTest(this.startPos)) {
                    case ActionControl.None:
                        break;
                    case ActionControl.Left:
                        break;
                    case ActionControl.Top:
                        break;
                    case ActionControl.Right:
                        break;
                    case ActionControl.Bottom:
                        this.addBottomContainer(elem);                        
                        break;
                
                    default:
                        break;
                }
                // this.refresh();
            }

            // if(this.ctx){
                // this.ctx.beginPath();
                // this.ctx.moveTo(this.startPos.x, this.startPos.y);
// 
                // this.elements.map(elem=>{
                    // if(elem.contains(this.startPos)){
                        // console.log(elem.savePerspective());
                    // }
                // })
            // };
        });

        this.canvas?.addEventListener("mouseup", (event: MouseEvent): void => {
            this.isDragging = false;
            const point = this.calcUnscrolledPosition({x: event.clientX, y: event.clientY});
            const start:Point = {x: this.startPos.x, y: this.startPos.y};
            // const size:Size = {w: point.x - start.x, h: point.y - start.y};

            // const rect: Rect= new Rect(start, size);
            // this.rectangles.push(rect);
        });

        this.canvas?.addEventListener("mousemove", (event: MouseEvent): void => {
            const pos = this.calcUnscrolledPosition({x: event.clientX, y: event.clientY});
            const element = this.findElementByPosition(pos);
            this.setHoveredElement(element, pos);
        });
    }

    refresh = (): void => {
        if(!this.ctx){
            return;
        }
        const initPoint = this.calcUnscrolledPosition({x: 0, y: 0});
        this.ctx.clearRect(initPoint.x, initPoint.y, 
            window.innerWidth - initPoint.x, window.innerHeight - initPoint.y);
        this.canvasPaintings();
    }

    calcUnscrolledPosition = (point: Point): Point => {
        if(!this.canvas){
            return defaultPoint;
        }
        const x = point.x + window.scrollX - this.canvas.offsetLeft || 
            point.x + this.canvas.scrollLeft - this.canvas.offsetLeft;
        const y = point.y + window.scrollY - this.canvas.offsetTop || 
            point.y + this.canvas.scrollTop - this.canvas.offsetTop;

        return {x,y};
    }

    addElement = (elem: sprotHtmlElement):void => {
        this.elements.push(elem);
    }

    canvasPaintings = () => {
        const gc = new SprotGraphicContext(this.ctx);
        if(!gc){
            return false;
        }

        for(let i = 0 ; i < this.elements.length; i++){
            const elem: sprotHtmlElement = this.elements[i];
            elem.drawElement(gc);
            console.log("element-", elem.getName(), ": ", elem.getY());
        }       
    }

    addBottomContainer = (prevContainer: sprotHtmlElement):void => {
        const prevPoint = prevContainer.getPoint();
        const prevSize = prevContainer.getSize();

        const newElemet = new sprotHtmlElement(null);
        newElemet.setX(prevPoint.x);
        newElemet.setY(prevPoint.y + prevSize.h);
        newElemet.setWidth(prevSize.w);
        newElemet.setHeight(50);
        this.addElement(newElemet);

        console.log("bottom elem: ", this.elements.length);
        this.refresh();
    }

    findElementByPosition = (point: Point): sprotHtmlElement | null => {
        // we are iteration in reverse order because we want to make sure that 
        // its only the topmost item that is returned
        for(let i = this.elements.length - 1; i >= 0 ; i--){
            const element = this.elements[i];

            if(element.contains(point) || 
                element.rectangle.controlsHitTest(point) !== ActionControl.None){
                return element;
            }
        }
        return null;
    }

    setHoveredElement = (htmlElemet: sprotHtmlElement | null, point: Point): void => {
        if(htmlElemet && htmlElemet.getState() === ElementState.Locked){
            return;
        }

        let formerHovered: sprotHtmlElement | null = null;

        for(let i = 0; i < this.elements.length; i++){
            const element = this.elements[i];
            if(!element){
                continue;
            }

            if(element.getState() === ElementState.Hovered){
                formerHovered = element;
            }

            element.setState(ElementState.Default);
        }

        if(htmlElemet){
            htmlElemet.setState(ElementState.Hovered);
            this.mouseMouseOverElement(htmlElemet, point); // this methods tracks the movement
            // inside the hovered element
        }

        if(htmlElemet !== formerHovered){   
            if(htmlElemet){
                // console.log("mouse entered");
                this.mouseEnterElement(htmlElemet); // this method keeps track of the entered element
            }  else{
                if(formerHovered){
                    // console.log(("mouse left"));
                    this.mouseLeaveElement(formerHovered); // if the mouse leaves the previous entered
                    // element this method is called immediately
                }
            }      
        }
    }
    
    mouseEnterElement = (enteredElement: sprotHtmlElement): void => {
        enteredElement.rectangle.showControls(true);
        this.refresh();
    }

    mouseLeaveElement = (leftElement: sprotHtmlElement): void => {
        leftElement.rectangle.showControls(false);
        this.refresh();
    }

    mouseMouseOverElement = (element: sprotHtmlElement, point: Point): void => {
        if(element.rectangle.hover(point)){
            // console.log("over control");
            this.refresh();  
        }
    }

    setSizer = (sizer: SprotBoxSizer): void => {
        if(!this.canvas){
            return;
        }
        const pos = this.calcUnscrolledPosition({x: 0, y:0});
        sizer.setParentPoint({x: 0, y:0});
        sizer.setParentSize({w: this.canvas.width, h: this.canvas.height});
        sizer.setContainingElement(null);
        sizer.repositionChildren();
    }
}

const sideBar: HTMLElement | null = document.getElementById("side-bar");
