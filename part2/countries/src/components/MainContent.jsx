import Countries from "./Countries";
import Country from "./Country";

const MainContent = ({ countries, selectedCountry, setSelectedCountry }) => {
  if (selectedCountry) {
    return <Country country={selectedCountry} />;
  }

  if (countries.length > 10) {
    return <p>To many matches, {countries.length}</p>;
  }

  if (countries.length <= 10 && countries.length > 1) {
    return (
      <Countries
        countries={countries}
        setSelectedCountry={setSelectedCountry}
      />
    );
  }

  if (countries.length === 1) {
    return <Country country={countries[0]} />;
  }

  return <p>No matches</p>;
};

export default MainContent;
