import {
    Widget
} from '@phosphor/widgets';

import {
    Message
} from '@phosphor/messaging';

import {
  JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import {
    ICommandPalette
} from '@jupyterlab/apputils';

import '../style/index.css';

class XkcdWidget extends Widget {
    constructor() {
        super();

        this.id = 'xkcd';
        this.title.label = 'xkcd.com';
        this.title.closable = true;
        this.addClass('jp-xkcdWidget');

        this.img = document.createElement('img');
        this.img.className = 'jp-xkcdCartoon';
        this.node.appendChild(this.img);

        this.img.insertAdjacentHTML('afterend',
            `<div class="jp-xkcdAttribution">
              <a href="https://creativecommons.org/licenses/by-nc/2.5/" class="jp-xkcdAttribution" target="_blank">
                <img src="https://licensebuttons.net/l/by-nc/2.5/80x15.png" />
              </a>
            </div>`
        );
    }

    readonly img: HTMLImageElement;

    onUpdateRequest(msg: Message): void {
        fetch('https://egszlpbmle.execute-api.us-east-1.amazonaws.com/prod').then(response => {
            return response.json();
        }).then(data => {
            this.img.src = data.img;
            this.img.alt = data.title;
            this.img.title = data.alt;
        })
    }
}

function activate(app: JupyterLab, palette: ICommandPalette) {
    console.log('JupyterLab extension xkcd is activated!');

    // Create a single widget
    let widget: XkcdWidget = new XkcdWidget();

    // Add an application command
    const command: string = 'xkcd:open';
    app.commands.addCommand(command, {
        label: 'Random xkcd comic',
        execute: () => {
            if (!widget.isAttached) {
                // Attach the widget to the main work area if it's not there
                app.shell.addToMainArea(widget);
            }

            // Refresh the comic in the widget
            widget.update();

            // Activate the widget
            app.shell.activateById(widget.id);
        }
    });

    // Add the command to the palette
    palette.addItem({command, category: 'Tutorial'});
};

/**
 * Initialization data for the xkcd extension.
 */
const extension: JupyterLabPlugin<void> = {
  id: 'xkcd',
  autoStart: true,
  requires: [ICommandPalette],
  activate: activate
};

export default extension;
