import { useState } from "react";
import CountryFilters from "./components/CountryFilters";
import getAllCountries from "./services/countries";
import MainContent from "./components/MainContent";
import { useEffect } from "react";

const App = () => {
  const [query, setQuery] = useState("");
  const [allCountries, setAllCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");

  useEffect(() => {
    getAllCountries().then((data) => {
      setAllCountries(data);
    });
  }, []);

  const handleFilterChange = (e) => {
    setQuery(e.target.value);
    setSelectedCountry(null);
  };

  const filteredCountries =
    query.trim().length === 0
      ? allCountries
      : allCountries.filter((c) =>
          c.name.common.toLowerCase().includes(query.trim().toLowerCase()),
        );

  console.log(filteredCountries.length);
  console.log(selectedCountry);
  return (
    <div>
      <CountryFilters query={query} handleChange={handleFilterChange} />
      <MainContent
        countries={filteredCountries}
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
      />
    </div>
  );
};

export default App;
