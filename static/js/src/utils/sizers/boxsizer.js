import { Orientation, defaultPoint } from "../interfaces.js";
import { SprotSizerItem } from "./sizeritem.js";
export var AlignItem;
(function (AlignItem) {
    AlignItem[AlignItem["Center"] = 0] = "Center";
    AlignItem[AlignItem["TopOrLeft"] = 1] = "TopOrLeft";
    AlignItem[AlignItem["BottomOrRight"] = 2] = "BottomOrRight";
})(AlignItem || (AlignItem = {}));
export class SprotBoxSizer {
    constructor(orient = Orientation.Horizontal) {
        this.sizeInMajorDir = (size) => {
            if (this.orientation == Orientation.Horizontal) {
                return size.w;
            }
            return size.h;
        };
        this.sizeInMinorDir = (size) => {
            if (this.orientation == Orientation.Horizontal) {
                return size.h;
            }
            return size.w;
        };
        this.posInMajorDir = (pt) => {
            if (this.orientation === Orientation.Horizontal) {
                return pt.x;
            }
            return pt.y;
        };
        this.posInMinorDir = (pt) => {
            if (this.orientation == Orientation.Horizontal) {
                return pt.y;
            }
            return pt.x;
        };
        this.setSizeGivenDir = (major, minor) => {
            if (this.orientation == Orientation.Horizontal) {
                return { w: major, h: minor };
            }
            return { w: minor, h: major };
        };
        // calcMinSize is used to calculate the size of the elements combined
        this.calcMinSize = () => {
            let minSizeMajorDir = 0;
            let highestSizeMinDir = 0;
            for (let i = 0; i < this.children.length; i++) {
                const element = this.children[i];
                minSizeMajorDir += this.sizeInMajorDir(element.getSize());
                if (this.sizeInMinorDir(element.getSize()) > highestSizeMinDir) {
                    highestSizeMinDir = this.sizeInMinorDir(element.getSize());
                }
            }
            return this.setSizeGivenDir(minSizeMajorDir, highestSizeMinDir);
        };
        this.reportFirstDir = (dir, size, sizeInOtherDir) => { };
        this.repositionChildren = () => {
            if (this.children.length <= 0) {
                return;
            }
            let offsetX = 0;
            let offsetY = 0;
            const minSize = this.calcMinSize();
            const itemSizeProportion = this.sizeInMajorDir(this.parentSize) / this.children.length;
            const largestItem = this.sizeInMinorDir(minSize);
            let minMajor = this.sizeInMajorDir(minSize);
            // if the minimum size of children combined is greater that
            // the size of the parent then minSize is the size of the parent element
            if (minMajor >= this.sizeInMajorDir(this.parentSize)) {
                minMajor = this.sizeInMajorDir(this.parentSize);
            }
            if (this.alignItems == AlignItem.Center) {
                // offsetX = 0; 
                const totParentWidth = this.sizeInMinorDir(this.parentSize);
                const totChildrenWidth = this.sizeInMinorDir(minSize);
                if (this.orientation === Orientation.Vertical) {
                    offsetX = (totParentWidth - totChildrenWidth) / 2;
                }
                else {
                    offsetY = (totParentWidth - totChildrenWidth) / 2;
                }
            }
            const len = this.children.length;
            for (let i = 0; i < len; i++) {
                const child = this.children[i];
                if (this.orientation === Orientation.Horizontal) {
                    let gap = this.elementGap;
                    if (i === len - 1) {
                        gap = 0;
                    }
                    child.setPoint({
                        x: offsetX + 10 + itemSizeProportion * i,
                        y: offsetY + 10 + 0
                    });
                    child.setSize({ w: itemSizeProportion - gap, h: largestItem });
                }
                else if (this.orientation === Orientation.Vertical) {
                    let gap = this.elementGap;
                    if (i === len - 1) {
                        gap = 0;
                    }
                    child.setPoint({ x: offsetX + 10,
                        y: offsetY + 10 + itemSizeProportion * i });
                    child.setSize({ w: largestItem, h: itemSizeProportion - gap });
                }
            }
        };
        this.addElement = (element) => {
            const sizerItem = new SprotSizerItem();
            sizerItem.setHtmlElement(element);
            this.children.push(sizerItem);
        };
        this.addItem = (item) => {
            this.children.push(item);
        };
        this.justifyContent = (dir) => {
        };
        this.setAlignItems = (dir) => {
            this.alignItems = dir;
        };
        this.addSpacer = (spacer) => { };
        this.setParentSize = (size) => { this.parentSize = size; };
        this.setParentPoint = (pos) => { this.parentPosition = pos; };
        this.setContainingElement = (element) => {
            this.containingElement = element;
        };
        this.getContainingElement = () => {
            return this.containingElement;
        };
        this.gap = (gap) => { this.elementGap = gap; };
        this.children = [];
        this.parentSize = { w: -1, h: -1 };
        this.orientation = orient;
        this.minSize = { w: -1, h: -1 };
        this.parentPosition = defaultPoint;
        this.containingElement = null;
        this.alignItems = AlignItem.TopOrLeft;
        this.elementGap = 0;
    }
    ;
}
