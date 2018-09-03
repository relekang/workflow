/* eslint-env node */
import { Browser, TextEditor, Terminal } from 'workflow-apps-defaults';

export default {
  name: 'workflow-example',
  type: 'workspace',
  children: [
    {
      type: 'layout',
      layout: 'splith',
      percent: 1.0,
      children: [
        {
          ...Terminal,
          cwd: __dirname,
          cmd: 'pwd',
          percent: 0.33,
        },
        {
          ...Browser,
          url: 'http://github.com/havardh/workflow',
          percent: 0.33,
        },
        {
          ...TextEditor,
          file: __filename,
          percent: 0.34,
        },
      ],
    },
  ],
};
