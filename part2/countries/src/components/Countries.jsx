const Countries = ({ countries, setSelectedCountry }) => {
  return countries.map((c) => (
    <div key={c.cca3}>
      <p>
        {c.name.common}
        <button onClick={() => setSelectedCountry(c)}>Show</button>
      </p>
    </div>
  ));
};

export default Countries;
