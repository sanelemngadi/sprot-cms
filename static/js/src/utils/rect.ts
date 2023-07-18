import { Size, Point} from "./interfaces.js";

export class Rect {
    private x: number;
    private y: number;
    private w: number;
    private h: number;

    constructor(point: Point = {x: -1, y: -1}, 
        size: Size = {w: -1, h: -1}){
        this.x = point.x;
        this.y = point.y;
        this.w = size.w;
        this.h = size.h;
    }

    center = (): Point => {
        const left = this.x;
        const top = this.y;

        const cx = left + (this.w / 2);
        const cy = top + (this.h/2);

        return {x: cx, y: cy};
    }

    contains = (point: Point): boolean => {
        const left = this.x;
        const right = left + this.w;
        const top = this.y;
        const bottom = top + this.h;
        const containX: boolean = left <= point.x && right >= point.x;
        const containY: boolean = top <= point.y && bottom >= point.y;

        if(containX && containY){
            return true;
        }
        return false;
    }

    // setters and get getter
    setPoint(p: Point): void{this.x = p.x; this.y = p.y;}
    getPoint(): Point{return {x: this.x, y: this.y};}

    setSize(s: Size): void{this.w = s.w; this.h = s.h;}
    getSize():Size{return {w: this.w, h: this.h};}

    setX(x: number): void{this.x = x;}
    getX():number {return this.x;}
    
    setY(y: number): void{this.y = y;}
    getY():number {return this.y;}

    setWidth(w: number): void{this.w = w;}
    getWidth():number {return this.w;}

    setHeight(h: number): void{this.h = h;}
    getHeight():number {return this.h;}

    getBottom = (): number => {return this.getY() + this.getHeight();}
    getTop = (): number => {return this.getY(); }
    getLeft = (): number => {return this.getX(); }
    getRight = (): number => {return this.getX() + this.getWidth();}
    getTopLeft = (): Point => {return this.getPoint();}
    getTopRight = (): Point => {return {x: this.getRight(), y: this.getTop()}};
    getBottomLeft = (): Point => {return {x: this.getLeft(), y: this.getBottom()}};
    getBottomRight = (): Point => {return {x: this.getRight(), y: this.getBottom()}};

}
