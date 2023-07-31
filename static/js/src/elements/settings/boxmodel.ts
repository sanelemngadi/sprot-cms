import { SprotGraphicsContext } from "../../context/graphics.js";
import { SprotBrush, SprotPen } from "../../context/tools.js";
import { SPROTPoint, SPROTRect } from "../../utils/utils.js";
import { SprotHtmlBaseElement } from "../base.js";
import { SprotFourSides } from "../styles/values.js";


interface ModelRect{
    Rect: SPROTRect;
    Pen: SprotPen;
    Brush: SprotBrush;
    Name: string
}

//this box models css box model and will be show on inspection too
export class SprotBoxModel{
    private margin: SprotFourSides;
    private border: SprotFourSides;
    private padding: SprotFourSides;
    private boundingBox:SPROTRect; // actual size of an element

    constructor(private element: SprotHtmlBaseElement){
        this.boundingBox = SPROTRect.create(element.getPosition(), element.getSize());
        this.element = element;

        this.margin = new SprotFourSides(0);
        this.border = new SprotFourSides(0);
        this.padding = new SprotFourSides(0);
    }

    Margin(b: SprotFourSides){
        this.margin = b;
        return this;
    }

    Border(b: SprotFourSides){
        this.border = b;
        return this;
    }

    Padding(b: SprotFourSides){
        this.padding = b;
        return this;
    }

    setBoundingBox(r: SPROTRect){
        this.boundingBox = r;
    }

    getMarginRect():SPROTRect {
        return this.boundingBox;
    }

    getPaddingRect(){
        return this.boundingBox.deflate(this.padding);
    }
}

export class SprotConstructBoxModel{
    private boxModel: SprotBoxModel;
    private canvasRect: SPROTRect;
    private rectangles: ModelRect[];

    constructor(private element: SprotHtmlBaseElement){
        this.boxModel = element.getBoxModel();
        this.canvasRect = SPROTRect.create(element.getPosition(), element.getSize());
        this.rectangles = [];
        this.rectangles.push({
            Rect: this.boxModel.getMarginRect(), 
            Brush: new SprotBrush("white"),
            Pen: new SprotPen("red"),
            Name: "Margin"
        });

        this.rectangles.push({
            Rect: this.boxModel.getPaddingRect(), 
            Brush: new SprotBrush("white"),
            Pen: new SprotPen("red"),
            Name: "Margin"
        });
    }

    drawModel(gc: SprotGraphicsContext){
        const ratio = this.getRatio();
        const marginRect = this.boxModel.getMarginRect().multiplyByVector(ratio);
        const paddingRect = this.boxModel.getPaddingRect().multiplyByVector(ratio);

        // gc.drawRect(marginRect);
        // gc.drawRect(paddingRect);
        // gc.drawRect(this.element.getRect().inflate(0));
    }

    // this ratio will help us to draw boxmodel at any rect
    getRatio(): number{
        const desiredWidth = this.canvasRect.getWidth();
        const actualWidth = this.boxModel.getMarginRect().getWidth();
        if(actualWidth === 0){
            return 0; // avoid division by zero
        }
        return desiredWidth/actualWidth;
    }

    setCanvasRect(r: SPROTRect){this.canvasRect = r;}

    hover(point: SPROTPoint){
        for(let rect of this.rectangles){
            rect.Brush.setColor("white");
            rect.Pen.setColor("red");

            if(rect.Rect.containPoint(point)){
                rect.Brush.setColor("blue");
                rect.Pen.setColor("yellow");
            }
        }
    }
}