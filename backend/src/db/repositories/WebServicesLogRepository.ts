import WebServicesLog from '../models/WebServicesLogModel';

export const getAllLogs = async () => {
    //pretražuju se svi zapisi u kolekciji
    const logs = await WebServicesLog.find();
    //kad funkcija find završi, ti se podatci spreme u varijablu logs i onda ih funkcija return vraća 
    console.log('Logs from MongoDB:', logs);  
    return logs;
};
