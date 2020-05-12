import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:mittverk/igital/utils/AvailableFonts.dart';
import 'package:mittverk/igital/widgets/Spacing.dart';
import 'package:mittverk/models/Task.dart';
import 'package:mittverk/models/TaskComment.dart';
import 'package:mittverk/models/TaskStatus.dart';
import 'package:mittverk/screens/HomeScreen/widgets/TimeTrackerDialog.dart';
import 'package:mittverk/services/ApiService.dart';
import 'package:mittverk/utils/Theme.dart';
import 'package:mittverk/widgets/CardTitle.dart';
import 'package:mittverk/igital/widgets/IgitalDropdownButton.dart';
import 'package:mittverk/widgets/ScreenLayout.dart';

class TaskDetailsArguments {
  Task task;

  TaskDetailsArguments(this.task);
}

class TaskDetailsView extends StatefulWidget {
  Task task;

  TaskDetailsView(BuildContext context) {
    final TaskDetailsArguments args = ModalRoute.of(context).settings.arguments;
    this.task = args.task;
    print(this.task);
  }

  @override
  State createState() => TaskDetailsViewState();
}

class TaskDetailsViewState extends State<TaskDetailsView> {
  TextEditingController commentInputController = TextEditingController();
  String _commentText = '';
  Task _task;

  @override
  void initState() {
    super.initState();

    getTaskDetail();
    commentInputController.addListener(commentInputChange);
  }

  ///
  ///
  /// {
  //    "projectTask": {
  //        "taskId": 1,
  //        "text": "Henda rusli",
  //        "status": 0,
  //        "typeId": 5,
  //        "comments": [
  //            {
  //                "taskId": 1,
  //                "comment": "my owner comment",
  //                "type": 0,
  //                "fullName": "Og svo framvegis",
  //                "sent": 1588625338000
  //            },
  //            {
  //                "taskId": 1,
  //                "comment": "my owner comment",
  //                "type": 0,
  //                "fullName": "Og svo framvegis",
  //                "sent": 1588670556000
  //            }
  //        ],
  //        "project": {
  //            "projectId": 909,
  //            "ownerName": "Tómas Erlingsson",
  //            "ownerAvatar": "https://lh6.googleusercontent.com/-M2GCfHlDcuk/AAAAAAAAAAI/AAAAAAAAARg/LDxlbUiczCQ/photo.jpg",
  //            "status": "CLOSED"
  //        }
  //    }
  //}

  void getTaskDetail() async {
    print('taskDetails');
    Response response = await ApiService.getTaskDetails(widget.task.taskId);
    if (response.statusCode != 200) {
      print('errorFetchin');
    } else {
      try {
        print(response.data);
        if (response.data != null && response.data["projectTask"] != null) {
          dynamic projectTask = response.data["projectTask"];
          Task tempTasks = Task.fromJson(projectTask);
          setState(() {
            _task = tempTasks;
          });
        } else {
          print('nopthing available');
        }
      } catch (e) {
        print("ERROR WHILE PARSING PROJECTS");
      }
    }
    print(response);
  }

  @override
  void dispose() {
    super.dispose();
    commentInputController.dispose();
  }

  void commentInputChange() {
    setState(() {
      _commentText = commentInputController.value.text;
    });
  }

  Widget taskDetailItemWrapper(Widget child) {
    return Container(
        child: Container(
            decoration: BoxDecoration(
                color: Colors.white,
                border: Border(
                    bottom: BorderSide(color: MVTheme.borderColor, width: 2))),
            child: Padding(
              padding: const EdgeInsets.all(12.0),
              child: child,
            )));
  }

  Widget TaskDetailHeader(String headerText) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Text(
              headerText,
              style: AvailableFonts.getTextStyle(
                context,
                color: MVTheme.mainFont,
                fontSize: 16,
                weight: FontWeight.bold,
              ),
            ),
            Icon(Icons.more_horiz)
          ],
        ),
        Text('DUDUD',
            style: AvailableFonts.getTextStyle(
              context,
              color: MVTheme.grayFont,
              fontSize: 12,
            ))
      ],
    );
  }

  Widget TaskDetailInfo(String subHeader, String header, {Icon widget}) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: <Widget>[
        Expanded(
          child: CardTitle(
            subtitle: subHeader,
            title: header,
          ),
        ),
        Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: <Widget>[widget != null ? widget : Spacing()],
        ),
      ],
    );
  }

  Widget commentHeader() {
    return Row(
      children: <Widget>[
        Expanded(
          child: Container(
            color: Colors.white,
            child: Padding(
              padding: const EdgeInsets.all(12.0),
              child: Text(
                'Comments on this task',
                style: AvailableFonts.getTextStyle(
                  context,
                  color: MVTheme.mainFont,
                  fontSize: 14,
                  weight: FontWeight.bold,
                ),
                textAlign: TextAlign.center,
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget comment(TaskComment comment) {
    return Container(
        child: Padding(
      padding: const EdgeInsets.all(12.0),
      child: Column(
        children: <Widget>[
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(comment.fullName,
                  style: AvailableFonts.getTextStyle(context,
                      color: MVTheme.mainFont,
                      fontSize: 12,
                      weight: FontWeight.bold)),
              Text(comment.dateSent.toString(),
                  style: AvailableFonts.getTextStyle(
                    context,
                    color: MVTheme.grayFont,
                    fontSize: 12,
                  ))
            ],
          ),
          Spacing(isVertical: true),
          Container(
              decoration: BoxDecoration(
                  color: Colors.white,
                  border: Border.all(color: Colors.white),
                  borderRadius: BorderRadius.all(Radius.circular(16))),
              child: Padding(
                padding: const EdgeInsets.all(8.0),
                child: Text(comment.comment),
              ))
        ],
      ),
    ));
  }

  Widget comments() {
    return Expanded(
      child: Container(
        child: ListView.builder(
            itemCount: this._task.comments.length,
            scrollDirection: Axis.vertical,
            shrinkWrap: true,
            itemBuilder: (BuildContext context, int index) {
              return comment(this._task.comments[index]);
            }),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    //todo
    print(this._task);
    print('task---------------');
    if (this._task == null) {
      return Text('fafafaloading');
    }

    return ScreenLayout(
      child: Container(
        child: Column(
          children: [
            taskDetailItemWrapper(TaskDetailHeader(this._task.text)),
            taskDetailItemWrapper(TaskDetailInfo(
              'Currently tracking',
              'Elhusinnretting',
            )),
            taskDetailItemWrapper(IgitalDropdownButton<dynamic>(
              context,
              'Current status',
              getTaskStatusString(this._task.status),
              TaskStatus.values.map((s) {
                return getTaskStatusString(s);
              }).toList(),
              onTap: (String p) async {
                print(p);
                TaskStatus newStatus = statusFromString(p);
                this._task.setStatus(newStatus);
                this.setState(() {
                  _task = _task;
                });
                Response res =
                    await ApiService.setProjectTaskStatus(this._task.taskId, newStatus);

                print(res);
                //TODO if res is wrong changeback
              },
            )),
            commentHeader(),
            comments(),
            Row(
              children: <Widget>[
                Expanded(
                  child: Container(
                      color: MVTheme.mainGreen,
                      child: TextField(
                        decoration: InputDecoration(
                          hintText: 'Add comment to task..',
                          fillColor: Colors.white,
                          focusColor: Colors.black.withAlpha(150),
                          filled: true,
                        ),
                        controller: commentInputController,
                        keyboardType: TextInputType.text,
                      )),
                ),
              ],
            )
          ],
        ),
      ),
    );
  }
}
