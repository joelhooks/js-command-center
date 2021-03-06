describe("CommandMapping", function() {
    "use strict";
    var mapping,
        commandConstructor;

    beforeEach(function() {
        commandConstructor = {};
        mapping = new jscc.CommandMapping(commandConstructor);
    });

    it("should be instantiated", function() {
       expect(mapping.constructor).toBe(jscc.CommandMapping);
    });

    it("should store command constructor", function() {
        expect(mapping.commandConstructor).toBe(commandConstructor);
    });

    describe("once", function() {
        it("should store fireOnce as true when called with no args", function () {
            mapping.once();
            expect(mapping.fireOnce).toBe(true);
        });

        it("should store fireOnce as false when called with false", function() {
            mapping.once(false);
            expect(mapping.fireOnce).toBe(false);
        });
    });
});