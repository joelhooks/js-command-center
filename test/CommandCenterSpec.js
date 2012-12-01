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
            expect(commandCenter.map(trigger)).toEqual({});
        })
    })
});