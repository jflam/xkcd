import {
    Widget
} from '@phosphor/widgets';

import {
  JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import {
    ICommandPalette
} from '@jupyterlab/apputils';

import '../style/index.css';

/**
 * Initialization data for the xkcd extension.
 */
const extension: JupyterLabPlugin<void> = {
  id: 'xkcd',
  autoStart: true,
  requires: [ICommandPalette],
  activate: (app: JupyterLab, palette: ICommandPalette) => {
    console.log('JupyterLab extension xkcd is activated!');

    // Create a single widget
    let widget: Widget = new Widget();
    widget.id = 'xkcd';
    widget.title.label = 'xkcd.com';
    widget.title.closable = true;

    // Add an application command
    const command: string = 'xkcd:open';
    app.commands.addCommand(command, {
        label: 'Random xkcd comic',
        execute: () => {
            if (!widget.isAttached) {
                // Attach the widget to the main work area if it's not there
                app.shell.addToMainArea(widget);
            }

            // Activate the widget
            app.shell.activateById(widget.id);
        }
    });

    // Add the command to the palette
    palette.addItem({command, category: 'Tutorial'});
  }
};

export default extension;
