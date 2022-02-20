import { useState } from "react";

import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";

import Skeleton from "components/Skeleton";
import CountryCard from "./components/CountryCard";

import REGION_LIST from "constants/regionList";

import { useGetAllCountriesQuery } from "reduxModules/country/countryApi";

import useInfiniteLoader from "hooks/useInfiniteLoader";

import styles from "./Home.module.scss";

function Home() {
  const { data = [], isLoading } = useGetAllCountriesQuery();

  const [{ name, region }, setFilter] = useState({
    name: "",
    region: "",
  });

  const { items, hasMoreItems, loadMoreRef } = useInfiniteLoader(data);

  const handleChangeFilter = (key) => (event) => {
    const value = event.target.value;
    setFilter((state) => ({
      ...state,
      [key]: value,
    }));
  };

  return (
    <>
      <div className={styles.toolbar}>
        <FormControl fullWidth className={styles.search}>
          <OutlinedInput
            type="search"
            value={name}
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            }
            placeholder="Search for a country..."
            onChange={handleChangeFilter("name")}
          />
        </FormControl>
        <FormControl fullWidth className={styles.filterRegion}>
          <InputLabel id="filter-region-label">Filter by region</InputLabel>
          <Select
            labelId="filter-region-label"
            label="Filter by region"
            value={region}
            onChange={handleChangeFilter("region")}
          >
            <MenuItem value="">All</MenuItem>
            {REGION_LIST.map((region) => (
              <MenuItem key={region} value={region}>
                {region}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      {isLoading ? (
        <Skeleton.HomeCountryCards />
      ) : (
        <div className={styles.cards}>
          {items.map((country) => (
            <CountryCard key={country.alpha3Code} {...country} />
          ))}
        </div>
      )}
      {hasMoreItems && <div ref={loadMoreRef} className={styles.loadMore} />}
    </>
  );
}

export default Home;
