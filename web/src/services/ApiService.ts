import { ApiError, ApiErrorType, handleApiError } from '../utils/apiErrorUtils';

export const IS_LOCAL = process.env.NODE_ENV !== 'production';

export const API_BASE =
	process.env.NODE_ENV === 'production'
		? 'https://rest.gigover.com/rest/'
		: // 'http://localhost:3000/rest/';
			'http://localhost:8080/gigover-sdk-3.0.2/rest/';
// If using proxy.
// If hosting backend locally use :8080 instead of :3000

/**
 * Maximum number of retry attempts for retryable API errors
 */
export const MAX_RETRY_ATTEMPTS = 3;

/**
 * Base backoff time for retries (in ms)
 */
export const BASE_RETRY_DELAY = 500;

/**
 * Retry an API call with exponential backoff
 * @param fn The function to retry
 * @param retryAttempts Current retry attempt count
 * @param maxRetries Maximum number of retries
 */
export async function retryWithBackoff<T>(
	fn: () => Promise<T>,
	retryAttempts = 0,
	maxRetries = MAX_RETRY_ATTEMPTS
): Promise<T> {
	try {
		return await fn();
	} catch (error) {
		// Check if we should retry
		if (retryAttempts < maxRetries && error instanceof ApiError && error.retryable) {
			// Calculate exponential backoff delay
			const delay = Math.min(
				BASE_RETRY_DELAY * Math.pow(2, retryAttempts),
				10000 // Max 10 seconds
			);

			// Add jitter to prevent thundering herd
			const jitteredDelay = delay + Math.random() * 100;

			// Wait before retrying
			await new Promise((resolve) => setTimeout(resolve, jitteredDelay));

			// Retry with incremented attempt count
			return retryWithBackoff(fn, retryAttempts + 1, maxRetries);
		}

		// We've run out of retries or the error isn't retryable
		throw error;
	}
}

/**
 * API client with enhanced error handling and retry logic
 */
export class ApiClient {
	/**
	 * Make a request with automatic error handling and retry for network issues
	 */
	static async request<T>(
		url: string,
		method = 'GET',
		data?: Record<string, string>,
		options: {
			retries?: number;
			withCredentials?: boolean;
			headers?: Record<string, string>;
		} = {}
	): Promise<T> {
		const { retries = MAX_RETRY_ATTEMPTS, withCredentials = true, headers = {} } = options;

		// Use fetch API
		const makeRequest = async (): Promise<T> => {
			try {
				const requestOptions: RequestInit = {
					method,
					credentials: withCredentials ? 'include' : 'same-origin',
					headers: {
						'Content-Type': 'application/json',
						...headers
					}
				};

				// Add body for non-GET requests
				if (method !== 'GET' && data) {
					requestOptions.body = JSON.stringify(data);
				}

				// Make the request
				const response = await fetch(url, requestOptions);

				// Handle non-2xx responses
				if (!response.ok) {
					let responseData;
					try {
						responseData = await response.json();
					} catch (e) {
						// If JSON parsing fails, use text instead
						responseData = { message: await response.text() };
					}

					throw new ApiError({
						message: responseData?.message || `API Error (${response.status})`,
						type: response.status >= 500 ? ApiErrorType.SERVER : ApiErrorType.CLIENT,
						endpoint: url,
						status: response.status,
						method,
						responseData,
						requestData: data,
						retryable: response.status >= 500 || response.status === 429
					});
				}

				// Parse successful response
				try {
					return await response.json();
				} catch (e) {
					// Handle successful but invalid JSON responses
					throw new ApiError({
						message: 'Invalid JSON response',
						type: ApiErrorType.PARSE,
						endpoint: url,
						status: response.status,
						method,
						retryable: false
					});
				}
			} catch (error) {
				// Handle fetch errors and transform them to ApiErrors
				if (!(error instanceof ApiError)) {
					throw handleApiError(error, url, method, data);
				}
				throw error;
			}
		};

		// Attempt the request with retries
		return retryWithBackoff(makeRequest, 0, retries);
	}

	/**
	 * GET request
	 */
	static async get<T>(url: string, options?: Record<string, string>): Promise<T> {
		return ApiClient.request<T>(url, 'GET', undefined, options);
	}

	/**
	 * POST request
	 */
	static async post<T>(
		url: string,
		data?: Record<string, string>,
		options?: Record<string, string>
	): Promise<T> {
		return ApiClient.request<T>(url, 'POST', data, options);
	}

	/**
	 * PUT request
	 */
	static async put<T>(
		url: string,
		data?: Record<string, string>,
		options?: Record<string, string>
	): Promise<T> {
		return ApiClient.request<T>(url, 'PUT', data, options);
	}

	/**
	 * DELETE request
	 */
	static async delete<T>(url: string, options?: Record<string, string>): Promise<T> {
		return ApiClient.request<T>(url, 'DELETE', undefined, options);
	}
}

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
	static removeProgressTab = (progressId: number) =>
		API_BASE + 'contractor/removeProgressTab/' + progressId;

	// Setting
	static getUserInfo = API_BASE + 'user/info';

	// Tender
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
	// Offers + bidder
	static addOffer = API_BASE + 'tender/addOffer';
	static editOffer = API_BASE + 'tender/editOffer';
	static addOfferItem = API_BASE + 'tender/offerItem';
	static publishOffer = API_BASE + 'tender/publishOffer';
	static userOffers = API_BASE + 'tender/offers';
	static tenderOffers = (tenderId: number) => API_BASE + 'tender/offers/' + tenderId;
	static addBidder = API_BASE + 'tender/addBidder';
	static bidderReject = API_BASE + 'tender/bidderReject';
	static bidderTenders = API_BASE + 'tender/bidderTenders';
	static offer = (offerId: number) => API_BASE + 'tender/offer/' + offerId;
	static acceptOffer = API_BASE + 'tender/acceptOffer';
	static rejectOffer = API_BASE + 'tender/rejectOffer';
	// Tender documents
	static addTenderDocumentByTenderOwner = API_BASE + 'tender/addTenderDocument'; // This is used by the TenderOwner to send documents.
	static removeTenderDocumentByTenderOwner = (documentId: number) =>
		API_BASE + 'tender/removeTenderDocument/' + documentId; // this one is used to remove documents from the Tender
	static addTenderDocument = API_BASE + 'tender/addDocument'; // This is used to add documents, but now we want the tender owner to be able to send documents wit the tender
	static offerDocuments = (offerId: number) => API_BASE + 'tender/offer/' + offerId; // this one is GET for bidders documents on offer
	static tenderDocuments = (tenderId: number) => API_BASE + 'tender/tender/' + tenderId; // this one is GET for the tenderOwner documents
	// Client bids
	static addBid = API_BASE + 'bid/addBid';
	static editBid = API_BASE + 'bid/editBid';
	static deleteBid = API_BASE + 'bid/deleteBid';
	static addBidItem = API_BASE + 'bid/addBidItem';
	static editBidItem = API_BASE + 'bid/editBidItem';
	static deleteBidItem = API_BASE + 'bid/deleteBidItem';
	static publishBid = API_BASE + 'bid/publishBid';
	static acceptBid = API_BASE + 'bid/accept';
	static rejectBid = API_BASE + 'bid/reject';
	static getBids = API_BASE + 'bid/bids';
	static getBidById = (bidId: number) => API_BASE + 'bid/' + bidId;
	// For the Client to see the Bid
	static getClientBids = API_BASE + 'bid/clientBids';
	static getClientBidById = (bidId: number) => API_BASE + 'bid/clientBid/' + bidId;

	// Properties
	static getProperties = API_BASE + 'properties/properties';
	static getPropertyById = (propertyId: number) => API_BASE + 'properties/' + propertyId;
	static addProperty = API_BASE + 'properties/addProperty';
	static editProperty = API_BASE + 'properties/editProperty';
	static addUnit = API_BASE + 'properties/addUnit';
	static editUnit = API_BASE + 'properties/editUnit';
	static addStakeholder = API_BASE + 'properties/addStakeHolder';
	static removeStakeholder = API_BASE + 'properties/removeStakeHolder';
	static addProject = (propertyId: number, projectId: number) =>
		API_BASE + 'properties/addProject/' + propertyId + '/' + projectId;
	static removeProject = (propertyId: number, projectId: number) =>
		API_BASE + 'properties/removeProject/' + propertyId + '/' + projectId;
	static addPropertyDocument = API_BASE + 'properties/addDocument';
	static removePropertyDocument = (documentId: number) =>
		API_BASE + 'properties/removeDocument/' + documentId;
	static deleteProperty = API_BASE + 'properties/delProperty';

	// Organization
	static createOrganization = API_BASE + 'user/orgCreate';
	static getOrganizations = API_BASE + 'user/orgs';
	static getOrganizationUsers = API_BASE + 'user/orgUsers';
	static changeOrganizations = API_BASE + 'user/orgChange';
	static changeOrganizationUserPrivileges = API_BASE + 'user/orgChangePriv';
	static inviteToOrganization = API_BASE + 'user/orgInvite';
	static removeInviteToOrganization = API_BASE + 'user/orgInviteRemove';
	static acceptOrganizationInvite = API_BASE + 'user/orgInviteAccept';
	static rejectOrganizationInvite = API_BASE + 'user/orgInviteDecline';
	static getUserOrgInvites = API_BASE + 'user/orgInvites';
	static getUserInvites = API_BASE + 'user/userInvites';
	// org login?
	static loginOrganization = API_BASE + 'org/login';
	static deleteOrganization = API_BASE + 'user/orgDelete';
	static leaveOrganization = API_BASE + 'user/orgLeave';
}
