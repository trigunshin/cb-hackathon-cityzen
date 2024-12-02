"use client"
import ModernButton from "@/app/components/modernButton";
import { Typography, Box, TextField, Stack, Divider, FormGroup, FormControl, styled, IconButton, Container, Button, FormHelperText } from "@mui/material";
import { Grid, useMediaQuery } from "@mui/system";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import { useCustomTheme } from "@/app/styles/theme";
import { useEffect, useRef, useState } from "react";
import PublicIcon from '@mui/icons-material/Public';
import AnimatedBox from "@/app/components/AnimatedBox";
import Link from 'next/link';
import Image from "next/image";
import ScrollingChips from "@/app/components/ScrollingChips";


const METRALL_INFO = {
    left: {
      title:
        "What is Metrall?",
      imagePlacement: "right",
      button: true,
      link: '/about',
      description:
        "Metrall empowers communities by offering easy access to the latest local news, events, and civic activities. With AI-driven insights, Metrall keeps you informed on important community matters, from city council meetings to public events, all in one intuitive platform. Stay connected to the pulse of your neighborhood and make informed decisions about your city.",
      },
    right: {
      title: "How does Metrall work?",
      imagePlacement: "left",
      button: false,
      link: null,
      description:
        "Metrall is more than just a news aggregator; it brings together real-time data, offering information based on your interests and location. Metrall connects to various public data APIs and scrapes city council meeting data, then uses artifical intelligence to summarize real data to make information more accessible. ",
    },
    questions: [
      // City Government & Policy
      'What were the key decisions from yesterday\'s LA City Council meeting?',
      'How is LA spending its new infrastructure budget?',
      'What are the proposed changes to local zoning laws in Downtown LA?',
      'When is the next public hearing about the new transit project?',
      
      // Community & Neighborhoods
      'What new businesses have opened in Highland Park this month?',
      'Are there any upcoming neighborhood council meetings in Venice?',
      'What\'s the status of the new community garden project in Boyle Heights?',
      'Which streets will be closed for the upcoming CicLAvia event?',
      
      // Environment & Infrastructure
      'What\'s being done about water conservation in LA right now?',
      'When will the Metro Purple Line extension be completed?',
      'Are there any e-waste collection events happening this month?',
      'What\'s the air quality forecast for the San Fernando Valley today?',
      
      // Public Safety
      'Has there been any progress on the Vision Zero traffic safety initiative?',
      'What are the crime statistics for my neighborhood this quarter?',
      'Where can I find information about emergency preparedness workshops?',
      'Are there any active street repairs in Silver Lake?',
      
      // Culture & Events
      'What free concerts are happening at Levitt Pavilion this summer?',
      'Which museums are offering free admission this weekend?',
      'What food festivals are coming up in the next month?',
      'Are there any volunteer opportunities at local schools?',
      
      // Housing & Development
      'What new affordable housing projects are being built in South LA?',
      'How can I participate in the next community planning meeting?',
      'What are the current rent control regulations in Los Angeles?',
      'Which neighborhoods are seeing the most development activity?',
      
      // Education & Youth
      'What summer programs are available for teens in LA?',
      'When is the next LAUSD board meeting?',
      'Which public libraries are hosting reading programs?',
      'What after-school activities are available in my area?'
    ]
  };


const sections = [
    {
        gifPosition: 'left',
        title: 'Get Total Local!',
        text: 'See all the local news, aggregated and unbiased, from sources such as Local News, NextDoor, Meetup, City Council Meetings, Public Safety Data, end beyond in a quick news article format.',
    },
    {
        gifPosition: 'right',
        title: 'Search & Find All Things Local',
        text: 'Want to know if any events are happening nearby? Any meetups? Protests? Safety issues? Hot deals or a new tasty place? Metrall gathers all the local news and apps together so you can search and know what`s going on at all times whenever you want. It`s all there, just search for it!',
    },
];  

const footerLinks = [
    {
      section: 'Learn More',
      links: [
        { name: 'Terms of Service', url: '/terms' },
        { name: 'Privacy Policy', url: '/privacy' },

      ],
    },
    {
      section: 'Other Links',
      links: [
        { name: 'About Us', url: '/about' },
        { name: 'Contact', url: '/contact' },
      ],
    },
  ];

export default function Landing() {
    const { theme, toggleTheme } = useCustomTheme();
    const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [medium, setMedium] = useState(true);
    const [email, setEmail] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handleSubmit = async (email: string) => {
        try {
        setLoading(true);
        setMessage(null);

        const response = await fetch('/api/send', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        if (response.ok) {
            const data = await response.json();
            setMessage('Email sent successfully!');
        } else {
            const errorData = await response.json();
            setMessage(`Failed to send email!`);
        }
        } catch (error) {
        setMessage('An error occurred while sending the email.');
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        setMedium(!isMediumScreen);
    }, [isMediumScreen]);
 
    return (
        <Box sx={{height: '100%', position: 'relative', bgcolor: `${theme.palette.background.paper}`}}>
            <Box sx={{ height: { xs: '100%', sm: '100%', md: '100vh' }}}>
                <Grid container alignItems='center' direction='row' wrap='wrap-reverse' height='100%'
                    //spacing={2}
                    //width='100%'
                >
                    {/* left side */}
                    <Grid 
                        size={{ xs: 12, md: 4 }}
                        width="100%" 
                        height="100%" 
                        display="flex" 
                        justifyContent="center" 
                        alignItems="center"
                        sx={{background: `linear-gradient(180deg, ${theme.palette.background.default} 60%, ${theme.palette.primary.light}) 40%`}}
                    >
                        <ScrollingChips questions={METRALL_INFO.questions} />
                        {medium ? (
                        <Divider orientation="vertical" flexItem sx={{ bgcolor: "secondary.contrastText" }} />
                        ) : (
                        <Divider orientation="horizontal" flexItem sx={{ bgcolor: "secondary.contrastText" }} />
                        )}
                    </Grid>

                    {/* right side */}
                    <Grid size={{xs: 12, md: 8}} container direction='column' sx={{bgcolor: `${theme.palette.background.paper}`,  position: 'relative'}}>
                        <IconButton
                        aria-label="switch mode"
                        onClick={toggleTheme}
                        sx={{
                            zIndex: 3,
                            m: 1,
                            gap: 1,
                            color: `${theme.palette.primary.contrastText}`,
                            position: 'fixed',
                            top: 8,
                            right: 8,
                        }}
                        size="small"
                        >
                        <Brightness4Icon />
                        </IconButton>
                        <Grid size={6} width={'100%'} px={7} py={3}>    
                            <Stack direction={'row'} gap={5} pb={3} alignContent={'center'}>
                                <Typography variant="h1" className="jaro" color="textPrimary">
                                    Metrall
                                </Typography>
                                {/* <Divider orientation="vertical" flexItem variant='middle' sx={{ bgcolor: "secondary.contrastText" }} />
                                <Typography variant="body1" color="textSecondary" alignContent='center'>tbd</Typography> */}
                            </Stack>
                            
                            <Typography variant="h3" color="textPrimary" paragraph>
                            Making City Data Accessible with AI 🏙️
                            </Typography>

                            <Typography variant="body1" color="textSecondary" paragraph>
                            Metrall is a product designed to empower citizens, developers, and businesses by providing streamlined access to city data.
                            With the power of artificial intelligence, we help you discover insights, visualize trends, and make data-driven decisions for a smarter city experience.
                            </Typography>
                            
                            <Typography variant="body1" color="textSecondary" paragraph>
                            Imagine a world where all the information you need about your city is easily accessible and presented in a way that's simple to understand.
                            Metrall brings this vision to life by analyzing complex city datasets and turning them into meaningful insights that you can access anytime.
                            </Typography>
                        </Grid>
                        <Divider sx={{ bgcolor: "secondary.contrastText" }} />
                        {/* Form Section for Email Sign-Up */}
                        <Grid size={6} width='100%' py={5} px={7}>
                            <Stack sx={{alignContent: 'center' }}>
                                <Typography variant="h6" color="textPrimary" gutterBottom>
                                    Stay Informed
                                </Typography>
                                
                                <Typography variant="body1" color="textSecondary" paragraph>
                                    Sign up to receive updates on Metrall’s launch, new features, and exclusive insights into how AI is transforming the way we interact with city data.
                                </Typography>

                                <Box display="flex" >
                                <form>
                                <FormGroup row={true} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline', gap: 2 }}>
                                    <Stack direction='column' alignItems='center'>
                                        <FormControl margin="dense">
                                            <TextField
                                            type="email"
                                            label="Enter your email"
                                            placeholder="example@example.com"
                                            value={email}
                                            onChange={handleEmailChange}
                                            variant="outlined"
                                            sx={{
                                                borderRadius: theme.spacing(2),
                                                "& .MuiOutlinedInput-root": {
                                                bgcolor: 'background.default',
                                                borderRadius: theme.spacing(2),
                                                "& fieldset": {
                                                    borderColor: 'primary.contrastText',
                                                },
                                                "&:hover fieldset": {
                                                    borderColor: 'primary.contrastText',
                                                },
                                                "&.Mui-focused fieldset": {
                                                    borderColor: 'primary.contrastText',
                                                },
                                                },
                                                "& .MuiInputLabel-root": {
                                                color: 'primary.contrastText',
                                                },
                                            }}
                                            />
                                        </FormControl>
                                        <FormHelperText id="my-helper-text">We'll never share your email.</FormHelperText>
                                    </Stack>
                                    <Stack direction={'row'} gap={2} alignItems='center'>
                                            <ModernButton
                                            query=""
                                            email={email}
                                            onEmailSubmit={handleSubmit} // Pass the submission handler
                                            type="button" // Ensure it doesn't submit a form by default
                                            disabled={loading} // Disable button during loading
                                            >
                                            {loading ? 'Sending...' : 'Submit'}
                                            </ModernButton>
                                        <Typography variant='body1' color={theme.palette.primary.light}>{message && <p>{message}</p>} </Typography>
                                    </Stack>
                                </FormGroup>
                                </form>
                                </Box>
                            </Stack>
                            
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
            <Divider orientation="horizontal" flexItem sx={{ bgcolor: "secondary.contrastText" }} />
            <Box sx={{height: 'auto', bgcolor: theme.palette.primary.light}}>
                <Box sx={{height: { xs: '100%', sm: '100%', md: '100vh' }, paddingY: {xs: 6, md: 6}, background: `linear-gradient(${theme.palette.background.default}, ${theme.palette.background.paper}) padding-box`, borderBottomRightRadius: {sm: theme.spacing(4), md: theme.spacing(10)}, borderBottomLeftRadius: {sm: theme.spacing(4), md: theme.spacing(10)}, borderBottom: `1px solid ${theme.palette.secondary.contrastText}`}}>
                    <Container sx={{ height: '100%', alignContent: 'center' }}>
                        <Stack spacing={6} direction="column">
                            {sections.map((section, index) => (
                            <Grid container spacing={4} key={index}>
                                {section.gifPosition === 'left' && (
                                <Grid size={{xs: 12, md: 6}}>
                                    <AnimatedBox 
                                        animationProps={{
                                            duration: 0.5, 
                                            ease: "easeOut",
                                        }}
                                        sx={{
                                            borderRadius: theme.spacing(2),
                                            width: '100%',
                                            height: 275,
                                            backgroundColor: theme.palette.background.paper,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            border: `1px solid ${theme.palette.secondary.contrastText}`,
                                        }}
                                    >
                                    <Typography variant="body1" color="textSecondary">GIF / Demo</Typography>
                                    </AnimatedBox>
                                </Grid>
                                )}
                                <Grid size={{xs: 12, md: 6}} alignContent={'center'}>
                                <Typography variant="h3" color="textPrimary" gutterBottom>{section.title}</Typography>
                                <Typography variant="body1" color="textSecondary">{section.text}</Typography>
                                </Grid>
                                {section.gifPosition === 'right' && (
                                <Grid size={{xs: 12, md: 6}}>
                                    <AnimatedBox
                                        animationProps={{
                                            duration: 0.5,
                                            ease: "easeOut",
                                        }}
                                        sx={{
                                            borderRadius: theme.spacing(2),
                                            width: "100%",
                                            height: 275,
                                            backgroundColor: theme.palette.background.paper,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            border: `1px solid ${theme.palette.secondary.contrastText}`,
                                        }}
                                        >
                                        <Typography variant="body1" color="textSecondary">GIF / Demo</Typography>
                                    </AnimatedBox>
                                </Grid>
                                )}
                            </Grid>
                            ))}
                        </Stack>                
                    </Container>
                </Box>

                <Box sx={{height: { xs: '100%', sm: '100%', md: '100vh' }, bgcolor: theme.palette.primary.light}}>
                    <Container sx={{ height: '100%', alignContent: 'center', width: '100%',  paddingY: {xs: 6, md: 0}, }}>
                        <Stack direction={'column'} gap={4}>
                            <Typography textAlign={'center'} variant='h2' color={theme.palette.background.paper} gutterBottom>
                                The Next Gen Approach to Local News & Information
                            </Typography>
                            <Grid container spacing={2} justifyContent="center">
                                {[1, 2, 3, 4].map((item, index) => (
                                <Grid key={index}>
                                    <AnimatedBox 
                                        animationProps={{
                                            duration: 0.5,
                                            ease: "easeOut",
                                        }}
                                        sx={{
                                            borderRadius: theme.spacing(2),
                                            height: 200,
                                            width: 275,
                                            backgroundColor: theme.palette.background.paper,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            border: `1px solid ${theme.palette.secondary.contrastText}`,
                                        }}
                                    >
                                    {`Box ${item}`}
                                    </AnimatedBox>
                                </Grid>
                                ))}
                            </Grid>
                        </Stack>
                    </Container>
                </Box>

                <Box paddingY={{xs: 4, sm: 4, md: 4}} sx={{height: { xs: '100%', sm: '100%', md:'50vh'}, bgcolor: theme.palette.background.paper, borderTopRightRadius: theme.spacing(10), borderTopLeftRadius: theme.spacing(10), borderTop: `1px solid ${theme.palette.secondary.contrastText}`}}>
                    <Container sx={{ height: '100%', alignContent: 'center' }}>
                        <Grid container spacing={4} paddingX={{xs: 3, sm: 3, md: 3}} sx={{alignItems: 'center'}}>
                            <Grid size={{xs: 12, md: 6}}>
                                <Typography
                                    variant="h3"
                                    component="div"
                                    sx={{ fontWeight: "bold", marginBottom: "1rem" }}
                                >
                                    Text
                                </Typography>
                                <Typography variant="body1" color="textSecondary">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                </Typography>
                            </Grid>
                            <Grid size={{xs: 12, md: 6}} sx={{ display: 'flex', justifyContent: "center", alignItems: "center",}}>
                                <AnimatedBox 
                                    animationProps={{
                                        duration: 0.5,
                                        ease: "easeOut",
                                    }}
                                    sx={{
                                    display: "flex",
                                    gap: "1rem",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    }}
                                >
                                    <PublicIcon fontSize="large" color="action" />
                                    <PublicIcon fontSize="large" color="action" />
                                    <PublicIcon fontSize="large" color="action" />
                                    <PublicIcon fontSize="large" color="action" />
                                </AnimatedBox>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>

                <Box paddingY={{xs: 4, sm: 4, md: 4}} sx={{height: { xs: '100%', sm: '100%', md:'75vh'}, bgcolor: theme.palette.background.default, borderTop: `1px solid ${theme.palette.secondary.contrastText}`}}>
                    <Container sx={{ height: '100%', alignContent: 'center' }}>
                        <Grid container spacing={4} paddingX={{xs: 3, sm: 3, md: 3}} alignItems={'center'}>
                        <Grid size={{xs: 12, md: 6}} sx={{ display: 'flex', justifyContent: "center"}}>
                                    <AnimatedBox 
                                        animationProps={{
                                            duration: 0.5,
                                            ease: "easeOut",
                                        }}
                                        sx={{
                                            display: "flex",
                                            gap: "1rem",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            }}
                                    >
                                        <Image width="600" height="300" src={`/mockup.png`} alt="mockup"/>
                                        {/* <Typography>GIF / Demo</Typography> */}
                                    </AnimatedBox>
                            </Grid>
                            <Grid size={{xs: 12, md: 6}}>
                                <Typography
                                    variant="h3"
                                    component="div"
                                    sx={{ fontWeight: "bold", marginBottom: "1rem" }}
                                >
                                    Text
                                </Typography>
                                <Typography variant="body1" color="textSecondary">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                </Typography>
                                <Button
                                    variant="text"
                                    color="primary"
                                    sx={{ marginTop: "1rem", textTransform: "none" }}
                                >
                                    Button text here &gt;
                                </Button>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>
                
                <Box paddingY={{xs: 4, sm: 4, md: 4}} sx={{height: { xs: '100%', sm: '100%', md:'50vh'}, bgcolor: theme.palette.background.paper, borderBottomRightRadius: theme.spacing(10), borderBottomLeftRadius: theme.spacing(10), borderTop: `1px solid ${theme.palette.secondary.contrastText}`, borderBottom: `1px solid ${theme.palette.secondary.contrastText}`}}>
                    <Container sx={{ height: '100%', alignContent: 'center' }} >
                        <Grid container spacing={4} paddingX={{xs: 3, sm: 3, md: 3}} sx={{alignItems: 'center'}}>
                            <Grid size={{xs: 12, md: 6}}>
                                <Typography
                                    variant="h3"
                                    component="div"
                                    sx={{ fontWeight: "bold", marginBottom: "1rem" }}
                                >
                                    Text
                                </Typography>
                                <Typography variant="body1" color="textSecondary">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                </Typography>
                                <Button
                                    variant="text"
                                    color="primary"
                                    sx={{ marginTop: "1rem", textTransform: "none" }}
                                >
                                    Button text here &gt;
                                </Button>
                            </Grid>
                            <Grid size={{xs: 12, md: 6}} sx={{ display: 'flex', justifyContent: "center", alignItems: "center",}}>
                                <AnimatedBox 
                                        animationProps={{
                                            duration: 0.5, // Animation duration
                                            ease: "easeOut", // Smooth easing
                                        }}
                                    sx={{
                                    display: "flex",
                                    gap: "1rem",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    }}
                                >
                                    <PublicIcon fontSize="large" color="action" />
                                    <PublicIcon fontSize="large" color="action" />
                                    <PublicIcon fontSize="large" color="action" />
                                    <PublicIcon fontSize="large" color="action" />                            
                                </AnimatedBox>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>
            </Box>

            {/* Content + Footer */}
            <Box sx={{height: { xs: '100%', sm: '100%', md:'50vh'}, bgcolor: `${theme.palette.primary.light}`}}>
                <Typography textAlign={'center'} paddingTop='50px' variant='h2' color={theme.palette.background.paper}>
                    Text here?
                </Typography>
                <Box sx={{ height: '100%', alignContent: 'end', bottom: 0, left: 0, width: '100%', }}>
                    <Grid container columns={3} sx={{ bgcolor: "background.default", borderTop: `1px solid ${theme.palette.secondary.contrastText}`}}>
                        <Grid size={{xs: 3, sm: 1}} alignContent={'center'}>
                            <Typography paddingY={2} variant="h2" className='jaro' style={{ fontWeight: 'bold', textAlign: 'center' }}>
                                Metrall
                            </Typography>
                        </Grid>
                        <Divider orientation="vertical" flexItem sx={{ bgcolor: "secondary.contrastText" }} />
                        <Grid 
                            size={{xs: 6, sm: 1}}
                            container
                            alignItems='center' 
                            justifyContent="space-around"
                            paddingY={3}
                            >
                            {footerLinks.map((section, index) => (
                                <Grid  
                                    size={{xs: 1}}
                                    key={section.section} 
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        }}
                                >
                                <Stack
                                    direction="column"
                                    spacing={2}
                                    alignItems={index === 0 ? 'flex-start' : 'flex-end'}
                                >
                                    {section.links.map(link => (
                                    <Link 
                                        key={link.name} 
                                        href={link.url} 
                                        passHref 
                                        style={{ textAlign: 'left' }}
                                    >
                                        <Typography variant="caption" color={theme.palette.primary.contrastText}>{link.name}</Typography>
                                    </Link>
                                    ))}
                                </Stack>
                                </Grid>
                            ))}
                        </Grid>
                    <Divider orientation="vertical" flexItem sx={{ bgcolor: "secondary.contrastText" }} />
                    </Grid>
                </Box>
            </Box>

        </Box>
    );
}
