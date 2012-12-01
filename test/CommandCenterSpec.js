describe("CommandCenter", function() {
    var commandCenter,
        trigger = "COMMAND_TRIGGER";

    beforeEach(function() {
        commandCenter = new CommandCenter();
    });

    it("should be able to be constructed", function() {
        expect(commandCenter).toBeDefined();
    });

    describe("map", function() {
        it("should create mapper", function() {
            expect(commandCenter.map(trigger).constructor).toBe(CommandMapper);
        });

        it("should return existing mapper when given identical trigger", function() {
            var mapper = commandCenter.map(trigger);
            expect(commandCenter.map(trigger)).toBe(mapper);
        });
    });

    describe("unmap", function() {
        it("should return unmapper", function() {
            var mapper = commandCenter.map(trigger);
            expect(commandCenter.unmap(trigger)).toBe(mapper);
        });

        it("should politely return a 'null' unmapper", function() {
            expect(commandCenter.unmap(trigger).fromAll).toBeDefined();
        })
    });
});