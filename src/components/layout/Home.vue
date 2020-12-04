<template>
	<div :class="{navCollapsed:collapse}">
		<v-header></v-header>
		<v-siderbar class="sidebar"></v-siderbar>
		<div class="main">
			<v-tags class="tags"></v-tags>
			<div class="content">
				<transition name="move" mode="out-in">
					<keep-alive :include="tagsList">
						<router-view></router-view>
					</keep-alive>
				</transition>
				<el-backtop target=".content"></el-backtop>
			</div>
		</div>
	</div>
</template>

<script>
	import vHeader from './Header.vue'
	import vSiderbar from './Sidebar.vue'
	import vTags from './Tags.vue'
	import bus from './bus'
    import { mapState } from 'vuex'
    
	export default {
		components: {
			vHeader,
			vSiderbar,
			vTags
		},
		data() {
			return {
				tagsList: [],
			}
		},
        computed: {
            ...mapState(['collapse'])
        },
		created() {
				bus.$on('tags', msg => {
					let arr = [];
					for (let i = 0, len = msg.length; i < len; i++) {
						msg[i].name && arr.push(msg[i].name);
					}
					this.tagsList = arr;
				});
		}
	}
</script>

<style>

</style>
