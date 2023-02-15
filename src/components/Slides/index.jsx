import syntax from 'react-syntax-highlighter/dist/cjs/styles/prism/coldark-dark';
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
  Text,
  UnorderedList,
} from 'spectacle';

import rendererImg from '../../assets/renderer.jpg';
import workerImg from '../../assets/worker.jpg';
import Demo from '../Demo';
import './Slides.css';

const theme = {
  size: {
    width: '100vw',
    height: '100vh',
  },
  colors: {
    secondary: 'var(--secondary)', // header
    tertiary: 'var(--bg)', // background
  },
  fonts: {
    header: '"Fira Code", "Helvetica Neue", Helvetica, Arial, sans-serif',
    text: '"Fira Code", "Helvetica Neue", Helvetica, Arial, sans-serif',
  },
  fontSizes: {
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
    <Deck theme={theme} template={template} className="slides">
      <Slide>
        <Heading>Web Workers</Heading>

        <Quote>
          <Text>Offloading work from the main thread.</Text>
        </Quote>

        <FlexBox alignItems="flex-end" justifyContent="unset" flex="1 1 auto">
          <Text fontSize="0.85em">Aymen Elawad / 2023</Text>
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
              href="https://developer.chrome.com/blog/inside-browser-part3"
              textDecoration="none"
            >
              <Text fontSize="0.35em" margin="0px" padding="0px">
                developer.chrome.com/blog/inside-browser-part3
              </Text>
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
                  Some can be moved as a "Transferable Object"
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
              href="https://developer.chrome.com/blog/createimagebitmap-in-chrome-50"
              textDecoration="none"
            >
              <Text fontSize="0.35em" margin="0px" padding="0px">
                developer.chrome.com/blog/createimagebitmap-in-chrome-50
              </Text>
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

                const result = e.data * 2

                postMessage(result)
              }
            `}</CodePane>
          </Appear>
        </FlexBox>
      </Slide>

      <Slide>
        <Heading>Demo</Heading>

        <FlexBox>
          <Demo />
        </FlexBox>
      </Slide>

      <Slide>
        <Heading>Questions</Heading>

        <FlexBox flexGrow={1} mb="10em">
          <Link
            href="https://github.com/elawad/web-workers-demo"
            textDecoration="none"
          >
            <Text>github.com/elawad/web-workers-demo</Text>
          </Link>
        </FlexBox>
      </Slide>
    </Deck>
  );
}

export default Docs;
