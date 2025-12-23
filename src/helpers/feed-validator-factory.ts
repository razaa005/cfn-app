import { FeedValidator } from "../types/feed-validator";
import { Rss2Validator } from "../validators/feeds/rss2-validator";
import { JsonFeedValidator } from "../validators/feeds/jsonfeed-validator";

export class FeedValidatorFactory {
  private static validators: { [name: string]: FeedValidator } = {
    "rss2-validator": new Rss2Validator(),
    "json-feedvalidator": new JsonFeedValidator(),
  };

  /**
   * Retrieve a named FeedValidator implementation.
   * @param name The name of the validator (e.g. 'rss2-validator', 'json-feedvalidator')
   * @returns FeedValidator instance or undefined if not found
   */
  static getValidator(name: string): FeedValidator | undefined {
    return this.validators[name];
  }

  /**
   * List all available validator names
   */
  static getAvailableValidatorNames(): string[] {
    return Object.keys(this.validators);
  }
}
