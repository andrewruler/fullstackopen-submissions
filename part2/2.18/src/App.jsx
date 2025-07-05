import { useState } from 'react';
import SearchService from './services/search.js'
function App() {
  const [countriesToShow, setCountriesToShow] = useState([])
  const [filter, setFilter] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);

  const handleInput = (e) => {
    const inputValue = e.target.value;
    setFilter(inputValue);

    SearchService.getSearch(inputValue)
      .then(results => {
        setCountriesToShow(results);
        setSelectedCountry(null); // reset selection on new search
      });
  };

  const handleShow = (country) => {
    setSelectedCountry(country);
  };

  const CountryDetail = ({ country }) => {
    return (
      <div>
        <h2>{country.name.common}</h2>
        <p>Capital: {country.capital}</p>
        <p>Population: {country.population}</p>
        <h3>Languages</h3>
        <ul>
          {Object.values(country.languages).map(language => (
            <li key={language}>{language}</li>
          ))}
        </ul>
        <img src={country.flags.png} alt={`Flag of ${country.name.common}`} />
      </div>
    )
  }

  return (
    <>
      <div>
        <p>Find countries</p> <input value={filter} onChange={handleInput}></input>
      </div>
      {countriesToShow.length > 10 && (
        <p>Too many, please specify better mia</p>
      )}

      {countriesToShow.length <= 10 && countriesToShow.length > 1 && (
        <ul>
          {countriesToShow.map(country => (
            <li key={country.name.common}>
              {country.name.common}
              <button onClick={() => handleShow(country)}>Show</button>
            </li>
          ))}
        </ul>
      )}

      {(countriesToShow.length === 1 || selectedCountry) && (
        <CountryDetail country={selectedCountry || countriesToShow[0]} />
      )}
    </>
  )
}

export default App
