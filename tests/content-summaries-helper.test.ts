import { getThumbnail } from '../src/helpers/content-summaries-helper';
import { ContentSummaryImage } from '../src/types/content-summaries';

describe('getThumbnail', () => {
  it('returns undefined if no summaryImage is provided', () => {
    expect(getThumbnail(undefined)).toBeUndefined();
  });

  it('returns url if no urlTemplate or availableSizes', () => {
    const image: ContentSummaryImage = {
      url: 'http://image.com/img.jpg',
      altText: '',
      urlTemplate: '',
      availableSizes: [],
      copyright: '',
      originalUrl: '',
      originalSize: { width: 0, height: 0 },
      locator: '',
      originCode: '',
    };
    expect(getThumbnail(image)).toEqual({ url: 'http://image.com/img.jpg' });
  });

  it('returns url with smallest available size from urlTemplate', () => {
    const image: ContentSummaryImage = {
      url: 'http://image.com/img.jpg',
      altText: '',
      urlTemplate: 'http://image.com/{width}x{height}.jpg',
      availableSizes: [
        { width: 300, height: 200 },
        { width: 100, height: 50 },
        { width: 200, height: 100 },
      ],
      copyright: '',
      originalUrl: '',
      originalSize: { width: 0, height: 0 },
      locator: '',
      originCode: '',
    };
    expect(getThumbnail(image)).toEqual({
      width: 100,
      height: 50,
      url: 'http://image.com/100x50.jpg',
    });
  });

  it('returns url with smallest available size even if sizes are unordered', () => {
    const image: ContentSummaryImage = {
      url: 'http://image.com/img.jpg',
      altText: '',
      urlTemplate: 'http://image.com/{width}x{height}.jpg',
      availableSizes: [
        { width: 400, height: 300 },
        { width: 50, height: 25 },
        { width: 200, height: 100 },
      ],
      copyright: '',
      originalUrl: '',
      originalSize: { width: 0, height: 0 },
      locator: '',
      originCode: '',
    };
    expect(getThumbnail(image)).toEqual({
      width: 50,
      height: 25,
      url: 'http://image.com/50x25.jpg',
    });
  });

  it('returns url if urlTemplate is present but availableSizes is empty', () => {
    const image: ContentSummaryImage = {
      url: 'http://image.com/img.jpg',
      altText: '',
      urlTemplate: 'http://image.com/{width}x{height}.jpg',
      availableSizes: [],
      copyright: '',
      originalUrl: '',
      originalSize: { width: 0, height: 0 },
      locator: '',
      originCode: '',
    };
    expect(getThumbnail(image)).toEqual({ url: 'http://image.com/img.jpg' });
  });

  it('returns url if availableSizes has no width/height', () => {
    const image: ContentSummaryImage = {
      url: 'http://image.com/img.jpg',
      altText: '',
      urlTemplate: 'http://image.com/{width}x{height}.jpg',
      availableSizes: [{ width: undefined as any, height: undefined as any }],
      copyright: '',
      originalUrl: '',
      originalSize: { width: 0, height: 0 },
      locator: '',
      originCode: '',
    };
    expect(getThumbnail(image)).toEqual({ url: 'http://image.com/img.jpg' });
  });
});
