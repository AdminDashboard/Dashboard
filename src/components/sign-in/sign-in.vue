<template>
	<div class="sign-in separate-inputs" :class="{account: !userIsAuthenticated}">
		<div v-if="!userIsAuthenticated">
			<div class="container" id="login-block">
	            <div class="row">
	                <div class="col-sm-6 col-md-4 col-md-offset-4">
	                    <div class="account-wall">
	                        <i class="user-img icons-faces-users-03"></i>
	                        <form @submit.prevent.stop="signIn" class="form-signin" role="form">
	                            <div class="append-icon">
	                                <input v-model="email" type="email" name="username" id="username" class="form-control form-white username" placeholder="Email" required>
	                                <i class="icon-user"></i>
	                            </div>
	                            <div class="append-icon m-b-20">
	                                <input v-model="password" type="password" name="password" class="form-control form-white password" placeholder="Password" required>
	                                <i class="icon-lock"></i>
	                            </div>
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
			email: null,
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
			this.$store.dispatch('signUserIn', {email: this.email, password: this.password});

			this.loading = true;
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
</style>
