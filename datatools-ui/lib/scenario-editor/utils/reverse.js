// @flow

import fetch from 'isomorphic-fetch'
import qs from 'qs'

import type {LatLng} from '../../types'

// this is not the complete shape of the object
type ReverseMapzenResponse = {
  features: Array<{
    geometry: {
      coordinates: [number, number],
      type: "Point"
    },
    properties: {
      accuracy: string,
      confidence: number,
      country: string,
      distance: number,
      label: string,
      locality: string,
      macroregion: string,
      name: string,
      neighbourhood: string,
      region: string
    },
    type: "Feature"
  }>,
  geocoding: {
    query: {
      "point.lat": number,
      "point.lon": number
    },
    timestamp: number
  },
  type: "FeatureCollection"
}

type ReverseEsriResponse = {
  address: {
    AddNum: string,
    Addr_type: string,
    Address: string,
    Block: string,
    City: string,
    CountryCode: string,
    District: string,
    LongLabel: string,
    Match_addr: string,
    MetroArea: string,
    Neighborhood: string,
    PlaceName: string,
    Postal: string,
    PostalExt: string,
    Region: string,
    Sector: string,
    ShortLabel: string,
    Subregion: string,
    Territory: string,
    Type: string
  },
  location: {
    spatialReference: {
      latestWkid: number,
      wkid: number
    },
    x: number,
    y: number
  }
}

export async function reversePelias (point: LatLng): Promise<ReverseMapzenResponse> {
  const location = {lon: point.lng, lat: point.lat}
  const MAPZEN_TURN_BY_TURN_KEY = process.env.MAPZEN_TURN_BY_TURN_KEY
  const params = {
    api_key: MAPZEN_TURN_BY_TURN_KEY,
    ...location
  }
  const url = `https://search.mapzen.com/v1/reverse?${qs.stringify(params)}`
  const response = await fetch(url)
  const json = await response.json()
  return json
}

export async function reverseEsri (point: LatLng): Promise<ReverseEsriResponse> {
  const params = {
    location: `${point.lng},${point.lat}`,
    returnIntersection: true,
    f: 'pjson'
  }
  const url = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?${qs.stringify(params)}`
  const response = await fetch(url)
  const json = await response.json()
  return json
}
