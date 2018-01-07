<template>
	<div class="settings">
		<!-- col 1 -->
		<div class="settings__col">
			<h2>About:</h2>
			<textarea v-model="userText"></textarea>
			<div class="settings__logo">
				<form-input v-model="logo" :passedLabel="'Logo'" :passedValue="logo"></form-input>
				<img :src="logo">
			</div>
			<div>
				<button class="btn btn-primary" type="submit" v-on:click.prevent.stop="submit">Save</button>
			</div>
		</div>

		<!-- col 2 -->
		<div class="settings__col">
			<h2>Socials:</h2>
			<social-links></social-links>
		</div>
	</div>
</template>

<script>
import firebase from 'firebase';
import Input from '../form-constructor/input/input.vue';
import Socials from './social/social.vue';

export default {
	firebase ()  {
		return {
			settings: {
				source: firebase.database().ref('general'),
				readyCallback: function () {
					this.loaded = true;
				}
			}
		}
	},
	data () {
		return {
			userText: null,
			loaded: false,
			logo: null
		};
	},
	watch: {
		loaded () {
			this.userText = this.aboutText;
			this.logo = this.logoUrl;
		}
	},
	computed: {
		aboutItem () {
			return this.settings.length && this.settings[0];
		},
		logoItem () {
			return this.settings.length && this.settings[1];
		},
		aboutText () {
			return this.aboutItem && this.aboutItem.text;
		},
		logoUrl () {
			return this.logoItem && this.logoItem.url;
		}
	},
	methods: {
		editAbout () {
			if (!this.aboutItem) {
				return;
			}

			this.$firebaseRefs.settings.child(this.aboutItem['.key']).set({
				text: this.userText
			});
		},
		editLogo () {
			if (!this.logoItem) {
				return;
			}

			this.$firebaseRefs.settings.child(this.logoItem['.key']).set({
				url: this.logo
			});
		},
		submit () {
			this.editAbout();
			this.editLogo();
		}
	},
	components: {
		'form-input': Input,
		'social-links': Socials
	}
}
</script>

<style scoped lang="sass">
textarea
	width: 400px
	height: 200px

.settings
	display: flex
	&__col
		width: 40%
	&__logo
		width: 400px
		img
			max-width: 200px
</style>
