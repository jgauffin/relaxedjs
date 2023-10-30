Components
===========

Components are used to create a specific part of a page. It can be a list of users, a forum post form or any other type of interaction with the user.
Components should not consist of a complete page, but just focus on allowing the user to do a specific thing.

For complete pages, use the [Page](./Page.md) class instead. You can also read the [Page vs Component](./Page-vs-component.md) article to learn the difference.

By using components, you get small well defined user interactions that can be reusable.




## Component templates

Templates can be used to customize the component structure by defining special tags in the HTML. 
The content of the template tag is used 


It consists of a collection of tags that the component can use during rendering.

### Template usage

Let's say that you have a AddUserComponent that you want to display in a modal. You can do that by doing the following:

```html
<h1>List users</h1>

<table>
    <!-- A user list -->
</table>
<button name="showAddUser"></button>

<modal name="addUser">
    <title>First name</title>
    <body>
        <user-add>
    </body>

</modal>
``` 

The modal component have defined three different sections, `title`, `body` and `buttons`. In this case, we just want to put the `AddUserComponent` within the body of the modal.
Most components have default values for the different parts which are used if the overrides are not defined.

### Template definition

```html
<div class="modal">
    <div class="header" templateName="header"></div>
    <div templateName="body"></div>
</div>>
```