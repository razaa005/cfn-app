import { FablClient } from '../src/helpers/fabl-client';
import type https from 'https';
import { TopicJson } from '../src/types/topic';
import { ContentSummaries } from '../src/types/content-summaries';

describe('FablClient', () => {
  const mockAgent = {} as https.Agent;
  const mockFetch = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetchTopic returns TopicJson on success', async () => {
    const mockTopic: TopicJson = { data: { curationList: [] } } as any;
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockTopic,
    });
    const client = new FablClient(mockAgent, mockFetch);
    const result = await client.fetchTopic('topicId');
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('topic?id=topicId'),
      expect.objectContaining({ agent: mockAgent })
    );
    expect(result).toBe(mockTopic);
  });

  it('fetchTopic throws on non-ok response', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 404 });
    const client = new FablClient(mockAgent, mockFetch);
    await expect(client.fetchTopic('topicId')).rejects.toThrow('API request failed with status 404');
  });

  it('fetchContentSummaries returns ContentSummaries on success', async () => {
    const mockSummaries: ContentSummaries = { data: { summaries: [] } } as any;
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockSummaries,
    });
    const client = new FablClient(mockAgent, mockFetch);
    const result = await client.fetchContentSummaries('curationId');
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('content-summaries?urn=curationId'),
      expect.objectContaining({ agent: mockAgent })
    );
    expect(result).toBe(mockSummaries);
  });

  it('fetchContentSummaries throws on non-ok response', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 500 });
    const client = new FablClient(mockAgent, mockFetch);
    await expect(client.fetchContentSummaries('curationId')).rejects.toThrow('Content summaries API request failed with status 500');
  });
});
