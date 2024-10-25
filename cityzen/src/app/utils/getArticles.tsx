import { ArticleNode } from './types';

export function getArticleData(resposneData: ArticleNode, numArticles: number = 1): ArticleNode[] {
    const articles: ArticleNode[] = [];

    //@ts-ignore
    for (let i = 0; i < Math.min(numArticles, resposneData.length); i++) {
        //@ts-ignore
        const node = resposneData[i].node;
        const extractedData: ArticleNode = {
            ...node,
            //@ts-ignore
            text: resposneData[i]?.text || ''
        };
        articles.push(extractedData);
    }

    console.log(articles);
    return articles;
}