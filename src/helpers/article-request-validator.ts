
import { Request } from 'express';
import { ArticleRequest } from '../types/article-request';
import { FeedConfig } from '../types/feed-config';
import { PartnerConfig, PartnerConfigEntry } from '../types/partner-template-config';

export interface ArticleRequestValidationResult {
  errors: string[];
  articleRequest?: ArticleRequest;
}

export class ArticleRequestValidator {
  static validate(
    req: Request,
    feedsConfig: FeedConfig,
    partnerConfig?: PartnerConfig
  ): ArticleRequestValidationResult {
    const errors: string[] = [];
    const {
      api_key,
      feed,
      accept_override,
      mixins,
      number_of_items,
      sort,
      clip_format,
      thumbnail_image_format,
      social_format,
      twitter_format,
      youtube_format,
      instagram_format,
      page_view_tracking,
    } = req.query;

    // api_key: required, non-empty
    let partnerData: PartnerConfigEntry | undefined = undefined;
    if (!api_key || typeof api_key !== 'string' || !api_key.trim()) {
      errors.push('api_key is required and must be a non-empty string.');
    } else if (partnerConfig) {
      // Flatten all partners from the array of objects
      const allPartners = partnerConfig.partners.reduce((acc, obj) => ({ ...acc, ...obj }), {} as { [k: string]: PartnerConfigEntry });
      const found = Object.values(allPartners).find(p => p.api_key === api_key);
      if (!found) {
        errors.push('api_key is not valid for any partner.');
      } else {
        partnerData = found;
      }
    }

    // feed: required, non-empty
    let topicId: string | null = null;
    if (!feed || typeof feed !== 'string' || !feed.trim()) {
      errors.push('feed is required and must be a non-empty string.');
    } else {
      if (feedsConfig.feeds && feedsConfig.feeds[feed]) {
        topicId = feedsConfig.feeds[feed].topicId;
      } else {
        errors.push('Unknown feed: ' + feed);
      }
    }

    // accept_override: optional, must be 'rss2' if present
    if (accept_override && accept_override !== 'rss2') {
      errors.push('accept_override, if provided, must be "rss2".');
    }

    // mixins: optional, comma-separated list of allowed values
    const allowedMixins = [
      'summary', 'thumbnail_images', 'body', 'body_images', 'clips', 'categories', 'authors', 'related_articles', 'all',
    ];
    if (mixins) {
      const mixinList = (typeof mixins === 'string' ? mixins.split(',') : []).map(m => m.trim());
      for (const m of mixinList) {
        if (!allowedMixins.includes(m)) {
          errors.push(`Invalid mixin: ${m}`);
        }
      }
    }

    // number_of_items: optional, integer 1-25
    if (number_of_items !== undefined) {
      const n = Number(number_of_items);
      if (!Number.isInteger(n) || n < 1 || n > 25) {
        errors.push('number_of_items must be an integer between 1 and 25.');
      }
    }

    // sort: optional, must be 'date_asc' or 'date_desc'
    if (sort && !['date_asc', 'date_desc'].includes(String(sort))) {
      errors.push('sort, if provided, must be "date_asc" or "date_desc".');
    }

    // clip_format: optional, must be 'link' or 'embedded_player'
    if (clip_format && !['link', 'embedded_player'].includes(String(clip_format))) {
      errors.push('clip_format, if provided, must be "link" or "embedded_player".');
    }

    // thumbnail_image_format: optional, must be 'image_only' if present
    if (thumbnail_image_format && thumbnail_image_format !== 'image_only') {
      errors.push('thumbnail_image_format, if provided, must be "image_only".');
    }

    // social_format: optional, must be 'link' or 'embedded'
    if (social_format && !['link', 'embedded'].includes(String(social_format))) {
      errors.push('social_format, if provided, must be "link" or "embedded".');
    }

    // twitter_format, youtube_format, instagram_format: optional, must be 'link' or 'embedded'
    for (const [param, val] of Object.entries({ twitter_format, youtube_format, instagram_format })) {
      if (val && !['link', 'embedded'].includes(String(val))) {
        errors.push(`${param}, if provided, must be "link" or "embedded".`);
      }
    }

    // page_view_tracking: optional, must be 'image' or 'javascript'
    if (page_view_tracking && !['image', 'javascript'].includes(String(page_view_tracking))) {
      errors.push('page_view_tracking, if provided, must be "image" or "javascript".');
    }

    if (errors.length > 0) {
      return { errors };
    }
    // Construct ArticleRequest object if validation passes
    const articleRequest = new ArticleRequest({
      api_key: api_key as string,
      feed: feed as string,
      accept_override: accept_override as 'rss2' | undefined,
      mixins: mixins as string | undefined,
      number_of_items: number_of_items !== undefined ? Number(number_of_items) : undefined,
      sort: sort as 'date_asc' | 'date_desc' | undefined,
      clip_format: clip_format as 'link' | 'embedded_player' | undefined,
      thumbnail_image_format: thumbnail_image_format as 'image_only' | undefined,
      social_format: social_format as 'link' | 'embedded' | undefined,
      twitter_format: twitter_format as 'link' | 'embedded' | undefined,
      youtube_format: youtube_format as 'link' | 'embedded' | undefined,
      instagram_format: instagram_format as 'link' | 'embedded' | undefined,
      page_view_tracking: page_view_tracking as 'image' | 'javascript' | undefined,
      topicId: topicId || undefined,
      partner: partnerData,
    });
    return { errors, articleRequest };
  }
}
