describe("CommandMapper", function() {
    var mapper,
        trigger,
        command;

    beforeEach(function() {
        trigger = {
            addMapping: sinon.spy(),
            removeMapping: sinon.spy()
        };
        mapper = new CommandMapper(trigger);
        command = {};

    });

    it("should be constructed", function() {
        expect(mapper.constructor).toBe(CommandMapper);
    });

    describe("toCommand", function() {
        it("should register mapping config with trigger", function() {
            var config = mapper.toCommand(command);
            expect(trigger.addMapping).toHaveBeenCalledWith(config)
        });

        it("should unregister old config when mapping a new config", function() {
            var oldConfig = mapper.toCommand(command);

            mapper.toCommand(command);

            expect(trigger.removeMapping).toHaveBeenCalledWith(oldConfig)
        })
    })
});