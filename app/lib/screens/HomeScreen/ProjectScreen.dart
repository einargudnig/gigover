import 'package:flutter/widgets.dart';
import 'package:mittverk/igital/widgets/NestedNavigator.dart';
import 'package:mittverk/models/Project.dart';
import 'package:mittverk/providers/HomeProvider.dart';
import 'package:mittverk/screens/HomeScreen/widgets/ProjectCard.dart';
import 'package:provider/provider.dart';

class ProjectScreenArguments {
  int id;

  ProjectScreenArguments(this.id);
}

class ProjectScreen extends StatefulWidget {
  @override
  State createState() => ProjectScreenState();
}

class ProjectScreenState extends State<ProjectScreen> {
  final GlobalKey<NavigatorState> navigationKey = GlobalKey<NavigatorState>();

  @override
  void initState() {
    super.initState();
  }

  @override
  void dispose() {
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final homeProvider = Provider.of<HomeProvider>(context);
    final ProjectScreenArguments args =
        ModalRoute.of(context).settings.arguments;
    Project project = homeProvider.projects.firstWhere((e) {
      return e.id == args.id;
    });

    print('Project with id:');
    print(project.id);

    return Column(
      children: <Widget>[
        ProjectCard(item: project),
      ],
    );
  }
}
