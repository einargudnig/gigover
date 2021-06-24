import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as express from 'express';

admin.initializeApp();

interface UserIdResponse {
	uId: string;
}

export const getUserIdForEmail = functions.https.onRequest(async (request: express.Request, response: express.Response<UserIdResponse | string>): Promise<any> => {
	const email: string | undefined = request.body.email;
	// Set CORS headers for preflight requests
	// Allows GETs from any origin with the Content-Type header
	// and caches preflight response for 3600s

	response.set('Access-Control-Allow-Origin', '*');

	if (request.method === 'OPTIONS') {
		// Send response to OPTIONS requests
		response.set('Access-Control-Allow-Methods', 'POST');
		response.set('Access-Control-Allow-Headers', 'Content-Type');
		response.set('Access-Control-Max-Age', '3600');
		return response.status(204).send('');
	} else {
		if (email) {
			functions.logger.info(`Getting user for email: ${email}`);
			const user = await admin.auth().getUserByEmail(`${email}`);

			if (user) {
				return response.status(200).send({
					uId: user.uid
				});
			}

			return response.status(404).send('Not found');
		} else {
			return response.status(400).send('Bad request');
		}
	}
});

export const getUserIdForPhoneNumber = functions.https.onRequest(async (request: express.Request, response: express.Response<UserIdResponse | string>): Promise<any> => {
	const phoneNumber: string | undefined = request.body.msisdn;
	// Set CORS headers for preflight requests
	// Allows GETs from any origin with the Content-Type header
	// and caches preflight response for 3600s

	response.set('Access-Control-Allow-Origin', '*');

	if (request.method === 'OPTIONS') {
		// Send response to OPTIONS requests
		response.set('Access-Control-Allow-Methods', 'POST');
		response.set('Access-Control-Allow-Headers', 'Content-Type');
		response.set('Access-Control-Max-Age', '3600');
		return response.status(204).send('');
	} else {
		if (phoneNumber) {
			functions.logger.info(`Getting user for phone number: ${phoneNumber}`);
			const user = await admin.auth().getUserByPhoneNumber(`+354${phoneNumber}`);

			if (user) {
				return response.status(200).send({
					uId: user.uid
				});
			}

			return response.status(404).send('Not found');
		} else {
			return response.status(400).send('Bad request');
		}
	}
});