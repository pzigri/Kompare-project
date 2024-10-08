import { MongoClient } from 'mongodb';  
import dotenv from 'dotenv';  

dotenv.config({ path: '../../data.env' }); //učitavaju se varijable okruženja iz env datoteke, u ovom slučaju uri baze

//Ako MONGODB_URI nije definiran u env datoteci, koristi se zadani uri s desne strane
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/database";
const client = new MongoClient(uri);

//povezivanje s bazom
export async function connectDB() {
  //pokušavanje spajanja s bazom, i ako je uspješno ispisuje se poruka
  try {
    await client.connect();
    console.log("Uspješno povezano s MongoDB bazom!");
    //ak dođe do pogreške, ovo hvata tu grešku i ispisuje je zajedno s porukom
  } catch (error) {
    console.error("Greška pri povezivanju s MongoDB:", error); 
  }
}

connectDB();
