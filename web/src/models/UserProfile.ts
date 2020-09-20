export interface IUserProfile {
	email: string;
	family_name: string;
	given_name: string;
	granted_scopes: string;
	hd: string; // Organization (domain)
	id: string;
	locale: string;
	name: string;
	picture: string;
	verified_email: boolean;
}
