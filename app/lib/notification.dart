import 'dart:async';

import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:mittverk/models/TaskStatus.dart';
import 'package:mittverk/providers/HomeProvider.dart';
import 'package:mittverk/screens/HomeScreen/TaskDetailsScreen.dart';
import 'package:mittverk/services/ApiService.dart';

import 'models/Task.dart';

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

  setNotifications(HomeProvider homeProvider) {
    // FirebaseMessaging.onBackgroundMessage(onBackgroundMessage);
    FirebaseMessaging.onMessage.listen(
          (message) async {
        handleMessage(message, homeProvider);
      },
    );
  }

  FirebaseMessaging getInstance() {
    return _firebaseMessaging;
  }

  requestPermission() async {
    return await _firebaseMessaging.requestPermission(alert: true, badge: true, sound: true);
  }

  setUserIdAndPushToken() async {
    try {
      await requestPermission();
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

  handleMessage(RemoteMessage message, HomeProvider homeProvider) async {
    print("PROCESSING NOTIFICATION MESSAGE");
    print(message);
    print(message.data);
    print(message.messageType);

    if (message.data.containsKey('taskId')) {
      int taskId = int.parse(message.data['taskId']);

      Task task = new Task(taskId: taskId);

      print("CONTAINS TASK ID.... : " + taskId.toString());
      homeProvider.homeNavigationKey.currentState!
          .pushNamed('/task', arguments: TaskDetailsArguments(task));
    }
  }

  void setOnLaunch(HomeProvider homeProvider) {
    FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) async {
      handleMessage(message, homeProvider);
    });
  }
}