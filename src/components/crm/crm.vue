<template>
	<div class="CRM">
		<h1 class="display-1">CRM</h1>
		<v-text-field
		prepend-icon="search"
		label="Search"
		single-line
		hide-details
		v-model="search"
		></v-text-field>
		<template>
			<v-data-table
			v-bind:headers="headers"
			v-bind:items="items"
			v-bind:search="search"
			v-model="selected"
			item-key="name"
			select-all
			class="elevation-1"
			>
				<template slot="items" slot-scope="props">
					<td>
						<v-checkbox
						primary
						hide-details
						v-model="props.selected"
						></v-checkbox>
					</td>
					<td>{{ props.item.order }}</td>
					<td class="text-xs-right">{{ props.item.status }}</td>
					<td class="text-xs-right">{{ props.item.name }}</td>
					<td class="text-xs-right">{{ props.item.email }}</td>
					<td class="text-xs-right">{{ props.item.phone }}</td>
					<td class="text-xs-right">{{ props.item.assigned }}</td>
					<td class="text-xs-right">{{ props.item.salutation }}</td>
					<td class="text-xs-right">{{ props.item.suffix }}</td>
				</template>
				<template slot="footer">
					<td colspan="100%">
						<v-btn color="primary">Add user</v-btn>
						<v-btn color="error" v-if="hasSelectedItems" @click="deleteSelected()">Delete selected</v-btn>
					</td>
				</template>
			</v-data-table>
		</template>
	</div>
</template>

<script>
  export default {
	data () {
		return {
			selected: [],
			search: '',
			headers: [
				{
				text: '#',
				align: 'left',
				value: 'order'
				},
				{ text: 'Status', value: 'status' },
				{ text: 'Name', value: 'name' },
				{ text: 'Email', value: 'email' },
				{ text: 'Phone', value: 'phone' },
				{ text: 'Assigned to', value: 'assigned' },
				{ text: 'Salutation', value: 'salutation' },
				{ text: 'Suffix', value: 'suffix' }
			],
			items: [
				{
				order: 1,
				status: 'Offline',
				name: 'Franz',
				email: 'franz@gmail.com',
				phone: 7777777,
				assigned: 'writers',
				salutation: 'Sartre',
				suffix: 'Absurd'
				},
				{
				order: 2,
				status: 'Online',
				name: 'asds',
				email: 'fs@gmail.com',
				phone: 3434,
				assigned: 'sds',
				salutation: 'gf',
				suffix: 'fg'
				},
				{
				order: 3,
				status: 'Online',
				name: '3asdfds',
				email: 'fs@gmail.com',
				phone: 3434,
				assigned: 'sds',
				salutation: 'gf',
				suffix: 'fg'
				},
				{
				order: 4,
				status: 'Online',
				name: '4afsds',
				email: 'fs@gmail.com',
				phone: 3434,
				assigned: 'sds',
				salutation: 'gf',
				suffix: 'fg'
				},
				{
				order: 5,
				status: 'Online',
				name: '5asds',
				email: 'fs@gmail.com',
				phone: 3434,
				assigned: 'sds',
				salutation: 'gf',
				suffix: 'fg'
				},
				{
				order: 6,
				status: 'Online',
				name: '6asds',
				email: 'fs@gmail.com',
				phone: 3434,
				assigned: 'sds',
				salutation: 'gf',
				suffix: 'fg'
				}
			]
		}
	},
	computed: {
		hasSelectedItems() {
			return this.selected.length > 0;
		}
	},
	methods: {
		showSelected() {
			if (!this.hasSelectedItems) {
				return;
			}
		},
		deleteSelected() {
			const indexesToRemove = this.selected.map(item => {
				return this.items.findIndex(arrayItem => arrayItem.order === item.order);
			}).sort((a, b) => a - b);

			this.$store.commit('setAlert',
				{type: 'success', message: 'Items successufly deleted'}
			);

			for (let i = indexesToRemove.length - 1; i >= 0; i--) {
				this.items.splice(indexesToRemove[i], 1);
			}

			this.selected = [];
		}
	}
  }
</script>
