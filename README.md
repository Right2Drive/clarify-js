[![Build Status](https://travis-ci.org/Right2Drive/clarify-js.svg?branch=master)](https://travis-ci.org/Right2Drive/clarify-js)

# Clarify

`clarify-js` is a small utility library with the intent of simplifying and/or serializing javascript objects. We all know about `JSON.stringify`, but if any of us have ever tried serializing an `Error` object, we know it doesn't always work how we might expect. 

`JSON.stringify` has two core properties that sometimes make it hard to cache our javascript objects:
- It does not serialize properties on the prototype
- It will not serialize properties that are non-enumerable

Now hopefully you will go your entire career without needing `clarify-js`, as most of the time the objects you are serializing are fully in your control. In the event that you're working with a package or library that generates these difficult to work with objects, it's this simple:

```
import clarify from "clarify-js";

const simplifiedObject = clarify(nonEnumerableObject);
const json = JSON.stringify(simplifiedObject);
```

**OR**

```
import { serialize } from "clarify-js";

const json = serialize(nonEnumerableObject);
```

For those of you not using `import`:

```
const clarify = require("clarify-js").default;

const simplifiedObject = clarify(nonEnumerableObject);
```
