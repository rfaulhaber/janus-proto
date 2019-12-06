<template>
    <div>
        <Menu />
        <Pane />
    </div>
</template>

<script>
import Menu from './Menu.vue';
import Pane from './Pane.vue';

export default {
    name: 'Tile',
    components: {
        Menu,
        Pane
    }
};
</script>
