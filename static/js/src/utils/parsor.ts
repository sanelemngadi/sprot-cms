
const html = {
    "element": "section",
    "self-closing": false,
    "attributes": {
        "class": "section",
        "id": "color"
    },
    "breakpoints": {
        "styles": {
            "border": "2px solid black",
            "color": "blue",
            "background-color": "silver",
            "display": "flex"
        },
        "sm": {
            "padding": "2px",
            "margin": "2rem"
        },
        "lg": {
            "max-width": "300px",
            "height": "200px"
        }
    },
    "children": [
        {
            "element": "div",
            "self-closing": false,
            "attributes": {
                "class": "first",
                "id": "number-one"
            },
            "breakpoints": {
                "styles": {
                    "border": "2px solid black",
                    "color": "blue",
                    "background-color": "silver"
                },
                "sm": {
                    "padding": "2px",
                    "margin": "2rem"
                },
                "lg": {
                    "max-width": "300px",
                    "height": "200px"
                }
            },
            "children": []
        },
        {
            "element": "div",
            "self-closing": false,
            "attributes": {
                "class": "two",
                "id": "number-two"
            },
            "breakpoints": {
                "styles": {
                    "border": "2px solid black",
                    "color": "blue",
                    "background-color": "silver"
                },
                "sm": {
                    "padding": "2px",
                    "margin": "2rem"
                },
                "lg": {
                    "max-width": "300px",
                    "height": "200px"
                }
            },
            "children": [
                
            ]
        }
    ]
}


interface ValuePair{
    [key:string]: string
}

class SprotDocument{
    private children: ValuePair;
    private selfClosing: boolean;
    private attributes: ValuePair;
    private breakPoints: ValuePair;
    private obj: ValuePair;

    constructor(obj: ValuePair = {}){
        this.children = {};
        this.attributes = {};
        this.breakPoints = {};
        this.obj = {};
        this.selfClosing = false;
    };

    setObject = (obj: ValuePair): void => {this.obj = obj;}
}