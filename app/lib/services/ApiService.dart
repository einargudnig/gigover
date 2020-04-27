import 'package:dio/dio.dart';

class ApiService {

  static String apiPrefix = 'http://gigover2.appspot.com/rest/';

  static Future<Response> verifyUser(String token) async {
    return await Dio().post(apiPrefix + '/user/verify', data: {'token': token});
  }
}
