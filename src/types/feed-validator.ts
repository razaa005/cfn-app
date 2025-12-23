export interface FeedValidationResult {
  valid: boolean;
  errors: string[];
}

export interface FeedValidator {
  /**
   * Validate a feed string (RSS XML or JSON Feed).
   * @param feed - The feed content as a string
   * @returns FeedValidationResult with validity and error details
   */
  validate(feed: string): FeedValidationResult;
}
