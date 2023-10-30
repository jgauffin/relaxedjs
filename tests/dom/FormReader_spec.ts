import { FormReader } from "../../src/DOM/Utils/FormReader";

describe("FormReader", () => {

    test("read an input value", () => {
        var html = `
        <body>
            <form>
                <input name="name" value="Arne">
            </form>
        </body>`;
        var elem = document.createElement("div");
        elem.innerHTML = html;

        var sut = new FormReader();
        var doc = sut.read(elem);

        expect(doc).toHaveProperty('name', "Arne");
    });

    test("convert input type number to numeric value", () => {
        var html = `
        <body>
            <form>
                <input name="userId" type="number" value="3">
            </form>
        </body>`;
        var elem = document.createElement("div");
        elem.innerHTML = html;

        var sut = new FormReader();
        var doc = sut.read(elem);

        expect(doc).toHaveProperty('userId', 3);
    });



    test("read a select value", () => {
        var html = `
        <body>
            <form>
                <select name="state">
                    <option value="2">2</option>
                    <option value="3" selected>3</option>
                </select>
            </form>
        </body>`;
        var elem = document.createElement("div");
        elem.innerHTML = html;

        var sut = new FormReader();
        var doc = sut.read(elem);

        expect(doc).toHaveProperty('state', 3);
    });

    test("read a select multiple value", () => {
        var html = `
        <body>
            <form>
                <select name="states" multiple>
                    <option value="1">1</option>
                    <option value="2" selected>2</option>
                    <option value="3" selected>3</option>
                </select>
            </form>
        </body>`;
        var elem = document.createElement("div");
        elem.innerHTML = html;

        var sut = new FormReader();
        var doc = sut.read(elem);

        expect(doc).toHaveProperty('states', [2, 3]);
    });


    test("read selected checkboxes value", () => {
        var html = `
        <body>
            <form>
                <input type="checkbox" name="state[]" value="1">
                <input type="checkbox" name="state[]" value="2" checked>
                <input type="checkbox" name="state[]" value="3" checked>
            </form>
        </body>`;
        var elem = document.createElement("div");
        elem.innerHTML = html;

        var sut = new FormReader();
        var doc = sut.read(elem);

        expect(doc).toHaveProperty('state', [2, 3]);
    });

    test("read selected radio", () => {
        var html = `
        <body>
            <form>
                <input type="checkbox" name="state" value="1">
                <input type="checkbox" name="state" value="2" selected>
            </form>
        </body>`;
        var elem = document.createElement("div");
        elem.innerHTML = html;

        var sut = new FormReader();
        var doc = sut.read(elem);

        expect(doc).toHaveProperty('state', 2);
    });


    test("read sub object using name attribute", () => {
        var html = `
        <body>
            <form>
                <div yo-name="person">
                    <input name="firstName" value="Gunnar">
                    <input name="lastName" value="Ek">
                </div>
            </form>
        </body>`;
        var elem = document.createElement("div");
        elem.innerHTML = html;

        var sut = new FormReader();
        var doc = sut.read(elem);

        expect(doc).toHaveProperty('person');
        expect(doc.person).toHaveProperty('firstName', "Gunnar");
        expect(doc.person).toHaveProperty('lastName', "Ek");
    });

    test("read sub object using dot notation", () => {
        var html = `
        <body>
            <form>
                <input name="person.firstName" value="Gunnar">
                <input name="person.lastName" value="Ek">
            </form>
        </body>`;
        var elem = document.createElement("div");
        elem.innerHTML = html;


        var sut = new FormReader();
        var doc = sut.read(elem);

        expect(doc).toHaveProperty('person');
        expect(doc.person).toHaveProperty('firstName', "Gunnar");
        expect(doc.person).toHaveProperty('lastName', "Ek");
    });    

    test("read array", () => {
        var html = `
        <body>
            <form>
                <input name="names[0]" value="jonas">
                <input name="names[1]" value="adam">
                <input name="names[2]" value="jens">
            </form>
        </body>`;
        var elem = document.createElement("div");
        elem.innerHTML = html;

        var sut = new FormReader();
        var doc = sut.read(elem);

        expect(doc).toHaveProperty('names', ["jonas", "adam", "jens"]);
    });

    test("read object array objects with dot notation", () => {
        var html = `
        <body>
            <form>
                <input name="persons[0].firstName" value="jonas">
                <input name="persons[0].lastName" value="gud">
                <input name="persons[1].firstName" value="per">
                <input name="persons[1].lastName" value="skog">
            </form>
        </body>`;
        var elem = document.createElement("div");
        elem.innerHTML = html;

        var sut = new FormReader();
        var doc = sut.read(elem);

        expect(doc).toHaveProperty('persons', [{firstName: "jonas", lastName: "gud"}, {firstName: "per", lastName: "skog"}]);
    });

    test("read object array with name attribute", () => {
        var html = `
        <body>
            <form>
                <div yo-name="persons[]">
                    <input name="firstName" value="jonas">
                    <input name="lastName" value="gud">
                </div>
                <div yo-name="persons[]">
                    <input name="firstName" value="per">
                    <input name="lastName" value="skog">
                </div>
            </form>
        </body>`;
        var elem = document.createElement("div");
        elem.innerHTML = html;

        var sut = new FormReader();
        var doc = sut.read(elem);

        expect(doc).toHaveProperty('persons', [{firstName: "jonas", lastName: "gud"}, {firstName: "per", lastName: "skog"}]);
    });        

    test("read object array with name attribute", () => {
        var html = `
        <body>
            <form>
                <div yo-name="persons[0]">
                    <input name="firstName" value="jonas">
                    <input name="lastName" value="gud">
                </div>
                <div yo-name="persons[2]">
                    <input name="firstName" value="per">
                    <input name="lastName" value="skog">
                </div>
            </form>
        </body>`;
        var elem = document.createElement("div");
        elem.innerHTML = html;

        var sut = new FormReader();
        var doc = sut.read(elem);

        expect(doc).toHaveProperty('persons', [{firstName: "jonas", lastName: "gud"}, undefined, {firstName: "per", lastName: "skog"}]);
    });        
});