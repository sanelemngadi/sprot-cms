export class Rect {
    constructor(point = { x: -1, y: -1 }, size = { w: -1, h: -1 }) {
        this.center = () => {
            const left = this.x;
            const top = this.y;
            const cx = left + (this.w / 2);
            const cy = top + (this.h / 2);
            return { x: cx, y: cy };
        };
        this.contains = (point) => {
            const left = this.x;
            const right = left + this.w;
            const top = this.y;
            const bottom = top + this.h;
            const containX = left <= point.x && right >= point.x;
            const containY = top <= point.y && bottom >= point.y;
            if (containX && containY) {
                return true;
            }
            return false;
        };
        this.getBottom = () => { return this.getY() + this.getHeight(); };
        this.getTop = () => { return this.getY(); };
        this.getLeft = () => { return this.getX(); };
        this.getRight = () => { return this.getX() + this.getWidth(); };
        this.getTopLeft = () => { return this.getPoint(); };
        this.getTopRight = () => { return { x: this.getRight(), y: this.getTop() }; };
        this.getBottomLeft = () => { return { x: this.getLeft(), y: this.getBottom() }; };
        this.getBottomRight = () => { return { x: this.getRight(), y: this.getBottom() }; };
        this.x = point.x;
        this.y = point.y;
        this.w = size.w;
        this.h = size.h;
    }
    // setters and get getter
    setPoint(p) { this.x = p.x; this.y = p.y; }
    getPoint() { return { x: this.x, y: this.y }; }
    setSize(s) { this.w = s.w; this.h = s.h; }
    getSize() { return { w: this.w, h: this.h }; }
    setX(x) { this.x = x; }
    getX() { return this.x; }
    setY(y) { this.y = y; }
    getY() { return this.y; }
    setWidth(w) { this.w = w; }
    getWidth() { return this.w; }
    setHeight(h) { this.h = h; }
    getHeight() { return this.h; }
}
