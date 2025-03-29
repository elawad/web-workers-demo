import syntax from 'react-syntax-highlighter/dist/esm/styles/prism/one-dark';
import {
  Appear,
  Box,
  CodePane,
  Deck,
  FlexBox,
  Heading,
  Image,
  Link,
  ListItem,
  Progress,
  Quote,
  Slide,
  type SpectacleThemeOverrides,
  Text,
  UnorderedList,
} from 'spectacle';

import App from '../App';
import rendererImg from './renderer.jpg';
import workerImg from './worker.jpg';
import './index.css';

const theme = {
  size: {
    width: '100vw',
    height: '100vh',
  },
  colors: {
    primary: 'var(--primary)', // text
    secondary: 'var(--secondary)', // header
    tertiary: 'inherit', // background
  },
  fonts: {
    header: 'inherit',
    text: 'inherit',
  },
  fontSizes: {
    monospace: '1.5rem',
  },
} as SpectacleThemeOverrides & { size: { width: string; height: string } };

const template = () => (
  <FlexBox justifyContent="flex-end" position="absolute" bottom={0} width={1}>
    <Box padding="0.5em 1em">
      <Progress />
    </Box>
  </FlexBox>
);

function Slides() {
  return (
    <Deck theme={theme} template={template} className="slides">
      <Slide>
        <Heading>Web Workers</Heading>
        <Quote>
          <Text>Offloading work from the main thread.</Text>
        </Quote>

        <FlexBox alignItems="flex-end" justifyContent="inherit" flexGrow={1}>
          <Text fontSize="0.85em" mb="0 !important" pb="0 !important">
            Aymen Elawad
          </Text>
        </FlexBox>
      </Slide>

      <Slide>
        <Heading>Why use Workers</Heading>

        <UnorderedList>
          <Appear>
            <ListItem>JavaScript is a single-threaded language</ListItem>
          </Appear>
          <Appear>
            <ListItem>All tasks run on the main thread:</ListItem>
            <UnorderedList>
              <Appear>
                <ListItem>JavaScript / Style / Layout / Paint</ListItem>
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
            <Image width={865} src={rendererImg} />
            <Link
              fontSize="0.65em"
              href="https://developer.chrome.com/blog/inside-browser-part3"
            >
              Chrome Developers
            </Link>
          </Box>

          <Box width={1}>
            <UnorderedList>
              <Appear>
                <ListItem>UI runs on main thread</ListItem>
              </Appear>
              <Appear>
                <ListItem>Workers run in dedicated threads</ListItem>
              </Appear>
              <Appear>
                <ListItem>Frees up the main thread</ListItem>
              </Appear>
            </UnorderedList>
          </Box>
        </FlexBox>
      </Slide>

      <Slide>
        <Heading>Limitations</Heading>

        <UnorderedList>
          <Appear>
            <ListItem>Can not access the DOM</ListItem>
          </Appear>
          <Appear>
            <ListItem>Global Window not available</ListItem>
          </Appear>
          <Appear>
            <ListItem>Data is copied between worker & main thread</ListItem>
            <UnorderedList>
              <Appear>
                <ListItem>
                  Some can be moved as a &quot;Transferable Object&quot;
                </ListItem>
              </Appear>
            </UnorderedList>
          </Appear>
          <Appear>
            <ListItem>Can use many standard Web APIs:</ListItem>
            <UnorderedList>
              <Appear>
                <ListItem>Fetch API / FileReader / ImageData</ListItem>
              </Appear>
            </UnorderedList>
          </Appear>
        </UnorderedList>
      </Slide>

      <Slide>
        <Heading>Example Usage</Heading>

        <FlexBox justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Image width={865} src={workerImg} />
            <Link
              fontSize="0.65em"
              href="https://developer.chrome.com/blog/createimagebitmap-in-chrome-50"
            >
              Chrome Developers
            </Link>
          </Box>

          <Box width={1}>
            <UnorderedList>
              <Appear>
                <ListItem>Main UI thread sends url to worker</ListItem>
              </Appear>
              <Appear>
                <ListItem>Worker fetches & manipulates image</ListItem>
              </Appear>
              <Appear>
                <ListItem>ImageData sent back to main thread</ListItem>
              </Appear>
            </UnorderedList>
          </Box>
        </FlexBox>
      </Slide>

      <Slide>
        <Heading>How to Use</Heading>

        <FlexBox justifyContent="space-around">
          <CodePane language="js" theme={syntax} showLineNumbers={false}>{`
            // main.js
            const worker = new Worker('w.js')

            worker.postMessage(10)

            worker.onmessage = (event) => {
              const sum = event.data
            }
          `}</CodePane>

          <Appear>
            <CodePane language="js" theme={syntax} showLineNumbers={false}>{`
              // w.js
              self.onmessage = (event) => {

                const sum = event.data * 2

                self.postMessage(sum)

              }
            `}</CodePane>
          </Appear>
        </FlexBox>
      </Slide>

      <Slide className="slide-app">
        <Heading>Demo</Heading>

        <App inSlide />
      </Slide>

      <Slide>
        <Heading>Resources</Heading>

        <Text>
          <Link href="https://github.com/elawad/web-workers-demo">
            github.com/elawad/web-workers-demo
          </Link>
        </Text>

        <Appear>
          <Text mt="2em !important">
            <Link
              href="https://developer.mozilla.org/docs/Web/API/Web_Workers_API"
              fontSize="0.7em"
            >
              MDN Web Workers
            </Link>
          </Text>

          <Text pt="0 !important">
            <Link
              href="https://nodejs.org/api/worker_threads.html#worker-threads"
              fontSize="0.7em"
            >
              Node Worker Threads
            </Link>
          </Text>
        </Appear>
      </Slide>
    </Deck>
  );
}

export default Slides;
