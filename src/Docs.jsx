import syntax from 'react-syntax-highlighter/dist/cjs/styles/prism/coldark-dark';
import {
  Appear,
  Box,
  CodePane,
  Deck,
  FlexBox,
  Heading,
  Image,
  ListItem,
  Progress,
  Quote,
  Slide,
  Text,
  UnorderedList,
} from 'spectacle';

import ImgRenderer from './assets/renderer.jpg';
import ImgWorker from './assets/worker.jpg';
import App from './App';
import './Docs.css';

const theme = {
  size: {
    width: '100vw',
    height: '100vh',
  },
  colors: {
    // primary: '#fff',
    tertiary: '#242424', // slide bg
  },
  fonts: {
    header: '"Fira Code", "Helvetica Neue", Helvetica, Arial, sans-serif',
    text: '"Fira Code", "Helvetica Neue", Helvetica, Arial, sans-serif',
  },
  fontSizes: {
    // h1: '72px',
    // h2: '64px',
    // h3: '56px',
    // text: '44px',
    monospace: '1.5rem',
  },
};

const template = () => (
  <FlexBox justifyContent="flex-end" position="absolute" bottom={0} width={1}>
    <Box padding="0.5em 1em">
      <Progress />
    </Box>
  </FlexBox>
);

function Docs() {
  return (
    <Deck theme={theme} template={template} className="docs">
      <Slide>
        <Heading>Web Workers</Heading>

        <Quote>
          <Text>Offloading work from the main thread.</Text>
        </Quote>

        <FlexBox alignItems="flex-end" justifyContent="unset" flex="1 1 auto">
          <Text fontSize="0.85em" margin="0 0 4em 0" padding="0px">
            Aymen Elawad
            <br />
            Feb, 2023
          </Text>
        </FlexBox>
      </Slide>

      <Slide>
        <Heading>Why use workers?</Heading>

        <UnorderedList>
          <Appear>
            <ListItem>JavaScript is a single-threaded language</ListItem>
          </Appear>
          <Appear>
            <ListItem>All tasks run on the main thread</ListItem>
            <UnorderedList>
              <Appear>
                <ListItem>JavaScript, Style, Layout, Paint, ...</ListItem>
              </Appear>
            </UnorderedList>
          </Appear>
          <Appear>
            <ListItem>Heavy CPU tasks can lock the main UI</ListItem>
          </Appear>
          <Appear>
            <ListItem>
              Web workers run expensive tasks in the background
            </ListItem>
          </Appear>
        </UnorderedList>
      </Slide>

      <Slide>
        <Heading>Threads</Heading>

        <FlexBox justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Image width={865} src={ImgRenderer} />
            <Text fontSize="0.65em" margin="0px" padding="0px">
              developer.chrome.com/blog/inside-browser-part3
            </Text>
          </Box>

          <Box width={1}>
            <UnorderedList>
              <Appear>
                <ListItem>UI runs on main thread</ListItem>
              </Appear>
              <Appear>
                <ListItem>Workers run in dedicated threads</ListItem>
              </Appear>
            </UnorderedList>
          </Box>
        </FlexBox>
      </Slide>

      <Slide>
        <Heading>Example Usage</Heading>

        <FlexBox justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Image width={865} src={ImgWorker} />
            <Text fontSize="0.65em" margin="0px" padding="0px">
              developer.chrome.com/blog/createimagebitmap-in-chrome-50
            </Text>
          </Box>

          <Box width={1}>
            <UnorderedList>
              <Appear>
                <ListItem>UI runs on main thread</ListItem>
              </Appear>
              <Appear>
                <ListItem>Workers run in dedicated threads</ListItem>
              </Appear>
            </UnorderedList>
          </Box>
        </FlexBox>
      </Slide>

      <Slide>
        <Heading>Code Example</Heading>

        <FlexBox justifyContent="space-around">
          <Appear>
            <CodePane language="js" theme={syntax} showLineNumbers={false}>{`
              // main.js
              const worker = new Worker('worker.js')
                
              worker.postMessage(10)
                
              worker.onmessage = (e) => {
                console.log(e.data)
              }
            `}</CodePane>
          </Appear>

          <Appear>
            <CodePane language="js" theme={syntax} showLineNumbers={false}>{`
              // worker.js

              onmessage = (e) => {
                  
                // expensive work...
                  
                postMessage(e.data * 2)  
              }
            `}</CodePane>
          </Appear>
        </FlexBox>
      </Slide>

      <Slide>
        <Heading>Demo</Heading>

        <FlexBox>
          <App />
        </FlexBox>
      </Slide>
    </Deck>
  );
}

export default Docs;
