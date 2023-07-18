import { logName, sprotHtmlElement } from "./utils/element.js";
// import {Rect} from "./utils/rect.js";

import {
    Size, Point, CSSProp, DrawingSettings, Orientation
    // HTMLProps, Transformations 
} from "./utils/interfaces.js";
import { Rectangle } from "./utils/shapes/shapes.js";
import { DesignBoard } from "./utils/canvas.js";
import { SprotSizerItem } from "./utils/sizers/sizeritem.js";
import { AlignItem, SprotBoxSizer } from "./utils/sizers/boxsizer.js";

logName("Sanele Mngadi");

const canvas = document.getElementById("canvas") as HTMLCanvasElement | null;

enum Direction{
    Default = 1,
    Top,
    Left,
    Right,
    Bottom
}

class SprotAffineTransformations{
    rotate = () => {}
    scale = () => {}
    translate = () => {}
}

if(canvas){
    const canvasOffsetX = canvas.offsetLeft;
    const canvasOffsetY = canvas.offsetTop;

    canvas.width = window.innerWidth - canvasOffsetX;
    canvas.height = window.innerHeight - canvasOffsetY;
    
    const art = new DesignBoard(canvas);

    window.addEventListener("resize", ()=> {
        canvas.width = window.innerWidth - canvasOffsetX;
        canvas.height = window.innerHeight - canvasOffsetY;

        art.refresh();
    });

    const globalStyles: CSSProp = {
        "margin": 0,
        "padding": 0,
        "scroll-behavior": "smooth",
        "box-sizing": "border-box"
    };

    // html element must have a parent
    const element = new sprotHtmlElement();
    element.setX(200);
    element.setY(30);
    element.setWidth(500);
    element.setHeight(60);
    element.setName("div");
    art.addElement(element);











    ///////////////////////////////
    
    const element2 = new sprotHtmlElement();
    element2.setX(200);
    element2.setY(130);
    element2.setWidth(500);
    element2.setHeight(160);
    element2.setName("input");
    art.addElement(element2);




    
    const childSizer = new SprotBoxSizer(Orientation.Horizontal);
    const elementChild1 = new sprotHtmlElement(element2);
    elementChild1.setX(200);
    elementChild1.setY(30);
    elementChild1.setWidth(500);
    elementChild1.setHeight(60);
    elementChild1.setName("div");
    element2.addChild(elementChild1);

    const elementChild2 = new sprotHtmlElement(element2);
    elementChild2.setX(200);
    elementChild2.setY(30);
    elementChild2.setWidth(500);
    elementChild2.setHeight(60);
    elementChild2.setName("div");
    element2.addChild(elementChild2);
    // art.addElement(elementChild2);

    childSizer.addElement(elementChild1);
    childSizer.addElement(elementChild2);
    element2.setSizer(childSizer);





    
    const element3 = new sprotHtmlElement();
    element3.setX(200);
    element3.setY(180);
    element3.setWidth(700);
    element3.setHeight(200);
    element3.setName("table");
    art.addElement(element3);

    const sizer = new SprotBoxSizer(Orientation.Vertical);
    sizer.addElement(element);
    sizer.addElement(element2);
    sizer.addElement(element3);
    sizer.gap(30);
    sizer.setAlignItems(AlignItem.Center);

    art.setSizer(sizer);
    // sizer.repositionChildren();

    art.refresh();
}