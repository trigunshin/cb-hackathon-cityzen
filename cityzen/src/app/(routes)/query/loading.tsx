import React from "react";
import {
  MainContentResult,
  NewsArticles,
  EventsResults,
  CityHallResults,
} from "@/app/components";
import { LoadingProps } from "@/app/utils/types";


const componentMap: Record<LoadingProps["content"], React.ReactNode> = {
  "Main Content": <MainContentResult data="" loading={true} />,
  "News Articles": <NewsArticles responseData={[]} loading={true} />,
  "Events": <EventsResults loading={true} />,
  "City Hall": <CityHallResults loading={true} />,
};

const Loading: React.FC<LoadingProps> = ({ content }) => {
  const loadingComponent = componentMap[content];
  return loadingComponent ? loadingComponent : componentMap["Main Content"];
};

export default Loading;
