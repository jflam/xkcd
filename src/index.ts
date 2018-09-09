import {
  JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import '../style/index.css';


/**
 * Initialization data for the xkcd extension.
 */
const extension: JupyterLabPlugin<void> = {
  id: 'xkcd',
  autoStart: true,
  activate: (app: JupyterLab) => {
    console.log('JupyterLab extension xkcd is activated!');
  }
};

export default extension;
