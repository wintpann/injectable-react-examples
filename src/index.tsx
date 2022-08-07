import React from 'react';
import ReactDOM from 'react-dom';
import { StoryBox } from 'storybox-react';
import 'storybox-react/dist/styles.css';
import { stories } from './stories';
import { InjectableHooksHolder } from './configured';

ReactDOM.render(
  <>
    <StoryBox stories={stories} />
    <InjectableHooksHolder />
  </>,
  document.getElementById('root'),
);
