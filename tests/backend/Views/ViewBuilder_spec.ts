import { ViewBuilder } from "../../../src/Backend/Views/ViewBuilder";
import { registrations } from "../../../src/Components/Implementation/Decorator";

// let jsonResponse = { test: 100 };
// let textResponse = '<div>Hello {{world}}</div>';
// let calls = 0;

import { FakeComponentMeta } from "./FakeComponentMeta";

// const fetch = jest.fn(() =>
//     Promise.resolve({
//         json: () => Promise.resolve(jsonResponse),
//         text: () => { calls++; return Promise.resolve(textResponse) }
//     }),
// ) as jest.Mock;
// global.fetch = fetch;

class MyComponent{

    constructor(){

    }

}

describe("ViewEngine", () => {

    // beforeEach(() => {+
    // });


    test("show fetch view from backend", async () => {
        var meta = new FakeComponentMeta();
        meta.methods.push({
            name: 'onAddUser',
            arguments: []
        });

        registrations.push({
            className: 'MyComponent',
            componentConstructor: MyComponent,
            tagName: 'MyComponent',
        });

        meta.setData({users: []});
        var wrapper = document.createElement('div');
        wrapper.innerHTML = `<div if="users">
                                <span>Hello {{world}}!</span>
                                <table>
                                    <tr for="users">
                                        <td :id="item.id">{{item.FirstName}}</td>
                                        <td><a name="yo">Test</a></td>
                                    </tr>
                                </table>
                            </div>
                            <section else>
                                Hello world!
                                <MyComponent id="id"><div name="header">{{firstName}}</div></MyComponent>
                            </section>
                            <form name="AddUser">
                            
                                <input name="Name" placeholder="Name">
                                <input name="Age" type="number" />
                                <button>Submit</button>
                            </form>
                            `;

        var sut = new ViewBuilder(meta);
        var actual = await sut.process('MyView', wrapper);

        console.log(actual);
        expect(actual).toBeDefined();
    });

});