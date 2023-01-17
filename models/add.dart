// import 'dart:io';
// import 'package:flutter/material.dart';
// import 'package:dio/dio.dart';
// import 'package:image_picker/image_picker.dart';
// import 'package:path_provider/path_provider.dart';

// class AddPetScreen extends StatefulWidget {
//   @override
//   _AddPetScreenState createState() => _AddPetScreenState();
// }

// class _AddPetScreenState extends State<AddPetScreen> {
//   final _formKey = GlobalKey<FormState>();
//   File _image;
//   String imgPath;
//   TextEditingController _nicknameController = TextEditingController();
//   TextEditingController _breedController = TextEditingController();
//   TextEditingController _ageController = TextEditingController();
//   TextEditingController _weightController = TextEditingController();
//   TextEditingController _colorController = TextEditingController();
//   TextEditingController _locationController = TextEditingController();
  
//   Future<void> _takePicture() async {
//     final picker = ImagePicker();
//     _image = await picker.getImage(source: ImageSource.camera);
//     final tempDir = await getTemporaryDirectory();
//     imgPath = '${tempDir.path}/image.jpg';
//     _image.copySync(imgPath);
//     setState(() {});
//   }
  
//   Future<void> _submitForm() async {
//     if (_formKey.currentState.validate() && _image != null) {
//       Dio dio = Dio();
//       FormData formData = FormData.fromMap({
//         "image": await MultipartFile.fromFile(imgPath, filename: 'image.jpg'),
//         "nickname": _nicknameController.text,
//         "breed": _breedController.text,
//         "age": _ageController.text,
//         "weight": _weightController.text,
//         "color": _colorController.text,
//         "location": _locationController.text,
//       });
//       try {
//         Response response = await dio.post("your api endpoint", data: formData);
//         if (response.statusCode == 200) {
//           // success
//         } else {
//           // handle error
//         }
//       } catch (e) {
//         // handle error
//       }
//     }
//   }
  
//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(
//         title: Text('Add Pet'),
//       ),
//       body: Form(
//         key: _formKey,
//         child: Column(
//           children: <Widget>[
//             Container(
//               width: double.infinity,
//               height: 200,
//               decoration: BoxDecoration(
//                 image: DecorationImage(
//                   image: _image == null
//                       ? AssetImage('assets/placeholder.jpg')
//                       : FileImage(_image),
//                   fit: BoxFit.cover,
//                 ),
//               ),
//               child: _image == null
//                   ? Center(
//                       child: IconButton(
//                         icon: Icon
