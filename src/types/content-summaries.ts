export interface ContentSummaryTitle {
  title: string;
  type: string;
}

export interface ContentSummaryLink {
  url: string;
  scheme: string;
  host: string;
  path: string;
}

export interface ContentSummaryDate {
  firstPublished: string;
  lastPublished: string;
  curated: string;
  liveFrom: string | null;
  liveUntil: string | null;
}

export interface ContentSummaryDescription {
  text: string;
  source: string;
}

export interface ContentSummaryImageSize {
  width: number;
  height: number;
}

export interface ContentSummaryImage {
  url: string;
  altText: string;
  urlTemplate: string;
  availableSizes: ContentSummaryImageSize[];
  copyright: string;
  originalUrl: string;
  originalSize: ContentSummaryImageSize;
  locator: string;
  originCode: string;
}

export interface ContentSummaryAttribution {
  title: string;
  link: ContentSummaryLink;
}

export interface ContentSummaryFlags {
  isBreakingNews: boolean;
  isConsumableInPlace: boolean;
  isConsumableAsSFV: boolean;
  isConsumableOnRedButton: boolean;
  isSuitableForSyndication: boolean;
}

export interface ContentSummaryStats {
  readTime: number;
  wordCount: number;
}

export interface ContentSummaryThumbnail {
    width?: number;
    height?: number;
    url?: string;    
}

export interface ContentSummary {
  urn: string;
  home: string;
  type: string;
  titles: ContentSummaryTitle[];
  title: string;
  link: ContentSummaryLink;
  dates: ContentSummaryDate;
  subtitle: string | null;
  descriptions: ContentSummaryDescription[];
  images: ContentSummaryImage[];
  isLive: boolean;
  isOppm: boolean;
  attributions: ContentSummaryAttribution[];
  commentsCount: number | null;
  reactionCounts: Record<string, number>;
  duration?: string;
  language: string;
  flags: ContentSummaryFlags;
  contributors: any[];
  relatedLinks: any[];
  context: Record<string, any>;
  stats: ContentSummaryStats;
  thumbnail?: ContentSummaryThumbnail;
  canSyndicate: boolean;
}

export interface ContentSummariesData {
  summaries: ContentSummary[];
}

export interface ContentSummaries {
  data: ContentSummariesData;
}
