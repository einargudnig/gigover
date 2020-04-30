import 'dart:developer';

import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:mittverk/main.dart';
import 'package:mittverk/providers/AuthProvider.dart';
import 'package:mittverk/screens/LoginScreen/widgets/LoginFooter.dart';
import 'package:mittverk/screens/LoginScreen/widgets/LoginForm.dart';
import 'package:mittverk/screens/LoginScreen/widgets/LoginHeader.dart';
import 'package:provider/provider.dart';

import '../../igital/utils/ScaleFactor.dart';

class LoginScreen extends StatefulWidget {
  @override
  State createState() => LoginScreenState();
}

class LoginScreenState extends State<LoginScreen> {
  TextEditingController _phoneNumberInput = TextEditingController();
  TextEditingController _verificationCodeInput = TextEditingController();

  String _phoneNumber;
  String _verificationCode;
  String _errorMessage;
  bool _verificationCodeSent = false;
  int _sendCount = 0;

  @override
  void initState() {
    super.initState();
    _phoneNumberInput.addListener(phoneInputChange);
    _verificationCodeInput.addListener(verificationInputChange);
  }

  @override
  void dispose() {
    super.dispose();
  }

  void phoneInputChange() {
    setState(() {
      _phoneNumber = _phoneNumberInput.value.text;
    });
  }

  void verificationInputChange() {
    setState(() {
      _verificationCode = _verificationCodeInput.value.text;
    });
  }

  void setErrorMessage(String errorMessage) {
    setState(() {
      _errorMessage = errorMessage;
    });
  }

  bool validatePhoneNumber(String number) {
    if (number == null || number.length < 7) {
      setErrorMessage("Phone number must be at least 7 digits");

      return false;
    }

    return true;
  }

  void submit(BuildContext context, AuthProvider authProvider) async {
    if (!_verificationCodeSent) {
      if (validatePhoneNumber(_phoneNumber)) {
        authProvider.verifyPhoneNumber(
          phoneNumber: '+354$_phoneNumber',
          codeSent: () {
            setState(() {
              _verificationCodeSent = true;
              _errorMessage = null;
            });
          },
          timeout: () {
            setErrorMessage('Login timed out, please try again.');
          },
          success: (AuthCredential authCredential) {
            print('Login: Successfully created authCredential');
            print(authCredential);
          },
          err: (String message) {
            setErrorMessage(message);
          },
        );

      }
    } else {
      bool loginStatus = await authProvider.attemptLogin(_verificationCode);

      if (_sendCount > 2) {
        setErrorMessage('Too many codes sent, enter your phone number again.');
        setState(() {
          _verificationCodeSent = false;
          _sendCount = 0;
        });
        return;
      }

      if (!loginStatus) {
        setErrorMessage('Invalid verification code');
        setState(() {
          _sendCount = _sendCount + 1;
        });
      } else {
        mainNavigatorKey.currentState.pushReplacementNamed('/home');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    ScaleFactor(context);

    return Consumer<AuthProvider>(
      builder: (context, authProvider, child) {
        return Scaffold(
          body: SizedBox.expand(
            child: Container(
              decoration: BoxDecoration(
                  image: DecorationImage(
                image: AssetImage("assets/images/background.jpg"),
                fit: BoxFit.cover,
              )),
              child: SafeArea(
                top: true,
                bottom: true,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: <Widget>[
                    LoginHeader(
                        phoneNumber: _phoneNumber,
                        verificationCodeSent: _verificationCodeSent),
                    LoginForm(
                        verificationCodeSent: _verificationCodeSent,
                        phoneNumberInput: _phoneNumberInput,
                        verificationCodeInput: _verificationCodeInput,
                        errorMessage: _errorMessage,
                        onSubmit: () {
                          submit(context, authProvider);
                        }),
                    LoginFooter(),
                  ],
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}
