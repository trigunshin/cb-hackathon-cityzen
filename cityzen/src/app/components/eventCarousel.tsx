"use client"
import React, { useRef, useState } from 'react'
import { Card, CardContent, Typography, CardActions, Chip, Stack } from '@mui/material'
import Link from 'next/link';
import { useTheme } from '@mui/system';

export default function EventCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const theme = useTheme();

  const startDragging = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true)
    setStartX(e.pageX - carouselRef.current!.offsetLeft)
    setScrollLeft(carouselRef.current!.scrollLeft)
  }

  const stopDragging = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return
    e.preventDefault()
    const x = e.pageX - carouselRef.current!.offsetLeft
    const walk = (x - startX) * 2 // Scroll-speed
    carouselRef.current!.scrollLeft = scrollLeft - walk
  }

  const cards = [
    {
      title: 'Breaking News: Major Scientific Discovery',
      content: 'Scientists have made a groundbreaking discovery that could revolutionize our understanding of the universe...',
      thumbnail: '/images/science-discovery.jpg',
      link: 'https://example.com/science-discovery',
      date: '2024-10-12'
    },
    {
      title: 'Tech Giant Launches New Product Line',
      content: 'A leading tech company has announced a new line of innovative products that promise to change the way we interact with technology...',
      thumbnail: '/images/tech-product.jpg',
      link: 'https://example.com/tech-product-launch',
      date: '2024-10-11'
    },
    {
      title: 'Global Climate Summit Reaches Historic Agreement',
      content: 'World leaders have come to a consensus on ambitious climate goals at the latest global summit...',
      thumbnail: '/images/climate-summit.jpg',
      link: 'https://example.com/climate-summit',
      date: '2024-10-10'
    },
    {
      title: 'Sports Team Clinches Championship Title',
      content: 'In a thrilling final match, the underdog team has secured their first championship in decades...',
      thumbnail: '/images/sports-championship.jpg',
      link: 'https://example.com/sports-championship',
      date: '2024-10-09'
    },
    {
      title: 'New Art Exhibition Opens to Critical Acclaim',
      content: 'A highly anticipated art exhibition featuring works from renowned international artists has opened its doors to the public...',
      thumbnail: '/images/art-exhibition.jpg',
      link: 'https://example.com/art-exhibition',
      date: '2024-10-08'
    },
    {
        title: 'New Art Exhibition Opens to Critical Acclaim',
        content: 'A highly anticipated art exhibition featuring works from renowned international artists has opened its doors to the public...',
        thumbnail: '/images/art-exhibition.jpg',
        link: 'https://example.com/art-exhibition',
        date: '2024-10-08'
      },
      {
        title: 'New Art Exhibition Opens to Critical Acclaim',
        content: 'A highly anticipated art exhibition featuring works from renowned international artists has opened its doors to the public...',
        thumbnail: '/images/art-exhibition.jpg',
        link: 'https://example.com/art-exhibition',
        date: '2024-10-08'
      },
  ];
  
  return (
    <div className="relative w-full">
      <div
        ref={carouselRef}
        className="flex overflow-x-auto space-x-4 p-4 cursor-grab active:cursor-grabbing"
        style={{ 
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
        onMouseDown={startDragging}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
        onMouseMove={handleMouseMove}
      >
        {cards.map((card, index) => (
         <Card
          key={index}
          color={theme.palette.background.card}
          variant='outlined'
          className="flex-shrink-0 w-64 h-auto"
          sx={{
            scrollSnapAlign: 'start',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
         <CardContent  sx={{ p:2}}>
           <Link href={card.link}>
             <Typography 
               gutterBottom 
               variant='body1' 
               color={theme.palette.text.secondary}
               sx={{textDecoration: 'underline', wordWrap: 'break-word'}} 
             >
               {card.title}
             </Typography>
           </Link>
           <Stack gap={1} direction={'column'} alignItems={'left'}>
             <Typography 
               variant="body1" 
               color={theme.palette.text.secondary}
               style={{
                 display: '-webkit-box',
                 WebkitLineClamp: 3,
                 WebkitBoxOrient: 'vertical',
                 overflow: 'hidden',
                 textOverflow: 'ellipsis'
               }}
             >
               {card.content}
             </Typography>
             <Stack gap={1} direction={'row'} alignItems={'center'}>
               <Chip
                 variant="outlined"
                 size="small"
                 sx={{ borderColor: `${theme.palette.text.secondary}` }}
                 label={
                   <Typography variant="caption" color={theme.palette.text.secondary}>
                     {card.date}
                   </Typography>
                 }
               />
             </Stack>
           </Stack>
         </CardContent>
       </Card>
        ))}
      </div>
      <style jsx global>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .overflow-x-auto::-webkit-scrollbar {
          display: none;
        }

        /* Hide scrollbar for IE, Edge and Firefox */
        .overflow-x-auto {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </div>
  )
}