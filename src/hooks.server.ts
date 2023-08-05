// src/hooks.server.ts
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';
import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createSupabaseServerClient({
		supabaseUrl: PUBLIC_SUPABASE_URL,
		supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
		event
	});

	/**
	 * A convenience helper so we can just call await getSession() instead const { data: { session } } = await supabase.auth.getSession()
	 */
	event.locals.getSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		return session;
	};

	// protect requests to all routes that start with /protected-routes
	if (event.url.pathname.startsWith('/chat') || event.url.pathname.startsWith('/profile')) {
		const session = await event.locals.getSession();
		if (!session) {
			// the user is not signed in
			throw redirect(303, '/');
		}
	}

	// protect POST requests to all routes that start with /protected-posts
	// if (event.url.pathname.startsWith('/protected-posts') && event.request.method === 'POST') {
	// 	const session = await event.locals.getSession();
	// 	if (!session) {
	// 		// the user is not signed in
	// 		throw error(303, '/');
	// 	}
	// }

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});
};
