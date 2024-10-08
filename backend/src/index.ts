import { connectDB } from './db'; 

//ako povezivanje bude uspješno, onda se pokazuje poruka da je uspješno
connectDB().then(() => {
  console.log("Backend server uspješno povezan s bazom!");
  //ako dođe do greške onda se prikazuje ta poruka
}).catch((error) => {
  console.error("Greška prilikom spajanja na bazu:", error);
});
