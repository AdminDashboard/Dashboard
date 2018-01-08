<template>
	<a class="menutoggle" href="#" @click="collapsedSidebar()"><span class="menu__handle"><span>Menu</span></span></a>
</template>

<script>
export default {
	data () {
		return {
			$body: null
		}
	},
	mounted () {
		this.$body = $('body');
	},
	methods: {
		/* Toggle Sidebar Collapsed */
		collapsedSidebar() {
			if (!this.$body) {
				return;
			}

		    if (this.$body.css('position') != 'relative') {
		        if (!this.$body.hasClass('sidebar-collapsed')) this.createCollapsedSidebar();
		        else this.removeCollapsedSidebar();
		    } else {
		        if (this.$body.hasClass('sidebar-show')) this.$body.removeClass('sidebar-show');
		        else this.$body.addClass('sidebar-show');
		    }
		},

		createCollapsedSidebar() {
		    this.$body.addClass('sidebar-collapsed');
		    $('.nav-sidebar ul').attr('style', '');
		    $(this).addClass('menu-collapsed');
		    $('#switch-sidebar').prop('checked');
		},

		removeCollapsedSidebar() {
		    this.$body.removeClass('sidebar-collapsed');
		    if (!this.$body.hasClass('submenu-hover')) $('.nav-sidebar li.active ul').css({
		        display: 'block'
		    });
		    $(this).removeClass('menu-collapsed');
		    if (this.$body.hasClass('sidebar-light') && !this.$body.hasClass('sidebar-fixed')) {
		        $('.sidebar').height('');
		    }
		}
	}
}
</script>
