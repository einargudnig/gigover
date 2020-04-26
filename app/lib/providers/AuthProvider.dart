import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/cupertino.dart';

import 'AnalyticsProvider.dart';

class AuthProvider extends ChangeNotifier {

    final FirebaseAuth _auth = FirebaseAuth.instance;
    final AnalyticsProvider _analytics;

    AuthProvider(this._analytics);

    void testEvent() {
        print('TestEvent');
        _analytics.sendEvent('TEST_Event', {
            "TESTData": 123,
        });
    }

}