import {} from "jasmine";
import { addProtoChain, CompoundDescriptor, createDescriptors, Descriptor, Descriptors, ELevelType, test } from "../utils/descriptors/index";

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

        fit("serializes depth 1", () => {
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
    }
}
