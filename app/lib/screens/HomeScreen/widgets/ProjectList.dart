import 'package:flutter/material.dart';
import 'package:mittverk/providers/HomeProvider.dart';
import 'package:mittverk/screens/HomeScreen/ProjectScreen.dart';
import 'package:provider/provider.dart';

import 'ProjectCard.dart';

class ProjectList extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final homeProvider = Provider.of<HomeProvider>(context);

    return Padding(
      padding: const EdgeInsets.all(16),
      child: ListView.builder(
        itemCount: homeProvider.projects.length,
        scrollDirection: Axis.vertical,
        shrinkWrap: true,
        itemBuilder: (BuildContext context, int index) {
          return GestureDetector(
            onTap: () {
              Navigator.of(context).pushNamed('/project', arguments: ProjectScreenArguments(homeProvider.projects[index]));
            },
              child: ProjectCard(item: homeProvider.projects[index]),
          );
        },
      ),
    );
  }
}
