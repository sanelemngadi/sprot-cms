import { SprotGraphicContext } from "./graphiccontext.js";
import { BreakPoints, CSSProp, ElementState, HTMLDatasetProp, HTMLProps, Point, Size, defaultPoint, defaultRect, defaultSize } from "./interfaces.js";
import { Rect } from "./rect.js";
import { Rectangle } from "./shapes/shapes.js";
import { SprotBoxSizer } from "./sizers/boxsizer.js";

export function logName (name: string): void {
    console.log(`Congradulations Mr. ${name} you can now import and export files`);
    
}

export class sprotHtmlElement extends Rect{
    public name: string;
    public self_closing: boolean;
    public properities: HTMLProps;
    public styles: CSSProp;
    public globalStyles: CSSProp;
    public data: HTMLDatasetProp;
    public breakpoints: BreakPoints;
    public children: sprotHtmlElement[];
    public hasChildren: boolean;
    public empty: boolean;
    public content: string;
    public rectangle: Rectangle;
    public trasformations: {
        angle: number,
        cornerRadius: number
    }

    // it's only the top most html element with no child which is html
    private parent: sprotHtmlElement | null;
    private state: ElementState;

    constructor(parent:sprotHtmlElement | null = null, point: Point = defaultPoint, 
        size: Size = defaultSize)
    {
        super(point, size);
        this.name = "section";
        this.self_closing = false;
        this.properities = {};
        this.styles = {};
        this.globalStyles = {};
        this.data = {};
        this.breakpoints = {};
        this.children = [];
        this.hasChildren = false;
        this.empty = true;
        this.content = "";
        this.parent = parent;
        // const rect: Rect = new Rect(point, size);
        this.trasformations = {angle: 0, cornerRadius: 2};
        this.rectangle = new Rectangle();
        this.state = ElementState.Default;
    }

    savePerspective = (): string => {
        const data = {
            name: this.name,
            self_closing: this.self_closing,
            properities: this.properities,
            data: this.data,
            breakpoints: this.breakpoints,
            children: this.children,
        }
        return JSON.stringify(data, null, 2);
    }
    isEmpty = (): boolean => {
        return  this.getHasChildren() && this.content.length <= 0;
    }
    
    getHasChildren = ():boolean => {
        return this.children.length > 0;
    }

    drawElement = (gc: SprotGraphicContext | null): void => {
        // model a box model
        if(!gc){
            return;
        }

        if(true){ // hover
            this.rectangle.setPoint(this.getPoint());
            this.rectangle.setSize(this.getSize());
            this.rectangle.draw(gc);
            this.rectangle.drawControls(gc);

            // this.breakpoints.sm = {
            //     "position": "absolute",
            //     "top": this.getX() + "px",
            //     "left": this.getY() + "px",
            //     "width": this.getWidth() + "px",
            //     "height": this.getHeight() + "px"
            // };
        }

        if(this.children.length > 0){
            this.children.forEach(element=> {
                element.drawElement(gc);
            })
        }
    }

    setName = (name: string): void => {
        this.name = name;
    }
    getName = (): string => {return this.name;}

    setParent = (p: sprotHtmlElement | null): void => {this.parent = p;}
    getParent = (): sprotHtmlElement | null => {return this.parent;}

    setState = (state: ElementState): void => {
        this.state = state;
    }

    getState = (): ElementState => {
        return this.state;
    }

    setSizer = (sizer: SprotBoxSizer): void => {
        sizer.setParentPoint(this.getPoint());
        sizer.setParentSize(this.getSize());
        sizer.setContainingElement(this);
        sizer.repositionChildren();
    }

    getChildren = (): sprotHtmlElement[] => {
        return this.children;
    }

    addChild = (child: sprotHtmlElement): void => {
        this.children.push(child);
    }
}