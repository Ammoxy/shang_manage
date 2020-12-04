<template>
	<div class="nopage">
			<span style="color: #0074D9;">4</span>
			<span style="color: #67C23A;">0</span>
			<span style="color: #0074D9;">4</span>
		<div>
			<p>Page Not Found</p>
			<p>
				<router-link to="/desktop"><el-button type="primary">返回首页</el-button></router-link>
			</p>
		</div>
	</div>
</template>

<script>
</script>

<style scoped lang="scss">
	.nopage {
		margin-top: 5vw;
		text-align: center;
	}

	.nopage span {
		font-size: 10vw;
	}
	
	.nopage p {
		margin: 1vw;
		font-size: 2.5vw;
	}
</style>
