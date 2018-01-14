<template>
	<v-card>
		<v-card-title>
      		<h2>Requests</h2>
    	</v-card-title>
	    <v-data-table
	      v-bind:headers="headers"
	      :items="items"
	      class="elevation-1"
	    >
		    <template slot="items" slot-scope="props">
				<tr v-bind:class="{success: !props.item.seen}">
					<td class="text-xs-right">{{ props.item.formatTime }}</td>
					<td class="text-xs-right">{{ props.item.name }}</td>
					<td class="text-xs-right">{{ props.item.email }}</td>
				    <td class="text-xs-right">{{ props.item.phone }}</td>
				    <td class="text-xs-right">{{ props.item.message }}</td>
				    <td class="text-xs-right">{{ props.item.page }}</td>
					<td>
						<v-btn class="btn btn-primary"
						v-text="props.item.seen
						? 'Mark as unseen'
						: 'Mark as seen'"
						@click="props.item.seen
						? edit(props.item, false)
						: edit (props.item, true)"></v-btn>
					</td>
			  	</tr>
		    </template>
	  	</v-data-table>
	</v-card>
</template>

<script>
import firebase from 'firebase';
import moment from 'moment';

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
			dateSortType: 'desc',
			headers:[
				{ text: 'Date', value: 'formatTime' },
				{ text: 'Name', value: 'name' },
				{ text: 'Email', value: 'email' },
				{ text: 'Phone', value: 'phone' },
				{ text: 'Message', value: 'message' },
				{ text: 'Page', value: 'page' },
				{ text: '', value: '' }
			]
		}
	},
	watch: {

	},
	computed: {
		items () {
			if (this.loaded) {
				console.log(this.requests);
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
		formatDate (fdate){
			return moment(Number(fdate)).format('DD/MM/YYYY');
		}
	}
}
</script>

<style scoped lang='sass'>
.requests-wrapper td
	vertical-align: middle
</style>
