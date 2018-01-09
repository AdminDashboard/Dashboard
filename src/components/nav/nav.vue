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
	},
	mounted () {
		this.toggleSidebarMenu();
	},
	methods: {
		toggleSidebarMenu() {
		    if ($('body').hasClass('sidebar-collapsed') || $('body').hasClass('sidebar-top') || $('body').hasClass('submenu-hover'))
		        $('.nav-sidebar .children').css({
		            display: ''
		        });
		    else $('.nav-active.active .children').css('display', 'block');
		    $('.sidebar').on('click', '.nav-sidebar li.nav-parent > a', function (e) {
		    	e.preventDefault();
		        if ($('body').hasClass('sidebar-collapsed') && !$('body').hasClass('sidebar-hover')) return;
		        if ($('body').hasClass('submenu-hover')) return;
		        var parent = $(this).parent().parent();
		        parent.children('li.active').children('.children').slideUp(200);
		        $('.nav-sidebar .arrow').removeClass('active');
		        parent.children('li.active').removeClass('active');
		        var sub = $(this).next();
		        if (sub.is(":visible")) {
		            sub.children().addClass('hidden-item')
		            $(this).parent().removeClass("active");
		            sub.slideUp(200, function () {
		                sub.children().removeClass('hidden-item')
		            });
		        } else {
		            $(this).find('.arrow').addClass('active');
		            sub.children().addClass('is-hidden');
		            setTimeout(function () {
		                sub.children().addClass('is-shown');
		            }, 0);
		            sub.slideDown(200, function () {
		                $(this).parent().addClass("active");
		                setTimeout(function () {
		                    sub.children().removeClass('is-hidden').removeClass('is-shown');
		                }, 500);
		            });
		        }
		    });
		}
	}
}
</script>

<style scoped lang="sass">
.nav
	> li > a
		position: relative
	a
		text-decoration: none
	li
		display: flex
		flex-wrap: wrap
		> *
			width: 100%
</style>
