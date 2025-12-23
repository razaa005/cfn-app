export interface TemplateEngine {
  compile(templateSource: string): (context: any) => string;
}