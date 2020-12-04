<template>
	<div class="tags" v-if="showTags">
		<ul>
			<li class="tags-li" v-for="(item,index) in tagsList" :class="{'active': isActive(item.path)}" :key="index">
				<router-link :to="item.path" class="tags-li-title">
					{{item.title}}
				</router-link>
				<span class="tags-li-icon" @click="closeTags(index)"> <span v-if="hideIcon"><i class="el-icon-close"></i></span></span>
			</li>
		</ul>
		<div class="tags-close-box">
            <el-dropdown @command="handleTags">
                <el-button size="mini" type="primary">
                    标签选项<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu size="small" slot="dropdown">
                    <el-dropdown-item command="other">关闭其他</el-dropdown-item>
                    <!-- <el-dropdown-item command="all">关闭所有</el-dropdown-item> -->
                </el-dropdown-menu>
            </el-dropdown>
        </div>
	</div>
</template>

<script>
	import bus from './bus';
	export default {
		data() {
			return {
				tagsList: [],
				hideIcon: true
			}
		},
		methods: {
			isActive(path) {
				if(this.tagsList.length === 1) {
					this.hideIcon = false;
				} else {
					this.hideIcon = true;
				}
				return path === this.$route.fullPath;
			},
			// 关闭单个标签
			closeTags(index) {
				const delItem = this.tagsList.splice(index, 1)[0];
				const item = this.tagsList[index] ? this.tagsList[index] : this.tagsList[index - 1];
				if (item) {
					delItem.path === this.$route.fullPath && this.$router.push(item.path);
				} else {
					this.$router.push('');
				}
			},
			// 关闭全部标签
			closeAll() {
				this.tagsList = [];
				this.$router.push('');
			},
			// 关闭其他标签
			closeOther() {
				const curItem = this.tagsList.filter(item => {
					return item.path === this.$route.fullPath;
				})
				this.tagsList = curItem;
				if(this.tagsList.length === 1) {
					this.hideIcon = false;
				}
			},
			// 设置标签
			setTags(route) {
				const isExist = this.tagsList.some(item => {
					return item.path === route.fullPath;
				})
				if (!isExist) {
					if (this.tagsList.length >= 16) {
						this.tagsList.shift();
					}
					this.tagsList.push({
						title: route.meta.title,
						path: route.fullPath,
						// name: route.matched[1].components.default.name
					})
				}
				bus.$emit('tags', this.tagsList);
			},
			handleTags(command) {
				command === 'other' ? this.closeOther() : this.closeAll();
			}
		},
		computed: {
			showTags() {
				return this.tagsList.length > 0;
			}
		},
		watch: {
			$route(newValue, oldValue) {
				this.setTags(newValue);
			}
		},
		created() {
			this.setTags(this.$route);
			// 监听关闭当前页面的标签页
			bus.$on('close_current_tags', () => {
				for (let i = 0, len = this.tagsList.length; i < len; i++) {
					const item = this.tagsList[i];
					if (item.path === this.$route.fullPath) {
						if (i < len - 1) {
							this.$router.push(this.tagsList[i + 1].path);
						} else if (i > 0) {
							this.$router.push(this.tagsList[i - 1].path);
						} else {
							this.$router.push('');
						}
						this.tagsList.splice(i, 1);
						break;
					}
				}
			})
		}
	}
</script>


<style scoped lang="scss">
	$color: #2a9f93;
	.tags {
		height: 40px;
		margin-bottom: 1px;
		padding-left: 6px;
		background-color: #fff;
		border-radius: 5px 5px 0 0;
	}

	.tags-li {
		float: left;
		height: 24px;
		line-height: 24px;
		margin: 6px;
		padding: 0 6px;
		border: 1px solid #999;
		border-radius: 5px;
		color: #000;
	}

	.tags-li:not(.active):hover {
		background: #f8f8f8;
	}

	.tags-li.active .tags-li-title {
		color: #fff;
	}
	
	.tags-li-icon {
		color: #000;
	}
    
    .tags-close-box {
        float: right;
        right: 0;
        top: 10px;
        padding-top: 5px;
        padding-right: 15px;
        text-align: center;
        width: 110px;
        height: 30px;
        z-index: 10;
    }
	
	.el-button--primary {
		background-color: $color;
		// background-image: linear-gradient(to right, #4CA1AF , #4CA1AF);
		border-color: $color;
	}
</style>
