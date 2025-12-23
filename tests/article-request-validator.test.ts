import { ArticleRequestValidator } from '../src/validators/article-request-validator';
import { PartnerConfig } from '../src/types/partner-template-config';

describe('ArticleRequestValidator', () => {
    const feedsConfig = {
        feeds: {
            'news': { topicId: 'topic123' }
        }
    };

    const partnerConfig = JSON.parse(`{ "partners": [ { "a": { "api_key": "keyA", "syndication_options": { "template_id": "topic-summaries-rss"}}, "b": { "api_key": "b_api_key", "syndication_options": { "template_id": "topic-summaries-jsonfeed" } } } ]}`) as PartnerConfig;

    it('should return an error if api_key is missing', () => {
        const req = { query: { feed: 'news' } } as any;
        const result = ArticleRequestValidator.validate(req, feedsConfig);
        expect(result.errors).toContain('api_key is required and must be a non-empty string.');
    });

    it('should return an error if api_key is empty string', () => {
        const req = { query: { api_key: '', feed: 'news' } } as any;
        const result = ArticleRequestValidator.validate(req, feedsConfig, partnerConfig);
        expect(result.errors).toContain('api_key is required and must be a non-empty string.');
    });

    it('should return an error if api_key is not valid for any partner', () => {
        const req = { query: { api_key: 'notfound', feed: 'news' } } as any;
        const result = ArticleRequestValidator.validate(req, feedsConfig, partnerConfig);
        expect(result.errors).toContain('api_key is not valid for any partner.');
    });

    it('should set partnerData if api_key matches a partner', () => {
        const req = { query: { api_key: 'keyA', feed: 'news' } } as any;
        const result = ArticleRequestValidator.validate(req, feedsConfig, partnerConfig);
        expect(result.errors.length).toBe(0);
        expect(result.articleRequest).toBeDefined();
    });

    it('should return an error if feed is missing', () => {
        const req = { query: { api_key: 'abc' } } as any;
        const result = ArticleRequestValidator.validate(req, feedsConfig);
        expect(result.errors).toContain('feed is required and must be a non-empty string.');
    });

    it('should return ArticleRequest if valid', () => {
        const req = { query: { api_key: 'abc', feed: 'news' } } as any;
        const result = ArticleRequestValidator.validate(req, feedsConfig);
        expect(result.errors.length).toBe(0);
        expect(result.articleRequest).toBeDefined();
        expect(result.articleRequest?.api_key).toBe('abc');
        expect(result.articleRequest?.feed).toBe('news');
        expect(result.articleRequest?.topicId).toBe('topic123');
    });

    it('should return an error for unknown feed', () => {
        const req = { query: { api_key: 'abc', feed: 'unknown' } } as any;
        const result = ArticleRequestValidator.validate(req, feedsConfig);
        expect(result.errors).toContain('Unknown feed: unknown');
        expect(result.articleRequest).toBeUndefined();
    });

    it('should return an error for invalid accept_override', () => {
        const req = { query: { api_key: 'abc', feed: 'news', accept_override: 'json' } } as any;
        const result = ArticleRequestValidator.validate(req, feedsConfig);
        expect(result.errors).toContain('accept_override, if provided, must be "rss2".');
    });

    it('should return an error for invalid mixins and not set them', () => {
        const req = { query: { api_key: 'abc', feed: 'news', mixins: 'summary,invalid' } } as any;
        const result = ArticleRequestValidator.validate(req, feedsConfig);
        expect(result.errors).toContain('Invalid mixin: invalid');
        expect(result.articleRequest).toBeUndefined();
    });

    it('should return an error for invalid number_of_items', () => {
        const req = { query: { api_key: 'abc', feed: 'news', number_of_items: '30' } } as any;
        const result = ArticleRequestValidator.validate(req, feedsConfig);
        expect(result.errors).toContain('number_of_items must be an integer between 1 and 25.');
    });

    it('should return an error for invalid sort', () => {
        const req = { query: { api_key: 'abc', feed: 'news', sort: 'invalid' } } as any;
        const result = ArticleRequestValidator.validate(req, feedsConfig);
        expect(result.errors).toContain('sort, if provided, must be "date_asc" or "date_desc".');
    });

    it('should return an error for invalid clip_format', () => {
        const req = { query: { api_key: 'abc', feed: 'news', clip_format: 'invalid' } } as any;
        const result = ArticleRequestValidator.validate(req, feedsConfig);
        expect(result.errors).toContain('clip_format, if provided, must be "link" or "embedded_player".');
    });

    it('should return an error for invalid thumbnail_image_format', () => {
        const req = { query: { api_key: 'abc', feed: 'news', thumbnail_image_format: 'invalid' } } as any;
        const result = ArticleRequestValidator.validate(req, feedsConfig);
        expect(result.errors).toContain('thumbnail_image_format, if provided, must be "image_only".');
    });

    it('should return an error for invalid social_format', () => {
        const req = { query: { api_key: 'abc', feed: 'news', social_format: 'invalid' } } as any;
        const result = ArticleRequestValidator.validate(req, feedsConfig);
        expect(result.errors).toContain('social_format, if provided, must be "link" or "embedded".');
    });

    it('should return an error for invalid twitter_format', () => {
        const req = { query: { api_key: 'abc', feed: 'news', twitter_format: 'invalid' } } as any;
        const result = ArticleRequestValidator.validate(req, feedsConfig);
        expect(result.errors).toContain('twitter_format, if provided, must be "link" or "embedded".');
    });

    it('should return an error for invalid youtube_format', () => {
        const req = { query: { api_key: 'abc', feed: 'news', youtube_format: 'invalid' } } as any;
        const result = ArticleRequestValidator.validate(req, feedsConfig);
        expect(result.errors).toContain('youtube_format, if provided, must be "link" or "embedded".');
    });

    it('should return an error for invalid instagram_format', () => {
        const req = { query: { api_key: 'abc', feed: 'news', instagram_format: 'invalid' } } as any;
        const result = ArticleRequestValidator.validate(req, feedsConfig);
        expect(result.errors).toContain('instagram_format, if provided, must be "link" or "embedded".');
    });

    it('should return an error for invalid page_view_tracking', () => {
        const req = { query: { api_key: 'abc', feed: 'news', page_view_tracking: 'invalid' } } as any;
        const result = ArticleRequestValidator.validate(req, feedsConfig);
        expect(result.errors).toContain('page_view_tracking, if provided, must be "image" or "javascript".');
    });
});
