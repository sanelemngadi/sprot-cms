"use strict";
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
            "children": []
        }
    ]
};
class SprotDocument {
    constructor(obj = {}) {
        this.setObject = (obj) => { this.obj = obj; };
        this.children = {};
        this.attributes = {};
        this.breakPoints = {};
        this.obj = {};
        this.selfClosing = false;
    }
    ;
}
