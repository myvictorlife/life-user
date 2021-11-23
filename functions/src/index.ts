import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as cors from "cors";
admin.initializeApp();

interface User {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

const app = express();

// Automatically allow cross-origin requests
app.use(cors({origin: true}));

app.post("/signup", async (request: express.Request, res: express.Response) => {
  functions.logger.info("New User Signup", request.body);
  const newUser: User = request.body;
  const result = await admin.auth().createUser({
    displayName: `${newUser.firstName} ${newUser.lastName}`,
    email: newUser.email,
  });
  functions.logger.info("Successfully created new user: ", result.uid);
  await admin.firestore().collection("users").doc(result.uid).set(newUser);
  res.json(newUser);
});

exports.api = functions.https.onRequest(app);
