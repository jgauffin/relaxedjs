import { Selector } from "../../src/DOM/Utils/Selector";

describe("FormReader", () => {

    test("get element by name attribute", () => {
        var html = `
        <body>
            <form>
                <input name="name" value="Arne">
            </form>
        </body>`;
        var elem = document.createElement("html");
        elem.innerHTML = html;

        var sut = new Selector(elem);
        var actual = sut.one('$name')

        expect(actual.getAttribute('value')).toBe('Arne');
    });

    test("get elemement by default prefix", () => {
        var html = `
        <body>
            <div data-name="name">hello</div>
        </body>`;
        var elem = document.createElement("html");
        elem.innerHTML = html;

        var sut = new Selector(elem);
        var actual = sut.one('$name')

        expect(actual.innerHTML).toBe('hello');
    });

    test("get elemement by custom prefix", () => {
        var html = `
        <body>
            <div yo-name="name">hello</div>
        </body>`;
        var elem = document.createElement("html");
        elem.innerHTML = html;

        var sut = new Selector(elem, 'yo');
        var actual = sut.one('$name')

        expect(actual.innerHTML).toBe('hello');
    });       
    
    test("get elemement by collection tag", () => {
        var html = `
        <body>
            <div yo-collection="name">hello</div>
        </body>`;
        var elem = document.createElement("html");
        elem.innerHTML = html;

        var sut = new Selector(elem, 'yo');
        var actual = sut.one('$name')

        expect(actual.innerHTML).toBe('hello');
    });

    test("get elemement by id", () => {
        var html = `
        <body>
            <div id="name">hello</div>
        </body>`;
        var elem = document.createElement("html");
        elem.innerHTML = html;

        var sut = new Selector(elem, 'yo');
        var actual = sut.one('$name')

        expect(actual.innerHTML).toBe('hello');
    });     

    test("get elemements", () => {
        var html = `
        <body>
            <div yo-name="some">
                hello
                <span name="some">kddk</span>
            </div>
            <div yo-collection="some">ldld</div>
            <h1 id="some">kdkd</h1>
        </body>`;
        var elem = document.createElement("html");
        elem.innerHTML = html;

        var sut = new Selector(elem, 'yo');
        var actuals = sut.all('$some')

        expect(actuals[0].textContent).toContain("hello");
        expect(actuals[1].innerHTML).toBe('kddk');
        expect(actuals[2].innerHTML).toBe('ldld');
        expect(actuals[3].innerHTML).toBe('kdkd');
    });     

});        
