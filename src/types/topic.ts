export interface Subject {
  subjectId: string;
  subjectType: string;
}

export interface Curation {
  curationId: string;
  curationType: string;
  position: number;
  visualProminence: string;
  intent?: string;
  visualStyle: string;
  title?: string;
  associatedContent?: {
    uri: string;
  };
  additionalText?: {
    plainText: string;
  };
}

export interface Analytics {
  name: string;
  producer: string;
  irisKeyword: string;
}

export interface Metadata {
  analytics: Analytics;
}

export interface TopicData {
  urn: string;
  title: string;
  description: string;
  edition: string | null;
  uri: string;
  home: string;
  visibility: boolean;
  hasAdvertising: boolean;
  language: string;
  subjectList: Subject[];
  curationList: Curation[];
  seoTitle: string;
  seoDescription: string;
  metadata: Metadata;
}

export interface TopicJson {
  data: TopicData;
  contentType: string;
}
