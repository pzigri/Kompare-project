import React, { useState, useEffect } from 'react';
import { Box, Button, Checkbox, FormControl, FormControlLabel, FormLabel, Paper, Radio, RadioGroup, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface LogData {
  brandCode: string;
  serviceKey: string;
}

//set je ažuriran popis, useState je rezultat koji se vraća
const Brendovi: React.FC = () => {
  const [logs, setLogs] = useState<LogData[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [serviceKeys, setServiceKeys] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedServiceKeys, setSelectedServiceKeys] = useState<string[]>([]);
  const navigate = useNavigate();


  //useEffect se koristi za dohvaćanje podataka s API-ja kada se komponenta prvi put učita, omogućuje promjene bez ponovnog učitavanja stranice
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<LogData[]>('http://localhost:4000/api/logovi'); 
        const data = response.data;

        setLogs(data);
        //filtrira duplikate brendova iz kolekcije, od svaki se prikazuje jednom
        const uniqueBrands = [...new Set(data.map((item) => item.brandCode))];
        setBrands(uniqueBrands);
      } catch (error) {
        console.error('Greška pri dohvaćanju podataka', error);
      }
    };

    fetchData();
  }, []);

  //ovaj useEffect se aktivira kad se promijeni selectedBrand ili logs
  useEffect(() => {
    if (selectedBrand) {
      const filteredServiceKeys = [
        ...new Set(
          logs
            .filter((item) => item.brandCode === selectedBrand)
            .map((item) => item.serviceKey)
        ),
      ];
      //ako je neki brand odabran, filtrira se popis logova tako da odgovara tom brandu i postavljaju se jedinstveni serviceKeys, ako brand nije odabran, serviceKeys se resetira i niz je prazan, odnosno, ne pokazje se
      setServiceKeys(filteredServiceKeys);
    } else {
      setServiceKeys([]); 
    }
  }, [selectedBrand, logs]);


  //ova funkcija se aktivira kada korisnik promijeni odabir branda
  const handleBrandChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedBrand(event.target.value); //postavlja se na odabranu vrijednost
  };

//praćenje odabranih serviceKey vrijednosti
  const handleServiceKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    //ako je value već odabrana, uklanja se iz popisa, a ako nije, dodaje se
    setSelectedServiceKeys((prev) =>
      prev.includes(value) ? prev.filter((key) => key !== value) : [...prev, value]
    );
  };

  const handleNext = () => {
    //ako brend nije odabran pojavljuje se upozorenje
    if (!selectedBrand) {
      alert('Molimo odaberite brand prije nego nastavite.');
      return;
    }
    //ako je odabran, prelazimo na stranicu rezultati na kpju se odabrani podatci šalju kao state
    navigate('/rezultati', { state: { selectedBrand, selectedServiceKeys } });
  };

  return (
    <Box sx={styles.container}>
      <Paper elevation={3} sx={styles.paper}>
        <Box>
          <FormControl component="fieldset">
            <FormLabel component="legend" sx={styles.formLabel}>
              Odaberite Brand:
            </FormLabel>
            <RadioGroup
              aria-label="brand" 
              name="brand" 
              value={selectedBrand}
              onChange={handleBrandChange}
            >
              {brands.map((brand) => (
                <FormControlLabel
                  key={brand}
                  value={brand}
                  control={<Radio />}
                  label={brand}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Box>
        <Box>
          {selectedBrand && serviceKeys.length > 0 && (
            <>
              <Typography variant="subtitle1" sx={styles.selectedBrandText}>
                Odabrali ste {selectedBrand}.
              </Typography>
              <FormControl component="fieldset">
                <FormLabel component="legend" sx={styles.formLabel}>
                  Dostupni Service Key-evi:
                </FormLabel>
                {serviceKeys.map((key) => (
                  <FormControlLabel
                    key={key}
                    control={
                      <Checkbox
                        value={key}
                        checked={selectedServiceKeys.includes(key)} //označava checkbox ako je odabran
                        onChange={handleServiceKeyChange}
                      />
                    }
                    label={key}
                  />
                ))}
              </FormControl>
            </>
          )}
        </Box>
      </Paper>
      <Button
        variant="contained"
        color="secondary"
        sx={styles.button}
        onClick={handleNext}
      >
        Dalje
      </Button>
    </Box>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#6200AA',
    padding: 4,
  },
  paper: {
    padding: 5,
    display: 'flex',
    gap: 5,
    backgroundColor: '#F7F7F7',
    marginLeft: 15,
    marginRight: 5,
    flexDirection: 'row',
  },
  formLabel: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  selectedBrandText: {
    marginBottom: 2,
    color: 'purple',
  },
  button: {
    marginLeft: 4,
    height: 40,
    alignSelf: 'flex-end',
  },
};

export default Brendovi;
