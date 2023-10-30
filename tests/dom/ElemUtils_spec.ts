import { ElementUtils } from "../../src/DOM/Utils/ElementUtils";

describe("ElemUtils", () => {

    test("if id is used as identifier", () => {
        var elem = document.createElement("div");
        elem.id = "33";

        var sut = new ElementUtils();
        var actual = sut.getIdentifier(elem);
      
        expect(actual).toBe('33');
    });

    test("that data is used as default prefix", () => {
        var elem = document.createElement("div");
        elem.setAttribute('data-name', "33");

        var sut = new ElementUtils();
        var actual = sut.getIdentifier(elem);
      
        expect(actual).toBe('33');
    });

    test("that prefix can be changed", () => {
        var elem = document.createElement("div");
        elem.setAttribute('yo-name', "33");

        var sut = new ElementUtils("yo");
        var actual = sut.getIdentifier(elem);
      
        expect(actual).toBe('33');
    });

    
    test("that name is used as identifier", () => {
        var elem = document.createElement("div");
        elem.setAttribute('name', "33");

        var sut = new ElementUtils("yo");
        var actual = sut.getIdentifier(elem);
      
        expect(actual).toBe('33');
    });

    test("that all children are moved to the new node", () => {
        var elem = document.createElement("div");
        var child1 = document.createElement('div');
        var child2 = document.createElement('div');
        elem.appendChild(child1);
        elem.appendChild(child2);
        child1.setAttribute('id', "1");
        child2.setAttribute('id', "2");
        var target = document.createElement("div");

        var sut = new ElementUtils("yo");
        sut.moveChildren(elem, target);
      
        expect(elem.childElementCount).toBe(0);
        expect(target.childElementCount).toBe(2);
        expect(target.childNodes[0]).toBe(child1);
    });

    test("that all children are removed", () => {
        var elem = document.createElement("div");
        var child1 = document.createElement('div');
        var child2 = document.createElement('div');
        elem.appendChild(child1);
        elem.appendChild(child2);
        child1.setAttribute('id', "1");
        child2.setAttribute('id', "2");

        var sut = new ElementUtils("yo");
        sut.removeChildren(elem);
      
        expect(elem.childElementCount).toBe(0);
    });
});

