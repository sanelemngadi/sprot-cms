import { ActionControl, ElementState, defaultPoint, defaultSize } from "../interfaces.js";
import { Rect } from "../rect.js";
export class Shape {
    constructor() {
        this.foregroundColor = "#ffffff";
        this.backgroundColor = "#ffffff";
        this.lineColor = "#000000";
        this.lineWidth = 1;
        this.transformations = {
            point: defaultPoint, size: defaultSize, angle: 0, borderRadius: 0
        };
        this.setState = (state) => this.state = state;
        this.getState = () => { return this.state; };
        this.getBoundingBox = () => {
            this.rect.setPoint(this.getPoint());
            this.rect.setSize(this.getSize());
            return this.rect;
        };
        this.rect = new Rect(this.transformations.point, this.transformations.size);
        this.state = ElementState.Default;
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
export class Circle extends Shape {
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
        this.getRect = () => {
            return this.getBoundingBox();
        };
    }
}
export class Rectangle extends Shape {
    constructor() {
        super();
        this.draw = (gc) => {
            const rect = new Rect(this.getPoint(), this.getSize());
            gc.setBackGroundColor(this.backgroundColor);
            gc.setForeGroundColor(this.foregroundColor);
            gc.drawRect(rect);
            // this.drawControls(gc);
        };
        this.hover = (point) => {
            // if(this.controls.topControl.getRect().contains(point)){
            // this.controls.topControl.setBackGroundColor("blue");
            // }else if(this.controls.leftControl.getRect().contains(point)){
            // this.controls.leftControl.setBackGroundColor("blue");
            // }else if(this.controls.rightControl.getRect().contains(point)){
            // this.controls.rightControl.setBackGroundColor("blue");
            // }else if(this.controls.bottomControl.getRect().contains(point)){
            // this.controls.bottomControl.setBackGroundColor("blue");
            // }else{
            // this.controls.topControl.setBackGroundColor("white");
            // this.controls.leftControl.setBackGroundColor("white");
            // this.controls.bottomControl.setBackGroundColor("white");
            // this.controls.rightControl.setBackGroundColor("white");
            // }
            const element = this.findControlByPosition(point);
            if (this.setHoveredControl(element)) {
                if (element) {
                    element.setBackGroundColor("blue");
                }
                return true;
            }
            else {
                if (element) {
                    element.setBackGroundColor("white");
                    // return true;
                }
            }
            return false;
        };
        this.drawControls = (gc) => {
            if (!gc || !this.paintControls) {
                return;
            }
            this.setDimensions();
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
            const tcRect = new Rect(tcPoint, size);
            this.controls.topControl.setPoint(tcPoint);
            this.controls.topControl.setSize(size);
            const lcPoint = { x: left - size.w / 2, y: center.y - size.h / 2 };
            this.controls.leftControl.addRect(new Rect(lcPoint, size));
            const rcPoint = { x: right - size.w / 2, y: center.y - size.h / 2 };
            this.controls.rightControl.addRect(new Rect(rcPoint, size));
            const bcPoint = { x: center.x - size.w / 2, y: bottom - size.h / 2 };
            this.controls.bottomControl.addRect(new Rect(bcPoint, size));
        };
        this.controlsHitTest = (point) => {
            let actionControl = ActionControl.None;
            if (this.controls.topControl.getRect().contains(point)) {
                actionControl = ActionControl.Top;
            }
            else if (this.controls.leftControl.getRect().contains(point)) {
                actionControl = ActionControl.Left;
            }
            else if (this.controls.rightControl.getRect().contains(point)) {
                actionControl = ActionControl.Right;
            }
            else if (this.controls.bottomControl.getRect().contains(point)) {
                actionControl = ActionControl.Bottom;
            }
            else {
                actionControl = ActionControl.None;
            }
            return actionControl;
        };
        this.getArrayControls = () => {
            const controls = [];
            controls[0] = this.controls.bottomControl;
            controls[1] = this.controls.leftControl;
            controls[2] = this.controls.rightControl;
            controls[3] = this.controls.topControl;
            return controls;
        };
        this.findControlByPosition = (point) => {
            for (let i = 0; i < this.getArrayControls().length; i++) {
                const control = this.getArrayControls()[i];
                if (control.getRect().contains(point)) {
                    return control;
                }
            }
            return null;
        };
        this.setHoveredControl = (hoveredControl) => {
            let formerHovered = null;
            for (let i = 0; i < this.getArrayControls().length; i++) {
                const control = this.getArrayControls()[i];
                if (!control) {
                    continue;
                }
                if (control.getState() === ElementState.Hovered) {
                    formerHovered = control;
                }
                control.setState(ElementState.Default);
            }
            if (hoveredControl) {
                hoveredControl.setState(ElementState.Hovered);
            }
            if (hoveredControl !== formerHovered) {
                return true;
            }
            else {
                return false;
            }
        };
        this.showControls = (show) => {
            this.paintControls = show;
        };
        this.controls = {
            "topControl": new Circle(),
            "leftControl": new Circle(),
            "rightControl": new Circle(),
            "bottomControl": new Circle()
        };
        this.setDimensions();
        this.paintControls = false;
    }
}
