View bindings
================

Views have a convention of configuration approach to bindings between the views and the controls. That is, by using the correct naming convention, events are automatically bound between the DOM elements and the component functions.

All bindings pass the event argument (like `MouseEvent`) to the bound component method (as the last argument, or the only one for conventional bindings).

## Binding buttons


The `<button />` element are bind using the button type. Buttons without the `type` attribute are not bound unless they have a `name` attribute, in which case they are bound as regular `input` elements.

Buttons with `type="submit"` are bound to a method called `onSubmit` and buttons with `type="cancel"` are bound to `onCancel`.

### Example

```html
<form>
    <input type="text" name="firstName" placeholder="First name">
    