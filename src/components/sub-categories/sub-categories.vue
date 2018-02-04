<template>
	<div class="sub-categories-wrapper">
		<h1>Sub categories</h1>
		<div class="sub-categories">
			<div class="sub-categories__items">
				<div class='sub-categories__item' v-for='category in subCategories'>
					<div class="sub-category">
						<div class="sub-category__edit">
							<v-btn color="secondary" flat icon @click="editItem(category)">
								<v-icon>edit</v-icon>
							</v-btn>
						</div>
						<div class="sub-category__image" @click="moveToProduct(category)" v-bind:style="{'background-image': 'url(' + category.mainImage + ')'}">
						</div>
						<div class="sub-category__col">
							<div class="sub-category__id"><span class="sub-category__label">id</span> {{category.id}}</div>
							<div class="sub-category__title"><span class="sub-category__label">title</span> {{category.title}}</div>
						</div>
						<div class="sub-category__col">
							<div class="sub-category__parent"><span class="sub-category__label">parent category</span> {{category.parentCat}}</div>
						</div>
					</div>
				</div>
			</div>
			<div class="sub-categories__form">
				<form action="">
					<h2>Main data</h2>
					<input type="text" v-model="id" name="id" placeholder="id">
					<input type="text" v-model="title" name="title" placeholder="title">
					<input type="text" v-model="url" name="url" placeholder="image url">
					<div class="sub-categories__parents">
						<h2>Parent category</h2>
						<label v-for="cat in parentCategories">
							{{cat.id}}
							<input type="radio" v-model="parentCat" v-bind:value="cat.id" @change='change' name="parentCat">
						</label>
					</div>
					<div v-if="mode === 'edit'">
						<v-btn color="primary" v-on:click.prevent.stop="edit">Edit</v-btn>
						<v-btn color="error" v-on:click.prevent.stop="deleteItem">Delete</v-btn>
						<v-btn color="secondary" v-on:click.prevent.stop="cancel">Cancel</v-btn>
					</div>
					<v-btn color="primary" v-else v-on:click.prevent.stop="submit">Create new</v-btn>
				</form>
			</div>
		</div>
	</div>
</template>

<script>
import './sub-categories.sass';
import firebase from 'firebase';

export default {
	firebase ()  {
		return {
			subCategories: firebase.database().ref('subCat'),
			parentCategories: firebase.database().ref('parentCat')
		}
	},
	data () {
		return {
			id: null,
			url: null,
			title: null,
			parentCat: null,
			mode: 'create',
			currentItem: null
		};
	},
	props: ['query'],
	watch: {
		query () {
			this.setQuery();
		}
	},
	mounted () {
		this.setQuery();
	},
	methods: {
		setQuery () {
			if (!this.query) {
				return;
			};

			const superRef = this.$firebaseRefs.subCategories
				.orderByChild('parentCat')
				.equalTo(this.query.catId);

			this.$bindAsArray('subCategories', superRef);
		},
		moveToProduct (cat) {
			this.$emit('moveToProduct', cat.id);
		},
		change (e) {
			this.parentCat = e.target.value;
		},
		editItem (item) {
			this.mode = 'edit';
			this.id = item.id;
			this.url = item.mainImage;
			this.title = item.title;
			this.parentCat = item.parentCat;

			this.currentItem = item;
		},
		cancel () {
			this.mode = 'create';
			this.id = null;
			this.url = null;
			this.title = null;
			this.parentCat = null;
			this.currentItem = null;
		},
		edit () {
			if (!this.currentItem) {
				alert('no item was specified');
				return;
			}

			this.$firebaseRefs.subCategories.child(this.currentItem['.key']).set({
				id: this.id,
				mainImage: this.url,
				title: this.title
			});

			this.cancel();
		},
		deleteItem () {
			if (confirm('Are you sure you want to delete this sub category?')) {
				this.$firebaseRefs.subCategories.child(this.currentItem['.key']).remove();
			}

			this.cancel();
		},
		submit (e) {
			e.preventDefault();

			if (!this.id || !this.title) {
				alert('id nor title shoulnt be empty');
				return;
			}

			this.$firebaseRefs.subCategories.push({
				id: this.id,
				mainImage: this.url,
				title: this.title,
				parentCat: this.parentCat
			});
		}
	}
}
</script>
