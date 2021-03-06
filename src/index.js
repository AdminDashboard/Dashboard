import './legacy.css';
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
import './temp.sass';

// pages
import SignIn from './components/sign-in/sign-in.vue';
import Requests from './components/requests/requests.vue';
import Settings from './components/settings/settings.vue';
import Inventory from './components/inventory/inventory.vue';
import Products from './components/products/products.vue';
import Sub from './components/sub-categories/sub-categories.vue';
import Super from './components/super-categories/super-categories.vue';
import CRM from './components/crm/crm.vue';

// components
import AuthGuard from './auth-guard.js';
import NavComponent from './components/nav/nav.vue';
import MenuToggle from './components/nav/menu-toggle.vue';
import AlertComponent from './components/alert/alert.vue';

const NotFound = {template: '<p>Page not found</p>'};

window.Vue = Vue;

const routes = [
  {path: '/sign-in', component: SignIn},
  {path: '/', component: SignIn},
  {path: '/requests', component: Requests, beforeEnter: AuthGuard},
  {path: '/settings', component: Settings, beforeEnter: AuthGuard},
  {path: '/products', component: Products, beforeEnter: AuthGuard},
  {path: '/sub', component: Sub, beforeEnter: AuthGuard},
  {path: '/crm', component: CRM, beforeEnter: AuthGuard},
  {path: '/Super', component: Super, beforeEnter: AuthGuard},
  {path: '/inventory', component: Inventory, beforeEnter: AuthGuard}
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
		'nav-component': NavComponent,
		'alert-component': AlertComponent,
		'menu-toggle': MenuToggle
	},
	mounted () {
		setTimeout(function() {
	        $('.loader-overlay').addClass('loaded');
	        $('body > section').animate({
	            opacity: 1,
	        }, 400);
	    }, 1000);
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
