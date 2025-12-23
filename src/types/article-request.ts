import { PartnerConfigEntry } from './partner-template-config';
export type AllowedMixin =
  | 'summary'
  | 'thumbnail_images'
  | 'body'
  | 'body_images'
  | 'clips'
  | 'categories'
  | 'authors'
  | 'related_articles'
  | 'all';

export interface ArticleRequestMixins {
  summary?: boolean;
  thumbnail_images?: boolean;
  body?: boolean;
  body_images?: boolean;
  clips?: boolean;
  categories?: boolean;
  authors?: boolean;
  related_articles?: boolean;
  all?: boolean;
}

export class ArticleRequest {
  api_key: string;
  feed: string;
  accept_override?: 'rss2';
  mixins: ArticleRequestMixins;
  number_of_items?: number;
  sort?: 'date_asc' | 'date_desc';
  clip_format?: 'link' | 'embedded_player';
  thumbnail_image_format?: 'image_only';
  social_format?: 'link' | 'embedded';
  twitter_format?: 'link' | 'embedded';
  youtube_format?: 'link' | 'embedded';
  instagram_format?: 'link' | 'embedded';
  page_view_tracking?: 'image' | 'javascript';
  topicId?: string;
  partner?: PartnerConfigEntry;

  constructor(params: {
    api_key: string;
    feed: string;
    accept_override?: 'rss2';
    mixins?: string;
    number_of_items?: number;
    sort?: 'date_asc' | 'date_desc';
    clip_format?: 'link' | 'embedded_player';
    thumbnail_image_format?: 'image_only';
    social_format?: 'link' | 'embedded';
    twitter_format?: 'link' | 'embedded';
    youtube_format?: 'link' | 'embedded';
    instagram_format?: 'link' | 'embedded';
    page_view_tracking?: 'image' | 'javascript';
    topicId?: string;
    partner?: PartnerConfigEntry;
  }) {
    this.api_key = params.api_key;
    this.feed = params.feed;
    this.accept_override = params.accept_override;
    this.number_of_items = params.number_of_items;
    this.sort = params.sort;
    this.clip_format = params.clip_format;
    this.thumbnail_image_format = params.thumbnail_image_format;
    this.social_format = params.social_format;
    this.twitter_format = params.twitter_format;
    this.youtube_format = params.youtube_format;
    this.instagram_format = params.instagram_format;
    this.page_view_tracking = params.page_view_tracking;
    this.topicId = params.topicId;
    this.partner = params.partner;
    this.mixins = {};
    if (params.mixins) {
      const allowed: AllowedMixin[] = [
        'summary', 'thumbnail_images', 'body', 'body_images', 'clips', 'categories', 'authors', 'related_articles', 'all'
      ];
      params.mixins.split(',').map(m => m.trim()).forEach(m => {
        if (allowed.includes(m as AllowedMixin)) {
          this.mixins[m as AllowedMixin] = true;
        }
      });
    }
  }
}
