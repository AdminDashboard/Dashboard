<template>
	<ul class="nav nav-sidebar">
		<li><a href="#/"><i class="icon-home"></i><span>Dashboard</span></a></li>
		<li class="nav-parent" v-if="userIsAuthenticated">
		<a href="/"><i class="icon-puzzle"></i><span>Admin</span> <span class="fa arrow"></span></a>
		<ul class="children collapse">
		<li class=""><a href="#/requests">Requests</a></li>
		<li class=""><a href="#/settings">Settings</a></li>
		</ul>
		</li>
		<li class="nav-parent" v-if="userIsAuthenticated">
		<a href="/"><i class="icon-layers"></i><span>Inventory</span> <span class="fa arrow"></span></a>
		<ul class="children collapse">
		<li class=""><a href="#/products">Products</a></li>
		<li class=""><a href="#/super">Super categories</a></li>
		<li class=""><a href="#/sub">Sub categories</a></li>
		</ul>
		</li>
	</ul>
</template>

<script>
export default {
	computed: {
		userIsAuthenticated () {
			return this.$store.getters.user !== null && this.$store.getters.user !== undefined;
		}
	}
}
</script>
