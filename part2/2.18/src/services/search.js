import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api'

const getAll = () => {
    return axios.get(`${baseUrl}/all`).then(response => response.data)
}

const getSearch = async (subString) => {
    const countries = await getAll()
    console.log(countries)
    return countries.filter(country => country.name.common.toLowerCase().includes(subString.toLowerCase()))
}

export default { getAll, getSearch }