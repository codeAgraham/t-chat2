<script lang="ts">
	// The ordering of these imports is critical to your app working properly
	import '@skeletonlabs/skeleton/themes/theme-skeleton.css';
	// If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	// Most of your app wide CSS should be put in this file
	import '../app.postcss';

	import {
		AppShell,
		AppBar,
		LightSwitch,
		Drawer,
		type DrawerSettings,
		drawerStore
	} from '@skeletonlabs/skeleton';

	//Supabase stuff----------------------------------------------
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	export let data;

	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});

	//Drawer stuff
	function trigger(position: 'left' | 'top' | 'right' | 'bottom') {
		const s: DrawerSettings = { id: 'nav', position };
		drawerStore.open(s);
	}

	$: classesActive = (href: string) => (href === $page.url.pathname ? '!bg-primary-500' : '');
</script>

<Drawer width="w-3/4 lg:w-1/3">
	<div class="flex flex-col h-full mx-auto px-8 mt-28">
		<h1 class="h1 mb-4 underline">Whatchoo want?</h1>
		<nav class="list-nav">
			<ul>
				<li>
					<a href="/profile" class={classesActive('/profile')} on:click={() => drawerStore.close()}>
						<span class="badge text-xl bg-primary-500">😎</span>
						<span class="flex-auto text-xl">Profile</span>
					</a>
				</li>
				<li>
					<a href="/chat" class={classesActive('/chat')} on:click={() => drawerStore.close()}>
						<span class="badge test-xl bg-primary-500">💩</span>
						<span class="flex-auto text-xl">Chat</span>
					</a>
				</li>
			</ul>
		</nav>
	</div>
</Drawer>

<AppShell>
	<svelte:fragment slot="header">
		<AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
			<svelte:fragment slot="lead"><LightSwitch /></svelte:fragment>
			{#if session}
				<button on:click={() => trigger('left')}><h1 class="text-5xl">💩</h1></button>
			{/if}
			<svelte:fragment slot="trail">
				{#if session}
					<form action="/signout" method="POST">
						<button class="btn btn-sm bg-gradient-to-br variant-gradient-tertiary-primary"
							>logout</button
						>
					</form>
				{/if}
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<slot />
</AppShell>
