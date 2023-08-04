<!-- src/routes/+page.svelte -->
<script lang="ts">
	import SpeechBubble from '../lib/components/SpeechBubble.svelte';

	// export let data;
</script>

<svelte:head>
	<title>t-chat</title>
</svelte:head>

<div class="flex flex-col mx-auto justify-start items-center h-full">
	<div class="flex justify-center items-center pt-8">
		<h1 class="text-7xl">💩</h1>
		<SpeechBubble>Welcome!</SpeechBubble>
	</div>
	<div class="w-3/4 lg:w-2/5 pt-4">
		<div class="card p-8 variant-ghost-surface">
			<h1 class="h1 mb-8">Sign in</h1>
			<form action="/signin" method="POST" class="space-y-4">
				<label class="label">
					<span>email</span>
					<input class="input" type="email" name="email" placeholder="email" />
				</label>
				<label class="label">
					<span>password</span>
					<input class="input" type="password" name="password" placeholder="password" />
				</label>
				<button class="btn variant-filled-primary">submit</button>
			</form>
		</div>
	</div>
</div>
