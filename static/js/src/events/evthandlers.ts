import { ISprotEventObject } from "../utils/interfaces.js";
import { SprotEvent } from "./eventobject.js";

interface SprotEventFunctors<T, P>{
    type: T;
    id: number;
    // element: SprotHtmlBaseElement;
    functor: (obj: P)=>void;
    // functor: (obj: ISprotEventObject)=>void;
}

export class SprotEventHandler{
    private events: SprotEventFunctors<any, any>[];

    constructor(){
        this.events = [];
    }

    addEventListener<T, P extends ISprotEventObject<T>>(type: T, functor: (event: P) => void){
        const event: SprotEventFunctors<T, P> = {type, functor, id: this.events.length};
        this.events.push(event);
    }

    // fire event to handle with eventListener
    sendEvent<T>(eventObject: SprotEvent<T>){
        // we reverse iterate the events because we want to handle the last event
        // first and then last
        // for(let evt of this.events){
        for(let i = this.events.length - 1; i >= 0; i--){
            const evt = this.events[i];
            if(evt.type !== eventObject.type){
                continue;
            }

            // eventObject.SetEventType(evt.eventType);
            evt.functor(eventObject);

            // if the the event is handled then stop handling the rest 
            // but if the user intentionally wants to handle all the same events the do so
            if(eventObject.skipped && (evt.type === eventObject.getEventType())){
                continue;
            }else{
                break;
            }
        }
    }
}



/*

I want to create an observer pattern to observe our events

*/

interface Base{
    name: string
}

class Sub implements Base{
    surname: string;
    constructor(public name: string){
        this.name = name;
        this.surname = "Bukhosini";
    }
}

function log(name: Base){
    console.log(name.name);
}

log(new Sub("Sanele"));