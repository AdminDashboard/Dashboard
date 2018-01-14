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
			v-bind:items="orderedItems"
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
						      <span
						      	class="headline"
						      	v-text="mode === 'add' ? 'Create contact' : 'Edit contact'">
						      </span>
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
						              required
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
						              required
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
						      <v-btn color="blue darken-1"
						      	flat
						      	@click.native="mode === 'add' ? addNewContact() : updateContact()"
						      	:disabled="!isValid"
						      	v-text="mode === 'add' ? 'Create' : 'Edit'"></v-btn>
						    </v-card-actions>
						  </v-card>
						</v-dialog>
						<v-btn color="secondary" v-if="hasSingleSelect" @click="editSelected()">Edit contact</v-btn>
						<v-btn color="error" v-if="hasSelectedItems" @click="deleteSelected()">Delete selected</v-btn>
					</td>
				</template>
			</v-data-table>
		</template>
	</div>
</template>

<script>
import firebase from 'firebase';

export default {
	firebase ()  {
		return {
			items: {
				source: firebase.database().ref('crm'),
				readyCallback: function () {
					this.loaded = true;
				}
			}
		}
	},
	data () {
		return {
			selected: [],
			search: '',
			mode: 'add',
			dialog: false,
			name: null,
			phone: null,
			email: null,
			assign: [],
			suffix: [],
			salutation: [],
			loaded: false,
			keyToEdit: null,
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
			]
		}
	},
	computed: {
		hasSelectedItems() {
			return this.selected.length > 0;
		},
		orderedItems() {
			return this.items.map((item, index) => {
				return {
					order: index + 1,
					status: item.status,
					name: item.name,
					email: item.email,
					phone: item.phone,
					assigned: item.assigned,
					salutation: item.salutation,
					suffix: item.suffix
				}
			});
		},
		isValid() {
			return Boolean(this.name
				&& this.email
				&& this.phone
				&& this.assign.length > 0
				&& this.salutation
				&& this.suffix.length > 0);
		},
		hasSingleSelect() {
			return this.selected.length === 1;
		}
	},
	methods: {
		getKeysToEdit() {
			return this.selected.map(item => {
				return this.items[item.order - 1]['.key'];
			}).reduce((result, item) => {
				result[item] = null;

				return result;
			}, {});
		},
		deleteSelected() {
			const keysToEdit = this.getKeysToEdit();

			this.$firebaseRefs.items.update(keysToEdit)
				.then(() => {
					this.$store.commit('setAlert',
						{type: 'success', message: 'Items successufly deleted'}
					);

					this.selected = [];
				}).catch(() => {
					this.$store.commit('setAlert',
						{type: 'error', message: 'An error has occured'}
					);
				});
		},
		editSelected() {
			const itemToEdit = this.selected[0];
			this.keyToEdit = this.items[itemToEdit.order - 1]['.key'];

			this.mode = 'edit';
			this.dialog = true;

			this.name = itemToEdit.name;
			this.email = itemToEdit.email;
			this.phone = itemToEdit.phone;
			this.assign = itemToEdit.assigned;
			this.suffix = itemToEdit.suffix;
		},
		addNewContact () {
			this.$firebaseRefs.items.push({
				status: 'Online',
				name: this.name,
				email: this.email,
				phone: this.phone,
				assigned: this.assign,
				salutation: 'test',
				suffix: this.suffix
			}).then(() => {
				this.$store.commit('setAlert',
					{type: 'success', message: 'Item successufly added'}
				);

				this.dialog = false;
				this.clearNewContact();
			}).catch(() => {
				this.$store.commit('setAlert',
					{type: 'error', message: 'An error has occured'}
				);
			});
		},
		updateContact () {
			let query = {};
			query = {
				status: 'Offline',
				name: this.name,
				email: this.email,
				phone: this.phone,
				assigned: this.assign,
				salutation: 'test',
				suffix: this.suffix
			};

			this.$firebaseRefs.items.child(this.keyToEdit).set(query)
				.then(() => {
					this.$store.commit('setAlert',
						{type: 'success', message: 'Item successufly updated'}
					);

					this.selected = [];
					this.dialog = false;
					this.clearNewContact();
				}).catch(() => {
					this.$store.commit('setAlert',
						{type: 'error', message: 'An error has occured'}
					);
				});
		},
		clearNewContact () {
			this.name
				= this.email
				= this.phone
				= null;

			this.assign = this.suffix = [];
		}
	}
  }
</script>
