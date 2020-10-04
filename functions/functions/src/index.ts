import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as express from 'express';
import * as cors from 'cors';

admin.initializeApp();

const corsHandler = cors({ origin: true,  });

interface UserIdResponse {
    uId: string;
}

export const getUserId = functions.https.onRequest(async (request: express.Request, response: express.Response<UserIdResponse | string>): Promise<any> => {
    const phoneNumber: string | undefined = request.body.msisdn;

    return corsHandler(request, response, async () => {
        if (phoneNumber) {
            functions.logger.info(`Getting user for phone number: ${phoneNumber}`);
            const user = await admin.auth().getUserByPhoneNumber(`+354${phoneNumber}`);

            if (user) {
                return response.status(200).send({
                    uId: user.uid,
                });
            }

            return response.status(404).send('Not found');
        } else {
            return response.status(400).send('Bad request');
        }
    });
});