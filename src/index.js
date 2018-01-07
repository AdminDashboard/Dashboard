import 'normalize.css';
import Vue from 'vue';
import Vuetify from 'vuetify';
import VueFire from 'vuefire';
import VueRouter from 'vue-router';
import 'font-awesome/css/font-awesome.css';
import '../node_modules/vuetify/dist/vuetify.min.css';
import VueLocalStorage from 'vue-ls';
import Firebase from 'firebase';
import {store} from './store';

// pages
import SignIn from './components/sign-in/sign-in.vue';
import Home from './components/home.vue';
import Requests from './components/requests/requests.vue';
import Settings from './components/settings/settings.vue';
import Products from './components/products/products.vue';
import Sub from './components/sub-categories/sub-categories.vue';
import Super from './components/super-categories/super-categories.vue';

// components
import AuthGuard from './auth-guard.js';
import NavComponent from './components/nav/nav.vue';

const NotFound = {template: '<p>Page not found</p>'};

window.Vue = Vue;

const routes = [
  {path: '/sign-in', component: SignIn},
  {path: '/', component: SignIn},
  {path: '/requests', component: Requests, beforeEnter: AuthGuard},
  {path: '/settings', component: Settings, beforeEnter: AuthGuard},
  {path: '/products', component: Products, beforeEnter: AuthGuard},
  {path: '/sub', component: Sub, beforeEnter: AuthGuard},
  {path: '/Super', component: Super, beforeEnter: AuthGuard}
];

const VueLocalStorageOptions = {
  namespace: 'vuejs__'
};

Vue.use(Vuetify);
Vue.use(VueFire);
Vue.use(VueRouter);
Vue.use(VueLocalStorage, VueLocalStorageOptions);

const router = new VueRouter({routes});

new Vue({
	el: '#app',
	router,
	store,
	components: {
		'nav-component': NavComponent
	},
	created () {
		Firebase.initializeApp({
			apiKey: "AIzaSyBkzYfE9ZCd0dg93pHgjctTimkXsdbLkGk",
			authDomain: "meraki-test-eb979.firebaseapp.com",
			databaseURL: "https://meraki-test-eb979.firebaseio.com",
			projectId: "meraki-test-eb979",
			storageBucket: "meraki-test-eb979.appspot.com",
			messagingSenderId: "142705752674"
		});

		Firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				this.$store.dispatch('autoSignIn', user);
			}
		});
	}
});
