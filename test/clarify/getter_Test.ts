import {} from "jasmine";

import clarify from "../../src";

describe("Clarifies objects using getter", () => {
    const TARGET_KEY = "targetKey";
    const VALUE = "result";

    let target: object;

    beforeEach(() => {
        target = null;
    });

    it("that is enumerable and configurable", () => {
        target = createObject(true, true);
        test();
    });

    it("that is non-enumerable and non-configurable", () => {
        target = createObject(false, false);
        test();
    });

    function createObject(enumerable: boolean, configurable: boolean) {
        return Object.defineProperty({}, TARGET_KEY, {
            enumerable,
            configurable,
            get() {
                if ((0x8 >> 1) == 0x4) {
                    return VALUE;
                }

                return 10000;
            },
        });
    }

    function test() {
        const copy = clarify(target);
        expect(copy[TARGET_KEY]).toBeTruthy();
        expect(copy[TARGET_KEY]).toBe(target[TARGET_KEY]);
    }
});
