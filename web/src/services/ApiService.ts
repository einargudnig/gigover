export const IS_LOCAL = process.env.NODE_ENV !== 'production';

export const API_BASE =
	process.env.NODE_ENV === 'production'
		? 'https://rest.gigover.com/rest/'
		: // : 'http://localhost:3000/rest/';
		  'http://localhost:8080/gigover-sdk-2.5.0-SNAPSHOT/rest/'; // 🤦‍♂️
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
	static resourceTypes = API_BASE + 'support/resourceTypes';
	static resourceCategories = API_BASE + 'support/resourceCategories';
	static resources = API_BASE + 'contractor/resources';
	static addResource = API_BASE + 'contractor/resourceAdd';
	static editResource = API_BASE + 'contractor/resourceUpdate';
	static holdResource = API_BASE + 'contractor/resourceHold';
	static releaseResource = API_BASE + 'contractor/resourceRelease';
	static deleteResource = API_BASE + 'contractor/resourceDel';
	static resourceHistory = (id: number) => API_BASE + 'contractor/resourceHistory/' + id;
	static resourceComment = API_BASE + 'contractor/addResourceComment';
	static getResourceComments = (id: number) =>
		API_BASE + 'contractor/resource/' + id + '/comments';

	// Time tracking
	static activeWorkers = API_BASE + 'contractor/activeWorkers';
	static startTimer = API_BASE + 'contractor/start';
	static stopTimer = API_BASE + 'contractor/stop';
	static timerReport = API_BASE + 'contractor/report';
	static changeTimeRecord = API_BASE + 'contractor/changeTimeRecord';

	// Time sheets
	static workAdd = API_BASE + 'timesheet/workAdd';
	static workChange = API_BASE + 'timesheet/workChange';
	static workRemove = API_BASE + 'timesheet/workRemove';
	static report = API_BASE + 'timesheet/reportCsv';

	// User registration
	static registerUser = API_BASE + 'user/store';

	// User notifications
	static notifications = API_BASE + 'contractor/notifications';
	static readNotification = (notificationId: number) =>
		API_BASE + 'contractor/notification/read/' + notificationId;
	static deleteNotification = (notificationId: number) =>
		API_BASE + 'contractor/notification/delete/' + notificationId;

	// Support
	static projectTypes = API_BASE + 'workers/types';

	// Cloud Functions
	static getUserIdByPhoneNumber =
		'https://us-central1-gigover2.cloudfunctions.net/getUserIdForPhoneNumber';
	static getUserIdByEmail = 'https://us-central1-gigover2.cloudfunctions.net/getUserIdForEmail';

	// File system

	static folderList = (projectId: number) => API_BASE + 'contractor/folder/' + projectId; //old
	static addFolder = API_BASE + 'contractor/addFolder';
	static deleteFolder = API_BASE + 'contractor/removeFolder';
	static folderFiles = (folderId: number) => API_BASE + 'contractor/documents/' + folderId;
	static projectFiles = (projectId: number) =>
		API_BASE + 'contractor/documents/project/' + projectId;
	static folderFolders = (projectId: number, folderId: number) =>
		API_BASE + 'contractor/folder/' + projectId + '/' + folderId;

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

	// Progress status
	static getProgressStatusList = API_BASE + 'contractor/progressStatus';

	// Tender
	//! TODO: add parameters where needed.
	static addTender = API_BASE + 'tender/addTender';
	static editTender = API_BASE + 'tender/editTender';
	static deleteTender = API_BASE + 'tender/deleteTender';
	static getTenderById = (tenderId: number) => API_BASE + 'tender/tender/' + tenderId; //! Use this one to display both the tender details and the tender items
	static addTenderItem = API_BASE + 'tender/addTenderItem';
	static editTenderItem = API_BASE + 'tender/editTenderItem';
	static deleteTenderItem = API_BASE + 'tender/deleteTenderItem';
	static publishTender = API_BASE + 'tender/publishTender';
	static userTenders = API_BASE + 'tender/tenders';
	static projectTenders = (projectId: number) => API_BASE + 'tender/tenders/' + projectId;
	static addOffer = API_BASE + 'tender/addOffer';
	static editOffer = API_BASE + 'tender/editOffer';
	static addOfferItem = API_BASE + 'tender/addOfferItem';
	static editOfferItem = API_BASE + 'tender/editOfferItem';
}
