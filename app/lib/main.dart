import 'package:cookie_jar/cookie_jar.dart';
import 'package:dio/dio.dart';
import 'package:firebase_analytics/firebase_analytics.dart';
import 'package:firebase_analytics/observer.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:mittverk/igital/widgets/IgitalScrollBehaviour.dart';
import 'package:mittverk/providers/AuthProvider.dart';
import 'package:mittverk/screens/HomeScreen/HomeScreen.dart';
import 'package:mittverk/screens/LoginScreen/LoginScreen.dart';
import 'package:mittverk/services/AnalyticsService.dart';
import 'package:mittverk/services/ApiService.dart';
import 'package:mittverk/utils/Theme.dart';
import 'package:mittverk/widgets/FullscreenLoader.dart';
import 'package:provider/provider.dart';

bool notNull(Object? o) => o != null;

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();

  SystemChrome.setPreferredOrientations([DeviceOrientation.portraitUp])
      .then((_) {
    runApp(MittVerkApp());
  });
}

final GlobalKey<NavigatorState> mainNavigatorKey = GlobalKey<NavigatorState>();

class MittVerkApp extends StatefulWidget {
  @override
  State createState() => MittVerkAppState();
}

class MittVerkAppState extends State<MittVerkApp> {
  final FirebaseAuth authInstance = FirebaseAuth.instance;

  MittVerkAppState() {
    AnalyticsService.analytics = FirebaseAnalytics();
    AnalyticsService.observer =
        FirebaseAnalyticsObserver(analytics: AnalyticsService.analytics);
    ApiService.dio = Dio();
    ApiService.cookieJar = CookieJar();
    ApiService.setCookieJar();
  }

  @override
  void initState() {
    super.initState();
  }

  @override
  void dispose() {
    super.dispose();
  }

  Widget splashScreen(Widget child) {
    return MaterialApp(
      builder: (context, child) {
        return ScrollConfiguration(
          behavior: IgitalScrollBehaviour(),
          child: child!,
        );
      },
      home: Container(
        decoration: BoxDecoration(
          color: MVTheme.primaryColor,
        ),
        child: Center(
          child: child,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return StreamBuilder(
      stream: authInstance.authStateChanges(),
      builder: (context, AsyncSnapshot<User?> snapshot) {
        if (snapshot.hasError) {
          // TODO
          return splashScreen(Text('ERROR'));
        }

        if (snapshot.connectionState == ConnectionState.waiting) {
          return FullscreenLoader();
        }

        return MultiProvider(
          providers: [
            ChangeNotifierProvider<AuthProvider>(
              create: (context) => AuthProvider(authInstance, snapshot.data),
            ),
          ],
          child: MaterialApp(
            debugShowCheckedModeBanner: false,
            theme: ThemeData(
              primaryColor: Color.fromRGBO(7, 16, 41, 1),
              backgroundColor: Color.fromRGBO(251, 251, 251, 1),
              accentColor: Color.fromRGBO(131, 136, 148, 1),
            ),
            builder: (context, child) {
              return ScrollConfiguration(
                behavior: IgitalScrollBehaviour(),
                child: child!,
              );
            },
            navigatorKey: mainNavigatorKey,
            initialRoute: snapshot.data != null ? '/home' : '/login',
            routes: {
              '/login': (context) => LoginScreen(),
              '/home': (context) => HomeScreen(),
            },
          ),
        );
      },
    );
  }
}
