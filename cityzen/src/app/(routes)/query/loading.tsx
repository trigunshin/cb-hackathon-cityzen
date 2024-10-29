import React from "react";
import {
  MainContentResult,
  NewsArticles,
  EventsResults,
  CityHallResults,
} from "@/app/components";
import { LoadingProps } from "@/app/utils/types";
import { Container } from "@mui/material";


const componentMap: Record<LoadingProps["content"], React.ReactNode> = {
  "Main Content": <MainContentResult data="" loading={true} />,
  "News Articles": <NewsArticles responseData={[]} loading={true} />,
  "Events": <EventsResults loading={true} />,
  "City Hall": <CityHallResults loading={true} />,
};

const Loading: React.FC<LoadingProps> = ({ content }) => {
  const loadingComponent = componentMap[content];
  return (
    <Container sx={{height: '100%', alignContent: 'center'}}>
      {loadingComponent ? loadingComponent : componentMap["Main Content"]}
    </Container>
  )
};

export default Loading;
