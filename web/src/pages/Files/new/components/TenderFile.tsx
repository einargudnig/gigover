import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetTenderById } from '../../../../queries/useGetTenderById';

export const TenderFile = (): JSX.Element => {
	const { tenderId } = useParams();
	const { data } = useGetTenderById(Number(tenderId));
	// console.log(data, 'DATA');
	// const tenderDocuments = data?.tender.documents;
	return <div>TenderFile</div>;
};
