import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Checkbox, FormControl, InputLabel, ListItemText, MenuItem, Select, OutlinedInput, Button, SelectChangeEvent } from '@mui/material';

interface LogData {
  brandCode: string;
  category: string;
  serviceKey: string;
  requestParams: {
    licensePlateNumber: string;
    policyType: string;
  };
  responseVariables: {
    totalPremium?: number;
    policyVehicle?: {
      make?: string;
      licensePlateNumber: string;
      manufactureYear: string;
    };
    policy: {
      insuranceCommencementDate: string;
      insuranceExpirationDate: string;
      policyNumber: string;
    };
  };
}

const Rezultati: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { selectedBrand, selectedServiceKeys } = location.state || { selectedBrand: '', selectedServiceKeys: [] };
  
  const [brandFilter, setBrandFilter] = useState<string[]>(selectedBrand || selectedServiceKeys ? [selectedBrand] : []); // ?: (if else) - ako selectedBrand ima neku vrijednost, postavi brandFilter na niz koji sadrži selectedBrand, inače postavi brandFilter na prazan niz
  const [serviceKeyFilter, setServiceKeyFilter] = useState<string[]>(selectedServiceKeys || []); // (ili) ako selectedServiceKeys ima vrijednost, koristi selectedServiceKeys, inače koristi prazan niz
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [policyTypeFilter, setPolicyTypeFilter] = useState<string[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogData[]>([]); //filtrirani logovi
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]); //odabrani za usporedbu

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  //useEffect se pokreće kada se komponenta učita, a također se reaktivira kada se promijene odabrani brand ili usluge.
  //Podaci se dohvaćaju iz API-ja pomoću axios poziva, i nakon toga se spremaju u stanje filteredLogs.
  //uniqueLogs filtrira podatke kako bi osigurao da ne postoje duplikati po kombinaciji branda i ključa usluge.
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get<LogData[]>('http://localhost:4000/api/logovi', {
          params: {
            brandCode: selectedBrand || '',
            serviceKeys: selectedServiceKeys,
          },
        });

        const uniqueLogs = response.data.filter(
          (log, index, self) =>
            index === self.findIndex((l) => l.brandCode === log.brandCode && l.serviceKey === log.serviceKey) //=== je stroga jednakost, a && omogućuje da se uklanjaju duplikati samo ako se podudaraju obje vrijednosti
        );
        setFilteredLogs(uniqueLogs);
      } catch (error) {
        console.error('Greška pri dohvaćanju logova:', error);
      }
    };

    if (selectedBrand && selectedServiceKeys.length > 0) {
      fetchLogs();
    }
  }, [selectedBrand, selectedServiceKeys]);

  const displayedLogs = filteredLogs.filter(
    (log) =>
      (brandFilter.length === 0 || brandFilter.includes(log.brandCode)) && //ako određeni filter nije odabran (npr. brandFilter.length === 0), svi rezultati se prikazuju za taj kriterij.
      (serviceKeyFilter.length === 0 || serviceKeyFilter.includes(log.serviceKey)) && //&& spaja prvi uvjet sa sljedećim itd, oba moraju biti istinita (Prvi uvjet provjerava sadrži li serviceKeyFilter trenutni serviceKey ili je prazan.)
      (categoryFilter.length === 0 || categoryFilter.includes(log.category)) &&
      (policyTypeFilter.length === 0 || policyTypeFilter.includes(log.requestParams?.policyType || ''))
  );
  
  const uniqueBrands = [...new Set(filteredLogs.map((log) => log.brandCode))];
  const uniqueServiceKeys = [...new Set(filteredLogs.map((log) => log.serviceKey))];
  const uniqueCategories = [...new Set(filteredLogs.map((log) => log.category))];
  const uniquePolicyTypes = [...new Set(filteredLogs.map((log) => log.requestParams?.policyType || 'N/A'))]; //nije obvezan, i ako ga nema onda nek piše N/A

  const handleSelectChange = (setFilter: React.Dispatch<React.SetStateAction<string[]>>) => 
    (event: SelectChangeEvent<string[]>) => {
      const selectedOptions = event.target.value as string[];
      setFilter(selectedOptions);
  };

  const handleSelectAll = () => {
    if (selectedOptions.length === displayedLogs.length) {
      setSelectedOptions([]);
    } else {
      setSelectedOptions(displayedLogs.map((_, index) => index));
    }
  };

  const handleSelectOption = (index: number) => {
    if (selectedOptions.includes(index)) {
      setSelectedOptions(selectedOptions.filter((i) => i !== index));
    } else {
      setSelectedOptions([...selectedOptions, index]);
    }
  };

  const handleExploreDifferences = () => {
    const selectedLogs = displayedLogs.filter((_, index) => selectedOptions.includes(index));
    navigate('/usporedba', { state: { selectedLogs } });
  };

  return (
    <Box sx={styles.outerContainer}>
      <Box sx={styles.container}>
        <h2 style={styles.title}>Logovi po Brandu i Uslugama (rezultati)</h2>

        <Box sx={styles.filterContainer}>
          <FormControl sx={styles.formControl}>
            <InputLabel>Brendovi</InputLabel>
            <Select
              multiple
              value={brandFilter}
              onChange={handleSelectChange(setBrandFilter)}
              input={<OutlinedInput label="Brendovi" />}
              renderValue={(selected) => (selected as string[]).join(', ')}
              MenuProps={MenuProps}
            >
              {uniqueBrands.map((brand) => (
                <MenuItem key={brand} value={brand}>
                  <Checkbox checked={brandFilter.includes(brand)} />
                  <ListItemText primary={brand} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={styles.formControl}>
            <InputLabel>Usluge</InputLabel>
            <Select
              multiple
              value={serviceKeyFilter}
              onChange={handleSelectChange(setServiceKeyFilter)}
              input={<OutlinedInput label="Usluge" />}
              renderValue={(selected) => (selected as string[]).join(', ')}
              MenuProps={MenuProps}
            >
              {uniqueServiceKeys.map((key) => (
                <MenuItem key={key} value={key}>
                  <Checkbox checked={serviceKeyFilter.includes(key)} />
                  <ListItemText primary={key} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={styles.formControl}>
            <InputLabel>Kategorije</InputLabel>
            <Select
              multiple
              value={categoryFilter}
              onChange={handleSelectChange(setCategoryFilter)}
              input={<OutlinedInput label="Kategorije" />}
              renderValue={(selected) => (selected as string[]).join(', ')}
              MenuProps={MenuProps}
            >
              {uniqueCategories.map((category) => (
                <MenuItem key={category} value={category}>
                  <Checkbox checked={categoryFilter.includes(category)} />
                  <ListItemText primary={category} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={styles.formControl}>
            <InputLabel>Tipovi polica</InputLabel>
            <Select
              multiple
              value={policyTypeFilter}
              onChange={handleSelectChange(setPolicyTypeFilter)}
              input={<OutlinedInput label="Tipovi polica" />}
              renderValue={(selected) => (selected as string[]).join(', ')}
              MenuProps={MenuProps}
            >
              {uniquePolicyTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  <Checkbox checked={policyTypeFilter.includes(type)} />
                  <ListItemText primary={type} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={styles.optionsContainer}>
          <input
            type="checkbox"
            onChange={handleSelectAll}
            checked={selectedOptions.length === displayedLogs.length}
          />
          <label>
            {selectedOptions.length === displayedLogs.length ? 'Deselect All' : 'Select All'}
          </label>
          {displayedLogs.map((log, index) => (
            <div key={index} style={styles.optionRow}>
              <input
                type="checkbox"
                checked={selectedOptions.includes(index)}
                onChange={() => handleSelectOption(index)}
              />
              {/* Provjera postoji li polje make, inače prikazujemo 'Nepoznato vozilo' */}
              <label>{`Brand: ${log.brandCode}, Marka vozila: ${log.responseVariables?.policyVehicle?.make ?? 'Nepoznato vozilo'}, Usluga: ${log.serviceKey}, Kategorija: ${log.category}, Ukupna premija: ${log.responseVariables?.totalPremium || 'N/A'}`}</label>
            </div>
          ))}
        </Box>

        <Box sx={styles.buttonContainer}>
          <Button sx={styles.exploreButton} onClick={handleExploreDifferences}>
            Usporedi označeno
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

const styles = {
  outerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6200AA',
    height: '100vh',
    padding: '20px',
  },
  container: {
    backgroundColor: '#F7F7F7',
    padding: '30px',
    borderRadius: '8px',
    maxWidth: '1200px',
    width: '100%',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
  },
  title: {
    color: '#7E28C6',
    textAlign: 'center' as const,
    marginBottom: '20px',
  },
  filterContainer: {
    display: 'flex',
    gap: '20px',
    marginBottom: '20px',
    justifyContent: 'space-between',
  },
  formControl: {
    minWidth: 200,
    maxWidth: 300,
  },
  optionsContainer: {
    margin: '20px 0',
    maxHeight: '300px',
    overflowY: 'auto' as const,
  },
  optionRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginTop: '20px',
  },
  exportButton: {
    backgroundColor: '#7E28C6',
    color: '#fff',
    padding: '10px',
    borderRadius: '4px',
    flex: 1,
  },
  exploreButton: {
    backgroundColor: '#7E28C6',
    color: '#fff',
    padding: '10px',
    borderRadius: '4px',
    flex: 1,
  },
};

export default Rezultati;
