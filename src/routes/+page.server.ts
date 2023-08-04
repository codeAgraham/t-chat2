// src/routes/+page.server.ts
import { redirect } from '@sveltejs/kit';

export const load = async ({ url, locals: { getSession } }) => {
	const session = await getSession();

	// if the user is already logged in return them to the chat page
	if (session) {
		throw redirect(303, '/chat');
	}

	return { url: url.origin };
};
