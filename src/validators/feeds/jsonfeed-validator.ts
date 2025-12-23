import { FeedValidator, FeedValidationResult } from "../../types/feed-validator";

export class JsonFeedValidator implements FeedValidator {
  validate(feed: string): FeedValidationResult {
    const errors: string[] = [];
    let valid = true;
    let parsed: any;

    // Parse JSON
    try {
      parsed = JSON.parse(feed);
    } catch (e: any) {
      errors.push("Feed is not valid JSON: " + e.message);
      return { valid: false, errors };
    }

    // Check version
    if (parsed.version !== "https://jsonfeed.org/version/1.1") {
      errors.push("version must be 'https://jsonfeed.org/version/1.1'.");
      valid = false;
    }

    // Required top-level fields
    if (!parsed.title) {
      errors.push("Missing required 'title' field.");
      valid = false;
    }
    if (!Array.isArray(parsed.items)) {
      errors.push("'items' must be an array.");
      valid = false;
    } else if (parsed.items.length === 0) {
      errors.push("'items' array must contain at least one item.");
      valid = false;
    }

    // Validate each item
    if (Array.isArray(parsed.items)) {
      parsed.items.forEach((item: any, idx: number) => {
        if (!item.id) {
          errors.push(`Item at index ${idx} is missing required 'id' field.`);
          valid = false;
        }
        if (!item.title && !item.content_text && !item.content_html) {
          errors.push(`Item at index ${idx} must have at least one of 'title', 'content_text', or 'content_html'.`);
          valid = false;
        }
      });
    }

    return { valid, errors };
  }
}
