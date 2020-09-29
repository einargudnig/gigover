export const API_BASE = 'https://gigover2.appspot.com/rest/';

export class ApiService {
	static verify = API_BASE + 'user/verify';

	static projectList = API_BASE + 'contractor/list/';
	static projectDetails = (id: number): string => API_BASE + 'contractor/project/' + id;
	static modifyProject = API_BASE + 'contractor/store'; // CRUD
	static addWorker = API_BASE + `contractor/addWorker`;
	static removeWorker = API_BASE + `contractor/removeWorker`;

	static addTask = API_BASE + 'contractor/addTask';
	static updateTask = API_BASE + 'workers/updateTask';
	static taskDetails = (id: number): string => API_BASE + 'workers/task/' + id;
	static addComment = API_BASE + 'contractor/comment';

	static registerUser = API_BASE + 'user/store';

	// Support
	static projectTypes = API_BASE + 'workers/types';
}
