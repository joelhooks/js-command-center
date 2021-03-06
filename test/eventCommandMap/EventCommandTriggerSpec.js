describe("EventCommandTrigger", function() {
    "use strict";
    var trigger,
        NullCommand,
        dispatcher;

    beforeEach(function() {
        dispatcher = {
            addEventListener:sinon.spy(),
            removeEventListener:sinon.spy()
        };

        trigger = new jscc.EventCommandTrigger({}, dispatcher, "TYPE");

        NullCommand = function NullCommand(){};
        NullCommand.prototype.execute = function(params) {};
    });

    it("should be constructed", function() {
        expect(trigger.constructor).toBe(jscc.EventCommandTrigger);
    });

    describe("addMapping", function() {
        it("should throw an error when given an invalid command", function() {
            expect(function() {
                //Jasmine needs it in an anon function
                //@see http://stackoverflow.com/q/4144686/87002
                trigger.addMapping(new jscc.CommandMapping(Object));
            }).toThrow("No execute() method on CommandMapping");
        });

        it("should add a listener with the first mapping", function() {
            trigger.addMapping(new jscc.CommandMapping(NullCommand));
            expect(dispatcher.addEventListener).toHaveBeenCalledOnce();
        });

        it("should ONLY add a listener with the first mapping", function() {
            trigger.addMapping(new jscc.CommandMapping(NullCommand));
            trigger.addMapping(new jscc.CommandMapping(NullCommand));
            expect(dispatcher.addEventListener).toHaveBeenCalledOnce();
        });
    });

    describe("removeMapping", function() {
        it("should remove listener when last mapping is removed", function() {
            var mapping = new jscc.CommandMapping(NullCommand);
            trigger.addMapping(mapping);

            trigger.removeMapping(mapping);

            expect(dispatcher.removeEventListener).toHaveBeenCalledOnce();
        });

        it("should NOT remove the listener when other mappings still exist", function() {
            var mapping = new jscc.CommandMapping(NullCommand);
            trigger.addMapping(mapping);
            trigger.addMapping(new jscc.CommandMapping(NullCommand));
            trigger.removeMapping(mapping);

            expect(dispatcher.removeEventListener).not.toHaveBeenCalled();
        });
    });
});