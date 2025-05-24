import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { ErrorResponse } from '../models/ErrorResponse';
import { ApiService } from '../services/ApiService';

interface ReportToCSVVariables {
	name: 'workReport';
	parameters: string;
}

const saveBlob = (blob: Blob, fileName: string) => {
	const a = document.createElement('a');
	document.body.appendChild(a);
	// @ts-ignore
	a.setAttribute('style', 'display: none');

	const url = window.URL.createObjectURL(blob);
	a.href = url;
	a.download = fileName;
	a.click();
	window.URL.revokeObjectURL(url);
};

export const useReportToCSV = () => {
	return useMutation<string, ErrorResponse, ReportToCSVVariables>({
		mutationFn: async (project) => {
			const response = await axios.post(ApiService.report, project, {
				withCredentials: true
			});
			return response.data;
		},
		onSuccess: async (data) => {
			const blob = new Blob([data], {
				type: 'text/csv;charset=utf8;'
			});
			saveBlob(blob, 'GigoverReport.csv');
		}
	});
};
