import { error, redirect, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ locals, request }) => {
	const formData = Object.fromEntries(await request.formData());
	const email = formData.email as string;
	const password = formData.password as string;

	const { error: err } = await locals.supabase.auth.signInWithPassword({
		email: email,
		password: password
	});

	if (err) {
		throw error(500, 'Something went wrong logging you in.');
	}

	throw redirect(303, '/profile');
};
