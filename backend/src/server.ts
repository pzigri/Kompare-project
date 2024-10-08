import Fastify from 'fastify';
import mongoose from 'mongoose';
import cors from '@fastify/cors'; 
import { webServicesLogController } from './controllers/WebServicesLogController';

const app = Fastify();

// registracija CORS-a
app.register(cors, {
  origin: '*',  // zvjezdica znači da dopušta pristup za sve domene
});

// povezivanje s MongoDB bazom podataka
mongoose.connect('mongodb://localhost:27017/myDatabase')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => console.error('MongoDB connection error:', err));

webServicesLogController(app); // registracija kontrolera

app.listen({ port: 4000 }, (err, address) => {
    if (err) {
        console.error('Error starting server:', err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`); //address sadrži inf o adresi na kojoj je server pokrenut
});
