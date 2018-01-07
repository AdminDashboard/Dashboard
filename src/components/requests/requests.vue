<template>
	<div class="requests-wrapper">
		<h1>Requests</h1>
		<table class="table">
			<thead>
				<tr>
					<th @click="sortByDate(dateSortType === 'desc'
						? 'asc'
						: 'desc')">data</th>
					<th>name</th>
					<th>email</th>
					<th>phone</th>
					<th>message</th>
					<th>page</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="request, index in items" v-bind:class="{success: !request.seen}">
					<td>{{request.formatTime}}</td>
					<td>{{request.name}}</td>
					<td>{{request.email}}</td>
					<td>{{request.phone}}</td>
					<td>{{request.message}}</td>
					<td>{{request.page}}</td>
					<td>
					<button class="btn btn-primary"
					v-text="request.seen
					? 'Mark as unseen'
					: 'Mark as seen'"
					@click="request.seen
					? edit(request, false)
					: edit (request, true)"></button>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
import firebase from 'firebase';

export default {
	firebase ()  {
		return {
			requests: {
				source: firebase.database().ref('requests'),
				readyCallback: function () {
					this.loaded = true;
				}
			}
		}
	},
	data () {
		return {
			loaded: false,
			dateSortType: 'desc'
		}
	},
	watch: {
		loaded () {
			this.sortByDate(this.dateSortType);
		}
	},
	computed: {
		items () {
			if (this.loaded) {
				return this.requests;
			}
		}
	},
	methods: {
		edit (item, mark) {
			this.$firebaseRefs.requests.child(item['.key']).set({
				type: item.type,
				name: item.name,
				email: item.email,
				phone: item.phone,
				message: item.message,
				page: item.page,
				seen: mark,
				unixTime: item.unixTime,
				formatTime: item.formatTime
			});
		},
		sortByDate (type) {
			if (!this.items) {
				return;
			}

			if (type === 'desc') {
				this.items.sort((a, b) => a.unixTime - b.unixTime);
			} else {
				this.items.sort((a, b) => a.unixTime + b.unixTime);
			}
		}
	}
}
</script>

<style scoped lang='sass'>
.requests-wrapper td
	vertical-align: middle
</style>
