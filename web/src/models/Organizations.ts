export interface Organization {
	id: number;
	name: string;
	priv: 'ADMIN' | 'VIEWER' | 'EDITOR';
}
