export interface FeedConfigFeed {
  topicId: string;
}

export interface FeedConfig {
  feeds: Record<string, FeedConfigFeed>;
}
