import { ArticleRequest } from '../src/types/article-request';

describe('ArticleRequest', () => {
  it('should correctly parse required fields', () => {
    const req = new ArticleRequest({ api_key: 'key', feed: 'feed' });
    expect(req.api_key).toBe('key');
    expect(req.feed).toBe('feed');
    expect(req.mixins).toEqual({});
  });

  it('should parse all optional fields', () => {
    const req = new ArticleRequest({
      api_key: 'key',
      feed: 'feed',
      accept_override: 'rss2',
      mixins: 'summary,body',
      number_of_items: 5,
      sort: 'date_asc',
      clip_format: 'link',
      thumbnail_image_format: 'image_only',
      social_format: 'embedded',
      twitter_format: 'link',
      youtube_format: 'embedded',
      instagram_format: 'link',
      page_view_tracking: 'image',
      topicId: 'topic123',
    });
    expect(req.accept_override).toBe('rss2');
    expect(req.number_of_items).toBe(5);
    expect(req.sort).toBe('date_asc');
    expect(req.clip_format).toBe('link');
    expect(req.thumbnail_image_format).toBe('image_only');
    expect(req.social_format).toBe('embedded');
    expect(req.twitter_format).toBe('link');
    expect(req.youtube_format).toBe('embedded');
    expect(req.instagram_format).toBe('link');
    expect(req.page_view_tracking).toBe('image');
    expect(req.topicId).toBe('topic123');
    expect(req.mixins.summary).toBe(true);
    expect(req.mixins.body).toBe(true);
    expect(req.mixins.thumbnail_images).toBeUndefined();
  });

  it('should handle mixins with extra whitespace', () => {
    const req = new ArticleRequest({ api_key: 'key', feed: 'feed', mixins: ' summary , body ' });
    expect(req.mixins.summary).toBe(true);
    expect(req.mixins.body).toBe(true);
  });

  it('should ignore unknown mixins', () => {
    const req = new ArticleRequest({ api_key: 'key', feed: 'feed', mixins: 'summary,unknown' });
    expect(req.mixins.summary).toBe(true);
    expect((req.mixins as any).unknown).toBeUndefined();
  });

  it('should not set mixins if mixins param is missing', () => {
    const req = new ArticleRequest({ api_key: 'key', feed: 'feed' });
    expect(req.mixins).toEqual({});
  });
});
