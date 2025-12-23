import { JsonFeedValidator } from "../src/validators/feeds/jsonfeed-validator";

describe("JsonFeedValidator", () => {
  let validator: JsonFeedValidator;

  beforeEach(() => {
    validator = new JsonFeedValidator();
  });

  it("should validate a minimal valid JSON Feed v1.1", () => {
    const feed = JSON.stringify({
      version: "https://jsonfeed.org/version/1.1",
      title: "Test Feed",
      items: [
        { id: "1", title: "Item 1", content_text: "Hello" }
      ]
    });
    const result = validator.validate(feed);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("should fail if not valid JSON", () => {
    const feed = "{ this is not json }";
    const result = validator.validate(feed);
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toMatch(/Feed is not valid JSON/);
  });

  it("should fail if version is missing or wrong", () => {
    const feed = JSON.stringify({ title: "Feed", items: [{ id: "1", content_text: "hi" }] });
    const result = validator.validate(feed);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("version must be 'https://jsonfeed.org/version/1.1'.");
  });

  it("should fail if title is missing", () => {
    const feed = JSON.stringify({
      version: "https://jsonfeed.org/version/1.1",
      items: [{ id: "1", content_text: "hi" }]
    });
    const result = validator.validate(feed);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Missing required 'title' field.");
  });

  it("should fail if items is not an array", () => {
    const feed = JSON.stringify({
      version: "https://jsonfeed.org/version/1.1",
      title: "Feed",
      items: "not-an-array"
    });
    const result = validator.validate(feed);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("'items' must be an array.");
  });

  it("should fail if items array is empty", () => {
    const feed = JSON.stringify({
      version: "https://jsonfeed.org/version/1.1",
      title: "Feed",
      items: []
    });
    const result = validator.validate(feed);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("'items' array must contain at least one item.");
  });

  it("should fail if an item is missing id", () => {
    const feed = JSON.stringify({
      version: "https://jsonfeed.org/version/1.1",
      title: "Feed",
      items: [{ title: "No ID", content_text: "hi" }]
    });
    const result = validator.validate(feed);
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toMatch(/Item at index 0 is missing required 'id' field/);
  });

  it("should fail if an item is missing all of title, content_text, and content_html", () => {
    const feed = JSON.stringify({
      version: "https://jsonfeed.org/version/1.1",
      title: "Feed",
      items: [{ id: "1" }]
    });
    const result = validator.validate(feed);
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toMatch(/must have at least one of 'title', 'content_text', or 'content_html'/);
  });

  it("should allow items with content_html instead of content_text", () => {
    const feed = JSON.stringify({
      version: "https://jsonfeed.org/version/1.1",
      title: "Feed",
      items: [{ id: "1", content_html: "<p>hi</p>" }]
    });
    const result = validator.validate(feed);
    expect(result.valid).toBe(true);
  });
});
