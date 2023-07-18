import { Rect } from "./rect.js";
export const defaultRect = new Rect();
export const defaultPoint = { x: -1, y: -1 };
export const defaultSize = { w: -1, h: -1 };
export var ActionControl;
(function (ActionControl) {
    ActionControl[ActionControl["None"] = 1] = "None";
    ActionControl[ActionControl["Left"] = 2] = "Left";
    ActionControl[ActionControl["Top"] = 3] = "Top";
    ActionControl[ActionControl["Right"] = 4] = "Right";
    ActionControl[ActionControl["Bottom"] = 5] = "Bottom";
})(ActionControl || (ActionControl = {}));
export var ElementState;
(function (ElementState) {
    ElementState[ElementState["Default"] = 1] = "Default";
    ElementState[ElementState["Hovered"] = 2] = "Hovered";
    ElementState[ElementState["Pressed"] = 3] = "Pressed";
    ElementState[ElementState["Locked"] = 4] = "Locked";
})(ElementState || (ElementState = {}));
export var Orientation;
(function (Orientation) {
    Orientation[Orientation["Horizontal"] = 0] = "Horizontal";
    Orientation[Orientation["Vertical"] = 1] = "Vertical";
})(Orientation || (Orientation = {}));
