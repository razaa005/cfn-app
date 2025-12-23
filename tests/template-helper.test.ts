import { TemplateHelper } from "../src/helpers/template-helper";
import { TemplateEngine } from "../src/types/template-engine";
import fs from "fs";
import path from "path";

describe("TemplateHelper", () => {
    let mockEngine: TemplateEngine;
    let helper: TemplateHelper;
    let compileMock: jest.Mock;
    const fakeTemplatePath = "/tmp/fake-template.hbs";
    const fakeTemplateContent = "Hello {{topic.title}}!";
    const fakeCompiled = jest.fn(() => "rendered");

    beforeEach(() => {
        compileMock = jest.fn(() => fakeCompiled);
        mockEngine = { compile: compileMock };
        helper = new TemplateHelper(mockEngine);
        jest.spyOn(fs, "existsSync").mockImplementation((p) => p === fakeTemplatePath);
        jest.spyOn(fs, "readFileSync").mockImplementation((p) => {
            if (p === fakeTemplatePath) return fakeTemplateContent;
            throw new Error("File not found");
        });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("calls compile and renders with correct context", () => {
        const topic = { title: "News" } as any;
        const contentSummaries = { items: [] } as any;
        const articleRequest = { foo: "bar" };
        const result = helper.applyTemplate(fakeTemplatePath, topic, contentSummaries, articleRequest);
        expect(fs.existsSync).toHaveBeenCalledWith(fakeTemplatePath);
        expect(fs.readFileSync).toHaveBeenCalledWith(fakeTemplatePath, "utf8");
        expect(compileMock).toHaveBeenCalledWith(fakeTemplateContent);
        expect(fakeCompiled).toHaveBeenCalledWith({ topic, contentSummaries, articleRequest, now: expect.any(String) });
        expect(result).toBe("rendered");
    });

    it("throws if template file does not exist", () => {
        jest.spyOn(fs, "existsSync").mockReturnValue(false);
        expect(() => helper.applyTemplate("/not/found.hbs", {} as any, {} as any)).toThrow(/Template file not found/);
    });

    it("resolves relative template paths", () => {
        const relPath = "templates/foo.hbs";
        const absPath = path.join(process.cwd(), relPath);
        jest.spyOn(fs, "existsSync").mockImplementation((p) => p === absPath);
        jest.spyOn(fs, "readFileSync").mockImplementation((p) => {
            if (p === absPath) return fakeTemplateContent;
            throw new Error("File not found");
        });
        helper.applyTemplate(relPath, {} as any, {} as any);
        expect(fs.existsSync).toHaveBeenCalledWith(absPath);
        expect(fs.readFileSync).toHaveBeenCalledWith(absPath, "utf8");
    });
});
