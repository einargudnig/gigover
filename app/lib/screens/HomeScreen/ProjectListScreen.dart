import 'package:flutter/material.dart';
import 'package:mittverk/providers/HomeProvider.dart';
import 'package:mittverk/screens/HomeScreen/widgets/ProjectCard.dart';
import 'package:provider/provider.dart';

import 'ProjectScreen.dart';

class ProjectListScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final homeProvider = Provider.of<HomeProvider>(context);

    return ListView.builder(
      itemCount: homeProvider.projects.length,
      scrollDirection: Axis.vertical,
      shrinkWrap: true,
      itemBuilder: (BuildContext context, int index) {
        return GestureDetector(
          onTap: () {
            Navigator.of(context).pushNamed('/project', arguments: ProjectListScreenArgs(homeProvider.projects[index]));
          },
          child: Padding(
            padding: const EdgeInsets.fromLTRB(12, 6, 12, 6),
            child: Padding(
              padding: const EdgeInsets.only(top:4.0, bottom: 4.0),
              child: ProjectCard(item: homeProvider.projects[index]),
            ),
          ),
        );
      },
    );
  }
}
