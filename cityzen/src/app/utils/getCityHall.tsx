interface ExtractedArticleData {
    videoUrl: string;
    title: string;
    id: number;
    dateTime: string;
    date: string;
    time: string;
    response?: string;
    [key: string]: any;
}

export function getCityVideoData(jsonData: ExtractedArticleData[], numberOfVideos: number): Pick<ExtractedArticleData, 'videoUrl' | 'title' | 'id' | 'dateTime' | 'date' | 'time' | 'response'>[] {
    return jsonData.slice(0, numberOfVideos).map(item => ({
        videoUrl: item.videoUrl,
        title: item.title,
        id: item.id,
        dateTime: item.dateTime,
        date: item.date,
        time: item.time,
        response: item.response
    }));
}

const documentElement = document.querySelector('document_content');
if (documentElement !== null) {
    const documentContent = JSON.parse(documentElement.textContent || 'null');

    const response = documentContent.response;
    
    //@ts-ignore
    const rawData: ExtractedArticleData[] = documentContent.nodes.map(node => ({
    ...node.data,
    response: response
    }));
  
    const numberOfVideosToLoad = 5;
    const processedData = getCityVideoData(rawData, numberOfVideosToLoad);
    console.log(processedData);

} else {
    console.error('Document content element not found');
}
