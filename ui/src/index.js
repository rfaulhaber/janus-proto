import * as CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/display/fullscreen.css';
import 'codemirror/theme/neat.css';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/addon/display/fullscreen.js';

const myCodeMirror = CodeMirror(document.getElementById('editor'), {
    value: 'hello world!'
});
