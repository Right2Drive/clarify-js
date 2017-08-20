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
