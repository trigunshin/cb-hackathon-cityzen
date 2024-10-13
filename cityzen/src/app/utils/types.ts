export interface ArticleNode {
    id_: string;
    text: string;
    extra_info: {
        author: string;
        word_count: number;
        [key: string]: any;
    };
}

export interface SourceNode {
    node: ArticleNode;
    score: number;
}

export interface ArticleMetadata {
    title: string;
    source: string;
    date: string;
    sentiment: number;
    image: string;
    url: string;
    [key: string]: any;
}

export interface JsonData {
    response: string;
    source_nodes: SourceNode[];
    metadata: {
        [key: string]: ArticleMetadata;
    };
}

export interface ExtractedArticleData extends Partial<ArticleMetadata> {
    text?: string;
    author?: string;
    word_count?: number;
    [key: string]: any;
}