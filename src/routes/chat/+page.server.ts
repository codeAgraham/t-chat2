import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	const user = await locals.getSession();

	// eslint-disable-next-line prefer-const
	let { data: messages, error } = await locals.supabase
		.from('messages')
		.select(
			`
		id, 
		message_text, 
		created_at, 
		sender_id: user_info ( id, username,avatar_url )
	`
		)
		.order('created_at', { ascending: true });

	// eslint-disable-next-line prefer-const
	let { data: user_info, error: error2 } = await locals.supabase
		.from('user_info')
		.select('*')
		.eq('id', user?.user.id);

	if (user_info == null) {
		user_info = [];
	}

	if (!user_info[0]?.username) {
		throw redirect(303, '/profile');
	}

	if (messages == null) {
		messages = [];
	}

	if (import.meta.env.DEV && (error || error2)) {
		console.log(error, error2);
	}

	return { messages: messages, user_info };
};

export const actions = {
	default: async ({ request, locals }) => {
		const formData = Object.fromEntries(await request.formData());
		const message = formData.prompt as string;
		const user = formData.sender_id as string;

		const { data, error } = await locals.supabase
			.from('messages')
			.insert([
				{
					sender_id: user,
					message_text: message
				}
			])
			.select();

		if (error && import.meta.env.DEV) {
			console.log(error.message, data);
		}

		return {
			success: true,
			formData
		};
	}
};
