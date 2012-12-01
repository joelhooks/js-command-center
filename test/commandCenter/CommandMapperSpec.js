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
        command2 = {};

    });

    it("should be constructed", function() {
        expect(mapper.constructor).toBe(CommandMapper);
    });

    describe("toCommand", function() {
        it("should register mapping config with trigger", function() {
            var config = mapper.toCommand(command);
            expect(trigger.addMapping).toHaveBeenCalledWith(config);
        });

        it("should unregister old config when mapping a new config", function() {
            var oldConfig = mapper.toCommand(command),
                newConfig = mapper.toCommand(command);

            expect(trigger.removeMapping).toHaveBeenCalledWith(oldConfig);
            expect(trigger.addMapping).toHaveBeenCalledWith(newConfig);
        });
    });

    describe("fromCommand", function() {
        it("should remove mapping from trigger", function() {
            var oldConfig = mapper.toCommand(command);

            mapper.fromCommand(command);

            expect(trigger.removeMapping).toHaveBeenCalledWith(oldConfig);
        });

        it("should only remove specified config from trigger", function() {
            var config1 = mapper.toCommand(command),
                config2 = mapper.toCommand(command2);

            mapper.fromCommand(command);

            expect(trigger.removeMapping).toHaveBeenCalledWith(config1);
            expect(trigger.removeMapping).not.toHaveBeenCalledWith(config2);
        });
    });

    describe("fromAll", function() {
        it("removes ALL mapping configs from trigger", function() {
            var config1 = mapper.toCommand(command),
                config2 = mapper.toCommand(command2);

            mapper.fromAll();

            expect(trigger.removeMapping).toHaveBeenCalledWith(config1);
            expect(trigger.removeMapping).toHaveBeenCalledWith(config2);
        });
    });
});