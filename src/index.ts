/**
 * TODO: Documentation
 * TODO: Add functions as option
 * @param target
 */
export default function clarify(target: object) {

    // Object
    if (isObject(target)) {
        // Get all the properties
        const descriptors = {};
        const props = getProperties(target);
        props.map(prop => {
            descriptors[prop] = {
                enumerable: true,
                writable: true,
                configurable: true,
                value: clarify(target[prop]),
            };
        });

        return Object.defineProperties({}, descriptors);
    }
    // Function
    else if (isFunction(target)) {
        throw new Error("Target is a function");
    }
    // Primitive type (or array)
    else {
        return target;
    }
}

export function serialize(target: object) {
    return JSON.stringify(clarify(target));
}

function getProperties(target: object): string[] {
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

function isArray(target: any) {
    return Array.isArray(target);
}

function isObject(target: any) {
    return ((typeof(target) === "object") && !isArray(target));
}

function isFunction(target: any) {
    return (typeof(target) === "function");
}
