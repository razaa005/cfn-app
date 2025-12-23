import { ContentSummary, ContentSummaryImage, ContentSummaryThumbnail } from '../types/content-summaries';

export const getCanSyndicate = (summary: ContentSummary): boolean => {
  return summary && summary.flags.isSuitableForSyndication && summary.type === 'article';
}

export const getThumbnail = (summaryImage?: ContentSummaryImage): ContentSummaryThumbnail | undefined => {
  if (!summaryImage) {
    return undefined;
  }

  const { url, urlTemplate, availableSizes } = summaryImage;

  if (urlTemplate && availableSizes && availableSizes.length > 0) {
    const smallestAvailableSize = availableSizes.reduce((previousMinSize, currentMinSize) =>
      previousMinSize.width && currentMinSize.width && previousMinSize.width < currentMinSize.width
        ? previousMinSize
        : currentMinSize,
    );

    if (smallestAvailableSize.width && smallestAvailableSize.height) {
      return {
        width: smallestAvailableSize.width,
        height: smallestAvailableSize.height,
        url: urlTemplate
          .replace('{width}', smallestAvailableSize.width.toString())
          .replace('{height}', smallestAvailableSize.height.toString()),
      };
    }
  }

  return { url };
};