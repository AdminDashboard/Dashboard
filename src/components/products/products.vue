<template>
	<div class="product-wrapper">
		<h1>Products</h1>
		<div class="products">
			<div class="products__items">
				<div class='products__item' v-for='product in filteredProducts'>
					<div class="admin-product">
						<div class="admin-product__edit">
							<v-btn color="secondary" flat icon @click="editItem(product)">
								<v-icon>edit</v-icon>
							</v-btn>
						</div>
						<div class="admin-product__image" v-bind:style="{'background-image': 'url(' + product.mainImage + ')'}">
						</div>
						<div class="admin-product__col">
							<div class="admin-product__id"><span class="admin-product__label">id</span> {{product.id}}</div>
							<div class="admin-product__title"><span class="admin-product__label">title</span> {{product.title}}</div>
						</div>
						<div class="admin-product__col"></div>
					</div>
				</div>
			</div>
			<div class="admin-product__form">
				<form action="">
					<h2>Main data</h2>
					<form-input v-model="id" :passedLabel="'id'" :passedValue="id"></form-input>
					<form-input v-model="title" :passedLabel="'Title'" :passedValue="title"></form-input>
					<h2>Product image</h2>
					<!--  -->
					<div class="image-upload">
						<input id="main-file" @change="onFilePicked" type="file" accept="image/*">
						<img :src="url">
					</div>
					<!--  -->

					<!--  -->
					<div class="image-upload">
						<input id="secondary-file" @change="onFilePicked" type="file" accept="image/*">
						<img :src="url2">
					</div>
					<!--  -->
					<h2>Price</h2>
					<form-input v-model="price" :passedLabel="'Price'" :passedValue="price"></form-input>
					<form-input v-model="priceText" :passedLabel="'Price text'" :passedValue="priceText"></form-input>
					<div class="admin-product__section"
						v-for="(section, index) in sections">
						<h2>Section: {{index + 1}}</h2>
						<input type="text"
							v-model="section.title" placeholder="section title">
						<!--  -->
						<div class="image-upload">
							<input :id="`section-file:${index}`" @change="onFilePicked" type="file" accept="image/*">
							<img :src="section.image1">
						</div>
						<!--  -->
						<div class="image-upload">
							<input :id="`section-secondary-file:${index}`" @change="onFilePicked" type="file" accept="image/*">
							<img :src="section.image2">
						</div>
						<!--  -->
						<textarea placeholder="description" v-model="section.description"></textarea>
						<div>
							<h3>Orientation: </h3>
							<label>
								left
								<input type="radio"
									checked
									v-bind:value="'left'"
									@change="changeSectionType($event, index)"
									v-bind:name="'type' + index">
							</label>
							<label>
								right
								<input type="radio"
									v-bind:value="'right'"
									@change="changeSectionType($event, index)"
									v-bind:name="'type' + index">
							</label>
						</div>
						<v-btn color="error" v-on:click.prevent.stop="removeSection(index)">Remove section</v-btn>
					</div>
					<h2>Item category</h2>
					<div class="products__check-field">
						<label v-for="sub in subCategories">
							{{sub.id}}
							<input type="radio" v-model="cat" v-bind:value="sub.id" @change='change' name="cat">
						</label>
					</div>
					<div v-if="mode === 'edit'">
						<v-btn color="primary" v-on:click.prevent.stop="edit">Edit</v-btn>
						<v-btn color="error" v-on:click.prevent.stop="deleteItem">Delete</v-btn>
						<v-btn color="secondary" v-on:click.prevent.stop="addSection">Add section</v-btn><br/><br/>
						<v-btn color="secondary" v-on:click.prevent.stop="cancel">Cancel</v-btn>
					</div>
					<div v-else>
						<v-btn color="secondary" v-on:click.prevent.stop="addSection">Add section</v-btn><br/><br/>
						<v-btn color="primary" v-on:click.prevent.stop="submit">Create new</v-btn>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script>
import './products.sass';
import firebase from 'firebase';
import Input from '../form-constructor/input/input.vue';

export default {
	firebase ()  {
		return {
			products: firebase.database().ref('products'),
			subCategories: firebase.database().ref('subCat')
		}
	},
	data () {
		return {
			id: null,
			url: null,
			url2: null,
			cat: null,
			title: null,
			price: null,
			priceText: null,
			sections: [],
			mode: 'create',
			currentItem: null,
			mainImageToUpload: null,
			secondImageToUpload: null,
			sectionImageToUpload: null,
			filter: null
		};
	},
	props: ['query'],
	mounted () {
		this.setQuery();
	},
	watch: {
		query () {
			this.setQuery();
		}
	},
	computed: {
		filteredProducts() {
			return this.filter
				? this.products.filter(item => item.cat === this.query)
				: this.products;
		}
	},
	methods: {
		setQuery () {
			this.filter = this.query;
		},
		changeSectionType (e, index) {
			this.sections[index].type = e.target.value;
		},
		removeSection (index) {
			this.sections.splice(index, 1);
		},
		change (e) {
			this.cat = e.target.value;
		},
		editItem (item) {
			this.cancel();

			this.mode = 'edit';
			this.id = item.id;
			this.url = item.mainImage;
			this.url2 = item.secondImage;
			this.title = item.title;
			this.sections = item.sections;
			this.cat = item.cat;
			this.price = item.price;
			this.priceText = item.priceText;

			this.currentItem = item;
		},
		cancel () {
			this.mode = 'create';
			this.id = null;
			this.url = null;
			this.url2 = null;
			this.title = null;
			this.sections = [];
			this.cat = null;
			this.price = null;
			this.priceText = null;
			this.currentItem = null;
			this.mainImageToUpload = null;
			this.sectionImageToUpload = null;
		},
		edit () {
			if (!this.currentItem) {
				return alert('no item was specified');
			}

			if (!this.sections) {
				return alert('add sections');
			}

			const mainImage = this.mainImageToUpload;
			const itemKey = this.currentItem['.key'];
			const _this = this;

			if (mainImage) {
				firebase.storage().ref('products/' + mainImage.name).put(mainImage)
					.then(imageInfo => {
						this.$firebaseRefs.products.child(itemKey).set({
							id: this.id,
							mainImage: imageInfo.downloadURL,
							secondImage: this.url2 || imageInfo.downloadURL,
							price: _this.price,
							priceText: this.priceText,
							title: this.title,
							cat: this.cat,
							sections: this.sections
						});
					})
					.then(() => {
						this.cancel();
					})
					.catch(err => {
						console.log('error >', err);
					})
			} else {
				this.$firebaseRefs.products.child(itemKey).set({
					id: this.id,
					mainImage: this.url,
					secondImage: this.url2 || this.url,
					title: this.title,
					price: this.price,
					priceText: this.priceText,
					cat: this.cat,
					sections: this.sections
				})
				.then(() => {
					this.cancel();
				});
			}
		},
		addSection () {
			this.sections.push({
				title: null,
				type: 'left',
				description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugit accusamus reiciendis quas nemo qui perferendis provident, laborum impedit velit voluptates corporis quam tempora, deleniti distinctio vitae nisi neque repellendus amet!',
				image1: 'https://firebasestorage.googleapis.com/v0/b/meraki-test-eb979.appspot.com/o/table2.png?alt=media&token=66b76efe-11fe-4885-a111-f7315dc6ce75'
			});
		},
		deleteItem () {
			if (confirm('Are you sure you want to delete this product?')) {
				this.$firebaseRefs.products.child(this.currentItem['.key']).remove();
			}
		},
		setFileReader (file, type) {
			const fileName = file.name;

			if (fileName.lastIndexOf('.') <= 0) {
				return alert('please add a valid image');
			}

			const fileReader = new FileReader();

			fileReader.addEventListener('load', () => {
				if (type === 'main-file') {
					this.url = fileReader.result;
					this.mainImageToUpload = file;
				} else if (type === 'secondary-file') {
					this.url2 = fileReader.result;
					this.secondImageToUpload = file;
				} else {
					const sectionIndex = type.split(':')[1];
					const sectionType = type.split(':')[0];

					if (sectionType === 'section-secondary-file') {
						firebase.storage().ref('products/' + file.name)
							.put(file)
							.then(imageInfo => {
								this.sections[sectionIndex].image2 = imageInfo.downloadURL;
							});

						return;
					}

					firebase.storage().ref('products/' + file.name)
						.put(file)
						.then(imageInfo => {
							this.sections[sectionIndex].image1 = imageInfo.downloadURL;
						});
				}
			});

			fileReader.readAsDataURL(file);
		},
		onFilePicked (event) {
			const file = event.target.files[0];
			const type = event.target.id;

			this.setFileReader(file, type);
		},
		submit (e) {
			if (!this.id || !this.title) {
				alert('id nor title shouldnt be empty');
				return;
			}

			const mainImage = this.mainImageToUpload;
			const secondImage = this.secondImageToUpload;

			firebase.storage().ref('products/' + mainImage.name).put(mainImage)
				.then(imageInfo => {

					firebase
						.storage()
						.ref('products/' + secondImage.name)
						.put(secondImage)
						.then(secondImageInfo => {
							this.$firebaseRefs.products.push({
								id: this.id,
								mainImage: imageInfo.downloadURL,
								secondImage: secondImageInfo.downloadURL,
								price: this.price,
								priceText: this.priceText,
								title: this.title,
								cat: this.cat,
								sections: this.sections
							});
						});
				})
				.catch(err => {
					console.log('error >', err);
				})
		}
	},
	components: {
		'form-input': Input
	}
}
</script>

<style lang='sass'>
.image-upload
	display: flex
	flex-wrap: wrap
	padding: 10px
	box-sizing: border-box
	background-color: lightblue
	margin-bottom: 10px
	align-items: center
	justify-content: space-between
	border-radius: 3px
	> *
		display: block
</style>
