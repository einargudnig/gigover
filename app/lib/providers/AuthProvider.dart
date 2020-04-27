import 'package:dio/dio.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/cupertino.dart';
import 'package:mittverk/models/VerifyUser.dart';
import 'package:mittverk/services/AnalyticsService.dart';
import 'package:mittverk/services/ApiService.dart';

class AuthProvider extends ChangeNotifier {

  FirebaseAuth _auth;
  FirebaseUser _user;

  String _currentPhoneNumber;
  String _currentVerificationId;

  AuthProvider(FirebaseAuth authInstance, FirebaseUser user) {
    _auth = authInstance;

    if (user != null) {
      setUser(user, isInit: true);
    }
  }

  /// Send a code to the phone number
  Future<bool> verifyPhoneNumber({
    @required String phoneNumber,
    @required Function codeSent,
    @required Function timeout,
    @required Function(AuthCredential) success,
    @required Function err,
  }) async {
    try {
      _currentPhoneNumber = phoneNumber;

      await _auth
          .verifyPhoneNumber(
        phoneNumber: phoneNumber,
        timeout: const Duration(seconds: 12),
        verificationFailed: (AuthException authException) {
          print('VerificationFailed');
          print(authException.code);

          err(authException.message);
        },
        verificationCompleted: (auth) {
          success(auth);
        },
        codeSent: (verificationId, [forceResendingToken]) {
          this._currentVerificationId = verificationId;
          codeSent();

          AnalyticsService.sendEvent('loginVerificationSent', {
            "phoneNumber": phoneNumber,
          });
        },
        codeAutoRetrievalTimeout: (verificationId) {
          // Optional
        },
      )
          .catchError(
        (err) {
          err('Error in sending code to phone number $_currentPhoneNumber');
        },
      );

      return true;
    } catch (err) {
      err("Could not send verification code to $_currentPhoneNumber");
      return false;
    }
  }

  Future<bool> attemptLogin(String smsCode) async {
    AuthCredential credential = PhoneAuthProvider.getCredential(
        verificationId: _currentVerificationId, smsCode: smsCode);

    AnalyticsService.sendEvent('loginAttemptVerificationCode',
        {'phoneNumber': _currentPhoneNumber, 'code': smsCode});

    try {
      AuthResult authResult = await _auth.signInWithCredential(credential);

      if (authResult.user != null) {
        setUser(authResult.user);
        return true;
      }
    } catch (e) {
      print('AttemptLogin failure');
      print(e);
    }

    return false;
  }

  Future logout() async {
    await _auth.signOut();
    AnalyticsService.sendEvent('userLoggedOut', null);
    notifyListeners();
  }

  void setUser(FirebaseUser user, {bool isInit}) async {
    if (isInit == null || isInit == false) {
      AnalyticsService.sendEvent('loginSuccess', {
        'userId': user.uid,
      });
    }

    _user = user;

    await verifyUser();
    linkAnalyticsUser();
    notifyListeners();
  }

  FirebaseUser getUser() {
    return _user;
  }

  void linkAnalyticsUser() {
    if (_user != null) {
      AnalyticsService.linkAnalyticsUser(_user.uid);
    }
  }

  Future<void> verifyUser() async {
    if (_user != null) {
      IdTokenResult token = await _user.getIdToken();

      if (token != null) {
        Response response = await ApiService.verifyUser(token.token);
        print('GOT RESPONSE FROM GIGOVER2');

        VerifyUser user = VerifyUser.fromJson(response.data);
        print(user);

        print(token);
        print(token.token);

        return;
      }

      throw new Exception("Token was not retrievable");
    }

    throw new Exception("User not logged in");
  }

}
