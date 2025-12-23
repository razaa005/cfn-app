
import type { RequestInit, Response } from 'node-fetch';
import https from 'https';
import { TopicJson } from '../types/topic';
import { ContentSummaries } from '../types/content-summaries';

export class FablClient {
  private agent: https.Agent;
  private fetchFn: (url: string, init?: RequestInit) => Promise<Response>;

  constructor(
    agent: https.Agent,
    fetchFn?: (url: string, init?: RequestInit) => Promise<Response>
  ) {
    this.agent = agent;
    if (fetchFn) {
      this.fetchFn = fetchFn;
    } else {
      // Dynamically import node-fetch only if not provided (for production)
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      this.fetchFn = require('node-fetch');
    }
  }

  async fetchTopic(topicId: string): Promise<TopicJson> {
    const url = `https://fabl.api.bbci.co.uk/module/topic?id=${encodeURIComponent(topicId)}`;
    const res = await this.fetchFn(url, { agent: this.agent });
    if (!res.ok) {
      throw new Error(`API request failed with status ${res.status}`);
    }
    return (await res.json()) as TopicJson;
  }

  async fetchContentSummaries(curationId: string): Promise<ContentSummaries> {
    const url = `https://fabl.api.bbci.co.uk/module/content-summaries?urn=${encodeURIComponent(curationId)}`;
    const res = await this.fetchFn(url, { agent: this.agent });
    if (!res.ok) {
      throw new Error(`Content summaries API request failed with status ${res.status}`);
    }
    return (await res.json()) as ContentSummaries;
  }
}
