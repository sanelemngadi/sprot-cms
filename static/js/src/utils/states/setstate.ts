import { SprotHtmlBaseElement } from "../../elements/base.js";
import { SprotEventObjectFactory } from "../../events/factory.js";
import { SprotState } from "../interfaces.js";
import { SPROTPoint, SPROTRect } from "../utils.js";

export class SprotEventStateElement{
    private elements: SprotHtmlBaseElement[]
    private state: SprotState;
    private eventFactory: SprotEventObjectFactory;

    constructor(
    ){
        this.elements = [];
        this.state = SprotState.DEFAULT;
        this.eventFactory = new SprotEventObjectFactory();
    }

    setEventState = (state: SprotState, 
        pos: SPROTPoint, elements:SprotHtmlBaseElement[]
    ): void => {
        this.state = state;
        this.elements = elements;
        const element = this.findElementByPos(pos, elements);
        this.setElementState(element, pos);
    }

    findElementByPos = (pos: SPROTPoint, elements: SprotHtmlBaseElement[]) 
        : SprotHtmlBaseElement | null => {
        for(let element of elements){
            if(!element.isShown()){
                continue;
            }
            const elementRect = SPROTRect.create(element.getPosition(), element.getSize());
            if(elementRect.containPoint(pos)){
                return element;
            }
        }
        return null;
    }

    setElementState = (activeElement: SprotHtmlBaseElement | null, 
        point: SPROTPoint): void => {
        if(activeElement){
            // if this element is locked or disables dont border hovering it

            if(!activeElement.isEnabled()){
                return;
            }
        }
        

        let formerActiveElement = null;
        for(let element of this.elements){
            if(!element.isShown()){
                continue;
            }
            if(element.hasEventState(this.state)){
                formerActiveElement = element;                
            }
            element.setEventState(SprotState.DEFAULT);
        }

        if(activeElement){
            activeElement.setEventState(this.state);
            // if mousemoving inside element the recursively hover over child elements
            // this helps because we are only searching the children of the element only
            const childElementState = new SprotEventStateElement();
            if(Array.isArray(activeElement.getChildren())){
                const children = activeElement.getChildren() as SprotHtmlBaseElement[];
                childElementState.setEventState(this.state, point, children);
            }

            if(this.state === SprotState.HOVERED){
                this.eventFactory.dispatch({type:"mousemove", payload: {
                    activeElement, point
                }});
            }
        }

        if(activeElement !== formerActiveElement){
            if(!activeElement && formerActiveElement){
                // we are current out of all element but previously we were on top of element
                // meaning we just left element fire mouseleave event
                if(this.state === SprotState.HOVERED){
                    this.eventFactory.dispatch({type:"mousemove", payload: {
                        formerElement: formerActiveElement ,point
                    }});
                }     
                else if(this.state === SprotState.PRESSED){
                    // fire kill focus to this element
                    // if the user clicked now of the elements then killfocus from the prev
                    // element that was clicked
                    this.eventFactory.dispatch({type:"killfocus", payload: {
                        formerElement: formerActiveElement, point
                    }});
                }
                else if(this.state === SprotState.RELEASED){
                }
            }

            else if(activeElement && !formerActiveElement){
                // we are ontop of an element but previous not, 
                // then that means wejust ented element
                if(this.state === SprotState.HOVERED
                ){ 
                    this.eventFactory.dispatch({type:"mouseenter", payload: {
                        activeElement, point
                    }});
                }
                else if(this.state === SprotState.PRESSED){
                    // fire left down to this element
                    this.eventFactory.dispatch({type:"mousedown", payload: {
                        activeElement, point
                    }});
                }
                else if(this.state === SprotState.RELEASED){
                    // fire set focus to this element
                    this.eventFactory.dispatch({type:"mouseup", payload: {
                        activeElement, point
                    }});

                    // on mouse left up focus the current element
                    this.eventFactory.dispatch({type:"setfocus", payload: {
                        activeElement
                    }});
                }
            }

            else if(activeElement && formerActiveElement){
                // if we happen to have both the current and previous hovere
                // that means we are from straight the former element, 
                // fire both enter and leave event
                if(this.state === SprotState.HOVERED){
                } 
                else if(this.state === SprotState.PRESSED){
                    // fire left down to this element
                    this.eventFactory.dispatch({type:"mousedown", payload: {
                        activeElement, formerElement: formerActiveElement,  point
                    }});
                    this.eventFactory.dispatch({type:"killfocus", payload: {
                        activeElement, formerElement: formerActiveElement
                    }});
                }
                else if(this.state === SprotState.RELEASED){
                    this.eventFactory.dispatch({type:"mouseup", payload: {
                        activeElement, formerElement: formerActiveElement,  point
                    }});
                    this.eventFactory.dispatch({type:"setfocus", payload: {
                        activeElement, formerElement: formerActiveElement
                    }});
                }           
            }
        }
    } 
}

// state, state