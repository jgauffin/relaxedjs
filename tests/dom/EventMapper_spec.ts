import { EventMapper } from "../../src/DOM/Utils/EventMapper";

describe("EventMapper", () => {

    test("that click event is hoocked up", () => {
        var invoked = false;
        var elem = document.createElement("div");
        var child = document.createElement("div");
        var sut = new EventMapper(elem);
        var e = new MouseEvent('click');
        child.setAttribute('yo-name', 'somename');
        elem.appendChild(child);

        sut.click('$somename', e => invoked = true)
        child.dispatchEvent(e);
      
        expect(invoked).toBe(true);
    });

    test("that keyDown event is hoocked up", () => {
        var invoked = false;
        var elem = document.createElement("div");
        var child = document.createElement("div");
        var sut = new EventMapper(elem);
        var e = new KeyboardEvent('keydown');
        child.setAttribute('yo-name', 'somename');
        elem.appendChild(child);

        sut.keyDown('$somename', e => invoked = true)
        child.dispatchEvent(e);
      
        expect(invoked).toBe(true);
    });

    test("that keyUp event is hoocked up", () => {
        var invoked = false;
        var elem = document.createElement("div");
        var child = document.createElement("div");
        var sut = new EventMapper(elem);
        var e = new KeyboardEvent('keyup');
        child.setAttribute('yo-name', 'somename');
        elem.appendChild(child);

        sut.keyUp('$somename', e => invoked = true)
        child.dispatchEvent(e);
      
        expect(invoked).toBe(true);
    });

});