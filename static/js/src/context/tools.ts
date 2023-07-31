export enum SprotPenType{
    SOLID = 1
}

export enum SprotBrushType{
    SOLID = 1
}

export class SprotPen{
    constructor(private color: string = "black", private width: number = 1, 
        private type: SprotPenType = SprotPenType.SOLID
    ){
        this.color = color;
        this.width = width;
        this.type = type;
    }

    getColor ():string {return this.color;}
    setColor(c: string){this.color = c;}

    getWidth():number{return this.width;}
    setWidth(n: number){this.width = this.width;}

    getType():SprotPenType{return this.type;}
    setType(type:SprotPenType){this.type = type;}
}

export class SprotBrush{
    constructor(private color: string = "black", 
    private type: SprotBrushType = SprotBrushType.SOLID
    ){
        this.color = color;
        this.type = type;
    }

    getColor ():string {return this.color;}
    setColor(c: string){this.color = c;}

    getType():SprotBrushType{return this.type;}
    setType(type:SprotBrushType){this.type = type;}
}