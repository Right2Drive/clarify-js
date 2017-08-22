import {} from "jasmine";

import { compare, CompoundDescriptor, createDescriptors, createObject, Descriptors, ELevelType, test } from "../utils/descriptors/index";

describe("Clarifying simple objects", () => {
    let descriptor: CompoundDescriptor;

    beforeEach(() => {
        descriptor = null;
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
