export interface SPROTSize{
    width: number,
    height: number
}

export interface SPROTPoint{
    x: number,
    y: number
}

export enum SprotState{
    DEFAULT = 1,
    HOVERED,
    PRESSED,
    RELEASED,
    FOCUSED,
    DISABLED,
    ENABLED
}

export enum SprotElement{
    DIV = 1,
    H1, H2, H3, H4, H5, H6,
    BODY, SECTION, ARTICLE, ASIDE,
    UL, LI,
    IMG, SPAN, A
}

export type SprotBlockElementName = "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" |
          "p" | "ul" | "li" | "section" | "body" | "article" |
          "aside"


export type SprotInlineElementName = "img" | "a" | "span";

export enum SprotOrientation{
    VERTICAL = 1,
    HORIZONTAL
}

export enum SprotDirection{
    Right = 1,
    Left,
    Bottom,
    Top,
    HORIZONTAL,
    VERTICAL
}

export interface SprotSides{
    top: string | number;
    right: string | number;
    left: string | number;
    bottom: string | number;
}

export type SprotEventType = "mousemove" | "mousedown" | "mouseup" | 
                         "resize" | "mouseenter" | "mouseleave" | "mouseover"; 

export interface ISprotEventObject<T>{
    type: T;
    skipped: boolean;
    Skip(): void;
    SetEventType(type: T): void;
    getEventType(): T;
    // veto(): void;
}