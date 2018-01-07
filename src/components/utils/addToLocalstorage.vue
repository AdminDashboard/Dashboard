<script>
export default {
	methods: {
		addToLocalstorage (type, item) {
			let items = Array.isArray(this.$ls.get(type)) && this.$ls.get(type) || [];
			let canPush = true;

			if (items.length) {
				canPush = (items.find(currentItem => currentItem.id === item.id)) ? false : true;
			}

			if (!canPush) {
				return false;
			}

			items.push(item);

			this.$ls.set(type, items);

			return true;
		}
	}
};
</script>
