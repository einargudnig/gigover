import firebase from 'firebase';
import { v4 as uuid } from 'uuid';
import { FileUploadType } from '../models/FileUploadType';
import { devError } from '../utils/ConsoleUtils';
import { Project } from '../models/Project';

interface UploadResult {
	downloadUrl: string;
}

export class FileSystemService {
	private fileSystem: firebase.storage.Storage;
	private ref: firebase.storage.Reference;

	constructor() {
		this.fileSystem = firebase.app().storage('gs://gigover-fileystem');
		this.ref = this.fileSystem.ref();
	}

	assertProjectAccess(projects: Project[], projectId: number) {
		const foundProject = projects.find((p) => p.projectId === projectId);

		if (!foundProject) {
			throw new Error('Unauthorized access to project');
		}
	}

	getProjectChild(projectId: number) {
		return this.ref.child(`${projectId}`);
	}

	getProjectFiles(projectId: number): Promise<firebase.storage.ListResult> {
		return this.getProjectChild(projectId).listAll();
	}

	async uploadFile(
		file: File,
		projectId: number,
		uploadType = FileUploadType.Project,
		fileExtension: string,
		status: (progress: number, state: firebase.storage.TaskState) => void,
		externalId?: number
	): Promise<UploadResult> {
		const fileName = uuid();
		const filePath = `${uploadType}${
			externalId ? `${externalId}/${fileName}` : fileName
		}${fileExtension}`;

		return new Promise<UploadResult>((resolve, reject) => {
			const uploadTask = this.getProjectChild(projectId).child(filePath).put(file);

			uploadTask.on(
				'state_changed',
				(snapshot) => {
					// Observe state change events such as progress, pause, and resume
					// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
					const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					status(progress, snapshot.state);
				},
				(error) => {
					devError('File upload error', error);
					reject(error.message);
				},
				async () => {
					const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
					resolve({ downloadUrl: downloadURL });
				}
			);
		});
	}
}
