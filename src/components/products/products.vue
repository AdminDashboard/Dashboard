<template>
	<div class="product-wrapper">
		<h1>Products</h1>
		<div class="products">
			<div class="products__items">
				<div class='products__item' v-for='product in products'>
					<div class="admin-product">
						<div class="admin-product__image" @click="editItem(product)" v-bind:style="{'background-image': 'url(' + product.mainImage + ')'}">
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
					<input @change="onFilePicked" type="file" accept="image/*">
					<img :src="url">
					<h2>Price</h2>
					<form-input v-model="price" :passedLabel="'Price'" :passedValue="price"></form-input>
					<form-input v-model="priceText" :passedLabel="'Price text'" :passedValue="priceText"></form-input>
					<div class="admin-product__section"
						v-for="(section, index) in sections">
						<h2>Section: {{index + 1}}</h2>
						<input type="text"
							v-model="section.title" placeholder="section title">
						<input type="text"
							v-model="section.image1" placeholder="section image1">
						<input type="text"
							v-model="section.image2" placeholder="section image2">
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
						<button class="btn btn-primary" v-on:click.prevent.stop="removeSection(index)">Remove section</button>
					</div>
					<h2>Item category</h2>
					<div class="products__check-field">
						<label v-for="sub in subCategories">
							{{sub.id}}
							<input type="radio" v-model="cat" v-bind:value="sub.id" @change='change' name="cat">
						</label>
					</div>
					<div v-if="mode === 'edit'">
						<button class="btn btn-primary" type="submit" v-on:click.prevent.stop="edit">Edit</button>
						<button class="btn btn-primary" type="submit" v-on:click.prevent.stop="deleteItem">Delete</button>
						<button class="btn btn-primary" v-on:click.prevent.stop="addSection">Add section</button><br/><br/>
						<button class="btn btn-primary" type="submit" v-on:click.prevent.stop="cancel">Cancel</button>
					</div>
					<div v-else>
						<button class="btn btn-primary" v-on:click.prevent.stop="addSection">Add section</button><br/><br/>
						<button class="btn btn-primary" type="submit" v-on:click.prevent.stop="submit">Create new</button>
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
			mainImageToUpload: null
		};
	},
	methods: {
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

						console.log('success >');
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
				image1: 'https://firebasestorage.googleapis.com/v0/b/meraki-test-eb979.appspot.com/o/table2.png?alt=media&token=66b76efe-11fe-4885-a111-f7315dc6ce75',
				image2: 'https://firebasestorage.googleapis.com/v0/b/meraki-test-eb979.appspot.com/o/table2.png?alt=media&token=66b76efe-11fe-4885-a111-f7315dc6ce75'
			});
		},
		deleteItem () {
			if (confirm('Are you sure you want to delete this product?')) {
				this.$firebaseRefs.products.child(this.currentItem['.key']).remove();
			}
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
		submit (e) {
			if (!this.id || !this.title) {
				alert('id nor title shouldnt be empty');
				return;
			}

			const mainImage = this.mainImageToUpload;

			firebase.storage().ref('products/' + mainImage.name).put(mainImage)
				.then(imageInfo => {
					this.$firebaseRefs.products.push({
						id: this.id,
						mainImage: imageInfo.downloadURL,
						// secondImage: this.url2,
						price: this.price,
						priceText: this.priceText,
						title: this.title,
						cat: this.cat,
						sections: this.sections
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
