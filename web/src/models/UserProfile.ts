import { Organization } from './Organizations';
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
	userName?: string;
}

export interface IUserInfo {
	userName?: string;
	name: string;
	registered: boolean;
	type: ContractorType | WorkerType;
	address: string;
	zipCode: string;
	avatar: string;
	phoneNumber: string;
	userId: string;
	email: string;
	organizations: Organization[];
	organization: Organization; //active organization
	authenticated: boolean;
}
