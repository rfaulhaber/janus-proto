<template>
    <div id="app">
        <Pane text="Hello" />
    </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue';
import Pane from './components/Pane.vue';
import { ipcRenderer } from 'electron';

console.log(typeof ipcRenderer);

export default {
    name: 'app',
    components: {
        Pane
    }
};
</script>
