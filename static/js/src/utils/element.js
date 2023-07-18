import { ElementState, defaultPoint, defaultSize } from "./interfaces.js";
import { Rect } from "./rect.js";
import { Rectangle } from "./shapes/shapes.js";
export function logName(name) {
    console.log(`Congradulations Mr. ${name} you can now import and export files`);
}
export class sprotHtmlElement extends Rect {
    constructor(parent = null, point = defaultPoint, size = defaultSize) {
        super(point, size);
        this.savePerspective = () => {
            const data = {
                name: this.name,
                self_closing: this.self_closing,
                properities: this.properities,
                data: this.data,
                breakpoints: this.breakpoints,
                children: this.children,
            };
            return JSON.stringify(data, null, 2);
        };
        this.isEmpty = () => {
            return this.getHasChildren() && this.content.length <= 0;
        };
        this.getHasChildren = () => {
            return this.children.length > 0;
        };
        this.drawElement = (gc) => {
            // model a box model
            if (!gc) {
                return;
            }
            if (true) { // hover
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
            if (this.children.length > 0) {
                this.children.forEach(element => {
                    element.drawElement(gc);
                });
            }
        };
        this.setName = (name) => {
            this.name = name;
        };
        this.getName = () => { return this.name; };
        this.setParent = (p) => { this.parent = p; };
        this.getParent = () => { return this.parent; };
        this.setState = (state) => {
            this.state = state;
        };
        this.getState = () => {
            return this.state;
        };
        this.setSizer = (sizer) => {
            sizer.setParentPoint(this.getPoint());
            sizer.setParentSize(this.getSize());
            sizer.setContainingElement(this);
            sizer.repositionChildren();
        };
        this.getChildren = () => {
            return this.children;
        };
        this.addChild = (child) => {
            this.children.push(child);
        };
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
        this.trasformations = { angle: 0, cornerRadius: 2 };
        this.rectangle = new Rectangle();
        this.state = ElementState.Default;
    }
}
