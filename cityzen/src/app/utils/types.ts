export interface ArticleNode {
    data: ArticleMetadata;
    text: string;
};

export interface ContentPageProps {
    selectedItem: string;
    content: QueryResponse | null;
    loading: boolean;
    children?: React.ReactNode;
}

export interface LoadingProps {
    content: "Main Content" | "News Articles" | "Events" | "City Hall";
};  

export interface QueryResponse {
    response: string;
    nodes: ArticleNode[];
};

export interface QueryLayoutProps {
  children: React.ReactNode;
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
};