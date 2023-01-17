// import 'package:flutter/material.dart';
// import 'package:dio/dio.dart';

// class AvailablePetsScreen extends StatefulWidget {
//   @override
//   _AvailablePetsScreenState createState() => _AvailablePetsScreenState();
// }

// class _AvailablePetsScreenState extends State<AvailablePetsScreen> {
//   List<Pet> _pets = [];

//   @override
//   void initState() {
//     super.initState();
//     _getAvailablePets();
//   }

//   _getAvailablePets() async {
//     Dio dio = Dio();
//     try {
//       Response response = await dio.get("http://yourserver.com/pets/available");
//       _pets = (response.data as List).map((pet) => Pet.fromJson(pet)).toList();
//     } catch (e) {
//       print(e);
//     }
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(
//         title: Text("Available Pets"),
//       ),
//       body: ListView.builder(
//         itemCount: _pets.length,
//         itemBuilder: (context, index) {
//           return ListTile(
//             title: Text(_pets[index].name),
//             subtitle: Text(_pets[index].breed),
//             leading: Image.network(_pets[index].image),
//             onTap: () {
//               // navigate to pet details screen
//             },
//           );
//         },
//       ),
//     );
//   }
// }
