<template>
	<div class="inventory">
		<v-btn @click="goBack()" v-if="currentDepth !== 'superCat'" class="inventory__back" color="secondary darken-2" dark>
      		<v-icon dark left>arrow_back</v-icon>Back
    	</v-btn>
		<div class="inventory__item" v-if="currentDepth === 'superCat'">
			<superCat v-on:moveToSub="moveToSubCat"></superCat>
		</div>
		<div class="inventory__item" v-if="currentDepth === 'sub'">
			<subcats v-on:moveToProduct="moveToProduct" v-bind:query="subQuery"></subcats>
		</div>
		<div class="inventory__item" v-if="currentDepth === 'product'">
			<products v-bind:query="productQuery"></products>
		</div>
	</div>
</template>

<script>
import Products from '../products/products.vue';
import Sub from '../sub-categories/sub-categories.vue';
import SuperCat from '../super-categories/super-categories.vue';

export default {
	data () {
		return {
			currentDepth: 'superCat',
			subQuery: null,
			productQuery: null
		}
	},
	methods: {
		moveToSubCat (queryState) {
			this.currentDepth = 'sub';

			this.subQuery = queryState.path;
		},
		moveToProduct (queryState) {
			this.currentDepth = 'product';

			this.productQuery = queryState;
		},
		goBack () {
			this.currentDepth = this.currentDepth === 'sub'
				? 'superCat'
				: 'sub';
		}
	},
	components: {
		superCat: SuperCat,
		subcats: Sub,
		products: Products
	}
}
</script>

<style scoped lang='sass'>
.inventory
	position: relative
	&__back
		position: absolute
		right: 0
		top: 0
</style>
