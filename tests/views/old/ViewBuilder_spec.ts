// import { ViewBuilder } from "../../src/Views/Engine2/ViewBuilder";
// import { IComponentMeta } from "../../src/backend/services/MetaGenerator";
// import { InvokerNodeContext } from "../../src/Views/Engine2/Invokers/Invokers";

// describe("ViewBuilder", () => {
//     const html  = `<table collection="users">
//         <tr>
//             <td>{{item.userName}}</td>
//         </tr>
//     </table>
//     <span unless="users">There are no users</span>`;

//     test("can render a view", async () => {
//         var meta: IComponentMeta = {
//             className: '',
//             constructorArguments: [],
//             data: [],
//             directory: '',
//             fileName: '',
//             methods: [],
//             properties: [],
//             tagName: 'myComponent',
//             routePath: ''
//         }
//         var element = document.createElement('div');
//         console.log('created ele,ent')
//         element.innerHTML = html;
//         console.log('now with html', element.outerHTML);

//         var sut = new ViewBuilder()
//         var actual = sut.process(element, meta)

//         var result = document.createElement('div');
//         var callback: any = {};
//         var context = new InvokerNodeContext(actual, {users: [{userName: 'jonas'}]}, callback);
//         await actual.invoke(result, context);
//         console.log('actual ', result.innerHTML);

//         expect(actual).toBe(true);
//     });

// });