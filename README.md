Preserverance elelr Resilience

tiyaga = filipinska för preserverance

# Welcome

Relaxed is a tiny and straightforward SPA library for Typescript. It doesn't have magic like a rendering engine or two-way bindings of fields.
You need to tell it to update the view or when to read from a form.

However, that puts you in control, which makes it trivial to find errors. Spend more time coding, and less time debugging.

## Need to know

This library consists of Pages and Components. Pages takes up the complete main area in the browser and controls the title in the browser.
A page can either be completely rendered in the page view or use one or more components.

A component is simply a small part of the view. It can be a list or an edit form. One or more components can be used to compose a page.

## Starting from scratch


Create a new package.json by running `npm init`. Install our package using `npm i -S relaxed.js`. Create a new sub folder for your start component `Start\`.

### Creating the first page

Create a new file in the `Start` folder and name it `Start.ts`. It's your first page. Add the following:

```typescript
@import { ContainerService } from "@relaxedjs/DependencyInjection";
@import { Routed } from "@relaxedjs/Router";

@ContainerService(), @Routed("/users/:id")
export class HomeComponent implements jes<User>, ICanActivate
{
    constructor(private httpClient: IHttpClient) {
    }

    data: User;

    async activate(): Promise<void> {
        this.data = await this.httpClient.get("/api/user/:id")
    }
}
```

The component tells that it wraps an object called `User`. It uses the built in HTTP client to fetch the user from the backend. Note that everything is fully async with standard JS promises.

The `Routed` decorator registers this component in the Router per default. There is no need to manage a seperate routing file. Routes are added as soon as you create a new component.

The @ContainerService attribute registers this component in the IoC container which is required to be able to build it with it's dependencies.

### Creating the first view

Add a new file called `Home.html` which is your new view.



## Getting started (.NET)

1. Download our template: `dotnet add template xxx'.
2. Create a new project from it `dotnet new relaxed"
3. Open `ClientApp/Home/Home.ts` and look at the 

# Views

The data in views is delivered both from the viewModel and from a context sensitive perspective.

As described under the ViewModel section, each view model has a `data` property which is used to expose view data. It's typically the information that you have fetched from the backend (with or without modifications made in the view model).
That data is used to show information.

However, sometimes you need to control how the information is displayed and that's done with the help of properties in the view model.

But let's start with the view data. You might have fetched information abou the user:

```javascript
export interface User {
    id: string;
    name: string;
    hobbies: string[];
}

@ContainerService(), @Routed("/users/:id")
export class UserViewModel implements IViewModel<User>, ICanActivate
{
    constructor(private httpClient: IHttpClient) {

    }

    data: User;

    async activate(): Promise<void> {
        this.data = await this.httpClient.get("/api/user/:id")
    }
}
```

And the corresponding view:

```html
<div>
    <dl>
        <dt>Name</dt>
        <dd>{{name}}</dd>

        <dt>Id</dt>
        <dd>{{id}}</dd>

        <dt>Hobbies</dt>
        <dd>{{hobbies:commaseperated}}</dt>
    </dl>
</div>
```

As you see. Everything from the data property is always bound directly to the view. However, as it typically only should contain pure data you need to use the View Model to control if something should be shown or not. 

so let's say that you want to display the hobbies only sometimes. Do do that you need to add a directive to the View Model.

```javascript
@ContainerService(), @Routed("/users/:id")
export class UserViewModel implements IViewModel<User>, ICanActivate
{
    constructor(private httpClient: IHttpClient) {

    }

    data: User;

    async activate(): Promise<void> {
        this.data = await this.httpClient.get("/api/user/:id")
    }

    canShowHobbies: boolean = false;
}
```

To use that field, you need to bind it through the view model:

```html
<div>
    <dl>
        <dt>Name</dt>
        <dd>{{name}}</dd>

        <dt>Id</dt>
        <dd>{{id}}</dd>


        <dt yo-if="vm.canShowHobbies">Hobbies</dt>
        <dd yo-if="vm.canShowHobbies">{{hobbies:commaseperated}}</dt>
    </dl>
</div>
```
