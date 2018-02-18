<template>
	<div class="super-categories-wrapper">
		<h1>Super categories</h1>
		<div class="super-categories">
			<div class="super-categories__items">
				<div class='super-categories__item' v-for='category in categories'>
					<div class="super-category">
						<div class="super-categories__edit">
							<v-btn color="secondary" flat icon @click="editItem(category)">
								<v-icon>edit</v-icon>
							</v-btn>
						</div>
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
					<h2>Category image</h2>
					<input @change="onFilePicked" type="file" accept="image/*">
					<img :src="url">
					<textarea placeholder="description" v-model="description"></textarea>
					<div>
						<label>
							Show its products
							<input type="checkbox" v-model="showItsChilds" name="showItsChilds">
						</label>
						<br/><br/>
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
			description: null,
			showItsChilds: true,
			mode: 'create',
			currentItem: null,
			mainImageToUpload: null
		};
	},
	methods: {
		moveToSubCats (item) {
			this.$emit('moveToSub', {
				path: {catId: item.id},
				old: 'parentCat'
			});
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
			this.mainImageToUpload = null;
		},
		edit () {
			if (!this.currentItem) {
				alert('no item specified');
				return;
			}

			const id = this.id;
			const title = this.title;
			const description = this.description || '';
			const showItsChilds = this.showItsChilds;
			const itemKey = this.currentItem['.key'];
			const mainImage = this.mainImageToUpload;

			if (mainImage) {
				firebase.storage().ref('super/' + mainImage.name).put(mainImage)
					.then(imageInfo => {
						this.$firebaseRefs.categories.child(itemKey).update({
							mainImage: imageInfo.downloadURL || this.url,
							id,
							description,
							showItsChilds,
							title
						});
					})
					.then(() => {
						this.cancel();
					})
			} else {
				this.$firebaseRefs.categories.child(itemKey).update({
					id,
					mainImage: this.url,
					description,
					showItsChilds,
					title
				})
				.then(() => {
					this.cancel();
				})
			}

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

			const mainImage = this.mainImageToUpload;

			firebase.storage().ref('super/' + mainImage.name).put(mainImage)
				.then(imageInfo => {
					this.$firebaseRefs.categories.push({
						id: this.id,
						mainImage: imageInfo.downloadURL || this.url,
						description: this.description,
						showItsChilds: this.showItsChilds,
						title: this.title
					});
				})
				.catch(err => {
					console.log('error >', err);
				})
		}
	}
}
</script>
