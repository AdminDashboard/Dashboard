<template>
	<div class="super-categories-wrapper">
		<h1>{{ type }} <v-btn color="secondary" @click="type = 'Super categories'" v-if="type === 'Sub Categories'">Back to super categories</v-btn></h1>
		<div class="super-categories">
			<div class="super-categories__items">
				<div class='super-categories__item' v-for='category in currentItems'>
					<div class="super-category">
						<div class="super-category__image" @click="moveToSubCats(category)" v-bind:style="{'background-image': 'url(' + category.mainImage + ')'}">
						</div>
						<div class="super-category__col">
							<div class="super-category__id"><span class="super-category__label">id</span> {{category.id}}</div>
							<div class="super-category__title"><span class="super-category__label">title</span> {{category.title}}</div>
						</div>
						<div class="super-category__col">
						</div>
					</div>
				</div>
			</div>
			<div class="super-categories__form">
				<form>
					<h2>Main data</h2>
					<select v-model="id">
						<option value="tables">tables</option>
						<option value="seating">seating</option>
						<option value="beds">beds</option>
						<option value="decor">decor</option>
						<option value="lighting">lighting</option>
						<option value="kitchen">kitchen</option>
						<option value="bathroom">bathroom</option>
					</select>
					<input type="text" v-model="title" name="title" placeholder="title">
					<input type="text" v-model="url" name="url" placeholder="image url">
					<textarea placeholder="description" v-model="description"></textarea>
					<div>
						<label>
							Show its products
							<input type="checkbox" v-model="showItsChilds" name="showItsChilds">
						</label>
						<br/><br/>
					</div>
					<div v-if="mode === 'edit'">
						<button class="btn btn-primary" type="submit" v-on:click.prevent.stop="edit">Edit</button>
						<button class="btn btn-primary" type="submit" v-on:click.prevent.stop="deleteItem">Delete</button>
						<button class="btn btn-primary" type="submit" v-on:click.prevent.stop="cancel">Cancel</button>
					</div>
					<button class="btn btn-primary" v-else type="submit" v-on:click.prevent.stop="submit">Create new</button>
				</form>
			</div>
		</div>
	</div>
</template>

<script>
import './super-categories.sass';
import firebase from 'firebase';

const DEFAULT_ID_CAT = 'tables';

export default {
	firebase ()  {
		return {
			categories: firebase.database().ref('parentCat'),
			subCategories: firebase.database().ref('subCat')
		}
	},
	data () {
		return {
			id: DEFAULT_ID_CAT,
			url: null,
			title: null,
			type: 'Super categories',
			description: null,
			showItsChilds: true,
			mode: 'create',
			currentItem: null
		};
	},
	computed: {
		currentItems () {
			return this.type === 'Super categories'
				? this.categories
				: this.subCategories;
		}
	},
	methods: {
		moveToSubCats (item) {
			if (this.type === 'Sub Categories') {
				return;
			}

			const superCatId = item.id;
			const superRef = this.$firebaseRefs.subCategories
				.orderByChild('parentCat')
				.equalTo(superCatId);

			this.type = 'Sub Categories';

			this.$bindAsArray('subCategories', superRef);
		},
		editItem (item) {
			this.mode = 'edit';
			this.id = item.id;
			this.url = item.mainImage;
			this.description = item.description;
			this.title = item.title;
			this.showItsChilds = item.showItsChilds;

			this.currentItem = item;
		},
		cancel () {
			this.mode = 'create';
			this.id = DEFAULT_ID_CAT;
			this.url = null;
			this.title = null;
			this.description = null;
			this.showItsChilds = true;
			this.currentItem = null;
		},
		edit () {
			if (!this.currentItem) {
				alert('no item specified');
				return;
			}

			this.$firebaseRefs.categories.child(this.currentItem['.key']).set({
				id: this.id,
				mainImage: this.url,
				description: this.description,
				showItsChilds: this.showItsChilds,
				title: this.title
			});

			this.cancel();
		},
		deleteItem () {
			if (confirm('Are you sure you want to delete this category?')) {
				this.$firebaseRefs.categories.child(this.currentItem['.key']).remove();
			}

			this.cancel();
		},
		submit (e) {
			e.preventDefault();

			if (!this.id || !this.title) {
				alert('id nor title shoulnt be empty');
				return;
			}

			this.$firebaseRefs.categories.push({
				id: this.id,
				mainImage: this.url,
				description: this.description,
				title: this.title,
				showItsChilds: this.showItsChilds
			});
		}
	}
}
</script>
