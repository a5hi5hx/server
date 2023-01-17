// import 'package:flutter/material.dart';
// import 'package:dio/dio.dart';

// class PetDetailScreen extends StatefulWidget {
//   final String petId;
//   PetDetailScreen({Key key, @required this.petId}) : super(key: key);

//   @override
//   _PetDetailScreenState createState() => _PetDetailScreenState();
// }

// class _PetDetailScreenState extends State<PetDetailScreen> {
//   final dio = Dio();
//   Map<String, dynamic> petData;

//   @override
//   void initState() {
//     super.initState();
//     _getPetData();
//   }

//   _getPetData() async {
//     final response = await dio.get("/pets/${widget.petId}");
//     setState(() {
//       petData = response.data;
//     });
//   }

//   void bookPet() async {
//     try {
//       final response = await dio.post('/book', data: {
//         'petId': petId,
//         'userId': 'userId',
//         'date': 'date',
//       });
//       if (response.statusCode == 200) {
//         // Show success message
//       } else {
//         // Show error message
//       }
//     } catch (e) {
//       print(e);
//     }
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(
//         title: Text("Pet Detail"),
//       ),
//       body: petData != null
//           ?
//           // Display pet details
//           Column(
//               children: [
//                 Text("Nickname: ${petData["nickname"]}"),
//                 Text("Breed: ${petData["breed"]}"),
//                 Text("Age: ${petData["age"]}"),
//                 Text("Weight: ${petData["weight"]}"),
//                 Text("Color: ${petData["color"]}"),
//                 Text("Location: ${petData["location"]}"),
//                 Image.network(petData["image"]),
//               ],
//             )
//           : Center(child: CircularProgressIndicator()),
//       bottomNavigationBar: BottomAppBar(
//         child: Container(
//           height: 50.0,
//           child: Row(
//             mainAxisAlignment: MainAxisAlignment.center,
//             children: [
//               FlatButton(
//                 onPressed: _bookPet,
//                 child: Text("Book"),
//               ),
//             ],
//           ),
//         ),
//       ),
//     );
//   }
// }
