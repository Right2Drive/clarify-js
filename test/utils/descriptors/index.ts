import {} from "jasmine";
import clarify from "../../../src/index";

export type Descriptor = ISimpleDescriptor | ICompoundDescriptor;
export type Descriptors = Descriptor[];

export enum ELevelType {
    MIXED = 0x1,
    ENUMERABLE = 0x2,
    NON_ENUMERABLE = 0x4,
}

interface IDescriptor {
    compound: boolean;
    name: string;
    value: any;
    enumerable: boolean;
}

interface ISimpleDescriptor extends IDescriptor {
    compound: false;
    value: any;
}

export interface ICompoundDescriptor extends IDescriptor {
    compound: true;
    proto: ICompoundDescriptor;
    value: Descriptor[];
}

/**
 * Create object from descriptors, serialize2 it, and verify the contents of the serialize2d object
 *
 * @param descriptor - The descriptors defining the object to serialize2
 */
export function test(descriptor: ICompoundDescriptor) {
    // Create object
    const obj = createObject(descriptor);

    // Create clone
    const copy = clarify(obj);

    // Ensure all necessary properties were copied
    compare(copy, descriptor);
}

export function compare(copy: object, descriptor: ICompoundDescriptor) {
    if (descriptor.proto) {
        const copyProto = Object.getPrototypeOf(copy);
        compare(copyProto, descriptor.proto);
    }
    descriptor.value.map(shadowDescriptor => {
        const { name } = shadowDescriptor;
        if (_descriptorIsCompound(shadowDescriptor)) {
            // If compound, go deeper
            expect(copy[name]).toBeTruthy();
            compare(copy[name], shadowDescriptor);
        }
        else if (typeof(shadowDescriptor) === "function") {
            // Functions shouldn't exist
            expect(copy[name]).toBeFalsy();
        }
        else {
            // Primitives should be equal
            expect(copy[name]).toBeTruthy();
            expect(copy[name]).toBe(shadowDescriptor.value);
        }
    });
}

/**
 * TODO: Documentation
 * @param descriptor
 */
export function createObject(descriptor: ICompoundDescriptor) {
    const obj = descriptor.proto ? Object.create(createObject(descriptor.proto)) : {};

    descriptor.value.map(descriptor => {
        // Define property
        Object.defineProperty(obj, descriptor.name, {
            enumerable: descriptor.enumerable,
            value: _descriptorIsCompound(descriptor) ? createObject(descriptor) : descriptor.value,
        });
    });

    return obj;
}

/**
 * Create the descriptors to define object creation
 *
 * @param levels - Number of levels to create
 * @param type - Type of descriptors (mixed/enumerable/non-enumerable)
 */
export function createDescriptors(levels: number, type: ELevelType, proto = null): ICompoundDescriptor {
    let asciiLetter = "A".charCodeAt(0);
    const getName = String.fromCharCode;
    let descriptors;
    let previous;

    for (let i = 0; i < levels; i++) {
        let level;

        switch (type) {
            case ELevelType.ENUMERABLE:
                level = _createSimpleDescriptors(getName(asciiLetter++), i, true);
                break;
            case ELevelType.NON_ENUMERABLE:
                level = _createSimpleDescriptors(getName(asciiLetter++), i, false);
                break;
            case ELevelType.MIXED:
                level = _createMixedDescriptors(getName(asciiLetter++), getName(asciiLetter++), i);
                break;
            default:
                throw new Error(`Unhandled case: ${type}`);
        }

        if (!i) {
            descriptors = level;
        } else {
            _addCompoundProp(previous, `level_${i}`, level);
        }
        previous = level;
    }

    return {
        proto,
        compound: true,
        enumerable: true,
        name: "root",
        value: descriptors,
    };
}

function _createMixedDescriptors(name1: string, name2: string, level: number) {
    return [
        ..._createSimpleDescriptors(name1, 0, true),
        ..._createSimpleDescriptors(name2, 0, false),
    ];
}

function _createSimpleDescriptors(name: string, level: number, enumerable = true): ISimpleDescriptor[] {
    const getName = (postfix: string) => `${name}_enumerable:${enumerable}_level:${level}_${postfix}`;

    return [{
        enumerable,
        name: getName("1"),
        value: 5,
        compound: false,
    }, {
        enumerable,
        name: getName("2"),
        value: "testString",
        compound: false,
    }, {
        enumerable,
        name: getName("3"),
        value: true,
        compound: false,
    }, {
        enumerable,
        name: getName("4"),
        value: () => 8,
        compound: false,
    }, {
        enumerable,
        name: getName("5"),
        value: [ "hello", "world"],
        compound: false,
    }];
}

function _addCompoundProp(descriptors: Descriptors, name: string, nestedDescriptors: Descriptors) {
    Object.defineProperty(descriptors, name, {
        enumerable: true,
        value: nestedDescriptors,
    });

    return descriptors;
}

function _descriptorIsCompound(property: Descriptor): property is ICompoundDescriptor {
    return (property.compound);
}
