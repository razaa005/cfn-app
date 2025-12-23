import fs from 'fs';
import path from 'path';
import { FeedConfig } from '../types/feed-config';
import { PartnerConfig, TemplateConfig } from '../types/partner-template-config';

export interface AppConfig {
  feedConfig: FeedConfig;
  partnerConfig: PartnerConfig;
  templateConfig: TemplateConfig;
}

export class AppConfigLoader {
  private feedConfigPath: string;
  private partnerConfigPath: string;
  private templateConfigPath: string;
  private config: AppConfig | null = null;

  constructor(
    feedConfigPath?: string,
    partnerConfigPath?: string,
    templateConfigPath?: string
  ) {
    this.feedConfigPath = feedConfigPath || path.join(__dirname, '../../data/feed-config.json');
    this.partnerConfigPath = partnerConfigPath || path.join(__dirname, '../../data/partner-config.json');
    this.templateConfigPath = templateConfigPath || path.join(__dirname, '../../data/template-config.json');
  }

  load(): AppConfig {
    try {
      const feedRaw = fs.readFileSync(this.feedConfigPath, 'utf8');
      const partnerRaw = fs.readFileSync(this.partnerConfigPath, 'utf8');
      const templateRaw = fs.readFileSync(this.templateConfigPath, 'utf8');
      this.config = {
        feedConfig: JSON.parse(feedRaw) as FeedConfig,
        partnerConfig: JSON.parse(partnerRaw) as PartnerConfig,
        templateConfig: JSON.parse(templateRaw) as TemplateConfig,
      };
      return this.config;
    } catch (e) {
      throw new Error('Could not load app config: ' + (e as Error).message);
    }
  }

  getConfig(): AppConfig {
    if (!this.config) {
      return this.load();
    }
    return this.config;
  }

  refresh(): AppConfig {
    return this.load();
  }
}
