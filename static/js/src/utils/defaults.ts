import { SprotBrush, SprotPen } from "../context/tools.js";
import { SprotBlockElement } from "../elements/base.js";
import { SprotFourSides } from "../elements/styles/values.js";
import { SPROTPoint, SPROTRect, SPROTSize } from "./utils.js";

const  SPROT = {
    NULL_SIZE: new SPROTSize(-1, -1),
    NULL_POINT: new SPROTPoint(-1, -1),
    NULL_RECT: new SPROTRect(-1, -1, -1, -1),
    DEFAULT_BRUSH: new SprotBrush("black"),
    DEFAULT_PEN: new SprotPen("black"),
    MARGIN: new SprotFourSides(0),
    PADDING: new SprotFourSides(0),
    BORDER_RADIUS: new SprotFourSides(0),
}

Object.defineProperty(SPROT, "NULL_SIZE", {
    get: function () {
        return new SPROTSize(-1, -1);
    },
    enumerable: true,
    configurable: true,
});

Object.defineProperty(SPROT, "NULL_POINT", {
    get: function () {
        return new SPROTPoint(-1, -1);
    },
    enumerable: true,
    configurable: true,
});

Object.defineProperty(SPROT, "NULL_RECT", {
    get: function () {
        return new SPROTRect(-1, -1, -1, -1);
    },
    enumerable: true,
    configurable: true,
});

Object.defineProperty(SPROT, "DEFAULT_BRUSH", {
    get: function () {
        return new SprotBrush("black");
    },
    enumerable: true,
    configurable: true,
});

Object.defineProperty(SPROT, "DEFAULT_PEN", {
    get: function () {
        return new SprotPen("black");
    },
    enumerable: true,
    configurable: true,
});

Object.defineProperty(SPROT, "MARGIN", {
    get: function () {
        return new SprotFourSides(0);
    },
    enumerable: true,
    configurable: true,
});

Object.defineProperty(SPROT, "PADDING", {
    get: function () {
        return new SprotFourSides(0);
    },
    enumerable: true,
    configurable: true,
});

Object.defineProperty(SPROT, "BORDER_RADIUS", {
    get: function () {
        return new SprotFourSides(0);
    },
    enumerable: true,
    configurable: true,
});

export default SPROT;
