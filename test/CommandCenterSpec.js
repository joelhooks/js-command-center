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
        xit("should create mapper", function() {
            console.log(commandCenter.constructor === CommandCenter);
            expect(commandCenter.map(trigger)).toEqual({});
        });

        xit("should return existing mapper when given identical trigger", function() {
            var mapper = commandCenter.map(trigger);
            expect(commandCenter.map(trigger)).toBe(mapper);
        })
    })
});