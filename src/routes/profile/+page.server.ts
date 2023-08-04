export const load = async ({ locals }) => {
	const session = await locals.getSession();
	// eslint-disable-next-line prefer-const
	let { data: user_info, error } = await locals.supabase
		.from('user_info')
		.select('*')
		.eq('id', session?.user.id);

	if (user_info == null) {
		user_info = [];
	}

	if (error) {
		console.log(error);
	}

	return { user_info };
};

export const actions = {
	update: async ({ request, locals }) => {
		const user = await locals.getSession();
		const formData = Object.fromEntries(await request.formData());
		const enteredUsername = formData.username;
		const uploaderId = user?.user.id;

		const { data, error } = await locals.supabase
			.from('user_info')
			.update({ username: enteredUsername })
			.eq('id', uploaderId)
			.select();

		if (error) {
			console.log(error);
		}
	}
};
