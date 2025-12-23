import { FeedValidator, FeedValidationResult } from "../../types/feed-validator";
import { XMLParser } from "fast-xml-parser";

export class Rss2Validator implements FeedValidator {
  validate(feed: string): FeedValidationResult {
    const errors: string[] = [];
    let valid = true;
    let parsed: any;

    // Parse XML
    try {
      const parser = new XMLParser({ ignoreAttributes: false });
      parsed = parser.parse(feed);
    } catch (e: any) {
      errors.push("Feed is not valid XML: " + e.message);
      return { valid: false, errors };
    }

    // Check root element
    if (!parsed.rss) {
      errors.push("Root element <rss> not found.");
      valid = false;
    } else {
      // Check version attribute
      const version = parsed.rss["@_version"] || parsed.rss.version;
      if (version !== "2.0") {
        errors.push("<rss> version attribute must be '2.0'.");
        valid = false;
      }
      // Check for <channel>
      if (!parsed.rss.channel) {
        errors.push("<channel> element not found inside <rss>.");
        valid = false;
      } else {
        // Check required channel fields
        const channel = parsed.rss.channel;
        if (!channel.title) {
          errors.push("<channel> missing required <title> element.");
          valid = false;
        }
        if (!channel.link) {
          errors.push("<channel> missing required <link> element.");
          valid = false;
        }
        if (!channel.description) {
          errors.push("<channel> missing required <description> element.");
          valid = false;
        }
        // Check for at least one <item>
        if (!channel.item) {
          errors.push("<channel> must contain at least one <item> element.");
          valid = false;
        }
      }
    }

    return { valid, errors };
  }
}
