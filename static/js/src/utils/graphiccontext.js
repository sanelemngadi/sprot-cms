import { sprotHtmlElement } from "./element.js";
export class SprotGraphicContext {
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
            const heading = new sprotHtmlElement(null, pos);
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
            // this.dc.strokeStyle = this.lineColor;
            // this.dc.fillStyle = this.backgroundColor;
            this.dc.beginPath();
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
    setBackGroundColor(c) {
        this.backgroundColor = c;
        if (!this.dc) {
            return;
        }
        this.dc.fillStyle = c;
    }
    getLineWidth() { return this.lineWidth; }
    setLineWidth(w) {
        this.lineWidth = w;
        if (!this.dc) {
            return;
        }
        this.dc.lineWidth = w;
    }
    getLineColor() { return this.lineColor; }
    setLineColor(c) {
        this.lineColor = c;
        if (!this.dc) {
            return;
        }
        this.dc.strokeStyle = c;
    }
}
;
