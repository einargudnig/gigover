import 'package:flutter/foundation.dart';
import 'package:mittverk/models/Project.dart';

class HomeProvider with ChangeNotifier {
  int _count = 0;
  List<Project> test = [
    new Project(
        title: 'Laugarásvegur 20',
        subTitle: 'Viðgerðir á klósetti',
        amountDone: 35.00,
        people: ["SEB", "TEB", "SAS"],
        daysLeft: 5),
    new Project(
        title: 'Sólvellir 8',
        subTitle: 'Parketlagning',
        amountDone: 59.00,
        people: ["SEB", "TEB"],
        daysLeft: 2)
  ];

  int get count => _count;

  void increment() {
    test.add(new Project(
        title: 'Laugarvegur 3',
        subTitle: 'Setja upp Apple TV',
        amountDone: 10,
        people: ["SEB", "TEB", "FAF", "TS", "TS", "TS", "TS", "TS"],
        daysLeft: 7));
    notifyListeners();
  }
}
