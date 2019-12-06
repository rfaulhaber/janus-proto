import * as CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/display/fullscreen.css';
import 'codemirror/theme/neat.css';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/addon/display/fullscreen.js';

class Pane extends HTMLElement {
    constructor() {
        super();

        this.root = document.createElement('div');
        this.editor = CodeMirror(this.root);
    }
}

customElements.define('pane', Pane);
