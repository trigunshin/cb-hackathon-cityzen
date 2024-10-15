export interface ArticleNode {
    data: ArticleMetadata;
    text: string;
};

export interface QueryResponse {
    response: string;
    nodes: ArticleNode[];
}

export interface ArticleMetadata {
    [key: string]: any;
    videoUrl?: string;
    title?: string;
    id?: number;
    meetingTypeId?: number;
    committeeId?: number;
    dateTime?: string;
    date?: string;
    time?: string;
    allowPublicComment?: boolean;
    generation?: number;
}