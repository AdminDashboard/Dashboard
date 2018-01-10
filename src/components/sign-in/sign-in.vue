<template>
	<div class="sign-in separate-inputs" :class="{account: !userIsAuthenticated}">
		<div v-if="!userIsAuthenticated">
			<div class="container" id="login-block">
	            <div class="row">
	                <div class="col-sm-6 col-md-4 col-md-offset-4">
	                    <div class="account-wall">
	                    	<v-layout justify-space-around>
    							<v-icon class="image-user" x-large color="white">account_circle</v-icon>
  							</v-layout>
	                        <form @submit.prevent.stop="signIn" class="form-signin" role="form">
								<v-text-field
								name="email"
								label="Email"
								single-line
								:dark="true"
								type="email"
								v-model="email"
								required
								prepend-icon="mail_outline"
								></v-text-field>
								<v-text-field
								name="password"
								label="Password"
								single-line
								:dark="true"
								type="password"
								v-model="password"
								required
								prepend-icon="vpn_key"
								></v-text-field>
	                            <v-btn color="primary" :loading="loading" type="submit">Sign in</v-btn>
	                            <div class="clearfix">
	                                <p class="pull-left m-t-20"><a id="password" href="#">Forgot password?</a></p>
	                                <p class="pull-right m-t-20"><a href="user-signup-v1.html">New here? Sign up</a></p>
	                            </div>
	                        </form>	                        
	                    </div>
	                </div>
	            </div>
	        </div>
		</div>
		<div v-else>
			<h1>Welcome to dashboard</h1>
			<v-btn color="primary" @click="signOut">Sign out</v-btn>
		</div>
	</div>
</template>

<script>

export default {
	data() {
		return {
			email: 'tehzarathustra@gmail.com',
			password: null,
			loading: false
		}
	},
	computed: {
		userIsAuthenticated () {
			return this.$store.getters.user !== null && this.$store.getters.user !== undefined;
		}
	},
	methods: {
		signIn () {
			this.loading = true;

			this
				.$store
				.dispatch('signUserIn', {email: this.email, password: this.password})
				.then((data) => {
					if (data === 'error') {
						this.loading = false;
					}
				});
		},
		signOut () {
			this.$store.dispatch('signOut');

			this.loading = false;
		}
	}
}
</script>

<style scoped lang="sass">
.sign-in.account
	position: fixed
	top: 0
	left: 0
	right: 0
	bottom: 0
	z-index: 999
	.append-icon
		margin-bottom: 10px
		position: relative
		i
			position: absolute
			top: 50%
			right: 10px
			transform: translateY(-50%)
	.btn
		margin: 10px 0
		width: 100%
	.image-user
		font-size: 10em
</style>
