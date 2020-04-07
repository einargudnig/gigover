
import 'package:flutter/foundation.dart';
import 'package:mittverk/models/Project.dart';

class HomeProvider with ChangeNotifier {
  int _count = 0;
  List<Project> test = [new Project(header: 'steve'), new Project(header: 'pete')];

  int get count => _count;

  void increment() {
    test.add(new Project(header: 'pete'));
    notifyListeners();
  }
}
