Views
=======

Views are plain html with special tags. Our custom tags can be used since no HTML are added to the DOM before it has been parsed and converted to valid HTML.

## View compilation

Views are compiled into HTML using the following sequence:


1. The view is parsed and converted into objects, one per HTML node, by the ViewBuilder.
2. The view