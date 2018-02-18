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
					<h2>Category image</h2>
					<input @change="onFilePicked" type="file" accept="image/*">
					<img :src="url">
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
			currentItem: null,
			mainImageToUpload: null
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
		onFilePicked (event) {
			const file = event.target.files[0];
			let fileName = file.name;

			if (fileName.lastIndexOf('.') <= 0) {
				return alert('please add a valid image');
			}

			const fileReader = new FileReader();

			fileReader.addEventListener('load', () => {
				this.url = fileReader.result;
			})

			fileReader.readAsDataURL(file);

			this.mainImageToUpload = file;
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
			this.mainImageToUpload = null;
		},
		edit () {
			if (!this.currentItem) {
				alert('no item was specified');
				return;
			}

			const itemKey = this.currentItem['.key'];
			const mainImage = this.mainImageToUpload;

			if (mainImage) {
				firebase.storage().ref('sub/' + mainImage.name).put(mainImage)
					.then(imageInfo => {
						this.$firebaseRefs.subCategories.child(itemKey).set({
							id: this.id,
							mainImage: this.url || imageInfo.downloadURL,
							title: this.title,
							parentCat: this.parentCat
						});
					})
					.then(() => {
						this.cancel();
					})
			} else {
				this.$firebaseRefs.products.child(itemKey).set({
					id: this.id,
					url: this.url,
					title: this.title,
					parentCat: this.parentCat
				})
				.then(() => {
					this.cancel();
				})
			}
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

			const mainImage = this.mainImageToUpload;

			firebase.storage().ref('products/' + mainImage.name).put(mainImage)
				.then(imageInfo => {
					this.$firebaseRefs.subCategories.push({
						id: this.id,
						mainImage: imageInfo.downloadURL,
						title: this.title,
						parentCat: this.parentCat
					});
				})
				.catch(err => {
					console.log('error >', err);
				})
		}
	}
}
</script>
