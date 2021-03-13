export const API_BASE = 'http://localhost:8080/rest/';

export class ApiService {
	static verify = API_BASE + 'user/verify';

	// Projects
	static projectList = API_BASE + 'contractor/list/';
	static projectDetails = (id: number): string => API_BASE + 'contractor/project/' + id;
	static modifyProject = API_BASE + 'contractor/store'; // Create & Update
	static addWorker = API_BASE + 'contractor/addWorker';
	static removeWorker = API_BASE + 'contractor/removeWorker';

	// Tasks
	static addTask = API_BASE + 'contractor/addTask';
	static updateTask = API_BASE + 'contractor/updateTask';
	static taskDetails = (id: number): string => API_BASE + 'workers/task/' + id;
	static addComment = API_BASE + 'contractor/comment';

	// Milestones
	static getMilestones = API_BASE + 'contractor/getMilestones';
	static addMilestone = API_BASE + 'contractor/addMilestone';
	static milestoneDetails = (id: number): string => API_BASE + 'contractor/task/' + id;

	// Time tracking
	static activeWorkers = API_BASE + 'contractor/activeWorkers';
	static startTimer = API_BASE + 'contractor/start';
	static stopTimer = API_BASE + 'contractor/stop';
	static timerReport = API_BASE + 'contractor/report';
	static changeTimeRecord = API_BASE + 'contractor/changeTimeRecord';

	// User registration
	static registerUser = API_BASE + 'user/store';

	// Support
	static projectTypes = API_BASE + 'workers/types';

	// Cloud Functions
	static getUserIdByPhoneNumber = 'https://us-central1-gigover2.cloudfunctions.net/getUserId';
}
