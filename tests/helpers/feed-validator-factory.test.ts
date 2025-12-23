import { FeedValidatorFactory } from "../../src/helpers/feed-validator-factory";
import { Rss2Validator } from "../../src/validators/feeds/rss2-validator";
import { JsonFeedValidator } from "../../src/validators/feeds/jsonfeed-validator";

describe("FeedValidatorFactory", () => {
    it("returns the correct validator instance for known names", () => {
        const rss = FeedValidatorFactory.getValidator("rss2-validator");
        const json = FeedValidatorFactory.getValidator("json-feedvalidator");
        expect(rss).toBeInstanceOf(Rss2Validator);
        expect(json).toBeInstanceOf(JsonFeedValidator);
    });

    it("returns undefined for unknown validator name", () => {
        expect(FeedValidatorFactory.getValidator("unknown")).toBeUndefined();
    });

    it("lists all available validator names", () => {
        const names = FeedValidatorFactory.getAvailableValidatorNames();
        expect(names).toContain("rss2-validator");
        expect(names).toContain("json-feedvalidator");
        expect(names.length).toBe(2);
    });

    it("returns the same instance for repeated calls", () => {
        const v1 = FeedValidatorFactory.getValidator("rss2-validator");
        const v2 = FeedValidatorFactory.getValidator("rss2-validator");
        expect(v1).toBe(v2);
    });
});
