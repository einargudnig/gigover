import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as express from 'express';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

interface UserIdResponse {
    uId: string;
}

export const getUserId = functions.https.onRequest(async (request: express.Request, response: express.Response<UserIdResponse | string>): Promise<any> => {
    const body = request.body;
    const phoneNumber: string | undefined = body['phoneNumber'];

    if (phoneNumber) {
        functions.logger.info(`Getting user for phone number: ${phoneNumber}`);
        const user = await admin.auth().getUserByPhoneNumber(phoneNumber);

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