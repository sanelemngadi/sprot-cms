import { Rect } from "./rect.js";

export interface Point{
    x: number;
    y: number;
}

export interface Size{
    w: number,
    h: number
}

export interface Transformations{
    point: Point;
    size: Size;
    angle: number;
    borderRadius: number;
}

export interface DrawingSettings{
    color: string;
    bg: string;
    stroke: string;
    stroke_width: number;
}

export type HTMLProps = Partial<Record<keyof HTMLElement, string | number | boolean>>;
export interface CSSProp{
    [key: string]: string | number;
}

export interface HTMLDatasetProp<T = number>{
    [key: string]: string | number | T;
}

export interface BreakPoints{
    xs?: CSSProp;
    sm?: CSSProp;
    md?: CSSProp;
    lg?: CSSProp;
    xl?: CSSProp;
    xxl?: CSSProp;
}

export interface Edge{
    top: string | number;
    left: string | number;
    bottom: string | number;
    right: string | number;
}

export const defaultRect:Rect = new Rect();
export const defaultPoint: Point = {x: -1, y: -1};
export const defaultSize: Size = {w: -1, h: -1};

export enum ActionControl{
    None = 1,
    Left,
    Top,
    Right,
    Bottom
}

export enum ElementState{
    Default = 1,
    Hovered,
    Pressed,
    Locked
}

export enum Orientation{
    Horizontal,
    Vertical
}