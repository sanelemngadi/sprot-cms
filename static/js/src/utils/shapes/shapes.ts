import { SprotGraphicContext } from "../graphiccontext.js";
import { ActionControl, ElementState, Point, Size, Transformations, defaultPoint, defaultSize } from "../interfaces.js";
import { Rect } from "../rect.js";

export class Shape{ // base class for all shape objects
    protected foregroundColor: string = "#ffffff"; 
    protected backgroundColor: string = "#ffffff";
    protected lineColor: string = "#000000";
    protected lineWidth: number = 1;
    protected state: ElementState;
    protected transformations: Transformations = {
        point: defaultPoint, size: defaultSize, angle: 0, borderRadius: 0
    }
    protected rect: Rect;

    constructor(){
        this.rect = new Rect(this.transformations.point, 
            this.transformations.size);

        this.state = ElementState.Default;
    }

    getForegroundColor(): string {return this.foregroundColor;}
    setForeGroundColor(c: string) {this.foregroundColor = c;}

    getBackgroundColor(): string {return this.backgroundColor;}
    setBackGroundColor(c: string) {this.backgroundColor = c;}

    getSize(): Size {return this.transformations.size;}
    setSize(size: Size) {this.transformations.size = size;}

    getPoint(): Point {return this.transformations.point;}
    setPoint(point: Point) {this.transformations.point = point;}

    getLineWidth(): number {return this.lineWidth;}
    setLineWidth(w: number) {this.lineWidth = w;}

    getLineColor(): string {return this.lineColor;}
    setLineColor(c: string) {this.lineColor = c;}

    setState = (state: ElementState) => this.state = state;
    getState = ():ElementState => {return this.state;}

    getBoundingBox = (): Rect => {
        this.rect.setPoint(this.getPoint());
        this.rect.setSize(this.getSize());

        return this.rect;
    }
}

export class Circle extends Shape{
    constructor(){
        super();
    }

    draw = (gc: SprotGraphicContext): void => {
        if(!gc){
            return;
        }
        const rect = new Rect(this.getPoint(), this.getSize());
        gc.setBackGroundColor(this.backgroundColor);
        gc.setForeGroundColor(this.foregroundColor);
        gc.drawCirce(rect);
    }

    addRect = (rect: Rect): void => {
        this.setPoint(rect.getPoint());
        this.setSize(rect.getSize());
    }

    getRect =(): Rect => {
        return this.getBoundingBox();
    }
}

export class Rectangle extends Shape{
    private controls: {
        topControl: Circle,
        leftControl: Circle,
        bottomControl: Circle,
        rightControl: Circle
    }
    private paintControls: boolean;

    constructor(){
        super();
        
        this.controls = {
            "topControl": new Circle(),
            "leftControl": new Circle(),
            "rightControl": new Circle(),
            "bottomControl": new Circle()
        }
        
        this.setDimensions();
        this.paintControls = false;
    }

    draw = (gc: SprotGraphicContext): void => {
        const rect = new Rect(this.getPoint(), this.getSize());
        gc.setBackGroundColor(this.backgroundColor);
        gc.setForeGroundColor(this.foregroundColor);
        gc.drawRect(rect);
        // this.drawControls(gc);
    }

    hover = (point: Point): boolean => {
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
        if(this.setHoveredControl(element)){
            if(element){
                element.setBackGroundColor("blue");
            }
            return true;
        }else{
            if(element){
                element.setBackGroundColor("white");
                // return true;
            }
        }

        return false;
    }
    
    drawControls = (gc: SprotGraphicContext | null): void => {
        if(!gc || !this.paintControls){
            return;
        }
        this.setDimensions();
        const selfRect = new Rect(this.getPoint(), this.getSize());
        const center: Point = selfRect.center();

        this.controls.bottomControl.draw(gc);
        this.controls.leftControl.draw(gc);
        this.controls.rightControl.draw(gc);
        this.controls.topControl.draw(gc);
    }

    setDimensions = (): void => {
        const selfRect = new Rect(this.getPoint(), this.getSize());
        const left = this.transformations.point.x;
        const right = left + this.transformations.size.w;
        const top = this.transformations.point.y;
        const bottom = top + this.transformations.size.h;

        const center = selfRect.center();
        const size: Size = {w: 16, h: 16};

        const tcPoint: Point = {x: center.x - size.w/2, y: top - size.h/2};
        const tcRect: Rect = new Rect(tcPoint, size);
        this.controls.topControl.setPoint(tcPoint);
        this.controls.topControl.setSize(size);

        const lcPoint: Point = {x: left - size.w/2 , y: center.y - size.h/2};
        this.controls.leftControl.addRect(new Rect(lcPoint, size));

        const rcPoint: Point = {x: right - size.w/2, y: center.y - size.h/2};
        this.controls.rightControl.addRect(new Rect(rcPoint, size));

        const bcPoint: Point = {x: center.x - size.w/2, y: bottom - size.h/2};
        this.controls.bottomControl.addRect(new Rect(bcPoint, size));        
    }

    controlsHitTest = (point: Point): ActionControl => {
        let actionControl: ActionControl = ActionControl.None;

        if(this.controls.topControl.getRect().contains(point)){
            actionControl = ActionControl.Top;
        }else if(this.controls.leftControl.getRect().contains(point)){
            actionControl = ActionControl.Left;
        }else if(this.controls.rightControl.getRect().contains(point)){
            actionControl = ActionControl.Right;
        }else if(this.controls.bottomControl.getRect().contains(point)){
            actionControl = ActionControl.Bottom;
        }else{
            actionControl = ActionControl.None;
        }
        return actionControl;
    }

    getArrayControls = (): Circle[] => {
        const controls: Circle[] = [];
        controls[0] = this.controls.bottomControl;
        controls[1] = this.controls.leftControl;
        controls[2] = this.controls.rightControl;
        controls[3] = this.controls.topControl;
        return controls;
    }

    findControlByPosition = (point: Point): Circle | null => {
        for(let i = 0; i < this.getArrayControls().length; i++){
            const control: Circle = this.getArrayControls()[i];
            if(control.getRect().contains(point)){
                return control;
            }
        }
        return null;
    }

    setHoveredControl = (hoveredControl: Circle | null): boolean => {
        let formerHovered: Circle | null = null;        

        for(let i = 0; i < this.getArrayControls().length; i++){
            const control:Circle = this.getArrayControls()[i];
            if(!control){
                continue;
            }

            if(control.getState() === ElementState.Hovered){
                formerHovered = control;
            }

            control.setState(ElementState.Default);
        }

        if(hoveredControl){
            hoveredControl.setState(ElementState.Hovered);
        }

        if(hoveredControl !== formerHovered){
            return true;
        }else{
            return false;
        }
    }

    showControls = (show: boolean):void => {
        this.paintControls = show;
    }
}