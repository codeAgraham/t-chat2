// src/app.d.ts
import { Database } from './types';
import { SupabaseClient, Session } from '@supabase/supabase-js';

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient;
			getSession(): Promise<Session | null>;
		}
		interface PageData {
			session: Session | null;
			db: SupabaseClient<Database> | null;
		}

		// interface Error {}
		// interface Platform {}
	}
}
