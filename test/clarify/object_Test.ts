import {} from "jasmine";

import clarify from "../../src";
import { compare, createDescriptors, createObject, Descriptors, ELevelType, ICompoundDescriptor } from "../utils/descriptors/index";

describe("Clarifying simple objects", () => {
    let copy: object;
    let descriptor: ICompoundDescriptor;

    beforeEach(() => {
        descriptor = null;
        copy = null;
    });

    it("serializes flat enumerable object", () => {
        // Arrange
        descriptor = createDescriptors(1, ELevelType.ENUMERABLE);

        // Act & Assert
        test(descriptor);
    });

    it("serializes flat non-enumerable object", () => {
        // Arrange
        descriptor = createDescriptors(1, ELevelType.NON_ENUMERABLE);

        // Act & Assert
        test(descriptor);
    });

    it("serializes flat, mixed object", () => {
        // Arrange
        descriptor = createDescriptors(1, ELevelType.MIXED);

        // Act & Assert
        test(descriptor);
    });

    it("serializes 2-level, enumerable object", () => {
        // Arrange
        descriptor = createDescriptors(2, ELevelType.ENUMERABLE);

        // Act & Assert
        test(descriptor);
    });

    it("serializes 2-level, non-enumerable object", () => {
        // Arrange
        descriptor = createDescriptors(2, ELevelType.NON_ENUMERABLE);

        // Act & Assert
        test(descriptor);
    });

    it("serializes 2-level, mixed object", () => {
        // Arrange
        descriptor = createDescriptors(2, ELevelType.MIXED);

        // Act & Assert
        test(descriptor);
    });

    it("serializes 3-level, mixed object", () => {
        // Arrange
        descriptor = createDescriptors(3, ELevelType.MIXED);

        // Act & Assert
        test(descriptor);
    });

});

/**
 * Create object from descriptors, serialize2 it, and verify the contents of the serialize2d object
 *
 * @param descriptor - The descriptors defining the object to serialize2
 */
function test(descriptor: ICompoundDescriptor) {
    // Create object
    const obj = createObject(descriptor);

    // Create clone
    const copy = clarify(obj);

    // Ensure all necessary properties were copied
    compare(copy, descriptor.value);
}
