import { SprotSides } from "../../utils/interfaces.js";

export class SprotFourSides implements SprotSides {
    top:  number;
    right: number;
    left: number;
    bottom: number;

    constructor();
    constructor(all: number);
    constructor(x: number, y: number);
    constructor(t: number, xx: number, b: number);
    constructor(top: number, right: number, bottom: number, left: number);
    constructor(...args: number[]) {
        this.top = 0;
            this.right = 0;
            this.bottom = 0;
            this.left = 0;
        if (args.length === 0) {
            this.top = 0;
            this.right = 0;
            this.bottom = 0;
            this.left = 0;
        } else if (args.length === 1) {
            this.setAll(args[0]);
        } else if (args.length === 2) {
            this.setBoth(args[0], args[1]);
        } else if (args.length === 3) {
            this.setThreeSides(args[0], args[1], args[2]);
        } else if (args.length === 4) {
            this.setFourSides(args[0], args[1], args[2], args[3]);
        } else {
        }
    }

    setAll(all: number) {
        this.top = all;
        this.right = all;
        this.bottom = all;
        this.left = all;
    }

    setBoth(x: number, y: number) {
        this.top = y;
        this.right = x;
        this.bottom = y;
        this.left = x;
    }

    setThreeSides(t: number, xx: number, b: number) {
        this.top = t;
        this.right = xx;
        this.bottom = b;
        this.left = xx;
    }

    setFourSides(top: number, right: number, bottom: number, left: number) {
        this.top = top;
        this.right = right;
        this.bottom = bottom;
        this.left = left;
    }

    setTop(n: number){
        this.top = n;
    }

    setBottom(n: number){
        this.bottom = n;
    }

    setRight(n: number){
        this.right = n;
    }

    setLeft(n: number){
        this.left = n;
    }
}
