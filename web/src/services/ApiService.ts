export const API_BASE = 'https://gigover2.appspot.com/rest/';

export class ApiService {
	static debugVerifyContractor = API_BASE + 'user/verifyCon';
	static verify = API_BASE + 'user/verify';
	static projectList = API_BASE + 'contractor/list/';
	static projectDetails = (id: number): string => API_BASE + 'contractor/project/' + id;
	static modifyProject = API_BASE + 'contractor/store'; // Create and Update
	static registerUser = API_BASE + 'user/store';
}
