import { SprotDesignBoard } from "./canvas/canvas.js";
import { SprotBrush, SprotPen } from "./context/tools.js";
import { SprotSectionElement } from "./elements/blockelements.js";
import { SprotContainerElement } from "./elements/container.js";
import { SprotBoxSizer } from "./elements/sizers/boxsizer.js";
import { SprotSizerFlags } from "./elements/sizers/sizeritem.js";
import { SprotFocusEvent, SprotMouseEvents, SprotSizeEvent } from "./events/eventobject.js";
import { ISprotEventObject, SprotEventType, SprotOrientation } from "./utils/interfaces.js";
import { SPROTPoint, SPROTSize } from "./utils/utils.js";

const canvas = document.getElementById("canvas") as HTMLCanvasElement |null;
let doneLoading = false;
window.onload = ()=> {
    doneLoading = true;
}

if(canvas){
    canvas.width = window.innerWidth - canvas.offsetLeft;
    canvas.height = window.innerHeight - canvas.offsetTop;

    window.addEventListener("resize", ()=>{
        canvas.width = window.innerWidth - canvas.offsetLeft;
        canvas.height = window.innerHeight - canvas.offsetTop;
    });

    const cv = new SprotDesignBoard(canvas);
    // if(doneLoading)
    {

        window.onload = ()=>{
            // console.log("once: ", canvas.width);
            cv.onSize();
        }

        // const body = new SprotContainerElement(cv, cv, new SPROTPoint(10, 10));
        // body.setSize(new SPROTSize(-1, 200));
        // body.setHoverPen(new SprotPen("red"));
        // // body.setPen(new SprotPen("black"));
        // body.setBrush(new SprotBrush("silver"));
        
        
        const section = new SprotSectionElement(cv, cv, new SPROTPoint(10, 10));
        section.setSize(new SPROTSize(-1, 400));
        section.setHoverPen(new SprotPen("red"));
        // section.setPen(new SprotPen("black"));
        section.setBrush(new SprotBrush("silver"));
        section.addEventListener("mousemove", (evt: ISprotEventObject<any>) => {
                // console.log("mouse: leave");
                // evt.Skip();
        });

        section.addEventListener("mousedown", (evt: SprotMouseEvents) => {
            console.log("mouse: down");
            // evt.Skip();
        });

        section.addEventListener("mouseup", (evt: SprotMouseEvents) => {
            console.log("mouse: up");
            // evt.Skip();
        });
        section.addEventListener("mouseenter", (evt: SprotMouseEvents) => {
            console.log("mouse: enter");
            evt.Skip();
        });
        section.addEventListener("mouseleave", (evt: SprotMouseEvents) => {
            console.log("mouse: leave");
            evt.Skip();
        });
        section.addEventListener("setfocus", (evt: SprotFocusEvent) => {
            console.log("on focus");
            // evt.Skip();
        });

        section.addEventListener("killfocus", (evt: SprotFocusEvent) => {
            console.log("on kill focus");
            // evt.Skip();
        });

        section.addEventListener("resize", (evt: SprotSizeEvent) => {
            console.log("sizing the object: ", evt.getSize());
            
        })

        const sectionChild1 = new SprotSectionElement(section, cv, new SPROTPoint(0, 0),
        new SPROTSize(-1, 50));
        sectionChild1.setHoverPen(new SprotPen("blue"));
        sectionChild1.setHoverBrush(new SprotBrush("silver"));
        sectionChild1.setPen(new SprotPen("white"));
        
        const sectionChild2 = new SprotSectionElement(section, cv, new SPROTPoint(0 , 20 + 50));
        sectionChild2.setSize(new SPROTSize(-1, 50));
        sectionChild2.setHoverPen(new SprotPen("blue"));
        sectionChild2.setHoverBrush(new SprotBrush("black"));
        sectionChild2.setPen(new SprotPen("white"));

        sectionChild2.addEventListener("mousemove", (evt: SprotMouseEvents) => {
            console.log("mouse: subclass motion");
        });
        // sectionChild2.setPen(new SprotPen("red"));
        
        const sectionChild3 = new SprotSectionElement(section, cv, new SPROTPoint(0 , 20 + 50));
        sectionChild3.setSize(new SPROTSize(-1, 50));
        sectionChild3.setHoverPen(new SprotPen("blue"));
        sectionChild3.setHoverBrush(new SprotBrush("silver"));
        sectionChild3.setPen(new SprotPen("white"));
        sectionChild3.setPen(new SprotPen("red"));
        // sectionChild3.Show(false);
        
        const sectionChild4 = new SprotSectionElement(section, cv, new SPROTPoint(0 , 20 + 50));
        sectionChild4.setSize(new SPROTSize(-1, 50));
        sectionChild4.setHoverPen(new SprotPen("blue"));
        sectionChild4.setHoverBrush(new SprotBrush("red"));
        sectionChild4.setPen(new SprotPen("white"));
        sectionChild4.setPen(new SprotPen("red"));

        const sizer = new SprotBoxSizer(SprotOrientation.HORIZONTAL);
        sizer.addElement(sectionChild1, new SprotSizerFlags(1));
        sizer.addGap(20);
        sizer.addElement(sectionChild2, new SprotSizerFlags(1));
        sizer.addGap(20);
        sizer.addElement(sectionChild3, new SprotSizerFlags(1));
        sizer.addGap(20);
        sizer.addElement(sectionChild4, new SprotSizerFlags(1));
        section.setSizer(sizer);    

        cv.addElement(section);
        cv.Refresh();
    }  
}