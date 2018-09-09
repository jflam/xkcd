import {
    JupyterLab, JupyterLabPlugin, ILayoutRestorer
} from '@jupyterlab/application';

import {
    ICommandPalette, InstanceTracker
} from '@jupyterlab/apputils';

import {
    JSONExt
} from '@phosphor/coreutils';

import {
    Message
} from '@phosphor/messaging';

import {
    Widget
} from '@phosphor/widgets';

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

function activate(app: JupyterLab, palette: ICommandPalette, restorer: ILayoutRestorer) {
    console.log('JupyterLab extension xkcd is activated!');

    // Create a single widget
    let widget: XkcdWidget;

    // Add an application command
    const command: string = 'xkcd:open';
    app.commands.addCommand(command, {
        label: 'Random xkcd comic',
        execute: () => {
            if (!widget) {
                // JIT create a new widget
                widget = new XkcdWidget();
                widget.update();
            }
            if (!tracker.has(widget)) {
                tracker.add(widget);
            }
            if (!widget.isAttached) {
                // Attach the widget to the main work area if it's not there
                app.shell.addToMainArea(widget);
            } else {
                widget.update();
            }

            // Activate the widget
            app.shell.activateById(widget.id);
        }
    });

    palette.addItem({ command, category: 'Tutorial'});

    // Track and restore the sidget state
    let tracker = new InstanceTracker<Widget>({ namespace: 'xkcd'});
    restorer.restore(tracker, {
        command,
        args: () => JSONExt.emptyObject,
        name: () => 'xkcd'
    });
};

/**
 * Initialization data for the xkcd extension.
 */
const extension: JupyterLabPlugin<void> = {
  id: 'xkcd',
  autoStart: true,
  requires: [ICommandPalette, ILayoutRestorer],
  activate: activate
};

export default extension;
