<template>
    <div id="app">
        <Tile />
    </div>
</template>

<script>
import Tile from './components/Tile.vue';
import { ipcRenderer } from 'electron';

console.log(typeof ipcRenderer);

export default {
    name: 'app',
    components: {
        Tile
    }
};
</script>
