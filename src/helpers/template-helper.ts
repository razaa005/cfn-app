import fs from 'fs';
import path from 'path';
import { TemplateEngine } from '../types/template-engine';
import { TopicJson } from '../types/topic';
import { ContentSummaries } from '../types/content-summaries';

export class TemplateHelper {
    private templateEngine: TemplateEngine;

    constructor(templateEngine: TemplateEngine) {
        this.templateEngine = templateEngine;
    }

    applyTemplate(
        templatePath: string,
        topic: TopicJson,
        contentSummaries: ContentSummaries,
        articleRequest?: any
    ): string {
        // If templatePath is not absolute, resolve relative to project root
        const resolvedPath = path.isAbsolute(templatePath)
            ? templatePath
            : path.join(process.cwd(), templatePath);
        if (!fs.existsSync(resolvedPath)) {
            throw new Error(`Template file not found: ${resolvedPath}`);
        }
        const templateSource = fs.readFileSync(resolvedPath, 'utf8');
        const template = this.templateEngine.compile(templateSource);
        const now = new Date().toUTCString();
        return template({ topic, contentSummaries, articleRequest, now });
    }
}