<template>
  <div id="app">
    <router-view v-if="isRouterRefresh"></router-view>
  </div>
</template>

<script>
	export default {
		provide() {
			return {
				reload: this.reload
			}
		},
		data() {
			return {
				isRouterRefresh: true
			}
		},
		methods: {
			reload() {
				this.isRouterRefresh = false;
				this.$nextTick(function() {
					this.isRouterRefresh = true;
				})
			}
		}
	}

	
</script>

<style lang="scss">
@import '@/assets/style/home.scss'
// #app {
//   font-family: Avenir, Helvetica, Arial, sans-serif;
//   -webkit-font-smoothing: antialiased;
//   -moz-osx-font-smoothing: grayscale;
//   // text-align: center;
//   color: #2c3e50;
// }
// 
// #nav {
//   padding: 30px;
// 
//   a {
//     font-weight: bold;
//     color: #2c3e50;
// 
//     &.router-link-exact-active {
//       color: #42b983;
//     }
//   }
// }
</style>
