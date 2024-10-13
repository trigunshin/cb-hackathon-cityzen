import { JsonData, ExtractedArticleData, ArticleMetadata } from './types';

export function getArticleData(data: JsonData, numArticles: number = 1, dataFields: (keyof ArticleMetadata | 'text' | 'author' | 'word_count')[] = []): ExtractedArticleData[] {
    const articles: ExtractedArticleData[] = [];
    const metadataKeys = Object.keys(data.metadata);
    const sourceNodes = data.source_nodes;

    for (let i = 0; i < Math.min(numArticles, metadataKeys.length); i++) {
        const articleKey = metadataKeys[i];
        const articleMetadata = data.metadata[articleKey];
        const sourceNode = sourceNodes.find(node => node.node.id_ === articleKey);

        const extractedData: ExtractedArticleData = {};

        // If no specific fields are requested, get all available fields
        const fieldsToExtract = dataFields.length > 0 ? dataFields : Object.keys(articleMetadata) as (keyof ArticleMetadata)[];

        fieldsToExtract.forEach(field => {
            if (field in articleMetadata) {
                extractedData[field] = articleMetadata[field];
            }
        });

        // Add text content if available
        if (sourceNode && sourceNode.node.text) {
            extractedData.text = sourceNode.node.text;
        }

        // Add thumbnail/photo if available
        if (articleMetadata.image) {
            extractedData.image = articleMetadata.image;
        }

        // Add any other valuable information
        if (sourceNode && sourceNode.node.extra_info) {
            Object.entries(sourceNode.node.extra_info).forEach(([key, value]) => {
                if (!(key in extractedData)) {
                    extractedData[key] = value;
                }
            });
        }

        articles.push(extractedData);
    }

    return articles;
}