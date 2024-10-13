import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Card, CardContent, Chip, CardActions, Button } from '@mui/material';
import { Grid } from '@mui/system';

interface NewsArticle {
  id: number;
  title: string;
  url: string;
  date: string;
  topic: string;
}

const newsArticles: NewsArticle[] = [
  { id: 1, title: "City Plans New Park Development", url: "https://example.com/news/1", date: "2024-03-15", topic: "Urban Development" },
  { id: 2, title: "Local Business Wins Innovation Award", url: "https://example.com/news/2", date: "2024-03-14", topic: "Business" },
  { id: 3, title: "Community Clean-up Event This Weekend", url: "https://example.com/news/3", date: "2024-03-16", topic: "Community" },
  { id: 4, title: "School District Announces New STEM Program", url: "https://example.com/news/4", date: "2024-03-13", topic: "Education" },
  { id: 5, title: "Mayor Proposes Budget for Next Fiscal Year", url: "https://example.com/news/5", date: "2024-03-12", topic: "Politics" },
  { id: 6, title: "Mayor Proposes Budget for Next Fiscal Year", url: "https://example.com/news/5", date: "2024-03-12", topic: "Politics" },
  { id: 7, title: "Mayor Proposes Budget for Next Fiscal Year", url: "https://example.com/news/5", date: "2024-03-12", topic: "Politics" },
  { id: 8, title: "Mayor Proposes Budget for Next Fiscal Year", url: "https://example.com/news/5", date: "2024-03-12", topic: "Politics" },
  { id: 8, title: "Mayor Proposes Budget for Next Fiscal Year", url: "https://example.com/news/5", date: "2024-03-12", topic: "Politics" },

];

interface NewsCardProps {
  title: string;
  link: string;
  date: string;
  topic: string;
}

function NewsCard({ title, link, date, topic }: NewsCardProps) {
  return (
    <Card className="max-w-full md:max-w-md mx-auto hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-gray-50 to-gray-100">
    <CardContent className="space-y-1">
      <Box className="flex justify-between items-start">
        <Button
          size="small"
          color="primary"
          endIcon={<OpenInNewIcon />}
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:bg-[#72bae32a] normal-case"
        >
          <Typography fontSize={'16px'} component="h2" className="text-gray-800 font-bold">
            {title}
          </Typography>
        </Button>
      </Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="space-between" alignItems="center">
        <Stack direction="row" spacing={1} alignItems="center" className="text-gray-600">
          <CalendarTodayIcon fontSize="small" />
          <Typography variant="body2">{date}</Typography>
        </Stack>
        <Chip
          label={topic}
          size="small"
          className="bg-[#72BAE3] text-white font-semibold"
        />
      </Stack>
    </CardContent>
  </Card>

  );
}

const NewsArticles: React.FC = () => {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Latest News Articles
      </Typography>
      <Grid container spacing={2}>
        {newsArticles.map((article) => (
          <Grid size={{xs: 12, md: 6, sm: 2}} key={article.id}>
            <NewsCard
              title={article.title}
              link={article.url}
              date={article.date}
              topic={article.topic}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default NewsArticles;