import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import handlebars from 'handlebars';
import { getCanSyndicate, getThumbnail } from './helpers/content-summaries-helper';
import { TemplateHelper } from './helpers/template-helper';
import { MtlsAgentHelper, MtlsAgentValidationError } from './helpers/mtls-agent-helper';
import { FablClient } from './helpers/fabl-client';
import { ArticleRequestValidator } from './helpers/article-request-validator';
import { AppConfigLoader, AppConfig } from './helpers/feed-config-loader';

dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

// App config loader (shared instance)
const appConfigLoader = new AppConfigLoader();
let appConfig: AppConfig;
try {
  appConfig = appConfigLoader.getConfig();
  console.log('[startup] Loaded app config');
} catch (e) {
  console.error('[startup] Failed to load app config:', (e as Error).message);
  process.exit(1);
}

// Endpoint to refresh all configs from filesystem
app.post('/refresh-config', (_req: Request, res: Response) => {
  try {
    appConfig = appConfigLoader.refresh();
    res.json({ status: 'App config refreshed successfully.' });
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
});

app.get('/articles', (req: Request, res: Response) => {
  let feedsConfig, partnerConfig;
  try {
    feedsConfig = appConfig.feedConfig;
    partnerConfig = appConfig.partnerConfig;
  } catch (e) {
    return res.status(500).json({ error: (e as Error).message });
  }

  const { errors, articleRequest } = ArticleRequestValidator.validate(req, feedsConfig, partnerConfig);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  const topicId = articleRequest?.topicId;
  if (!topicId) {
    return res.status(400).json({ errors: ['Missing topicId after validation.'] });
  }

  // Setup Fabl Client with agent and fetch
  let fablClient: FablClient;
  try {
    const agent = MtlsAgentHelper.createAgentFromEnv();
    fablClient = new FablClient(agent, fetch);
  } catch (err) {
    if (err instanceof MtlsAgentValidationError) {
      return res.status(500).json({ error: 'Fabl Client setup failed', details: err.errors });
    }
    return res.status(500).json({ error: 'Unknown error during Fabl Client setup.' });
  }

  (async () => {
    try {
      const topic = await fablClient.fetchTopic(topicId);
      let curationIds: string[] = [];
      if (topic && topic.data && Array.isArray(topic.data.curationList)) {
        if (topic.data.curationList.length === 0) {
          console.log('[articles] No curations found for topicId:', topicId);
          return res.status(400).json({ error: 'Zero curations were found for the given topic.' });
        }
        curationIds = topic.data.curationList
          .map(c => c.curationId)
          .filter(id => id.startsWith('urn:bbc:tipo:list'));
        console.log('[articles] Filtered curationIds returned from fetchTopic:', curationIds);
      } else {
        console.log('[articles] No curationList found in topic data for topicId:', topicId);
      }

      // Efficiently collect up to the required number of syndicate-eligible summaries
      const requestedItems = articleRequest?.number_of_items && articleRequest.number_of_items > 0 ? articleRequest.number_of_items : 25;
      const maxItems = Math.min(25, requestedItems);
      let allSummaries: any[] = [];
      for (const curationId of curationIds) {
        const contentSummaries = await fablClient.fetchContentSummaries(curationId);
        const summaries = contentSummaries?.data?.summaries || [];
        console.log(`[articles] curationId ${curationId} returned ${summaries.length} items`);
        for (const summary of summaries) {
          const canSyndicate = getCanSyndicate(summary);
          if (canSyndicate) {
            console.log(`[articles] Adding syndicatable summary: ${summary.title}`);
            allSummaries.push({
              ...summary,
              thumbnail: getThumbnail(summary.images && summary.images[0]),
              canSyndicate
            });
            if (allSummaries.length >= maxItems) break;
          }
        }
        if (allSummaries.length >= maxItems) break;
      }
      console.log(`[articles] syndicateSummaries.length before template: ${allSummaries.length}`);
      // Log the article request mixins
      console.log(`[articles] articleRequest.mixins: ${JSON.stringify(articleRequest?.mixins)}`);
      // Select template config based on partner
      let templatePath = 'templates/topic-summaries-rss.hbs';
      let contentType = 'application/rss+xml';
      // log partner info if available
      console.log('[articles] articleRequest.partner:', articleRequest?.partner);
      if (articleRequest && articleRequest.partner && articleRequest.partner.syndication_options) {
        const templateId = articleRequest.partner.syndication_options.template_id;
        console.log(`[articles] Using partner template_id: ${templateId}`);
        const templateConfig = appConfig.templateConfig.templates.find(t => t.id === templateId);
        if (templateConfig) {
          templatePath = templateConfig.path;
          contentType = templateConfig.content_type;
        }
      }
      // Render using the selected template
      const templateHelper = new TemplateHelper(handlebars);
      const xml = templateHelper.applyTemplate(
        templatePath,
        topic,
        { data: { summaries: allSummaries } },
        articleRequest
      );
      res.set('Content-Type', contentType);
      return res.send(xml);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  })();
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
