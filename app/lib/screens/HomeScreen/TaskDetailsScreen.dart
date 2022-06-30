import 'dart:io';
import 'dart:math';

import 'package:dio/dio.dart';
import 'package:file_picker/file_picker.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:flutter/material.dart';
import 'package:flutter_mentions/flutter_mentions.dart';
import 'package:mittverk/igital/utils/AvailableFonts.dart';
import 'package:mittverk/igital/widgets/IgitalDropdownButton.dart';
import 'package:mittverk/igital/widgets/RoundedButton.dart';
import 'package:mittverk/igital/widgets/ScaleTap.dart';
import 'package:mittverk/igital/widgets/Spacing.dart';
import 'package:mittverk/models/ProjectImage.dart';
import 'package:mittverk/models/Task.dart' as ProjectTask;
import 'package:mittverk/models/TaskComment.dart';
import 'package:mittverk/models/TaskStatus.dart';
import 'package:mittverk/providers/ProjectProvider.dart';
import 'package:mittverk/screens/HomeScreen/widgets/CommentBody.dart';
import 'package:mittverk/services/ApiService.dart';
import 'package:mittverk/utils/Theme.dart';
import 'package:mittverk/widgets/CardTitle.dart';
import 'package:mittverk/widgets/LoadingSpinner.dart';
import 'package:mittverk/widgets/ScreenLayout.dart';
import 'package:mittverk/igital/extensions/num_extensions.dart';
import 'package:provider/provider.dart';
import 'package:rich_text_controller/rich_text_controller.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:uuid/uuid.dart';

import '../../main.dart';

class TaskDetailsArguments {
  ProjectTask.Task? task;

  TaskDetailsArguments(this.task);
}

class TaskDetailsView extends StatefulWidget {
  ProjectTask.Task? task;

  TaskDetailsView(BuildContext context) {
    final TaskDetailsArguments args = ModalRoute.of(context)!.settings.arguments as TaskDetailsArguments;
    this.task = args.task;
  }

  @override
  State createState() => TaskDetailsViewState();
}

class TaskDetailsViewState extends State<TaskDetailsView> {
  bool addCommentLoading = false;

  // TextEditingController commentInputController = TextEditingController();
  String _commentText = '';
  ProjectTask.Task? _task;

  late double _progress = 0;
  late bool _isUploading = false;
  late int? _imageId;

  late RichTextController _controller;

  final FocusNode commentFocus = FocusNode();
  final GlobalKey<FlutterMentionsState> commentKey = GlobalKey<FlutterMentionsState>();

  Map<RegExp, TextStyle> patternUser = {RegExp(userRegex): TextStyle(color: Colors.amber, fontWeight: FontWeight.bold)};

  @override
  void initState() {
    super.initState();
    getTaskDetail();

    _controller = RichTextController(
      patternMatchMap: patternUser,
      deleteOnBack: true,
      onMatch: (List<String> match) {
        // print(match);
      },
    );

    _controller.addListener(commentInputChange);
    commentFocus.addListener(_onCommentFocusChange);
  }

  void _onCommentFocusChange() {
    this.setState(() {});
  }

  Future<void> getTaskDetail() async {
    Response response = await ApiService.getTaskDetails(widget.task!.taskId);
    if (response.statusCode != 200) {
      print('errorFetchin');
      // TODO Implement error screen here
    } else {
      try {
        print('TaskDetailsScreen.getTaskDetail()');
        print(response.data);
        if (response.data != null && response.data["projectTask"] != null) {
          dynamic projectTask = response.data["projectTask"];

          print(response.data["projectTask"]["images"]);

          ProjectTask.Task? tempTask = ProjectTask.Task.fromJson(projectTask);

          setState(() {
            _task = tempTask;
          });
        } else {
          print('nopthing available');
        }
      } catch (e) {
        print(e);
        print("ERROR WHILE PARSING PROJECTS");
        // TODO Implement error screen here
      }
    }
    print(response);
  }

  @override
  void dispose() {
    super.dispose();
    _controller.dispose();
  }

  void commentInputChange() {
    setState(() {
      _commentText = _controller.value.text;
      print("new text $_commentText");
    });
  }

  Widget taskDetailItemWrapper(Widget child) {
    return Container(
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          border: Border(
            bottom: BorderSide(color: MVTheme.borderColor, width: 2),
          ),
        ),
        child: Padding(
          padding: const EdgeInsets.all(12.0),
          child: child,
        ),
      ),
    );
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
                fontSize: 16.scale as double,
                weight: FontWeight.bold,
              ),
            )
          ],
        ),
      ],
    );
  }

  Widget TaskDetailInfo(String subHeader, String header, {Icon? widget}) {
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
                  fontSize: 16.scale as double,
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

  ProjectImage? findProjectImage(List<ProjectImage> images, int? imageId) {
    if (images.isNotEmpty && imageId != null) {
      for (ProjectImage img in images) {
        if (img.imageId == imageId) {
          return img;
        }
      }
    }
    return null;
  }

  Widget comment(TaskComment comment, ProjectTask.Task task) {
    ProjectImage? image = findProjectImage(task.images ?? [], comment.imageId);

    return Container(
        child: Padding(
      padding: const EdgeInsets.all(12.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(comment.fullName!,
                  style: AvailableFonts.getTextStyle(context,
                      color: MVTheme.mainFont, fontSize: 14.scale as double, weight: FontWeight.bold)),
              Text(comment.formattedDate,
                  style: AvailableFonts.getTextStyle(
                    context,
                    color: MVTheme.grayFont,
                    fontSize: 14.scale as double,
                  ))
            ],
          ),
          image != null ? Spacing(isVertical: true) : Container(),
          image != null
              ? ScaleTap(
                  onTap: () async {
                    if (await canLaunch(image.url ?? '')) {
                      await launch(image.url ?? '');
                    }
                  },
                  child: Image.network(image.url ?? '', width: 120, height: 120, fit: BoxFit.contain))
              : Container(),
          Spacing(isVertical: true),
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Flexible(
                child: Container(
                  decoration: BoxDecoration(
                      color: Colors.white,
                      border: Border.all(color: Colors.white),
                      borderRadius: BorderRadius.all(Radius.circular(16))),
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(10, 8, 10, 8),
                    child: CommentBody(comment),
                  ),
                ),
              ),
            ],
          )
        ],
      ),
    ));
  }

  Widget comments() {
    return Expanded(
      child: Container(
        child: ListView.builder(
            itemCount: this._task!.comments!.length,
            scrollDirection: Axis.vertical,
            shrinkWrap: true,
            itemBuilder: (BuildContext context, int index) {
              return comment(this._task!.comments![index], this._task!);
            }),
      ),
    );
  }

  void addComment() async {
    FocusScope.of(context).unfocus();

    String currentText = "";

    if (commentKey.currentState != null && commentKey.currentState!.controller != null) {
      currentText = commentKey.currentState!.controller!.markupText;
    }

    if (currentText.length > 0) {
      setState(() {
        addCommentLoading = true;
      });

      print("Sending comment: $currentText");

      // TODO Error component
      await ApiService.addComment(currentText, _task!.projectId, _task!.taskId, imageId: _imageId);
      await this.getTaskDetail();

      commentKey.currentState!.controller!.clear();
      setState(() {
        addCommentLoading = false;
      });
    }
  }

  String getFileExtension(String fileName) {
    try {
      if (fileName.contains('.')) {
        return "." + fileName.split('.').last;
      }
      return "";
    } catch (e) {
      return "";
    }
  }

  void completedUpload(String fileName, TaskSnapshot taskSnapshot) async {
    String url = await taskSnapshot.ref.getDownloadURL();
    print("DOWNLOAD URL $url");

    Response response = await ApiService.addDocument(
      folderId: 0,
      projectId: _task!.projectId!,
      taskId: _task!.taskId!,
      name: fileName,
      url: url,
      bytes: taskSnapshot.totalBytes,
    );

    print("addDocument responseCode: ${response.statusCode}");
    print(response.data);

    if (response.statusCode == 200) {
      if (response.data['projectImage'] != null && response.data['projectImage']['imageId'] != null) {
        setState(() {
          try {
            _imageId = response.data['projectImage']['imageId'] as int;
            print("IMAGE ID SET TO $_imageId");
          } catch (e) {
            print(e);
          }
        });
      }
    }
  }

  pickImageAndUpload() async {
    FilePickerResult? result = await FilePicker.platform.pickFiles(
      type: FileType.image,
    );

    if (result != null) {
      print("Result is not null.");
      File file = File(result.files.single.path!);

      try {
        int? projectId = _task!.projectId;

        if (projectId != null) {
          final storageRef = FirebaseStorage.instance.refFromURL("gs://gigover-fileystem");

          print('Uploading to ${projectId}');

          var uuid = Uuid();
          String filePath = "${projectId}/${uuid.v4()}${getFileExtension(file.path)}";

          print("FilePath: $filePath");

          final bucketRef = storageRef.child(filePath);

          UploadTask uploadTask = bucketRef.putFile(file);

          // Listen for state changes, errors, and completion of the upload.
          uploadTask.snapshotEvents.listen((TaskSnapshot taskSnapshot) {
            switch (taskSnapshot.state) {
              case TaskState.running:
                final progress = 100.0 * (taskSnapshot.bytesTransferred / taskSnapshot.totalBytes);

                setState(() {
                  _progress = max(90, progress);
                  _isUploading = true;
                });

                print("Upload is $progress% complete.");
                break;
              case TaskState.paused:
                print("Upload is paused.");
                break;
              case TaskState.canceled:
                print("Upload was canceled");
                setState(() {
                  _isUploading = false;
                });
                break;
              case TaskState.error:
                // Handle unsuccessful uploads
                setState(() {
                  _isUploading = false;
                });
                break;
              case TaskState.success:
                {
                  // Handle successful uploads on complete
                  setState(() {
                    _isUploading = false;
                    _progress = 90;
                  });

                  completedUpload(file.path, taskSnapshot);
                }
                // ...
                break;
            }
          });
        }
      } on FirebaseException catch (e) {
        // ...
        print(e);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (this._task == null) {
      return ScreenLayout(
          child: Container(
              child: Center(
        child: LoadingSpinner(),
      )));
    }

    return ScreenLayout(
      child: Container(
        child: Column(
          children: [
            taskDetailItemWrapper(TaskDetailHeader(this._task!.getTitle())),
            taskDetailItemWrapper(IgitalDropdownButton<dynamic>(
              context,
              'Current status',
              getTaskStatusString(this._task!.status),
              TaskStatus.values.where((v) => v != TaskStatus.Archived).map((s) {
                return getTaskStatusString(s);
              }).toList(),
              onTap: (String p) async {
                print(p);
                TaskStatus newStatus = statusFromString(p);
                this._task!.setStatus(newStatus);
                this.setState(() {
                  _task = _task;
                });

                ProjectProvider projectProvider = Provider.of<ProjectProvider>(context, listen: true);
                projectProvider.updateTask(_task);
                await ApiService.setProjectTaskStatus(this._task!.taskId, newStatus);
              },
            )),
            commentHeader(),
            comments(),
            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                boxShadow: [
                  BoxShadow(
                    offset: Offset.fromDirection(0, 5),
                    color: Colors.black.withAlpha(15),
                    blurRadius: 15,
                  )
                ],
              ),
              child: Column(
                children: <Widget>[
                  Row(
                    children: <Widget>[
                      Expanded(
                        child: Container(
                          child: FlutterMentions(
                            key: commentKey,
                            suggestionPosition: SuggestionPosition.Top,
                            maxLines: 3,
                            minLines: 3,
                            textInputAction: TextInputAction.send,
                            keyboardType: TextInputType.multiline,
                            onSubmitted: (value) {
                              addComment();
                            },
                            autofocus: true,
                            focusNode: commentFocus,
                            decoration: InputDecoration(
                              fillColor: Colors.white,
                              focusColor: Colors.black.withAlpha(150),
                              hintStyle: TextStyle(
                                color: Colors.black.withAlpha(150),
                                fontSize: 18.scale as double?,
                              ),
                              hintText: 'Write a comment..',
                              border: OutlineInputBorder(),
                              filled: true,
                              enabledBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.all(Radius.circular(12)),
                                borderSide: BorderSide(color: Colors.transparent),
                              ),
                              focusedBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.all(Radius.circular(12)),
                                borderSide: BorderSide(
                                  color: Colors.white,
                                ),
                              ),
                            ),
                            mentions: [
                              Mention(
                                trigger: "@",
                                style: TextStyle(backgroundColor: Colors.black, color: Colors.yellow),
                                suggestionBuilder: (data) {
                                  return Container(
                                    decoration: BoxDecoration(
                                      color: Colors.black.withAlpha(15),
                                    ),
                                    padding: EdgeInsets.fromLTRB(10.0, 16.0, 10.0, 16.0),
                                    child: Row(
                                      mainAxisAlignment: MainAxisAlignment.start,
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: <Widget>[
                                        Column(
                                          children: <Widget>[
                                            Text('@${data['display']}'),
                                          ],
                                        )
                                      ],
                                    ),
                                  );
                                },
                                markupBuilder: (String trigger, String mention, String value) {
                                  return trigger + "[" + value + "](" + mention + ")";
                                },
                                data: _task != null && _task!.workers != null
                                    ? _task!.workers!.map((worker) {
                                        return {
                                          "id": worker.uId,
                                          "display": worker.name,
                                          "photo": "",
                                        };
                                      }).toList()
                                    : [],
                              )
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                  commentFocus.hasFocus
                      ? Row(
                          mainAxisAlignment: MainAxisAlignment.end,
                          children: <Widget>[
                            SafeArea(
                              bottom: true,
                              child: Padding(
                                padding: const EdgeInsets.only(
                                  right: 8.0,
                                  bottom: 8.0,
                                ),
                                child: Row(
                                  children: [
                                    RoundedButton(
                                      loading: _isUploading,
                                      fillBackground: Colors.black,
                                      padding: EdgeInsets.only(right: 12.0, left: 12, top: 8, bottom: 8),
                                      text: 'Image',
                                      onTap: () async {
                                        pickImageAndUpload();
                                      },
                                    ),
                                    SizedBox(width: 8.0),
                                    RoundedButton(
                                      loading: addCommentLoading,
                                      fillBackground: MVTheme.mainGreen,
                                      padding: EdgeInsets.only(right: 12.0, left: 12, top: 8, bottom: 8),
                                      textColor: MVTheme.primaryColor,
                                      onTap: () {
                                        addComment();
                                      },
                                      text: 'Add comment',
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        )
                      : Container(),
                ].where(notNull).toList(),
              ),
            )
          ],
        ),
      ),
    );
  }
}
