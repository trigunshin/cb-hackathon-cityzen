"use client"
import ModernButton from "@/app/components/modernButton";
import { Container, Typography, Box, TextField, Button, Stack, Divider, FormGroup, FormControl } from "@mui/material";
import { Grid, useTheme, width } from "@mui/system";

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


export default function Landing() {
    const theme = useTheme();

    return (
    <Box sx={{height: '100vh'}}>
        <Grid 
        container 
        //spacing={2}
        alignItems="center" 
        direction="row" 
        wrap="wrap"
        height='100%'
        width='100%'
        >
        {/* Placeholder for Video/Image on the Left */}
        <Grid 
            size={{ xs: 12, md: 4 }}
            width="100%" 
            height="100%" 
            bgcolor="grey.300" 
            display="flex" 
            justifyContent="center" 
            alignItems="center"
        >
            <Box 
                sx={{ 
                    width: '100%', 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    overflowY: 'auto',
                }}
            >
                {METRALL_INFO.questions.reduce((acc, question, index) => {
                    const row = Math.floor(index / 2);
                    if (!acc[row]) {
                        acc[row] = [];
                    }
                    acc[row].push(
                        <Box 
                            key={index} 
                            sx={{ 
                                margin: 1, 
                                padding: 1.5, 
                                border: `1px solid ${theme.palette.secondary.contrastText}`, 
                                borderRadius: theme.spacing(3),
                                display: 'flex', 
                                justifyContent: 'center', 
                                alignItems: 'center' 
                            }}
                        >
                            <Typography variant='caption' color="textSecondary" align="center">{question}</Typography>
                        </Box>  
                    );
                    return acc;
                }, []).map((chips, rowIndex) => (
                    <Box 
                        key={rowIndex} 
                        sx={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            width: '100%', 
                            flexWrap: 'wrap' 
                        }}
                    >
                        {chips}
                    </Box>
                ))}
            </Box>
            <Divider orientation="vertical" flexItem sx={{ bgcolor: "secondary.contrastText" }} />

        </Grid>

        {/* Text Content on the Right */}
        <Grid size={{xs: 12, md: 8}} container direction="column" height='100vh' width="100%" height='100%'>
            <Grid size={8} width={'100%'} px={5} py={5} px={7}>    
                <Stack direction={'row'} gap={5} pb={3} alignContent={'center'}>
                    <Typography variant="h1" className="jaro" color="textPrimary">
                        Metrall
                    </Typography>
                    <Divider orientation="vertical" flexItem variant='middle' sx={{ bgcolor: "secondary.contrastText" }} />
                    <Typography variant="body1" color="textSecondary" alignContent='center'>tbd</Typography>
                </Stack>
                
                <Typography variant="h3" color="textSecondary" paragraph>
                Making City Data Accessible with AI
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
            <Divider sx={{ color: "secondary.contrastText" }} />
            {/* Form Section for Email Sign-Up */}
            <Grid size={4} width={'100%'} py={5} px={7}>
                <Stack sx={{alignContent: 'center' }}>
                    <Typography variant="h6" color="textPrimary" gutterBottom>
                        Stay Informed
                    </Typography>
                    
                    <Typography variant="body1" color="textSecondary" paragraph>
                        Sign up to receive updates on Metrall’s launch, new features, and exclusive insights into how AI is transforming the way we interact with city data.
                    </Typography>

                        
                    <Box display="flex" justifyContent="center">
                        <form>
                            <FormGroup>
                                <FormControl fullWidth margin='dense'>
                                <TextField
                                    type="email"
                                    label="Enter your email"
                                    placeholder="example@example.com"
                                    variant="outlined"
                                />
                                </FormControl>
                                <FormControl fullWidth margin="dense">
                                <ModernButton query="" type="submit" fullWidth>
                                    Submit
                                </ModernButton>
                                </FormControl>
                            </FormGroup>
                        </form>
                    </Box>
                </Stack>
            </Grid>
        </Grid>
        </Grid>
    </Box>
  );
}
