import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/cupertino.dart';
import 'package:mittverk/services/AnalyticsService.dart';

class AuthProvider extends ChangeNotifier {
  final FirebaseAuth _auth = FirebaseAuth.instance;

  FirebaseUser _user;
  String _currentPhoneNumber;
  String _currentVerificationId;

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

          AnalyticsService.sendEvent('login_verificationSent', {
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

    AnalyticsService.sendEvent('login_attemptVerificationCode',
        {'phoneNumber': _currentPhoneNumber, 'code': smsCode});

    AuthResult authResult = await _auth.signInWithCredential(credential);

    if (authResult.user != null) {
      setUser(authResult.user);
      return true;
    }

    return false;
  }

  Future logout() async {
    await _auth.signOut();
    notifyListeners();
  }

  void setUser(FirebaseUser user) {
    _user = user;
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
}
