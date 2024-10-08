import { FastifyInstance } from 'fastify';
import { getAllLogs } from '../db/repositories/WebServicesLogRepository';

//funkcija webServicesLogController prima instancu Fastify servera, služi za registraciju novih ruta (a to je u ovom slučaju '/api/logovi')
export const webServicesLogController = (app: FastifyInstance) => {
   
    //request sadrži informacije o HTTP zahtjevu koji je poslan, a reply se koristi za slanje odgovora
    app.get('/api/logovi', async (request, reply) => {

    //try blok hvata greške pri dohvaćanju podataka
    //ako getAllLogs() uspješno vrati podatke, ti podaci se pohranjuju u varijablu logs, i prikažu se zbog reply.send(logs)
        try {
            const logs = await getAllLogs();
            reply.send(logs);

    //catch blok hvata bilo kakve greške koje su se pojavile unutar try bloka, poput problema s bazom podataka ili mrežnih pogrešaka
    //u slučaju pogreške, postavlja se HTTP status na 500 (što označava internu pogrešku servera) te se klijentu šalje JSON objekt s porukom i samom greškom
        } catch (error) {
            reply.status(500).send({ message: 'Error fetching logs', error });
        }
    });
};
