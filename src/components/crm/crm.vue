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
						<v-dialog v-model="dialog" persistent max-width="500px">
						  <v-btn color="primary" dark slot="activator">Add contact</v-btn>
						  <v-card>
						    <v-card-title>
						      <span class="headline">Create contact</span>
						    </v-card-title>
						    <v-card-text>
						      <v-container grid-list-md>
						        <v-layout wrap>
						          <v-flex xs12 sm6 md6>
						            <v-text-field v-model="name" label="Name" required></v-text-field>
						          </v-flex>
						          <v-flex xs12 sm6 md6>
						            <v-text-field v-model="phone" label="Phone"
						              required
						            ></v-text-field>
						          </v-flex>
						          <v-flex xs12>
						            <v-text-field v-model="email" label="Email" required></v-text-field>
						          </v-flex>
						          <v-flex xs12 sm6>
						            <v-select
						              label="Assign to"
						              multiple
						              v-model="assign"
						              autocomplete
						              chips
						              :items="['writers', 'poets']"
						            ></v-select>
						          </v-flex>
						          <v-flex xs12 sm6>
						            <v-select
						              label="Suffix"
						              multiple
						              v-model="suffix"
						              autocomplete
						              chips
						              :items="['novel', 'poem']"
						            ></v-select>
						          </v-flex>
						        </v-layout>
						      </v-container>
						      <small>*indicates required field</small>
						    </v-card-text>
						    <v-card-actions>
						      <v-spacer></v-spacer>
						      <v-btn color="blue darken-1" flat @click.native="dialog = false">Close</v-btn>
						      <v-btn color="blue darken-1" flat @click.native="addNewContact()">Save</v-btn>
						    </v-card-actions>
						  </v-card>
						</v-dialog>
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
			dialog: false,
			name: null,
			phone: null,
			email: null,
			assign: [],
			suffix: [],
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
		},
		addNewContact () {
			this.items.push({
				order: this.items.length + 1,
				status: 'Online',
				name: this.name,
				email: this.email,
				phone: this.phone,
				assigned: this.assign,
				salutation: 'value',
				suffix: this.suffix
			});

			this.$store.commit('setAlert',
				{type: 'success', message: 'Item successufly added'}
			);

			this.dialog = false;
		}
	}
  }
</script>
