import { sprotHtmlElement } from "./element.js";
import { SprotGraphicContext } from "./graphiccontext.js";
import { ActionControl, ElementState, defaultPoint } from "./interfaces.js";
export class DesignBoard {
    constructor(canvas) {
        this.canvas = canvas;
        this.addGlobalStyles = (styles) => {
            this.globalStyles = Object.assign(Object.assign({}, this.addGlobalStyles), styles);
        };
        this.isOk = () => {
            if (this.canvas) {
                return true;
            }
            return false;
        };
        this.bindEvents = () => {
            var _a, _b, _c;
            (_a = this.canvas) === null || _a === void 0 ? void 0 : _a.addEventListener("mousedown", (event) => {
                this.isDragging = true;
                this.startPos = this.calcUnscrolledPosition({ x: event.clientX, y: event.clientY });
                for (let i = 0; i < this.elements.length; i++) {
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
            (_b = this.canvas) === null || _b === void 0 ? void 0 : _b.addEventListener("mouseup", (event) => {
                this.isDragging = false;
                const point = this.calcUnscrolledPosition({ x: event.clientX, y: event.clientY });
                const start = { x: this.startPos.x, y: this.startPos.y };
                // const size:Size = {w: point.x - start.x, h: point.y - start.y};
                // const rect: Rect= new Rect(start, size);
                // this.rectangles.push(rect);
            });
            (_c = this.canvas) === null || _c === void 0 ? void 0 : _c.addEventListener("mousemove", (event) => {
                const pos = this.calcUnscrolledPosition({ x: event.clientX, y: event.clientY });
                const element = this.findElementByPosition(pos);
                this.setHoveredElement(element, pos);
            });
        };
        this.refresh = () => {
            if (!this.ctx) {
                return;
            }
            const initPoint = this.calcUnscrolledPosition({ x: 0, y: 0 });
            this.ctx.clearRect(initPoint.x, initPoint.y, window.innerWidth - initPoint.x, window.innerHeight - initPoint.y);
            this.canvasPaintings();
        };
        this.calcUnscrolledPosition = (point) => {
            if (!this.canvas) {
                return defaultPoint;
            }
            const x = point.x + window.scrollX - this.canvas.offsetLeft ||
                point.x + this.canvas.scrollLeft - this.canvas.offsetLeft;
            const y = point.y + window.scrollY - this.canvas.offsetTop ||
                point.y + this.canvas.scrollTop - this.canvas.offsetTop;
            return { x, y };
        };
        this.addElement = (elem) => {
            this.elements.push(elem);
        };
        this.canvasPaintings = () => {
            const gc = new SprotGraphicContext(this.ctx);
            if (!gc) {
                return false;
            }
            for (let i = 0; i < this.elements.length; i++) {
                const elem = this.elements[i];
                elem.drawElement(gc);
                console.log("element-", elem.getName(), ": ", elem.getY());
            }
        };
        this.addBottomContainer = (prevContainer) => {
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
        };
        this.findElementByPosition = (point) => {
            // we are iteration in reverse order because we want to make sure that 
            // its only the topmost item that is returned
            for (let i = this.elements.length - 1; i >= 0; i--) {
                const element = this.elements[i];
                if (element.contains(point) ||
                    element.rectangle.controlsHitTest(point) !== ActionControl.None) {
                    return element;
                }
            }
            return null;
        };
        this.setHoveredElement = (htmlElemet, point) => {
            if (htmlElemet && htmlElemet.getState() === ElementState.Locked) {
                return;
            }
            let formerHovered = null;
            for (let i = 0; i < this.elements.length; i++) {
                const element = this.elements[i];
                if (!element) {
                    continue;
                }
                if (element.getState() === ElementState.Hovered) {
                    formerHovered = element;
                }
                element.setState(ElementState.Default);
            }
            if (htmlElemet) {
                htmlElemet.setState(ElementState.Hovered);
                this.mouseMouseOverElement(htmlElemet, point); // this methods tracks the movement
                // inside the hovered element
            }
            if (htmlElemet !== formerHovered) {
                if (htmlElemet) {
                    // console.log("mouse entered");
                    this.mouseEnterElement(htmlElemet); // this method keeps track of the entered element
                }
                else {
                    if (formerHovered) {
                        // console.log(("mouse left"));
                        this.mouseLeaveElement(formerHovered); // if the mouse leaves the previous entered
                        // element this method is called immediately
                    }
                }
            }
        };
        this.mouseEnterElement = (enteredElement) => {
            enteredElement.rectangle.showControls(true);
            this.refresh();
        };
        this.mouseLeaveElement = (leftElement) => {
            leftElement.rectangle.showControls(false);
            this.refresh();
        };
        this.mouseMouseOverElement = (element, point) => {
            if (element.rectangle.hover(point)) {
                // console.log("over control");
                this.refresh();
            }
        };
        this.setSizer = (sizer) => {
            if (!this.canvas) {
                return;
            }
            const pos = this.calcUnscrolledPosition({ x: 0, y: 0 });
            sizer.setParentPoint({ x: 0, y: 0 });
            sizer.setParentSize({ w: this.canvas.width, h: this.canvas.height });
            sizer.setContainingElement(null);
            sizer.repositionChildren();
        };
        this.isDragging = false;
        this.startPos = { x: -1, y: -1 };
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
    }
    ;
}
const sideBar = document.getElementById("side-bar");
