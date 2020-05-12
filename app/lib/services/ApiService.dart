import 'package:cookie_jar/cookie_jar.dart';
import 'package:dio/dio.dart';
import 'package:dio_cookie_manager/dio_cookie_manager.dart';
import 'package:mittverk/models/TaskStatus.dart';

class ApiService {
  static Dio dio;
  static CookieJar cookieJar;
  static String apiPrefix = 'http://gigover2.appspot.com/rest/';

  static setCookieJar() {
    dio.interceptors.add(CookieManager(cookieJar));
  }

  /// Verify the user you are logged in as
  static Future<Response> verifyUser(String token) async {
    String url = apiPrefix + '/user/verify';
    Response response = await dio.post(url, data: {'token': token});
    cookieJar.loadForRequest(Uri.parse(url));
    return response;
  }

  /// Get a list of projects
  static Future<Response> projectList() async {
    return await dio.get(apiPrefix + '/workers/list');
  }

  /// Get project details (with comments)
  static Future<Response> getProjectDetails(int projectId) async {
    return await dio.get(apiPrefix + '/workers/' + projectId.toString());
  }

  /// Task details
  static Future<Response> getTaskDetails(int taskId) async {
    return await dio.get(apiPrefix + '/workers/task/' + taskId.toString());
  }

  /// Get project types, these are used on tasks
  static Future<Response> projectTypes() async {
    return await dio.get(apiPrefix + '/workers/types');
  }

  /// Get a task list for a project
  static Future<Response> getProjectTaskList(int projectId) async {
    return await dio.get(apiPrefix + '/workers/tasks/' + projectId.toString());
  }

  /// Get user specific info
  ///
  static Future<Response> getUserDetails() async {
    return await dio.get(apiPrefix + '/user/info');
  }

  /// Update a project task status with an optional comment
  static Future<Response> setProjectTaskStatus(
    int taskId,
    TaskStatus status, {
    String comment,
  }) async {

    return await dio.post(apiPrefix + '/workers/updateTask', data: {
      'taskId': taskId,
      'status': status.index,
      'comment': comment,
    });
  }

  /// Add a comment to a project task
  static Future<Response> addComment(
    String comment,
    int projectId,
    int taskId, {
    bool isContractor = false,
  }) async {
    return await dio.post(
        apiPrefix + '/${isContractor ? 'workers' : 'contractor'}/comment',
        data: {
          'projectId': projectId,
          'taskId': taskId,
          'comment': comment,
        });
  }

  /// Start a timer
  static Future<Response> workStart(int projectId, int workType) async {
    return await dio.post(apiPrefix + '/work/start', data: {
      'projectId': projectId,
      'workType': workType,
    });
  }

  /// Stop a timer
  static Future<Response> workEnd(
    int projectId, {
    String comment,
  }) async {
    return await dio.post(apiPrefix + '/work/stop', data: {
      'projectId': projectId,
      'comment': comment,
    });
  }

  // TODO Remove
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

  // TODO Remove
  // DEV - VerifyAdam to get Projects on the account
  static Future<Response> verifyAdam() async {
    String url = apiPrefix + '/user/verifyAdam';
    Response response = await dio.get(url);
    cookieJar.loadForRequest(Uri.parse(url));

    return response;
  }
}
