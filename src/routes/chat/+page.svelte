<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import { Avatar } from '@skeletonlabs/skeleton';
	import type { Message } from '../../types';
	import { onMount, beforeUpdate, afterUpdate } from 'svelte';

	export let data: PageData;

	let allMessages: Message[];
	let autoscroll: boolean;
	let div: HTMLElement;

	beforeUpdate(() => {
		autoscroll = div && div.offsetHeight + div.scrollTop > div.scrollHeight - 20;
	});

	afterUpdate(() => {
		if (autoscroll) div.scrollTo(0, div.scrollHeight);
	});

	$: {
		allMessages = data?.messages || [];
	}

	onMount(() => {
		div.scrollTo(0, div.scrollHeight);
	});

	function formatMessageDate(created_at: string): string {
		const date = new Date(created_at);
		const today = new Date();
		const yesterday = new Date(today);
		yesterday.setDate(today.getDate() - 1);

		let finalDate = '';

		if (date.toDateString() === today.toDateString()) {
			finalDate = 'Today';
		} else if (date.toDateString() === yesterday.toDateString()) {
			finalDate = 'Yesterday';
		} else {
			const options: Intl.DateTimeFormatOptions = {
				weekday: 'short',
				day: 'numeric',
				month: 'numeric'
			};
			finalDate = new Intl.DateTimeFormat('en-US', options).format(date).replace(',', '');
		}

		const timeOptions: Intl.DateTimeFormatOptions = {
			hour: 'numeric',
			minute: '2-digit',
			hour12: true
		};
		finalDate += ' @ ' + new Intl.DateTimeFormat('en-US', timeOptions).format(date).toLowerCase();

		return finalDate;
	}
</script>

<div
	class="flex flex-col h-[calc(100%-theme(space.48))] w-full lg:w-4/5 mx-auto mt-2 card p-4 bg-surface-50-900-token"
>
	<div
		class="overflow-auto px-4 flex-grow flex flex-col justify-start space-y-4 hide-scrollbar h-screen"
		bind:this={div}
	>
		{#each allMessages as message}
			{#if message.sender_id.id == data?.session?.user.id}
				<div class="flex gap-2 justify-end items-start">
					<div
						class="card p-4 variant-soft-primary rounded-tr-none space-y-2 max-w-screen-sm flex-grow min-w-0"
					>
						<header class="flex justify-between items-center">
							<p class="font-bold">{message.sender_id?.username}</p>
							<small class="opacity-50">{formatMessageDate(message.created_at)}</small>
						</header>
						<p>{message.message_text}</p>
					</div>
					<Avatar src={message.sender_id.avatar_url} width="w-12 h-12 flex-shrink-0" />
				</div>
			{:else}
				<div class="flex gap-2 items-start">
					<Avatar src={message.sender_id.avatar_url} width="w-12 h-12 flex-shrink-0" />
					<div
						class="card p-4 variant-soft-surface rounded-tl-none space-y-2 max-w-screen-sm flex-grow min-w-0"
					>
						<header class="flex justify-between items-center">
							<p class="font-bold">{message.sender_id?.username}</p>
							<small class="opacity-50">{formatMessageDate(message.created_at)}</small>
						</header>
						<p>{message.message_text}</p>
					</div>
				</div>
			{/if}
		{/each}
	</div>
	<div class="flex-shrink-0 mt-4">
		<form
			use:enhance
			method="POST"
			class="input-group input-group-divider grid-cols-[auto_1fr_auto] rounded-container-token"
		>
			<button class="input-group-shim">+</button>
			<input type="hidden" name="sender_id" value={data.session?.user.id} />
			<input type="hidden" name="username" value={data.user_info[0].username} />
			<textarea
				class="bg-transparent border-0 ring-0"
				name="prompt"
				placeholder="Write a message..."
				rows="1"
			/>
			<button class="variant-filled-primary">Send</button>
		</form>
	</div>
</div>
