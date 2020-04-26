import 'package:flutter/cupertino.dart';
import 'package:provider/provider.dart';

import 'AnalyticsProvider.dart';

class AuthProvider extends ChangeNotifier {

    AnalyticsProvider analytics;

    AuthProvider(this.analytics) {
        testEvent();
    }

    void testEvent() {
        print('TestEvent');
        analytics.sendEvent('TEST_Event', {
            "TESTData": 123,
        });
    }

}