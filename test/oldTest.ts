enum ELevelType {
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

interface ICompoundDescriptor extends IDescriptor {
    compound: true;
    value: Descriptor[];
}

type Descriptor = ISimpleDescriptor | ICompoundDescriptor;
type Descriptors = Descriptor[];

fdescribe("Serialize2", () => {
    let copy: object;
    let descriptors: Descriptors;

    beforeEach(() => {
        descriptors = null;
        copy = null;
    });

    it("Serializes flat enumerable object", () => {
        // Arrange
        descriptors = createDescriptors(1, ELevelType.ENUMERABLE);

        // Act & Assert
        test(descriptors);
    });

    it("Serializes flat non-enumerable object", () => {
        // Arrange
        descriptors = createDescriptors(1, ELevelType.NON_ENUMERABLE);

        // Act & Assert
        test(descriptors);
    });

    it("Serializes flat, mixed object", () => {
        // Arrange
        descriptors = createDescriptors(1, ELevelType.MIXED);

        // Act & Assert
        test(descriptors);
    });

    // TODO: Finish prototype tests
    it("Serializes flat, mixed object with prototype chain", () => {
        fail();
    });

    // TODO: Finish proxy tests
    it("Serializes flat, mixed proxy", () => {
        fail();
    });

    it("Serializes 2-level, enumerable object", () => {
        // Arrange
        descriptors = createDescriptors(2, ELevelType.ENUMERABLE);

        // Act & Assert
        test(descriptors);
    });

    it("Serializes 2-level, non-enumerable object", () => {
        // Arrange
        descriptors = createDescriptors(2, ELevelType.NON_ENUMERABLE);

        // Act & Assert
        test(descriptors);
    });

    it("Serializes 2-level, mixed object", () => {
        // Arrange
        descriptors = createDescriptors(2, ELevelType.MIXED);

        // Act & Assert
        test(descriptors);
    });

    it("Serializes 3-level, mixed object", () => {
        // Arrange
        descriptors = createDescriptors(3, ELevelType.MIXED);

        // Act & Assert
        test(descriptors);
    });

});

/**
 * Create object from descriptors, serialize2 it, and verify the contents of the serialize2d object
 *
 * @param descriptors - The descriptors defining the object to serialize2
 */
function test(descriptors: Descriptors) {
    // Create object
    const obj = _createObject(descriptors);

    // Create clone
    const copy = serialize(obj);

    // Ensure all necessary properties were copied
    _compare(copy, descriptors);
}

/**
 * Create the descriptors to define object creation
 *
 * @param levels - Number of levels to create
 * @param type - Type of descriptors (mixed/enumerable/non-enumerable)
 */
function createDescriptors(levels: number, type: ELevelType) {
    let asciiLetter = "A".charCodeAt(0);
    const getName = String.fromCharCode;
    let descriptors;

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
            _addCompoundProp(descriptors, `level_${i}`, level);
        }
    }

    return descriptors;
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
    }];
}

function _addCompoundProp(descriptors: Descriptors, name: string, nestedDescriptors: Descriptors) {
    Object.defineProperty(descriptors, name, {
        enumerable: true,
        value: nestedDescriptors,
    });

    return descriptors;
}

function _createObject(descriptors: Descriptors) {
    const obj = {};
    descriptors.map(descriptor => {
        Object.defineProperty(obj, descriptor.name, {
            enumerable: descriptor.enumerable,
            value: _descriptorIsCompound(descriptor) ? _createObject(descriptor.value) : descriptor.value,
        });
    });

    return obj;
}

function _compare(copy: object, descriptors: Descriptors) {
    descriptors.map(descriptor => {
        if (_descriptorIsCompound(descriptor)) {
            // If compound, go deeper
            expect(copy[descriptor.name]).toBeTruthy();
            _compare(copy[descriptor.name], descriptor.value);
        } else if (typeof(descriptor.value) === "function") {
            // If function, should not exist
            expect(copy[descriptor.name]).toBeFalsy();
        } else {
            // If primitive,
            expect(copy[descriptor.name]).toBeTruthy();
            expect(copy[descriptor.name]).toBe(descriptor.value);
        }
    });
}

function _descriptorIsCompound(property: Descriptor): property is ICompoundDescriptor {
    return (property.compound);
}
