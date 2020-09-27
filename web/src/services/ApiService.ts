export const API_BASE = 'https://gigover2.appspot.com/rest/';

export class ApiService {
	static verify = API_BASE + 'user/verify';

	static projectList = API_BASE + 'contractor/list/';
	static projectDetails = (id: number): string => API_BASE + 'contractor/project/' + id;
	static modifyProject = API_BASE + 'contractor/store'; // CRUD

	static modifyTask = API_BASE + 'contractor/addTask';
	static addComment = API_BASE + 'contractor/comment';

	static registerUser = API_BASE + 'user/store';

	// Support
	static projectTypes = API_BASE + 'workers/types';
}
