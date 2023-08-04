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

	$: {
		allMessages = data?.messages || [];
	}

	async function mapPayloadToMessage(payload: any): Promise<Message> {
		const senderId = payload.new.sender_id;

		let { data: sender_info, error } = await data.supabase
			.from('user_info')
			.select('id, username, avatar_url')
			.eq('id', senderId);

		if (error || !sender_info || sender_info.length === 0) {
			throw new Error("Couldn't fetch sender details");
		}

		const senderDetails = sender_info[0];

		return {
			id: payload.new.id,
			message_text: payload.new.message_text,
			created_at: payload.new.created_at,
			sender_id: {
				id: senderDetails.id,
				username: senderDetails.username,
				avatar_url: senderDetails.avatar_url
			}
		};
	}

	const messages = data.supabase
		.channel('custom-insert-channel')
		.on(
			'postgres_changes',
			{ event: 'INSERT', schema: 'public', table: 'messages' },
			async (payload) => {
				if (import.meta.env.DEV) {
					console.log('Change received!', payload);
				}
				if (payload.new.sender_id === data?.session?.user.id) {
					return;
				}
				try {
					const newMessage = await mapPayloadToMessage(payload);
					allMessages = [...allMessages, newMessage];
				} catch (error) {
					console.error('Error mapping payload to message:', error);
				}
			}
		)
		.subscribe();

	beforeUpdate(() => {
		autoscroll = div && div.offsetHeight + div.scrollTop > div.scrollHeight - 20;
	});

	afterUpdate(() => {
		if (autoscroll) div.scrollTo(0, div.scrollHeight);
	});

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
