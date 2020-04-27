import 'package:cookie_jar/cookie_jar.dart';
import 'package:dio/dio.dart';
import 'package:dio_cookie_manager/dio_cookie_manager.dart';

class ApiService {
  static Dio dio;
  static CookieJar cookieJar;
  static String apiPrefix = 'http://gigover2.appspot.com/rest/';

  static setCookieJar() {
    dio.interceptors.add(CookieManager(cookieJar));
  }

  static Future<Response> verifyUser(String token) async {
    String url = apiPrefix + '/user/verify';
    Response response = await dio.post(url, data: {'token': token});
    cookieJar.loadForRequest(Uri.parse(url));
    return response;
  }

  static Future<Response> projectList() async {
    return await dio.get(apiPrefix + '/workers/list');
  }

  static Future<Response> workStart(int projectId, int workType) async {
    return await dio.post(apiPrefix + '/work/start', data: {
      'projectId': projectId,
      'workType': workType,
    });
  }

  static Future<Response> workEnd(int projectId, {String comment}) async {
    return await dio.post(apiPrefix + '/work/stop', data: {
      'projectId': projectId,
      'comment': comment,
    });
  }

  // DEV - Only contractor accounts
  static Future<Response> createProject() async {
    String url = apiPrefix + '/contractor/store';
    Response response = await dio.post(url, data: {
      "name": "Gardastraeti 40",
      "status": 0,
      "description": "Laga gardinn"
    });

    return response;
  }

  // DEV - VerifyAdam to get Projects on the account
  static Future<Response> verifyAdam() async {
    String url = apiPrefix + '/user/verifyAdam';
    Response response = await dio.get(url);
    cookieJar.loadForRequest(Uri.parse(url));

    return response;
  }

}
