import { AppConfigLoader, AppConfig } from "../../src/helpers/feed-config-loader";
import fs from "fs";
import path from "path";

describe("AppConfigLoader", () => {
    const fakeFeedConfig = { foo: "bar" };
    const fakePartnerConfig = { partners: ["p1"] };
    const fakeTemplateConfig = { templates: ["t1"] };
    const feedPath = "/tmp/feed.json";
    const partnerPath = "/tmp/partner.json";
    const templatePath = "/tmp/template.json";

    beforeEach(() => {
        jest.spyOn(fs, "readFileSync").mockImplementation((file) => {
            if (file === feedPath) return JSON.stringify(fakeFeedConfig);
            if (file === partnerPath) return JSON.stringify(fakePartnerConfig);
            if (file === templatePath) return JSON.stringify(fakeTemplateConfig);
            throw new Error("File not found");
        });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("loads all configs from provided paths", () => {
        const loader = new AppConfigLoader(feedPath, partnerPath, templatePath);
        const config = loader.load();
        expect(config.feedConfig).toEqual(fakeFeedConfig);
        expect(config.partnerConfig).toEqual(fakePartnerConfig);
        expect(config.templateConfig).toEqual(fakeTemplateConfig);
    });

    it("throws if a config file is missing", () => {
        jest.spyOn(fs, "readFileSync").mockImplementation(() => { throw new Error("fail"); });
        const loader = new AppConfigLoader(feedPath, partnerPath, templatePath);
        expect(() => loader.load()).toThrow(/Could not load app config/);
    });

    it("returns cached config from getConfig if already loaded", () => {
        const loader = new AppConfigLoader(feedPath, partnerPath, templatePath);
        const config1 = loader.load();
        const config2 = loader.getConfig();
        expect(config2).toBe(config1);
    });

    it("calls load from getConfig if not loaded", () => {
        const loader = new AppConfigLoader(feedPath, partnerPath, templatePath);
        const spy = jest.spyOn(loader, "load");
        loader.getConfig();
        expect(spy).toHaveBeenCalled();
    });

    it("refresh always reloads config", () => {
        const loader = new AppConfigLoader(feedPath, partnerPath, templatePath);
        const spy = jest.spyOn(loader, "load");
        loader.refresh();
        expect(spy).toHaveBeenCalled();
    });

    it("uses default paths if none provided", () => {
        const joinSpy = jest.spyOn(path, "join");
        // We don't care about actual file reads here
        jest.spyOn(fs, "readFileSync").mockReturnValue("{}" as any);
        new AppConfigLoader();
        expect(joinSpy).toHaveBeenCalledWith(expect.any(String), expect.stringContaining("feed-config.json"));
        expect(joinSpy).toHaveBeenCalledWith(expect.any(String), expect.stringContaining("partner-config.json"));
        expect(joinSpy).toHaveBeenCalledWith(expect.any(String), expect.stringContaining("template-config.json"));
    });
});
