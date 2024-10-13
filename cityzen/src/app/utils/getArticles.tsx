import { JsonData, ExtractedArticleData, ArticleMetadata } from './types';

export function getArticleData(jsonData: JsonData, numArticles: number = 1, dataFields: (keyof ArticleMetadata | 'text' | 'author' | 'word_count')[] = []): ExtractedArticleData[] {
    const articles: ExtractedArticleData[] = [];
    const metadataKeys = Object.keys(jsonData.metadata);
    const sourceNodes = jsonData.source_nodes;

    for (let i = 0; i < Math.min(numArticles, metadataKeys.length); i++) {
        const articleKey = metadataKeys[i];
        const articleMetadata = jsonData.metadata[articleKey];
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

// export const jsonData: JsonData = {
//     "response": "The documents contain information about recent news articles.",
//     "source_nodes": [
//       {
//         "node": {
//           "id_": "article1",
//           "text": "Baby Reindeer's explosive £92million Netflix court case has taken a dramatic twist as court documents were laid bare. Last month, the woman who claims she is the real-life Martha from the award-winning show was given the green light by a judge in Los Angeles to sue the streaming giant.",
//           "extra_info": {
//             "author": "Jane Doe",
//             "word_count": 150,
//             "category": "Entertainment"
//           }
//         },
//         "score": 0.228941157
//       },
//       {
//         "node": {
//           "id_": "article2",
//           "text": "Diddy accuses federal officials of leaking material in his sex-trafficking case. The timely production of these materials is critical to Mr. Combs' ability to prepare his defense, his lawyers wrote.",
//           "extra_info": {
//             "author": "John Smith",
//             "word_count": 100,
//             "category": "Legal"
//           }
//         },
//         "score": 0.251545906
//       },
//       {
//         "node": {
//           "id_": "article3",
//           "text": "SpaceX successfully launched another batch of Starlink satellites into orbit today, further expanding its global internet coverage. The Falcon 9 rocket lifted off from Cape Canaveral at dawn, carrying 60 satellites.",
//           "extra_info": {
//             "author": "Emily Johnson",
//             "word_count": 120,
//             "category": "Technology"
//           }
//         },
//         "score": 0.198765432
//       }
//     ],
//     "metadata": {
//       "article1": {
//         "title": "Baby Reindeer £92million Netflix court case takes twist as documents laid bare",
//         "source": "Entertainment Weekly",
//         "date": "2024-10-12",
//         "sentiment": 0.1294117647058823,
//         "image": "https://example.com/images/baby-reindeer.jpg",
//         "url": "https://example.com/baby-reindeer-case"
//       },
//       "article2": {
//         "title": "Diddy accuses federal officials of leaking material in his sex-trafficking case",
//         "source": "Legal Times",
//         "date": "2024-10-10",
//         "sentiment": -0.2627450980392156,
//         "image": "https://example.com/images/diddy-case.jpg",
//         "url": "https://example.com/diddy-case"
//       },
//       "article3": {
//         "title": "SpaceX launches more Starlink satellites, expanding global internet coverage",
//         "source": "Space News",
//         "date": "2024-10-15",
//         "sentiment": 0.7890123456789012,
//         "image": "https://example.com/images/spacex-launch.jpg",
//         "url": "https://example.com/spacex-starlink-launch"
//       }
//     }
//   };
  
//   // Test the function
//   const allArticles = getArticleData(jsonData, 3);
//   console.log(JSON.stringify(allArticles, null, 2));
  
//   // Test with specific fields
//   const specificFields = getArticleData(jsonData, 2, ['title', 'date', 'author', 'category']);
//   console.log(JSON.stringify(specificFields, null, 2));