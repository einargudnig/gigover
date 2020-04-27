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

    print('Cookie content: ');
    print(cookieJar.loadForRequest(Uri.parse(url)));

    return response;
  }

  // DEV
  static Future<Response> createProject() async {
    String url = apiPrefix + '/contractor/store';
    Response response = await dio.post(url, data: {
      "name": "Gardastraeti 40",
      "status": 0,
      "description": "Laga gardinn"
    });

    return response;
  }

}
