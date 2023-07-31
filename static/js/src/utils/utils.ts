import { SprotFourSides } from "../elements/styles/values.js";
import { SprotOrientation } from "./interfaces.js";
import { SPROTMax } from "./standard.js";

export class SPROTSize{
    private width: number;
    private height: number;
    constructor(width: number = 0, height: number = 0){
        this.height = height;
        this.width = width;
    }

    setSize = (size: SPROTSize):void => {
        this.height = size.height;
        this.width = size.width
    }

    setWidth(w: number){this.width = w;};
    getWidth(): number{ return this.width;};
    
    setHeight(h: number){this.height = h;};
    getHeight(): number{ return this.height;};

    // the following methods will help us to chain the size like
    // instance.Height(20).Width(50)
    Width(w: number):SPROTSize{this.width = w; return this;}
    Height(h: number):SPROTSize{this.height = h; return this;}
}

export class SPROTPoint{
    private x: number;
    private y: number;
    constructor(x: number = 0, y: number = 0){
        this.y = y;
        this.x = x;
    }

    setPoint = (point: SPROTPoint):void => {
        this.x = point.x
        this.y = point.y;
    }

    setX(x: number){this.x = x;};
    getX(): number{ return this.x;};
    
    setY(y: number){this.y = y;};
    getY(): number{ return this.y;};

    // the following methods will help us to chain the size like
    // instance.YY(20).XX(50)
    XX(x: number):SPROTPoint{this.x = x; return this;}
    YY(y: number):SPROTPoint{this.y = y; return this;}
}

export class SPROTRect{
    constructor(private x: number, private y: number, 
        private w: number, private h: number){
            this.x = x;
            this.y = y; 
            this.w = w;
            this.h = h;
    }

    static create(point: SPROTPoint, size: SPROTSize){
        return new SPROTRect(point.getX(), point.getY(), 
            size.getWidth(), size.getHeight());
    }

    containPoint = (pt: SPROTPoint): boolean => {
        const insideX = pt.getX() > this.getLeft() && pt.getX() < this.getRight();
        const insideY = pt.getY() > this.getTop() && pt.getY() < this.getBottom();
        return insideX && insideY;
    }
    
    multiplyByVector(c: number):SPROTRect{
        return SPROTRect.create(this.getPosition(), 
            new SPROTSize(this.getWidth()*c, this.getHeight()*c));
    }
    deflate(s: SprotFourSides): SPROTRect;
    deflate(n: number): SPROTRect;
    deflate(arg: unknown){
        // let rect = SPROT.NULL_RECT;
        let deflatedX = this.getX(); // shift to the right
        let deflatedW = this.getWidth();
        let deflatedY = this.getY();
        let deflatedH = this.getHeight();

        if(typeof arg === "object"){
            const top = (arg as SprotFourSides).bottom;
            const right = (arg as SprotFourSides).right;
            const bottom = (arg as SprotFourSides).bottom;
            const left = (arg as SprotFourSides).left;

            deflatedX += (+ left); // shift to the right
            deflatedW += (- right - left);
            deflatedY += (+ top);
            deflatedH += (- bottom - top);
        }else{
            const p = arg as number;
            deflatedX += (+ p); // shift to the right
            deflatedW += (- p*2);
            deflatedY += (+ p);
            deflatedH += (- p*2);
        }
        const rect = new SPROTRect(deflatedX, deflatedY, deflatedW, deflatedH);
        return rect;
    }


    deflateHorizontal(n: number){
        const deflatedX = this.getX() + n; // shift to the right
        const deflatedW = this.getWidth() - n*2;
        const deflatedY = this.getY();
        const deflatedH = this.getHeight();
        const rect = new SPROTRect(deflatedX, deflatedY, deflatedW, deflatedH);
        return rect;
    }

    deflateVertical(n: number):SPROTRect{
        const deflatedX = this.getX(); // shift to the right
        const deflatedW = this.getWidth();
        const deflatedY = this.getY() + n;
        const deflatedH = this.getHeight() - n*2;
        const rect = new SPROTRect(deflatedX, deflatedY, deflatedW, deflatedH);
        return rect;
    }

    inflate(s: SprotFourSides): SPROTRect;
    inflate(n: number): SPROTRect;
    inflate(arg: unknown){
        // let rect = SPROT.NULL_RECT;
        let inflatedX = this.getX(); // shift to the right
        let inflatedW = this.getWidth();
        let inflatedY = this.getY();
        let inflatedH = this.getHeight();

        if(typeof arg === "object"){
            const top = (arg as SprotFourSides).bottom;
            const right = (arg as SprotFourSides).right;
            const bottom = (arg as SprotFourSides).bottom;
            const left = (arg as SprotFourSides).left;

            inflatedX += (- left); // shift to the right
            inflatedW += (+ right + left);
            inflatedY += (- top);
            inflatedH += (+ bottom + top);
        }else{
            const p = arg as number;
            inflatedX += (- p); // shift to the right
            inflatedW += (+ p*2);
            inflatedY += (- p);
            inflatedH += (+ p*2);
        }
        const rect = new SPROTRect(inflatedX, inflatedY, inflatedW, inflatedH);
        return rect;
    }

    fullyContainRect() {}

    getX(){return this.x;};
    setX(x: number){this.x = x;}
    
    getY(){return this.y;};
    setY(y: number){this.y = y;}
    
    getWidth(){return this.w;};
    setWidth(w: number){this.w = w;}
    
    getHeight(){return this.h;};
    setHeight(h: number){this.h = h;}

    getPosition(){return new SPROTPoint(this.x, this.y);}
    setPosition(pt: SPROTPoint){this.x = pt.getX(); this.y = pt.getY();}

    getSize(){return new SPROTSize(this.w, this.h);}
    setSize(sz: SPROTSize){this.w = sz.getWidth(); this.h = sz.getHeight();}

    getTop(): number{return this.y;}
    setTop(n: number){this.y = n;}

    getBottom():number {return this.getTop() + this.h;}
    setBottom(n: number){this.setSize(new SPROTSize(this.getSize().getWidth(), SPROTMax(0, n)));}

    getLeft():number{return this.x;}
    setLeft(n: number){this.x = n;}

    getRight():number{return this.getLeft() + this.w;}
    setRight(n: number){this.setSize(new SPROTSize(
        SPROTMax(10, n), this.getSize().getHeight()
    ))}

    getLeftTop():SPROTPoint{return new SPROTPoint(this.getLeft(), this.getTop());}
    getRightTop():SPROTPoint{return new SPROTPoint(this.getRight(), this.getTop());}

    getLeftBottom():SPROTPoint{return new SPROTPoint(this.getLeft(), this.getBottom());}
    getRightBottom():SPROTPoint{return new SPROTPoint(this.getRight(), this.getBottom());}
    
}

export class SprotCornerRadius{
    constructor(private topLeft: number = 0, private topRight: number = 0, 
        private bottomRight: number = 0, private bottomLeft: number = 0){
            this.topLeft = topLeft;
            this.topRight = topRight;
            this.bottomRight = bottomRight;
            this.bottomLeft = bottomLeft;
        }
    getTL(){return this.topLeft;}
    getTR(){return this.topRight;}
    getBL(){return this.bottomLeft;}
    getBR(){return this.bottomRight;}

    TL(n: number): SprotCornerRadius{this.topLeft = n; return this;}
    TR(n: number): SprotCornerRadius{this.topRight = n; return this;}
    BL(n: number): SprotCornerRadius{this.bottomLeft = n; return this;}
    BR(n: number): SprotCornerRadius{this.bottomRight = n; return this;}
}

// macros
export const SPROTUNUSEDVAR = (variable: any): any => {
    return variable;
} 

export class SprotTransformationInDirection{
    constructor(){}

    static getSizeMajorDir(dir: SprotOrientation, size: SPROTSize): number{
        if(dir === SprotOrientation.HORIZONTAL){
            return size.getWidth();
        }
        return size.getHeight();
    }

    static getSizeMinorDir(dir: SprotOrientation, size: SPROTSize): number{
        if(dir === SprotOrientation.HORIZONTAL){
            return size.getHeight();
        }
        return size.getWidth();
    }

    static getPosMajorDir(dir: SprotOrientation, pt: SPROTPoint): number{
        if(dir === SprotOrientation.HORIZONTAL){
            return pt.getX();
        }
        return pt.getY();
    }

    static getPosMinorDir(dir: SprotOrientation, pt: SPROTPoint): number{
        if(dir === SprotOrientation.HORIZONTAL){
            return pt.getY();
        }
        return pt.getX();
    }

    static getSizeGivenDir(dir: SprotOrientation, major: number, minor: number): SPROTSize{
        if(dir === SprotOrientation.HORIZONTAL){
            return new SPROTSize(major, minor);
        }
        return new SPROTSize(minor, major);
    }

    static setPointGivenDir(dir: SprotOrientation, major: number, minor: number): SPROTPoint{
        if(dir === SprotOrientation.HORIZONTAL){
            return new SPROTPoint(major, minor);
        }
        return new SPROTPoint(minor, major);
    }
}
