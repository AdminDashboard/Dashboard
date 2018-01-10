import Vue from 'vue';
import Vuex from 'vuex';
import * as firebase from 'firebase';

Vue.use(Vuex);

export const store = new Vuex.Store({
	state: {
		user: null,
		alert: null
	},
	mutations: {
		setUser (state, payload) {
			state.user = payload;
		},
		setAlert (state, payload) {
			state.alert = payload;
		}
	},
	actions: {
		autoSignIn ({commit}, payload) {
			commit('setUser', {id: payload.uid, registeredMeetups: []});
		},
		signUserIn ({commit}, payload) {
			return firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
				.then(user => {
					const newUser = {
						id: user.uid
					}

					commit('setUser', newUser);
				})
				.catch(error => {
					commit('setAlert', {type: 'error', message: error.message});

					console.log(error);

					return 'error';
				});
		},
		signOut ({commit}) {
		 	firebase.auth().signOut();
		 	commit('setUser', null);
		},
		triggerError ({commit}, payload) {
			commit('setError', payload);
		}
	},
	getters: {
		user (state) {
			return state.user;
		},
		alert (state) {
			return state.alert;
		}
	}
})
