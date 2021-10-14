import { GoogleMap, withGoogleMap, withScriptjs } from "react-google-maps";
import React from "react";

const GigoverMaps = withScriptjs(withGoogleMap((props) =>
  <GoogleMap
    defaultZoom={8}
    defaultCenter={{ lat: -34.397, lng: 150.644 }}
  >
    {/*
			{props.isMarkerShown && <Marker position={{ lat: -34.397, lng: 150.644 }} />}
*/}
  </GoogleMap>
))


export default GigoverMaps;
