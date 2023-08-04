export interface UserInfo {
	avatar_url: string | null;
	created_at: string | null;
	email: string | null;
	id: string;
	username: string | null;
}

export interface Message {
	id: string;
	message_text: string;
	created_at: string;
	sender_id: {
		id: string;
		username: string;
		avatar_url: string;
	};
}

export interface Database {
	public: {
		Tables: {
			messages: {
				Row: Message;
				Insert: Message;
				Update: Message;
				Relationships: [
					{
						foreignKeyName: 'messages_sender_id_fkey';
						columns: ['sender_id'];
						referencedRelation: 'user_info';
						referencedColumns: ['id'];
					}
				];
			};
			user_info: {
				Row: UserInfo;
				Insert: UserInfo;
				Update: UserInfo;
				Relationships: [
					{
						foreignKeyName: 'user_info_id_fkey';
						columns: ['id'];
						referencedRelation: 'users';
						referencedColumns: ['id'];
					}
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
}
