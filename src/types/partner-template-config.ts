export interface SyndicationOptions {
  template_id: string;
}

export interface PartnerConfigEntry {
  api_key: string;
  syndication_options: SyndicationOptions;
}

export interface Partners {
  [partnerName: string]: PartnerConfigEntry;
}

export interface PartnerConfig {
  partners: Partners[];
}

export interface TemplateConfigEntry {
  id: string;
  path: string;
  content_type: string;
}

export interface TemplateConfig {
  templates: TemplateConfigEntry[];
}
