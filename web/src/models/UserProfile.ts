export type ContractorType = 0;
export type WorkerType = 1;

export interface IUserProfile {
	registered: boolean;
	type: ContractorType | WorkerType;
	email: string;
	authenticated: boolean;
	avatar: string;
	name: string;
	phoneNumber: string;
}
