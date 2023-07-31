import { SprotGraphicsContext } from "../../context/graphics.js";
import { SprotPen } from "../../context/tools.js";
import { SprotTransformationInDirection } from "../../utils/utils.js";
import { SprotBoxSizer } from "./boxsizer.js";
import { SprotSizerItemKind } from "./sizeritem.js";

export class SprotHightlightSizer{
    private drawSizer: boolean;

    constructor(private sizer: SprotBoxSizer){
        this.sizer = sizer;
        this.drawSizer = false;
    }

    static hightlight(gc: SprotGraphicsContext, sizer: SprotBoxSizer | null, draw: boolean){
        if(!draw || !sizer){
            return;
        }
        const elements = sizer.getChildren();
        for(let item of elements){
            if(item.getKind() ===SprotSizerItemKind.ELEMENT){
                continue;
                gc.setPen(new SprotPen("blue"));
            }else{
                gc.setPen(new SprotPen("yellow"));
            }

            const rect = item.getRect();
            const pt = item.getElement()?.getParent().getPosition();
            if(pt){
                const pos = SprotTransformationInDirection.setPointGivenDir(
                    sizer.getOrientation(), 
                    SprotTransformationInDirection.getPosMajorDir(sizer.getOrientation(), pt) + 
                    // SprotTransformationInDirection.getPosMajorDir(sizer.getOrientation(), sizer.getDimension().getPosition()) + 
                    SprotTransformationInDirection.getPosMajorDir(sizer.getOrientation(), item.getPosition()),
                    SprotTransformationInDirection.getPosMinorDir(sizer.getOrientation(), pt)
                );
                rect.setPosition(pos);
            }else{
                let posMjr = SprotTransformationInDirection.getPosMajorDir(
                    sizer.getOrientation(), sizer.getDimension().getPosition()                
                    );
                    posMjr += SprotTransformationInDirection.getPosMajorDir( sizer.getOrientation(), rect.getPosition());
    
                let posMnr = SprotTransformationInDirection.getPosMinorDir(
                    sizer.getOrientation(), sizer.getDimension().getPosition()
                    );
    
                const pppp = SprotTransformationInDirection.setPointGivenDir(
                    sizer.getOrientation(), posMjr, posMnr
                );
                rect.setPosition(pppp);
            }
            // gc.drawRect(rect);
        }
    }
}