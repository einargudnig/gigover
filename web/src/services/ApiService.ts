export const IS_LOCAL = process.env.NODE_ENV !== 'production';

export const API_BASE =
	process.env.NODE_ENV === 'production'
		? 'https://rest.gigover.com/rest/'
		: 'http://localhost:8080/rest/';

export class ApiService {
	static verify = API_BASE + 'user/verify';
	static change = API_BASE + 'user/change';
	static logout = API_BASE + 'user/logout';

	// Projects
	static projectList = API_BASE + 'contractor/listEx';
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
	static getMilestones = (projectId: number): string =>
		API_BASE + 'contractor/milestones/' + projectId;
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
	static getUserIdByPhoneNumber =
		'https://us-central1-gigover2.cloudfunctions.net/getUserIdForPhoneNumber';

	// File system
	static folderList = (projectId: number) => API_BASE + 'contractor/folder/' + projectId;
	static addFolder = API_BASE + 'contractor/addFolder';
	static deleteFolder = API_BASE + 'contractor/removeFolder';
	static folderFiles = (folderId: number) => API_BASE + 'contractor/documents/' + folderId;

	// Image dots and comments
	static addImage = API_BASE + 'contractor/addDocument'; // Used for all kinds of files
	static removeImage = API_BASE + 'contractor/removeDocument'; // Used for all kinds of files
	static addImageDot = API_BASE + 'contractor/addDot';
	static removeImageDot = API_BASE + 'contractor/removeDot';
	static getImageDots = (imageId: number) => API_BASE + 'contractor/dots/' + imageId;
	static addDotComment = API_BASE + 'contractor/addDotComment';
	static updateDotStatus = API_BASE + 'contractor/updateDotStatus';
	static removeDotComment = API_BASE + 'contractor/removeDotComment';
	static editDotComment = API_BASE + 'contractor/editDotComment';
}
