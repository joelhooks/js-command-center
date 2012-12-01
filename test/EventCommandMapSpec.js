describe("EventCommandMap", function() {
    var commandMap,
        dispatcher,
        injector,
        mapper,
        EVENT_ONE = "EVENT_ONE",
        EVENT_TWO = "EVENT_TWO";

    beforeEach(function() {
        dispatcher = {
            addEventListener:sinon.spy(),
            removeEventListener:sinon.spy()
        };
        injector = {};
        commandMap = new EventCommandMap(injector, dispatcher, new CommandCenter());
    });

    it("should be instantiated", function() {
        expect(commandMap.constructor).toBe(EventCommandMap);
    });

    describe("map", function() {
        it("should create mapper", function() {
            mapper = commandMap.map(EVENT_ONE);
            expect(mapper.constructor).toBe(CommandMapper);
        });

        it("should return same mapper when given identical event type", function() {
            mapper = commandMap.map(EVENT_ONE);
            expect(commandMap.map(EVENT_ONE)).toBe(mapper);
        });

        it("should return different mappers for different types", function() {
            mapper = commandMap.map(EVENT_ONE);
            expect(commandMap.map(EVENT_TWO)).not.toBe(mapper);
        })
    })
});