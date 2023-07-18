import { logName } from "./utils/element.js";
const printName = (name) => {
    console.log(`My name is ${name}`);
};
printName("Sanele Mngadi");
// ############################################################################
// # Global variables
// ############################################################################
const canvas = document.getElementById("canvas");
// ############################################################################
// # Global enumerators
// ############################################################################
var Direction;
(function (Direction) {
    Direction[Direction["Default"] = 1] = "Default";
    Direction[Direction["Top"] = 2] = "Top";
    Direction[Direction["Left"] = 3] = "Left";
    Direction[Direction["Right"] = 4] = "Right";
    Direction[Direction["Bottom"] = 5] = "Bottom";
})(Direction || (Direction = {}));
// ############################################################################
// # Global classes
// ############################################################################
// ------------------------------Rect Implementation --------------------------
class Rect {
    constructor(point = { x: -1, y: -1 }, size = { w: -1, h: -1 }) {
        this.center = () => {
            const left = this.point.x;
            const top = this.point.y;
            const cx = left + (this.size.w / 2);
            const cy = top + (this.size.h / 2);
            return { x: cx, y: cy };
        };
        this.contains = (point) => {
            const left = this.point.x;
            const right = left + this.size.w;
            const top = this.point.y;
            const bottom = top + this.size.h;
            const containX = left <= point.x && right >= point.x;
            const containY = top <= point.y && bottom >= point.y;
            if (containX && containY) {
                return true;
            }
            return false;
        };
        // each rectangle knows how to render itself in a canvas
        this.draw = (ctx) => {
            if (!ctx) {
                return;
            }
            ctx.strokeStyle = this.stroke;
            ctx.strokeRect(this.point.x, this.point.y, this.size.w, this.size.h);
        };
        this.point = point;
        this.size = size;
        this.bg = "#ffffff";
        this.stroke = "#000000";
    }
    // setters and get getter
    setPoint(p) { this.point = p; }
    getPoint() { return this.point; }
    setSize(s) { this.size = s; }
    getSize() { return this.size; }
    setX(x) { this.point.x = x; }
    getX() { return this.point.x; }
    setY(y) { this.point.y = y; }
    getY() { return this.point.y; }
    setWidth(w) { this.size.w = w; }
    getWidth() { return this.size.w; }
    setHeight(h) { this.size.h = h; }
    getHeight() { return this.size.h; }
}
// ------------------------------Shape Implementation --------------------------
// we will use these shapes to produces svgs and save them extenally and in our
// webpages
class SprotGraphicContext {
    constructor(ctx) {
        this.foregroundColor = "#ffffff";
        this.backgroundColor = "#ffffff";
        this.lineColor = "#000000";
        this.lineWidth = 1;
        this.isOk = () => {
            return this.dc !== null;
        };
        // draw rectangle
        this.drawRect = (rect) => {
            if (!this.dc) {
                return;
            }
            this.dc.strokeRect(rect.getX(), rect.getY(), rect.getWidth(), rect.getHeight());
            this.dc.fillRect(rect.getX(), rect.getY(), rect.getWidth(), rect.getHeight());
        };
        this.drawText = (text, pos, maxWidth) => {
            if (!this.dc) {
                return;
            }
            this.dc.fillText(text, pos.x, pos.y, maxWidth);
            const heading = new sprotHtmlElement({}, pos);
            heading.name = "p";
            heading.content = text;
            heading.breakpoints.sm = {
            // "max-width": maxWidth + "px"
            };
        };
        this.drawCirce = (rect) => {
            if (!this.dc) {
                return;
            }
            const center = rect.center();
            const radius = rect.getWidth() / 2;
            // settings
            this.dc.strokeStyle = this.lineColor;
            this.dc.fillStyle = this.backgroundColor;
            this.dc.beginPath();
            // this.dc.arc(rect.getX(), rect.getY(), Math.abs(radius), 0, 2 * Math.PI);
            this.dc.arc(center.x, center.y, Math.abs(radius), 0, 2 * Math.PI);
            this.dc.closePath();
            this.dc.fill();
            this.dc.stroke();
        };
        this.dc = ctx;
    }
    getForegroundColor() { return this.foregroundColor; }
    setForeGroundColor(c) { this.foregroundColor = c; }
    getBackgroundColor() { return this.backgroundColor; }
    setBackGroundColor(c) { this.backgroundColor = c; }
    getLineWidth() { return this.lineWidth; }
    setLineWidth(w) { this.lineWidth = w; }
    getLineColor() { return this.lineColor; }
    setLineColor(c) { this.lineColor = c; }
}
;
class SprotAffineTransformations {
    constructor() {
        this.rotate = () => { };
        this.scale = () => { };
        this.translate = () => { };
    }
}
class Shape {
    constructor() {
        this.foregroundColor = "#ffffff";
        this.backgroundColor = "#ffffff";
        this.lineColor = "#000000";
        this.lineWidth = 1;
        this.transformations = {
            point: defaultPoint, size: defaultSize, angle: 0, borderRadius: 0
        };
    }
    getForegroundColor() { return this.foregroundColor; }
    setForeGroundColor(c) { this.foregroundColor = c; }
    getBackgroundColor() { return this.backgroundColor; }
    setBackGroundColor(c) { this.backgroundColor = c; }
    getSize() { return this.transformations.size; }
    setSize(size) { this.transformations.size = size; }
    getPoint() { return this.transformations.point; }
    setPoint(point) { this.transformations.point = point; }
    getLineWidth() { return this.lineWidth; }
    setLineWidth(w) { this.lineWidth = w; }
    getLineColor() { return this.lineColor; }
    setLineColor(c) { this.lineColor = c; }
}
class Circle extends Shape {
    constructor() {
        super();
        this.draw = (gc) => {
            if (!gc) {
                return;
            }
            const rect = new Rect(this.getPoint(), this.getSize());
            gc.setBackGroundColor(this.backgroundColor);
            gc.setForeGroundColor(this.foregroundColor);
            gc.drawCirce(rect);
        };
        this.addRect = (rect) => {
            this.setPoint(rect.getPoint());
            this.setSize(rect.getSize());
        };
    }
}
class Rectangle extends Shape {
    constructor() {
        super();
        this.draw = (gc) => {
            const rect = new Rect(this.getPoint(), this.getSize());
            gc.setBackGroundColor(this.backgroundColor);
            gc.setForeGroundColor(this.foregroundColor);
            gc.drawRect(rect);
            this.drawControls(gc);
        };
        this.hover = (gc) => {
            this.drawControls(gc);
        };
        this.drawControls = (gc) => {
            if (!gc) {
                return;
            }
            const selfRect = new Rect(this.getPoint(), this.getSize());
            const center = selfRect.center();
            this.controls.bottomControl.draw(gc);
            this.controls.leftControl.draw(gc);
            this.controls.rightControl.draw(gc);
            this.controls.topControl.draw(gc);
        };
        this.setDimensions = () => {
            const selfRect = new Rect(this.getPoint(), this.getSize());
            const left = this.transformations.point.x;
            const right = left + this.transformations.size.w;
            const top = this.transformations.point.y;
            const bottom = top + this.transformations.size.h;
            const center = selfRect.center();
            const size = { w: 16, h: 16 };
            const tcPoint = { x: center.x - size.w / 2, y: top - size.h / 2 };
            this.controls.topControl.addRect(new Rect(tcPoint, size));
            const lcPoint = { x: left - size.w / 2, y: center.y - size.h / 2 };
            this.controls.leftControl.addRect(new Rect(lcPoint, size));
            const rcPoint = { x: right - size.w / 2, y: center.y - size.h / 2 };
            this.controls.rightControl.addRect(new Rect(rcPoint, size));
            const bcPoint = { x: center.x - size.w / 2, y: bottom - size.h / 2 };
            this.controls.bottomControl.addRect(new Rect(bcPoint, size));
        };
        this.setDimensions();
        this.controls = {
            topControl: new Circle(),
            leftControl: new Circle(),
            rightControl: new Circle(),
            bottomControl: new Circle()
        };
    }
}
const defaultRect = new Rect();
const defaultPoint = { x: -1, y: -1 };
const defaultSize = { w: -1, h: -1 };
class sprotHtmlElement extends Rect {
    constructor(globals, point = { x: 50, y: 50 }, size = { w: window.innerWidth - point.x, h: 50 }) {
        super(point, size);
        this.savePerspective = () => {
            const data = {
                name: this.name,
                self_closing: this.self_closing,
                properities: this.properities,
                data: this.data,
                breakpoints: this.breakpoints,
                children: this.children,
            };
            return JSON.stringify(data, null, 2);
        };
        this.isEmpty = () => {
            return this.getHasChildren() && this.content.length <= 0;
        };
        this.getHasChildren = () => {
            return this.children.length <= 0;
        };
        this.drawElement = (ctx) => {
            // model a box model
            if (!ctx) {
                return;
            }
            if (true) { // hover
                const padding = this.styles['padding'] ? this.styles['padding'] :
                    this.globalStyles['padding'];
                const margin = this.styles['margin'] ? this.styles['margin'] :
                    this.globalStyles['margin'];
                ctx.strokeStyle = this.stroke;
                this.rectangle.draw;
                // ctx.strokeRect(
                //     this.trasformations.rect.getX(),
                //     this.trasformations.rect.getY(),
                //     this.trasformations.rect.getWidth(),
                //     this.trasformations.rect.getHeight(),
                // );
                this.breakpoints.sm = {
                    "position": "absolute",
                    "top": this.trasformations.rect.getX() + "px",
                    "left": this.trasformations.rect.getY() + "px",
                    "width": this.trasformations.rect.getWidth() + "px",
                    "height": this.trasformations.rect.getHeight() + "px"
                };
                //ctx.roundRect(
                //    this.trasformations.rect.x - ,
                //    this.trasformations.rect.y,
                //    this.trasformations.rect.w,
                //    this.trasformations.rect.h,
                //    this.trasformations.cornerRadius
                //);
            }
        };
        this.name = "section";
        this.self_closing = false;
        this.properities = {};
        this.styles = {};
        this.globalStyles = globals;
        this.data = {};
        this.breakpoints = {};
        this.children = [];
        this.hasChildren = false;
        this.empty = true;
        this.content = "";
        const rect = new Rect(point, size);
        this.trasformations = { rect: rect, angle: 0, cornerRadius: 2 };
        this.rectangle = new Rectangle();
    }
}
class DesignBoard {
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
            var _a, _b, _c, _d;
            (_a = this.canvas) === null || _a === void 0 ? void 0 : _a.addEventListener("mousedown", (event) => {
                this.isDragging = true;
                this.startPos = this.calcUnscrolledPosition({ x: event.clientX, y: event.clientY });
                if (this.ctx) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.startPos.x, this.startPos.y);
                    this.elements.map(elem => {
                        if (elem.contains(this.startPos)) {
                            console.log(elem.savePerspective());
                        }
                    });
                }
                ;
            });
            (_b = this.canvas) === null || _b === void 0 ? void 0 : _b.addEventListener("mouseup", (event) => {
                this.isDragging = false;
                const point = this.calcUnscrolledPosition({ x: event.clientX, y: event.clientY });
                const start = { x: this.startPos.x, y: this.startPos.y };
                const size = { w: point.x - start.x, h: point.y - start.y };
                const rect = new Rect(start, size);
                this.rectangles.push(rect);
            });
            (_c = this.canvas) === null || _c === void 0 ? void 0 : _c.addEventListener("mousemove", (event) => {
                const pos = this.calcUnscrolledPosition({ x: event.clientX, y: event.clientY });
                this.refresh();
                if (this.isDragging) {
                    this.drawAllItems();
                    this.drawRectangle(pos);
                }
                else {
                    this.hoverRect(pos);
                }
                for (let i = this.elements.length - 1; i >= 0; i--) {
                    const elem = this.elements[i];
                }
            });
            (_d = this.canvas) === null || _d === void 0 ? void 0 : _d.addEventListener("resize", () => {
                console.log("hello");
            });
        };
        this.refresh = () => {
            var _a;
            (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.clearRect(0, 0, window.innerWidth, window.innerHeight);
            this.drawAllItems();
        };
        this.calcUnscrolledPosition = (point) => {
            if (!this.canvas) {
                return defaultPoint;
            }
            const x = point.x + window.scrollX || point.x + this.canvas.scrollLeft;
            const y = point.y + +window.scrollY || point.y + this.canvas.scrollTop;
            return { x, y };
        };
        this.drawUsingPenTool = (point) => {
            if (!this.ctx) {
                return;
            }
            this.ctx.lineTo(point.x, point.y);
            this.ctx.stroke();
        };
        this.drawRectangle = (point) => {
            const start = { x: this.startPos.x, y: this.startPos.y };
            const size = { w: point.x - start.x, h: point.y - start.y };
            // this.ctx?.strokeRect(start.x, start.y, size.w, size.h);
        };
        this.drawDefinedRect = (rect) => {
            // rect.draw(this.ctx);
        };
        this.addElement = (elem) => {
            this.elements.push(elem);
        };
        this.drawAllItems = () => {
            // this.rectangles.map((rect: Rect)=>{
            // this.drawDefinedRect(rect);
            // });
            this.elements.map((elem) => {
                elem.drawElement(this.ctx);
                const gc = new SprotGraphicContext(this.ctx);
                if (gc.isOk()) {
                    // const controls = new SprotRectControls(elem);
                    // elem.getControls().drawPlus(gc);
                    // controls.drawPlus(gc);
                }
            });
        };
        this.hoverRect = (mousePos) => {
            for (let i = this.elements.length - 1; i >= 0; i--) {
                const elem = this.elements[i];
                this.elements.map(r => r.stroke = "#000000");
                if (elem.contains(mousePos)) {
                    elem.stroke = "red";
                    break;
                }
            }
        };
        this.isDragging = false;
        this.startPos = { x: -1, y: -1 };
        this.rectangles = [];
        this.globalStyles = {
            "margin": 0,
            "padding": 0,
            "scroll-behavior": "smooth",
            "box-sizing": "border-box",
        };
        this.element = new sprotHtmlElement(this.globalStyles);
        this.elements = [];
        // bind mouse events
        this.bindEvents();
        // device context
        this.ctx = canvas ? canvas.getContext("2d") : null;
    }
    ;
}
if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const art = new DesignBoard(canvas);
    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        art.refresh();
    });
    const globalStyles = {
        "margin": 0,
        "padding": 0,
        "scroll-behavior": "smooth",
        "box-sizing": "border-box"
    };
    const element = new sprotHtmlElement(globalStyles);
    element.setWidth(500);
    art.addElement(element);
    art.refresh();
}
logName("Sanele Mngadi");
