import { SprotDesignBoard } from "./canvas/canvas.js";
import { SprotBrush, SprotPen } from "./context/tools.js";
import { SprotSectionElement } from "./elements/blockelements.js";
import { SprotBoxSizer } from "./elements/sizers/boxsizer.js";
import { SprotSizerFlags } from "./elements/sizers/sizeritem.js";
import { SprotOrientation } from "./utils/interfaces.js";
import { SPROTPoint, SPROTSize } from "./utils/utils.js";
const canvas = document.getElementById("canvas");
let doneLoading = false;
window.onload = () => {
    doneLoading = true;
};
if (canvas) {
    canvas.width = window.innerWidth - canvas.offsetLeft;
    canvas.height = window.innerHeight - canvas.offsetTop;
    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth - canvas.offsetLeft;
        canvas.height = window.innerHeight - canvas.offsetTop;
    });
    const cv = new SprotDesignBoard(canvas);
    // if(doneLoading)
    {
        window.onload = () => {
            // console.log("once: ", canvas.width);
            cv.onSize();
        };
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
        section.addEventListener("mousemove", (evt) => {
            // console.log("mouse: leave");
            // evt.Skip();
        });
        section.addEventListener("mousedown", (evt) => {
            console.log("mouse: down");
            // evt.Skip();
        });
        section.addEventListener("mouseup", (evt) => {
            console.log("mouse: up");
            // evt.Skip();
        });
        section.addEventListener("mouseenter", (evt) => {
            console.log("mouse: enter");
            evt.Skip();
        });
        section.addEventListener("mouseleave", (evt) => {
            console.log("mouse: leave");
            evt.Skip();
        });
        section.addEventListener("setfocus", (evt) => {
            console.log("on focus");
            // evt.Skip();
        });
        section.addEventListener("killfocus", (evt) => {
            console.log("on kill focus");
            // evt.Skip();
        });
        const sectionChild1 = new SprotSectionElement(section, cv, new SPROTPoint(0, 0), new SPROTSize(-1, 50));
        sectionChild1.setHoverPen(new SprotPen("blue"));
        sectionChild1.setHoverBrush(new SprotBrush("silver"));
        sectionChild1.setPen(new SprotPen("white"));
        const sectionChild2 = new SprotSectionElement(section, cv, new SPROTPoint(0, 20 + 50));
        sectionChild2.setSize(new SPROTSize(-1, 50));
        sectionChild2.setHoverPen(new SprotPen("blue"));
        sectionChild2.setHoverBrush(new SprotBrush("black"));
        sectionChild2.setPen(new SprotPen("white"));
        // sectionChild2.Bind(SprotEventType.MOUSE_MOVE, (evt: ISprotEventObject) => {
        //     console.log("mouse: subclass motion");
        // }, sectionChild2);
        // sectionChild2.setPen(new SprotPen("red"));
        const sectionChild3 = new SprotSectionElement(section, cv, new SPROTPoint(0, 20 + 50));
        sectionChild3.setSize(new SPROTSize(-1, 50));
        sectionChild3.setHoverPen(new SprotPen("blue"));
        sectionChild3.setHoverBrush(new SprotBrush("silver"));
        sectionChild3.setPen(new SprotPen("white"));
        sectionChild3.setPen(new SprotPen("red"));
        // sectionChild3.Show(false);
        const sectionChild4 = new SprotSectionElement(section, cv, new SPROTPoint(0, 20 + 50));
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
        // const mainSizer = new SprotBoxSizer(SprotOrientation.VERTICAL);
        // const div1 = new SprotContainerElement(body, cv, new SPROTPoint(10, 10));
        // div1.setSize(new SPROTSize(-1, 10));
        // div1.setHoverPen(new SprotPen("red"));
        // const div2 = new SprotContainerElement(body, cv, new SPROTPoint(10, 10));
        // div2.setSize(new SPROTSize(-1, 10));
        // div2.setHoverPen(new SprotPen("red"));
        // const div3 = new SprotContainerElement(body, cv, new SPROTPoint(10, 10));
        // div3.setSize(new SPROTSize(-1, 10));
        // div3.setHoverPen(new SprotPen("red"));
        // mainSizer.addElement(section);
        // mainSizer.addElement(div1);
        // mainSizer.addElement(div2);
        // mainSizer.addElement(div3);
        // body.setSizer(mainSizer);
        // console.log("parent pos: ", section.getPosition().getX(), 
        //     " child pos: ", sectionChild1.getPosition().getX());    
        cv.addElement(section);
        cv.Refresh();
        // console.log("name: ", section.getName(), ", type: ", section.getType(), 
        // " normal pen: ", section.getPen().getColor(), " hover: ", section.getHoverPen().getColor());
    }
}
const tree = {
    name: "Thembelihle",
    children: [
        {
            name: "Thembisile",
            children: [
                {
                    name: "Slindile",
                    children: [
                        {
                            name: "sli kid 1",
                            children: []
                        },
                    ]
                },
                {
                    name: "Sanele",
                    children: [
                        {
                            name: "Sisanda",
                            children: []
                        },
                        {
                            name: "Ntuso",
                            children: []
                        },
                    ]
                },
            ]
        },
        {
            name: "Nunu",
            children: [
                {
                    name: "nunu kid 1",
                    children: []
                },
                {
                    name: "nunu kid 2",
                    children: []
                },
                {
                    name: "nunu kid 3",
                    children: []
                },
                {
                    name: "nunu kid 4",
                    children: []
                },
                {
                    name: "nunu kid 5",
                    children: []
                },
            ]
        },
        {
            name: "Thulani",
            children: []
        },
    ]
};
const findMember = (tree, name) => {
    for (let i = 0; i < Object(tree).keys().lenght; i++) {
        const key = Object(tree).keys()[i];
        if (name == key) {
            return tree[key];
        }
        if (typeof tree[key] === "object") {
            const vp = (tree[key]);
            findMember(vp, name);
        }
    }
    return `we don't have family name ${name}`;
};
