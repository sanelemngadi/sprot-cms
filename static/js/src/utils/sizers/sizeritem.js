import { defaultRect } from "../interfaces.js";
export class SprotSizerItem {
    constructor() {
        this.setHtmlElement = (element) => {
            this.htmlElement = element;
            this.rect = element;
        };
        this.getElement = () => {
            return this.htmlElement;
        };
        this.isSpacer = () => {
            return this.htmlElement === null;
        };
        this.setSize = (size) => {
            var _a;
            this.rect.setSize(size);
            (_a = this.htmlElement) === null || _a === void 0 ? void 0 : _a.setSize(size);
        };
        this.getSize = () => { return this.rect.getSize(); };
        this.setPoint = (pt) => {
            var _a;
            this.rect.setPoint(pt);
            (_a = this.htmlElement) === null || _a === void 0 ? void 0 : _a.setPoint(pt);
        };
        this.getPoint = () => { return this.rect.getPoint(); };
        this.setRect = (rect) => { this.rect = rect; };
        this.getRect = () => { return this.rect; };
        this.htmlElement = null;
        this.rect = defaultRect;
    }
}
