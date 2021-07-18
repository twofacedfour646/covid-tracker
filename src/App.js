import React from 'react';
import InfoBox from "./InfoBox";
import Map from "./Map";
import "./App.css";
import {Card} from "@material-ui/core";
import {
    MenuItem,
    FormControl,
    Select,
    CardContent
} from "@material-ui/core";
import Table from "./Table";
import {sortData} from "./util";
import numeral from "numeral";

function App() {
    const [country, setCountry] = React.useState("Worldwide");
    const [countries, setCountries] = React.useState([]);
    const [countryInfo, setCountryInfo] = React.useState({});
    const [tableData, setTableData] = React.useState([]);
    const [mapCenter, setMapCenter] = React.useState({
        lat: 34.80746, lng: -40.4796
    });
    const [mapZoom, setMapZoom] = React.useState(3);
    const [mapCountries, setMapCountries] = React.useState([]);
    const [caseType, setCaseType] = React.useState("cases");

    React.useEffect(() => {
        fetch("https://disease.sh/v3/covid-19/all")
        .then(response => response.json())
        .then(data => {
            setCountryInfo(data);
        })
    }, [])

    React.useEffect(() => {
        const getCountriesData = async () => {
          fetch("https://disease.sh/v3/covid-19/countries")
            .then((response) => response.json())
            .then((data) => {
              const countries = data.map((country) => ({
                name: country.country,
                value: country.countryInfo.iso2,
              }));

              const sortedData = sortData(data)
            
              setTableData(sortedData);
              setMapCountries(data);
              setCountries(countries);
            });
        };
    
        getCountriesData();
      }, []);

      console.log(tableData);


      const handleCountryChange = async (event) => {
        const country = event.target.value;

        const url = country === "Worldwide" ? "https://disease.sh/v3/covid-19/all" : `https://disease.sh/v3/covid-19/countries/${country}`;

        await fetch(url)
        .then(response => response.json())
        .then(data => {
            setCountry(country);
            setCountryInfo(data);

            if (country === "Worldwide") {
                setMapCenter({lat: 34.80746, lng: -40.4796});
                setMapZoom(3);
            } else {
                setMapCenter({
                    lat: data.countryInfo.lat,
                    lng: data.countryInfo.long
                });
                setMapZoom(4);
            }
        })
    }

    console.log(countryInfo);



    return (
        <div className="app">
            <div className="app__left">
                {/* Header */}
                <div className="app__header">
                    <h2>COVID-19 TRACKER</h2>
                        
                    <FormControl className="app__dropdown">
                        <Select variant="outlined" value={country} onChange={handleCountryChange}>
                            <MenuItem value="Worldwide">Worldwide</MenuItem>
                            {countries.map(country => {
                                return <MenuItem value={country.value}>{country.name}</MenuItem>
                            })}
                        </Select>
                    </FormControl>
                </div>

                {/* Info Boxes */}
                <div className="app__stats">
                    {/* Info Box */}
                    <InfoBox title="Coronavirus Cases" isRed active={caseType === "cases"} onClick={e => setCaseType("cases")} caseType="danger" cases={numeral(countryInfo.todayCases).format("0.0a")} total={numeral(countryInfo.cases).format("0.0a")}/>
                    {/* Info Box */}
                    <InfoBox title="Recovered" active={caseType === "recovered"} caseType="recovered" onClick={e => setCaseType("recovered")} cases={numeral(countryInfo.todayRecovered).format("0.0a")} total={numeral(countryInfo.recovered).format("0.0a")}/>
                    {/* Info Box */}
                    <InfoBox title="Deaths" isRed active={caseType === "deaths"} caseType="danger" onClick={e => setCaseType("deaths")} cases={numeral(countryInfo.todayDeaths).format("0.0a")} total={numeral(countryInfo.deaths).format("0.0a")}/>
                </div>

                {/* Map */}
                <Map center={mapCenter} zoom={mapZoom} countries={mapCountries} casesType={caseType}/>
            </div>
            
            <Card className="app__right">
                {/* Table */}
                <h3>Live Cases by Country</h3>
                <Table countries={tableData}/>

            </Card>
        </div>
    )
}

export default App;