import { useMutation } from 'react-query';
import { ErrorResponse } from '../models/ErrorResponse';
import { ApiService } from '../services/ApiService';
import axios, { AxiosResponse } from 'axios';

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
	return useMutation<AxiosResponse, ErrorResponse, ReportToCSVVariables>(
		async (project) => await axios.post(ApiService.report, project, { withCredentials: true }),
		{
			onSuccess: async (response) => {
				const blob = new Blob([response.data], {
					type: 'text/csv;charset=utf8;'
				});
				saveBlob(blob, 'GigoverReport.csv');
			}
		}
	);
};
