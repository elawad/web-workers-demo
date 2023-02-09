import syntax from 'react-syntax-highlighter/dist/cjs/styles/prism/coldark-dark';
import {
  Appear,
  Box,
  CodePane,
  Deck,
  FlexBox,
  Heading,
  ListItem,
  MarkdownSlide,
  Progress,
  Slide,
  UnorderedList,
} from 'spectacle';

import App from './App';
import './Docs.css';

const theme = {
  fonts: {
    header: '"Fira Code", "Helvetica Neue", Helvetica, Arial, sans-serif',
    text: '"Fira Code", "Helvetica Neue", Helvetica, Arial, sans-serif',
  },
};

const template = () => (
  <FlexBox justifyContent="flex-end" position="absolute" bottom={0} width={1}>
    <Box padding="1em">
      <Progress />
    </Box>
  </FlexBox>
);

function Docs() {
  return (
    <Deck theme={theme} template={template} className="docs">
      <Slide>
        <Heading>Web Workers !=</Heading>
        <FlexBox>
          <App />
        </FlexBox>
      </Slide>

      <Slide>
        <Heading>Worker Example</Heading>
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

      <MarkdownSlide animateListItems>
        {`
       # Markdown Slide
       It uses the \`animateListItems\` prop.
       - Its list items...
       - ...will appear...
       - ...one at a time.
       
       \`\`\`js
        const a = 10;
       \`\`\`
      `}
      </MarkdownSlide>

      <Slide>
        <Heading>Fragments</Heading>
        <UnorderedList>
          <Appear>
            <ListItem>Sub 1</ListItem>
          </Appear>
          <Appear>
            <ListItem>Sub 2</ListItem>
          </Appear>
          <Appear>
            <ListItem>Sub 3</ListItem>
          </Appear>
        </UnorderedList>
      </Slide>
    </Deck>
  );
}

export default Docs;
