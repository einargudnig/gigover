import 'dart:async';

import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:mittverk/services/ApiService.dart';

Future<void> onBackgroundMessage(RemoteMessage message) async {
  await Firebase.initializeApp();

  if (message.data.containsKey('data')) {
    // Handle data message
    final data = message.data['data'];

    //
    print('Route to ${data}');
  }

  if (message.data.containsKey('notification')) {
    // Handle notification message
    final notification = message.data['notification'];

    print('Notification contains: $notification message');
  }
  // Or do other work.
}

class FCM {
  final _firebaseMessaging = FirebaseMessaging.instance;

  final streamCtlr = StreamController<String>.broadcast();
  final titleCtlr = StreamController<String>.broadcast();
  final bodyCtlr = StreamController<String>.broadcast();

  setNotifications() {
    // FirebaseMessaging.onBackgroundMessage(onBackgroundMessage);
    FirebaseMessaging.onMessage.listen(
          (message) async {
        if (message.data.containsKey('data')) {
          // Handle data message
          streamCtlr.sink.add(message.data['data']);
        }
        if (message.data.containsKey('notification')) {
          // Handle notification message
          streamCtlr.sink.add(message.data['notification']);
        }
        // Or do other work.
        titleCtlr.sink.add(message.notification!.title!);
        bodyCtlr.sink.add(message.notification!.body!);
      },
    );
  }

  setUserIdAndPushToken() async {
    try {
      // With this token you can test it easily on your phone
      String? token = await _firebaseMessaging.getToken();

      print("GOT TOKEN: $token");

      if (token != null) {
        await ApiService.storePushToken(token);
        print("TOKEN STORED!");
      }
    } catch (e) {
      print("COULD NOT STORE PUSH TOKEN: START");
      print(e);
      print("COULD NOT STORE PUSH TOKEN: END");
    }
  }

  dispose() {
    streamCtlr.close();
    bodyCtlr.close();
    titleCtlr.close();
  }
}