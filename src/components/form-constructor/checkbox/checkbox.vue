<template>
	<div class="checkbox-wrapper">
		<label class="checkbox">
			<span class="checkbox__check">
				<input type="checkbox">
			</span>
			<span class="checkbox__label">{{passedLabel}}</span>
		</label>
	</div>
</template>

<script>

export default {
	props: ['passedLabel']
}
</script>

<style scoped lang="sass">
.checkbox
	position: relative
	display: block
	&__label
		position: absolute
		top: 0px
		font-family: 'Futura PT'
		color: #ccc
		left: 23px
		font-size: .9em
</style>
