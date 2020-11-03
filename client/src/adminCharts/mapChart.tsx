import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker, MarkerClusterer} from '@react-google-maps/api';
import axios from 'axios';
import { Event, Location, eventName } from '../models/event'

type EventObject = {
    name: eventName,
    date: number,
    geoLoaction: Location
};

const MapChart: React.FC = () => {

    const [markersPosition, setMarkersPostion] = useState<EventObject[]>([]);

    useEffect(() => {
        async function getEvents () {
            const { data } = await axios.get('http://localhost:3001/events/all')
            const eventsList : EventObject[] = data.map((obj: Event) : EventObject => {
                    return {
                        name: obj.name,
                        date: obj.date,
                        geoLoaction: obj.geolocation.location
                    }
                })
            setMarkersPostion(eventsList)     
        }
        getEvents()
    },[])
  
   console.log(markersPosition)
    const containerStyle = {
        width: '800px',
        height: '400px'
      };
      
      const center = {
        lat: 17,
        lng: 0
      };

  return (
    <LoadScript
    googleMapsApiKey='AIzaSyBYkqDfr-AaBOz3AnuC64G9cCZuu00ekY8'
    >
        <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={1}
        options={{
            disableDefaultUI: true
        }}
        >
        <MarkerClusterer
            gridSize={75}
        >
        {(clusterer) => 
            markersPosition.map((obj: EventObject) => {
             return <Marker 
             position={obj.geoLoaction} 
             key={obj.date} 
             clusterer={clusterer}/>
        })}
        </MarkerClusterer>
        </GoogleMap>
    </LoadScript>
  );
};

export default MapChart