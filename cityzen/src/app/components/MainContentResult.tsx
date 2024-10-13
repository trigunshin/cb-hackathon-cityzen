import { Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

const MainContentResult = () => {
  const [text, setText] = useState('');

  useEffect(() => {
    fetch('https://api.example.com/text')
      .then(response => response.json())
      .then(data => setText(data.text))
      .catch(error => {
        console.error('Error fetching text:', error);
        setText(loremipsum);
      });
  }, []);

  const loremipsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ut lorem tellus. Pellentesque finibus justo ut orci malesuada varius. Morbi et augue a lorem pulvinar vestibulum ac eget lectus. Etiam eu sagittis leo. Nam dictum dui ac lacus luctus congue. Donec tincidunt nisi a eros efficitur luctus. Nulla accumsan mauris vel libero egestas, vestibulum dignissim sapien ultricies. Pellentesque sodales sollicitudin nisi. Cras sollicitudin nibh ac nibh commodo varius. Suspendisse maximus erat ac accumsan rhoncus. Nam odio augue, ultrices in finibus nec, efficitur ac arcu. \n Vivamus a enim ornare, auctor libero sed, hendrerit diam. Nullam et ex ac dolor dapibus pellentesque. Aenean porttitor dui ex, at interdum mauris sagittis eu. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Quisque vestibulum quam vitae est vestibulum, quis ullamcorper lectus molestie. Nam arcu tellus, malesuada at rhoncus eu, pulvinar volutpat enim. Morbi facilisis magna sapien, a finibus ipsum imperdiet non. Morbi ac feugiat ipsum. Nam cursus elit at lacus vestibulum vulputate. Pellentesque auctor sagittis arcu, feugiat elementum mi blandit ut. Curabitur dignissim imperdiet urna sit amet finibus. Praesent sagittis lorem orci, in tincidunt libero congue et. Vestibulum sit amet diam sed erat rhoncus euismod sed at risus. Nam et iaculis eros. Aenean in lorem auctor, efficitur ipsum at, rhoncus augue. Vestibulum volutpat orci at sem interdum, eu pharetra urna cursus. Mauris imperdiet lacus at auctor convallis. Fusce ac tortor ut orci lacinia porttitor. Interdum et malesuada fames ac ante ipsum primis in faucibus. Suspendisse imperdiet pulvinar ultricies. Integer efficitur risus et massa faucibus, quis rutrum orci malesuada. Sed id egestas libero, suscipit consectetur velit. Fusce suscipit hendrerit justo ac ultricies. Mauris finibus nisi vel pellentesque lacinia. \n Pellentesque accumsan nulla non ante commodo, nec tempus diam mollis. Maecenas a varius augue. Curabitur mollis tincidunt libero, id fringilla arcu lobortis a.";

  return (
    <>
    <Typography fontSize={'18px'} paddingY={2} color='#868686' gutterBottom>
        A summary of the information we analyzed relating to your question...
    </Typography>
    <Box sx={{ padding: 1}}>
        {text ? text.split('\n').map((line, index) => (
            <Typography key={index} variant="body1" component="p" sx={{ lineHeight: 2 }} color='#868686'>
                {line}
            </Typography>
        )) : loremipsum.split('\n').map((line, index) => (
            <Typography key={index} variant="body1" component="p" sx={{ lineHeight: 2 }} color='#868686'>
                {line}
            </Typography>
        ))}
    </Box>
    </>

  ); 
}

export default MainContentResult;

