import { SprotDesignBoard } from "../canvas/canvas.js";
import { SprotGraphicsContext } from "../context/graphics.js";
import { SprotMouseEvent } from "../events/event.js";
import SPROT from "../utils/defaults.js";
import { SPROTMax, SPROTMin } from "../utils/standard.js";
import { SPROTPoint, SPROTRect, SPROTSize } from "../utils/utils.js";
import { SprotBlockElement, SprotHtmlBaseElement } from "./base.js";

export class SprotContainerElement extends SprotBlockElement{
    private startPos: SPROTPoint;
    private dragging: boolean;
    constructor(
        protected parent: SprotHtmlBaseElement | SprotDesignBoard, 
        protected canvas: SprotDesignBoard,
        protected position: SPROTPoint = SPROT.NULL_POINT,
        protected size: SPROTSize = SPROT.NULL_SIZE
    ){
        super(parent, canvas, "div", position, size);
        this.startPos = SPROT.NULL_POINT;
        this.dragging= false;
    }

    getRect(){return SPROTRect.create(this.getPosition(), this.getSize());}

    onMouseLeftDown(event: SprotMouseEvent): void {
        this.dragging = true;
        this.startPos = event.getPosition();
        // console.log("left down");
        
    }

    onMouseLeftUp(event: SprotMouseEvent): void {
        this.dragging = false;
        // console.log("left up");
        
    }

    onMouseMoveInsideElement(event: SprotMouseEvent): void {
        const pt = event.getPosition();
        const draggingVector = new SPROTPoint(
            pt.getX() - this.startPos.getX(), pt.getY() - this.startPos.getY()
        );

        console.log("move: ", pt.getX());
        
        if(this.dragging){
            //console.log("drag vector: ", draggingVector.getX());
            const pFrom = SPROTMax(this.getSize().getWidth() - draggingVector.getX(), 20);
            const size = SPROTMin(pFrom, this.getParent().getSize().getWidth());
            
            //this.setSize(new SPROTSize(
            //    size, this.getSize().getHeight()
            //))

            // this.setPosition(new SPROTPoint(
                // draggingVector.getX() - this.getPosition().getX(),
                // this.getRelativePosition().getY()
            // ))

            const rect = this.getRect();
            rect.setLeft(pt.getX() + 30);
            this.setSize(rect.getSize());

            // when it comes to sizing element you have to be outside the element
            // and handle outside events not internal

            console.log(" size: ",(rect.getSize().getWidth()));
            

            this.Refresh();
        }

       // console.log(this.dragging);
        
    }

    onMouseEnterElement(event: SprotMouseEvent): void {
        // console.log("Mouse entered again");
        // super.onMouseEnterElement(event);

        

    }

    onMouseLeaveElement(event: SprotMouseEvent): void {
        // super.onMouseLeaveElement(event);
        console.log("opps left");
        if(this.dragging){
            // this.dragging = false;
        }

    }
    
}