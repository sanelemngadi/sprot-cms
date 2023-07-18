import { sprotHtmlElement } from "./element.js";
import { Point } from "./interfaces.js";
import {  Rect } from "./rect.js";


export class SprotGraphicContext{
    protected foregroundColor: string = "#ffffff"; 
    protected backgroundColor: string = "#ffffff";
    protected lineColor: string = "#000000";
    protected lineWidth: number = 1;

    dc: CanvasRenderingContext2D | null;
    constructor(ctx: CanvasRenderingContext2D | null){
        this.dc = ctx;
    }

    isOk = ():boolean => {
        return this.dc !== null;
    }

    // draw rectangle
    drawRect = (rect: Rect): void => {
        if(!this.dc){
            return;
        }
        this.dc.strokeRect(rect.getX(), rect.getY(), rect.getWidth(), rect.getHeight());
        this.dc.fillRect(rect.getX(), rect.getY(), rect.getWidth(), rect.getHeight());
    }
    drawText = (text: string, pos: Point, maxWidth?: number): void => {
        if(!this.dc){
            return;
        }
        this.dc.fillText(text, pos.x, pos.y, maxWidth);

        const heading = new sprotHtmlElement(null, pos);
        heading.name = "p";
        heading.content = text;
        heading.breakpoints.sm = {
            // "max-width": maxWidth + "px"
        }
    }
    drawCirce = (rect: Rect): void => {
        if(!this.dc){
            return;
        }

        const center = rect.center();
        const radius = rect.getWidth() / 2;

        // settings
        // this.dc.strokeStyle = this.lineColor;
        // this.dc.fillStyle = this.backgroundColor;

        this.dc.beginPath();
        this.dc.arc(center.x, center.y, Math.abs(radius), 0, 2 * Math.PI);
        this.dc.closePath();

        this.dc.fill();
        this.dc.stroke();
    }

    getForegroundColor(): string {return this.foregroundColor;}
    setForeGroundColor(c: string) {this.foregroundColor = c;}

    getBackgroundColor(): string {return this.backgroundColor;}
    setBackGroundColor(c: string) {
        this.backgroundColor = c;
        if(!this.dc){
            return;
        }
        this.dc.fillStyle = c;
    }

    getLineWidth(): number {return this.lineWidth;}
    setLineWidth(w: number) {
        this.lineWidth = w;
        if(!this.dc){
            return;
        }
        this.dc.lineWidth = w;
    }

    getLineColor(): string {return this.lineColor;}
    setLineColor(c: string) {
        this.lineColor = c;
        if(!this.dc){
            return;
        }
        this.dc.strokeStyle = c;
    }
};
