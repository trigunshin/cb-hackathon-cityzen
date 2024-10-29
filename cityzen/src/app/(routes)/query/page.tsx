import React from "react";
import { Typography } from "@mui/material";
import {
  NewsArticles,
  EventsResults,
  CityHallResults,
  MainContentResult,
} from "@/app/components";
import { ContentPageProps } from "@/app/utils/types";
import Footer from "@/app/components/Footer";

const ContentPage: React.FC<ContentPageProps> = ({ selectedItem, content, loading, children }) => {

  const renderContent = () => {
    switch (selectedItem) {
      case "Main Content":
        return <MainContentResult data={content?.response} loading={loading} />;
      case "News Articles":
        return <NewsArticles responseData={content?.nodes} loading={loading} />;
      case "Events":
        return <EventsResults loading={loading} />;
      case "City Hall":
        return <CityHallResults loading={loading} />;
      default:
        return (
          <Typography variant="subtitle1" padding={2} color="text.secondary" height="100%" textAlign="center" alignContent="center" gutterBottom>
            Select an item from the menu to view content.
          </Typography>
        );
    }
  };

  return (
    <>
      {renderContent()}
      <Footer />
    </>
  );
};

export default ContentPage;
