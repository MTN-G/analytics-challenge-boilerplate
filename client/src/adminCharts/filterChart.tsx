import React, { useEffect, useState } from "react";
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputLabel from '@material-ui/core/InputLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Event, eventName, browser } from '../models/event'

const styleEventDiv = {
    maxHeight: 300,
    border: "1px solid green",
    margin: 6,
    padding: 8
}

type sorting = "%2Bdate" | "-date"

const FilterChart: React.FC = () => {
    const [sorting, setSorting] = useState<sorting>("-date")
    const [type, setType] = useState<eventName | undefined>(undefined)
    const [browser, setBrowser] = useState<browser | undefined>(undefined)
    const [search, setSearch] = useState<string | undefined>(undefined)
    const [offset, setOffset] = useState<number>(10)
    const [data, setData] = useState<{events: Event[], more: boolean}>({events: [], more: true})


    useEffect(() => {
        let url = `http://localhost:3001/events/all-filtered?sorting=${sorting}&offset=${offset}`;
        if (type !== undefined) url = url + `&type=${type}`;
        if (browser !== undefined) url = url + `&browser=${browser}`;
        if (search !== undefined) url = url + `&search=${search}`
        async function getEventsByDays () {
            const {data} = await axios.get(url)
            setData(data)  
        }
        console.log(url)
        getEventsByDays()
    },[sorting, type, browser, search, offset])

    const handleChange = (e : React.ChangeEvent<{value: string }>, setState: Function) => {
        if (e.target.value === 'All') setState(undefined)
        else setState(e.target.value);
        setOffset(10)
    }

    console.log(data)

  return (
   <div>
       <div style={{display: 'flex' , gap: "20px"}}>
         <div style={{display: "flex", flexDirection: "column", gap: "5px"}}>
            <InputLabel shrink htmlFor="age-native-label-placeholder" >
            Page Name
            </InputLabel>
            <NativeSelect
            value={type}
            onChange={e => handleChange(e , setType)}
            >
            <option value={undefined}>All</option>
            <option value={'signup'}>Register Page</option>
            <option value={'login'}>Login Page</option>
            <option value={'admin'}>Admin Page</option>
            <option value={'pageView'}>Others</option>
            </NativeSelect>
            <br/>
            <InputLabel shrink htmlFor="age-native-label-placeholder">
            Browser
            </InputLabel>
            <NativeSelect
            value={browser}
            onChange={e => handleChange(e , setBrowser)}
            >
            <option value={undefined}>All</option>
            <option value={'chrome'}>Chrome</option>
            <option value={'ie'}>ie</option>
            <option value={'firefox'}>FireFox</option>
            <option value={'safari'}>Safari</option>
            <option value={'edge'}>Edge</option>
            <option value={'other'}>Others</option>
            </NativeSelect>
            <br/>
            <TextField id="outlined-basic" label="Search" variant="outlined" onChange={e => handleChange(e , setSearch)} />
          </div>
            <InfiniteScroll
                    dataLength={offset}
                    next={() => setOffset(prev => prev + 10)}
                    hasMore={data.more}
                    style={{ display: 'flex', flexDirection: 'column' }}
                    loader={<h4>Loading...</h4>}
                    height={400}
                    endMessage={
                        <p style={{ textAlign: 'center' }}>
                        <b>You have seen all Events</b>
                        </p>}
            >
            {data.events.map((event, i) => <div style={styleEventDiv}>{`${i + 1}.`}<b>{event.name}</b> by: User {event.distinct_user_id} at {`${new Date(event.date).toLocaleString()}`}</div>)}
            </InfiniteScroll>
      </div>
        <RadioGroup aria-label="position" name="position" defaultValue="-date" row>
            <FormControlLabel
            value="-date"
            control={<Radio color="primary" onChange={e => handleChange(e , setSorting)}/>}
            label="descends by date"
            />
            <FormControlLabel
            value="%2Bdate"
            control={<Radio color="primary" onChange={e => handleChange(e , setSorting)} />}
            label="ascending by date"
            /> 
        </RadioGroup>
     </div>
  );
};

export default FilterChart