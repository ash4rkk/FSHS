const CountryFilters = ({ query, handleChange }) => {
  return (
    <div>
      find countries
      <input value={query} onChange={handleChange} />
    </div>
  );
};

export default CountryFilters;
