/**
 * TODO: Documentation
 * TODO: Add functions as option
 * @param target
 */
export default function simplify(target: any) {
    const type = typeof(target);

    // Object
    if (type === "object") {
        // Get all the properties
        const descriptors = {};
        const props = getProperties(target);
        props.map(prop => {
            descriptors[prop] = {
                enumerable: true,
                writable: true,
                configurable: true,
                value: simplify(target[prop]),
            };
        });

        return Object.defineProperties({}, descriptors);
    }
    // Function
    else if (type === "function") {
        throw new Error("Target is a function");
    }
    // Primitive type
    else {
        return target;
    }
}

function getProperties(target: object): string[] {
    if (typeof(target) !== "object") {
        throw new Error("Target was not a object and had no properties");
    }

    const props = [];
    let curr = target;

    while (curr) {
        Object.getOwnPropertyNames(curr).map(prop => {
            /************ No Functions ******** No Duplicates *************/
            if (typeof(target[prop]) !== "function" && props.indexOf(prop) === -1) {
                props.push(prop);
            }
        });

        curr = Object.getPrototypeOf(curr);
    }

    return props;
}
