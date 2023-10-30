// import { ElemUtils } from "../dom/ElemUtils";
// import { IRouteExecutionContext } from "../routing/interfaces/IRouteExecutionContext";
// import { IRouteHandler } from "../routing/interfaces/IRouteHandler";
// import { IViewModel } from "./ViewModels/interfaces/IViewModel";

//   /**
//  * Executes a specific route (i.e. loads the view model and view from the server, caches them and finally executes the VM).
//  */
//    export class RouteInvoker implements IRouteHandler {
//     private html: string;
//     private viewModelScript: string;
//     private viewModel: any;
//     private applicationName: string;

//     constructor(public section: string, applicationName: string) {
//         if (!applicationName) {
//             throw new Error("applicationName must be specified");
//         }
//         if (!section) {
//             throw new Error("section must be specified");
//         }
//         this.applicationName = applicationName;

//     }

//     static replaceAll(str: string, replaceWhat: string, replaceTo: string): string {
//         replaceWhat = replaceWhat.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
//         const re = new RegExp(replaceWhat, "g");
//         return str.replace(re, replaceTo);
//     }

//     private applyRouteDataToLinks(viewElement: HTMLElement, routeData: any) {
//         const links = viewElement.querySelectorAll("a");
//         for (let i = 0; i < links.length; i++) {
//             const link = <HTMLAnchorElement>links[i];

//             let pos = link.href.indexOf("#");
//             if (pos === -1 || link.href.substr(pos + 1, 1) !== "/") {
//                 continue;
//             }
//             for (let dataName in routeData) {
//                 if (routeData.hasOwnProperty(dataName)) {
//                     var after = RouteInvoker.replaceAll(link.href, `:${dataName}`, routeData[dataName]);
//                     var before = link.href;
//                     link.href = RouteInvoker.replaceAll(link.href, `:${dataName}`, routeData[dataName]);
//                 }
//             }

//         }
//     }

//     private moveNavigationToMain(viewElement: HTMLElement, context: any) {
//         const navigations = viewElement.querySelectorAll("[data-navigation]");
//         for (let i = 0; i < navigations.length; i++) {
//             const nav = <HTMLElement>navigations[i];
//             const target = nav.getAttribute("data-navigation");
//             const targetElem = document.getElementById(target);
//             if (!targetElem)
//                 throw new Error(`Failed to find target element '${target}' for navigation '${nav.innerHTML}'`);


//             var ifStatement = nav.getAttribute("data-if");
//             var ifResult = !ifStatement || !this.evalInContext(ifStatement, context);
//             if (!ifResult) {
//                 nav.parentNode.removeChild(nav);
//                 continue;
//             }
//             this.removeConditions(nav, context);

//             ElemUtils.removeChildren(targetElem);
//             ElemUtils.moveChildren(nav, targetElem);
//         }
//     }

//     private removeConditions(elem: HTMLElement, context: any) {
//         for (var i = 0; i < elem.childElementCount; i++) {
//             var child = elem.children[i];
//             var ifStatement = child.getAttribute("data-if");
//             var ifResult = !ifStatement || !this.evalInContext(ifStatement, context);
//             if (!ifResult) {
//                 child.parentNode.removeChild(child);
//                 continue;
//             }
//         }

//     }

//     private evalInContext(code: string, context: any) {
//         var func = function(js: string) {
//             return eval("with (this) { " + js + "}");
//         };
//         return func.call(context, code);
//     }

//     private isIE() {
//         var myNav = navigator.userAgent.toLowerCase();
//         return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
//     }

//     invoke(ctx: IRouteExecutionContext): void {
//         var self = this;
//         this.ensureResources(() => {
//             var viewElem = document.createElement("div");
//             viewElem.className = "ViewContainer";
//             viewElem.innerHTML = this.html;


//             //add script
//             var scriptElem = document.createElement("script");
//             scriptElem.setAttribute("type", "text/javascript");
//             scriptElem.setAttribute("data-tag", "viewModel");
//             ctx.target.attachViewModel(scriptElem);
//             if (this.isIE() <= 9) {
//                 scriptElem.text = this.viewModelScript;
//             } else {
//                 scriptElem.innerHTML = this.viewModelScript;
//             }

//             //load model and run it
//             var className = (this.section.replace(/\//g, ".") + "ViewModel");
//             this.viewModel = Config.viewModelFactory.create(this.applicationName, className);
//             var vm = this.viewModel;

//             if (vm.hasOwnProperty("getTargetOptions")) {
//                 var options = (<any>vm)["hasTargetOptions"]();
//                 ctx.target.assignOptions(options);
//             } else {
//                 ctx.target.assignOptions({});
//             }

//             //move nav etc.
//             this.applyRouteDataToLinks(viewElem, ctx.routeData);
//             this.moveNavigationToMain(viewElem, { model: this.viewModel, ctx: ctx });

//             var activationContext = {
//                 routeData: ctx.routeData,
//                 viewContainer: viewElem,
//                 render(data: any, directives?: any) {
//                     const r = new Griffin.Yo.Views.ViewRenderer(viewElem);
//                     r.render(data, directives);
//                 },
//                 readForm(selector: HTMLElement | string): any {
//                     var reader = new Dom.FormReader(selector);
//                     return reader.read();
//                 },
//                 renderPartial(selector: string, data: any, directives?: any) {
//                     const selector1 = new Dom.Selector(viewElem);
//                     const target = selector1.one(selector);
//                     const r = new Griffin.Yo.Views.ViewRenderer(target);
//                     r.render(data, directives);
//                 },
//                 resolve() {
//                     document.title = vm.getTitle();

//                     ctx.target.setTitle(vm.getTitle());
//                     ctx.target.render(viewElem);
//                     const scripts = viewElem.getElementsByTagName("script");
//                     const loader = new ScriptLoader();
//                     for (var i = 0; i < scripts.length; i++) {
//                         loader.loadTags(scripts[i]);
//                     }

//                     const allIfs = viewElem.querySelectorAll("[data-if]");
//                     for (let j = 0; j < allIfs.length; j++) {
//                         let elem = allIfs[j];
//                         var condition = elem.getAttribute("data-if");
                        
//                         //if can also be used during the rendering loop
//                         if (condition.substr(0,3) != 'vm.' && condition.substr(0,6) != 'model.' && condition.substr(0,4) != 'ctx.') {
//                             continue;
//                         }
                        
//                         //model is for backwards compability.
//                         let result = self.evalInContext(condition, { model: vm, ctx: ctx, vm:vm });
//                         if (!result) {
//                             elem.parentNode.removeChild(elem);
//                         }
//                     }

//                     const allUnless = viewElem.querySelectorAll("[data-unless]");
//                     for (let j = 0; j < allUnless.length; j++) {
//                         let elem = allUnless[j];
//                         var condition = elem.getAttribute("data-unless");
                        
//                         //if can also be used during the rendering loop
//                         if (condition.substr(0,3) != 'vm.' && condition.substr(0,6) != 'model.' && condition.substr(0,4) != 'ctx.') {
//                             continue;
//                         }
                        
//                         let result = self.evalInContext(condition, { ctx: ctx, vm:vm });
//                         if (!result) {
//                             elem.parentNode.removeChild(elem);
//                         }
//                     }

//                 },
//                 reject() {
//                     //TODO: Fail?
//                 },
//                 handle: new Dom.EventMapper(viewElem),
//                 select: new Dom.Selector(viewElem),
//                 applicationScope: Config.applicationScope
//             };

//             this.viewModel.activate(activationContext);
//         });
//     }



//     private ensureResources(callback: () => void) {
//         var bothPreloaded = true;
//         var self = this;
//         if (typeof this.html === "undefined") {
//             const path = Config.resourceLocator.getHtml(this.section);
//             Net.Http.get(path, (xhr, success) => {
//                 if (success) {
//                     self.html = xhr.responseText;
//                     this.doStep(callback);
//                 } else {
//                     throw new Error(xhr.responseText);
//                 }
//                 bothPreloaded = false;
//             }, "text/html");
//         }
//         if (typeof this.viewModel === "undefined") {
//             const path = Config.resourceLocator.getScript(this.section);
//             Net.Http.get(path, (xhr, success) => {
//                 if (success) {
//                     self.viewModelScript = xhr.responseText;
//                     this.doStep(callback);
//                 } else {
//                     throw new Error(xhr.responseText);
//                 }
//             }, "text/javascript");
//             bothPreloaded = false;
//         }

//         if (bothPreloaded)
//             this.doStep(callback);
//     }

//     private doStep(callback: () => void) {
//         if (typeof this.html !== "undefined"
//             && typeof this.viewModelScript !== "undefined") {
//             callback();
//         }
//     }
// }