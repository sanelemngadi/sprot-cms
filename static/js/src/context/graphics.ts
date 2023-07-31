import { SPROTRect, SprotCornerRadius } from "../utils/utils.js";
import { SprotBrush, SprotPen } from "./tools.js";

import SPROT from "../utils/defaults.js"

export class SprotGraphicsContext{
    private brush: SprotBrush;
    private pen: SprotPen;
    private foregroundColor:string;

    constructor(private ctx: CanvasRenderingContext2D){
        this.ctx = ctx;
        this.brush = SPROT.DEFAULT_BRUSH;
        this.pen = SPROT.DEFAULT_PEN;
        this.foregroundColor = "black";

        this.ctx.fillStyle = this.brush.getColor();
        this.ctx.strokeStyle = this.pen.getColor();
        this.ctx.lineWidth = this.pen.getWidth();
    }

    static create = (ctx: CanvasRenderingContext2D): SprotGraphicsContext => {
        return new SprotGraphicsContext(ctx);
    }

    // graphics settings
    setPen(pen: SprotPen){
        this.pen = pen;
        this.ctx.lineWidth = pen.getWidth();
        this.ctx.strokeStyle = pen.getColor();
    }

    setBrush(brush: SprotBrush){
        this.brush = brush;
        this.ctx.fillStyle = brush.getColor();
    }

    drawRect = (rect: SPROTRect) => {
        this.drawRoundedRect(rect, 0);
    }

    drawBorderRadiusRect = (rect: SPROTRect, br: SprotCornerRadius) => {
            const dc = this.ctx;
            const {x, y, w, h} = {x:rect.getX(), y:rect.getY(), 
                w:rect.getWidth(), h:rect.getHeight()};
        this.ctx.beginPath();
        this.ctx.moveTo(x + br.getTL(), y);
        this.ctx.arcTo(x + w, y, x + w, y + h, br.getTR());
        this.ctx.arcTo(x + w, y + h, x, y + h,br.getBR());
        this.ctx.arcTo(x, y + h, x, y, br.getBL());
        this.ctx.arcTo(x, y, x + w, y, br.getTL());
        this.ctx.closePath();
        this.ctx.stroke();
    }

    drawRoundedRect = (rect:SPROTRect, radius: number) =>{
        const br = new SprotCornerRadius(radius, radius, radius, radius);
        this.drawBorderRadiusRect(rect, br);
    }
}
