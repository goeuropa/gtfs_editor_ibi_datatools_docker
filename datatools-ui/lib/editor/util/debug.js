// @flow

import featurecollection from 'turf-featurecollection'
import point from 'turf-point'

import type {Coordinates, GeoJsonFeatureCollection} from '../../types'

/**
 * Log a link to the input feature collection rendered in geojson.io
 */
export function logGeojsonioUrl (features: GeoJsonFeatureCollection) {
  console.log(`http://geojson.io/#data=data:application/json,${encodeURIComponent(JSON.stringify(features))}`)
}

/**
 * Convert array of coordinates to a feature collection.
 */
export function logCoordsToGeojsonio (coords: Coordinates) {
  const features = coordsToFeatureCollection(coords)
  logGeojsonioUrl(features)
}

function coordsToFeatureCollection (coords: Coordinates): GeoJsonFeatureCollection {
  // Feature collection used for debug logging to geojson.io
  return featurecollection(coords.map(c => point(c)))
}
