import mongoose from 'mongoose';

mongoose.connect('mongodb+srv://roxanaperrotta:roxanaperrottacoder@cluster0.ujdlb.mongodb.net/integrativePractice?retryWrites=true&w=majority&appName=Cluster0')
.then(()=> console.log('Conexión a BD exitosa'))
.catch((error)=>console.log('Error al conectarse a BD', error));