import {} from "jasmine";
import { addProtoChain, CompoundDescriptor, createDescriptors, createObject, Descriptor, Descriptors, ELevelType, test } from "../utils/descriptors/index";

describe("Prototype chain object", () => {
    let descriptor: CompoundDescriptor;
    let targets: CompoundDescriptor[];

    beforeEach(() => {
        descriptor = createDescriptors(3, ELevelType.MIXED);
        targets = [];
    });

    describe("containing single chain", () => {

        beforeEach(() => {
            targets.push(descriptor);
        });

        it("serializes depth 1", () => {
            targets.map(addPrototype(1));

            test(descriptor);
        });

        it("serializes depth 2", () => {
            targets.map(addPrototype(2));

            test(descriptor);
        });
    });

    describe("containing 2 chains", () => {

        beforeEach(() => {
            targets.push(descriptor, findFirstCompound(descriptor));
        });

        it("serializes depth 1", () => {
            targets.map(addPrototype(1));

            test(descriptor);
        });

        it("serializes depth 2", () => {
            targets.map(addPrototype(2));

            test(descriptor);
        });
    });

    describe("containing 3 chains", () => {

        beforeEach(() => {
            const intermediate = findFirstCompound(descriptor);
            targets.push(descriptor, intermediate, findFirstCompound(intermediate));
        });

        it("serializes depth 1", () => {
            targets.map(addPrototype(1));

            test(descriptor);
        });

        it("serializes depth 2", () => {
            targets.map(addPrototype(2));

            test(descriptor);
        });
    });

    it("clarification should ignore duplicate properties on prototype", () => {
        // Setup descriptors
        const proto = createDescriptors(2, ELevelType.MIXED);
        const descriptor = createDescriptors(2, ELevelType.MIXED, proto);
        proto.value.map(levelZero => {
            if (levelZero.compound) {
                levelZero.value.map(levelOne => {
                    levelOne.name += "altered";
                });
            }
        });

        // Create object
        const copy = createObject(descriptor);

        // Validate copy
        Object.getOwnPropertyNames(copy["level_1"]).map(name => {
            expect(name).not.toContain("altered");
        });
    });
});

function findFirstCompound(compound: CompoundDescriptor) {
    let find: CompoundDescriptor = null;
    compound.value.some(descriptor => {
        if (descriptor.compound) {
            find = descriptor;

            return true;
        }

        return false;
    });

    return find;
}

function addPrototype(depth: number) {
    return function(descriptor: CompoundDescriptor) {
        addProtoChain(descriptor, depth, 2, ELevelType.MIXED);
    };
}
