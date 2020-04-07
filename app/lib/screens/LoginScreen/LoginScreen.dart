import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:mittverk/screens/LoginScreen/widgets/LoginFooter.dart';
import 'package:mittverk/screens/LoginScreen/widgets/LoginForm.dart';
import 'package:mittverk/screens/LoginScreen/widgets/LoginHeader.dart';

import '../../igital/services/AuthenticationService.dart';
import '../../igital/services/AuthenticationService.dart';
import '../../igital/services/AuthenticationService.dart';
import '../../igital/utils/ScaleFactor.dart';

class LoginScreen extends StatefulWidget {
  @override
  State createState() => LoginScreenState();
}

class LoginScreenState extends State<LoginScreen> {
  AuthenticationService authenticationService;

  TextEditingController _phoneNumberInput = TextEditingController();
  TextEditingController _verificationCodeInput = TextEditingController();

  String _phoneNumber;
  String _errorMessage;
  bool _verificationCodeSent = false;
  int _resendCount = 0;

  @override
  void initState() {

    super.initState();
    authenticationService = AuthenticationService();

    _phoneNumberInput.addListener(phoneInputChange);

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

  void submit() {

  }

  @override
  Widget build(BuildContext context) {
    ScaleFactor(context);

    return Scaffold(
      body: SizedBox.expand(
        child: Container(
          decoration: BoxDecoration(
            image: DecorationImage(
              image: AssetImage("assets/images/background.jpg"),
              fit: BoxFit.cover,
            )
          ),
          child: SafeArea(
            top: true,
            bottom: true,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: <Widget>[
                LoginHeader(
                  phoneNumber: _phoneNumber,
                  verificationCodeSent: _verificationCodeSent
                ),
                LoginForm(
                  phoneNumberInput: _phoneNumberInput,
                  verificationCodeInput: _verificationCodeInput,
                  onSubmit: () {
                    submit();
                  }
                ),
                LoginFooter(),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
