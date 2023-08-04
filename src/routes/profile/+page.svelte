<script lang="ts">
	import type { PageData } from './$types';
	import { Avatar } from '@skeletonlabs/skeleton';
	import { enhance } from '$app/forms';

	export let data: PageData;

	$: username = data?.user_info[0]?.username;
</script>

<div class="w-3/4 mx-auto mt-8">
	<div class="card p-8">
		{#if !username}
			<aside class="alert variant-ghost-error w-3/4 mx-auto text-center">
				<div class="alert-message">
					<h3 class="h3">Profile Needed</h3>
					<p>You must select a username.</p>
				</div>
			</aside>
		{:else}
			<h1 class="h1 text-center">Hi, {username}</h1>
		{/if}

		<form
			action="?/update"
			method="POST"
			class="flex flex-col mx-auto justify-center items-center space-y-10"
			enctype="multipart/form-data"
			use:enhance
		>
			<div class="flex flex-col w-full mx-auto justify-center items-center">
				<Avatar src={data?.user_info[0]?.avatar_url} width="w-48" class="my-8" />
			</div>

			<div class="flex justify-center items-center">
				<label for="username" class="label mr-3">username:</label>
				<input
					type="text"
					class="input-group"
					name="username"
					placeholder="enter a username"
					value={username}
				/>
			</div>
			<div class="flex">
				<button class="btn variant-filled-primary text-xl">update</button>
				{#if username}
					<button class="btn variant-outline-success ml-4 hover:variant-filled-primary"
						><a href="/chat">enter CHAT👉</a></button
					>
				{/if}
			</div>
		</form>
	</div>
</div>
