import Vue from 'vue';
import Vuex, { Store } from 'vuex';

Vue.use(Vuex);

const store = new Store({
	state: {
		columns: [],
		files: []
	}
});

export default store;
