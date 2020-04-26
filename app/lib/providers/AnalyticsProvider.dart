import 'package:firebase_analytics/firebase_analytics.dart';
import 'package:firebase_analytics/observer.dart';

class AnalyticsProvider {

  FirebaseAnalytics analytics;
  FirebaseAnalyticsObserver observer;

  AnalyticsProvider() {
    print('Initializing analytics provider');
    analytics = FirebaseAnalytics();
    observer = FirebaseAnalyticsObserver(analytics: analytics);
    print('Analytics provider initialized.');
  }

  Future<void> sendEvent(String name, Map<String, dynamic> params) async {
    print('Debug: Sending event $name - with params? ${params != null ? 'Yes' : 'No'}');
    await analytics.logEvent(name: name, parameters: params);
  }

}