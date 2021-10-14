export const IS_LOCAL = process.env.NODE_ENV !== 'production';

export const API_BASE =
	process.env.NODE_ENV === 'production'
		? 'https://rest.gigover.com/rest/'
		: 'http://localhost:3000/rest/';
// If using proxy.
// If hosting backend locally use :8080 instead of :3000

export class ApiService {
	static verify = API_BASE + 'user/verify';
	static change = API_BASE + 'user/change';
	static logout = API_BASE + 'user/logout';

	// Projects
	static projectList = API_BASE + 'contractor/listEx';
	static projectDetails = (id: number): string => API_BASE + 'contractor/project/' + id;
	static modifyProject = API_BASE + 'contractor/store'; // Create & Update

	// Project users
	// --- App Users
	static addWorker = API_BASE + 'contractor/addWorker';
	static removeWorker = API_BASE + 'contractor/removeWorker';
	// --- Web users
	static addUser = API_BASE + 'contractor/addUser';
	static removeUser = API_BASE + 'contractor/removeUser';
	static projectUsers = (id: number): string => API_BASE + 'contractor/projectUsers/' + id;

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

	// Resources
	static resourceTypes = 'support/resourceTypes';
	static resourceCategories = 'support/resourceCategories';
	static resources = API_BASE + 'contractor/resources';
	static addResource = 'contractor/resourceAdd';
	static editResource = 'contractor/resourceEdit';
	static holdResource = 'contractor/resourceHold';
	static releaseResource = 'contractor/resourceRelease';

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
	static getUserIdByEmail = 'https://us-central1-gigover2.cloudfunctions.net/getUserIdForEmail';

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
