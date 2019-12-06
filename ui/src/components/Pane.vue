<template>
    <div ref="editor"></div>
</template>

<script>
import * as CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/display/fullscreen.css';
import 'codemirror/theme/neat.css';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/addon/display/fullscreen.js';

export default {
    name: 'Pane',
    props: {
        text: String
    },
    mounted: function() {
        CodeMirror(this.$refs.editor, {
            value: 'foo'
        });
    }
};
</script>
