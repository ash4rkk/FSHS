import { useState, useEffect } from 'react'
import getWeather from '../services/weather'

const Country = ({ country }) => {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    const [lat, lon] = country.capitalInfo.latlng
    getWeather(lat, lon).then((data) => setWeather(data))
  }, [country])

  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>capital: {country.capital[0]}</p>
      <p>area: {country.area}</p>
      <h3>languages:</h3>
      <ul>
        {Object.keys(country.languages).map((k) => (
          <li key={k}>{country.languages[k]}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={country.flags.alt} />

      {weather && (
        <div>
          <h3>Weather in {country.capital[0]}</h3>
          <p>temperature {weather.main.temp} Celsius</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
          />
          <p>wind {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  )
}

export default Country
