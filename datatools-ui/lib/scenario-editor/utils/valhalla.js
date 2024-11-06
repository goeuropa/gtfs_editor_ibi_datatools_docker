import { isEqual as coordinatesAreEqual } from '@conveyal/lonlat'
// import isomorphicFetch from "isomorphic-fetch"; //! Changed content
// import L from "leaflet"; //! Changed content
// import { decode as decodePolyline } from "polyline"; //! Changed content
import lineString from 'turf-linestring'
// import qs from "qs"; //! Changed content

// import { coordIsOutOfBounds } from "../../editor/util/map"; //! Changed content

//* Refactored for our use, flow has been removed

/**
 * Convert GraphHopper routing JSON response to polyline.
 */

//! Changed content
// function handleGraphHopperRouting(path, individualLegs = false) {
//   // console.info(1, { path, individualLegs });
//   const { instructions, points } = path;
//   // Decode polyline and reverse coordinates.
//   const decodedPolyline = decodePolyline(points).map((c) => [c[1], c[0]]);
//   if (individualLegs) {
//     const segments = [];

//     const segmentPointIndices = [0];

//     instructions.forEach((instruction, i) => {
//       if (instruction.text.match(/Waypoint (\d+)/) || i === instructions.length - 1) {
//         segmentPointIndices.push(instruction.interval[0]);
//       }
//     });
//     // Once all of the indices have been found, slice the decoded polyline up
//     // at the provided indices.
//     if (segmentPointIndices.length > 2) {
//       for (var i = 1; i < segmentPointIndices.length; i++) {
//         const [from, to] = [segmentPointIndices[i - 1], segmentPointIndices[i] + 1];
//         const segment = decodedPolyline.slice(from, to);
//         segments.push(segment);
//       }
//       // console.info(7, "individual legs", segments);
//       return segments;
//     } else {
//       // FIXME does this work for two input points?
//       return [decodedPolyline];
//     }
//   } else {
//     return decodedPolyline;
//   }
// }

/**
 * Route between two or more points using external routing service.
 * @param  {[type]} points         array of two or more LatLng points
 * @param  {[type]} individualLegs whether to return coordinates as set of
 *                                 distinct segments for each pair of points
 * @return {[type]}                Array of coordinates or Array of arrays of coordinates.
 */
export async function polyline (points, individualLegs = false, avoidMotorways = false) {
  // console.info(2, { individualLegs });
  // let json; //! Changed content
  // const geometry = []; //! Changed content

  try {
    //! Changed content
    // Chunk points into sets no larger than the max # of points allowed by
    // GraphHopper plan.
    // const pointLimit = +process.env.GRAPH_HOPPER_POINT_LIMIT;

    // // Default to chunks of 30 points if the point limit is less than 2. (There
    // // must be at least two points passed in to routing method in order to
    // // successfully route.)
    // const chunk = pointLimit > 2 ? pointLimit : 30;
    // let count = 0;
    // const j = points.length;
    // for (let i = 0; i < j; i += chunk) {
    //   // Offset the slice indices so that the next chunk begins with the
    //   const offset = count * -1;
    //   const beginIndex = i + offset;
    //   const endIndex = i + chunk + offset;
    //   const chunkedPoints = points.slice(beginIndex, endIndex);

    //   if (process.env.GRAPH_HOPPER_KEY) {
    //     json = await routeWithGraphHopper(chunkedPoints, avoidMotorways);

    //     const path = json && json.paths && json.paths[0];

    //     if (path) {
    //       const result = handleGraphHopperRouting(path, individualLegs);
    //       geometry.push(...result);
    //     } else {
    //       // If any of the routed legs fails, default to straight line (return null).
    //       console.warn(`Error routing from point ${beginIndex} to ${endIndex}`, chunkedPoints);
    //       // return null;  //! Changed content
    //     }
    //   }
    //   count++;
    // }

    //  console.info(3, "geometryGraphhopper:", geometry); //! New content
    //   return geometry; //! Changed content

    //* The main function
    const valhallaGeometry = [] //! New content
    const valhallaData = await getValhallaData(points, individualLegs, avoidMotorways) //! New content
    valhallaGeometry.push(...valhallaData) //! New content
    // console.info(4, "valhallaGeometry:", valhallaGeometry); //! New content
    return valhallaGeometry //! New content
  } catch (e) {
    console.info('e:', e)
    return null
  }
}

//* Not used here
export async function getSegment (points, followRoad, defaultToStraightLine = true, avoidMotorways = false) {
  // Store geometry to be returned here.
  // console.info(5, "points:", points, { avoidMotorways }, { followRoad });
  let geometry
  if (followRoad) {
    // if snapping to streets, use routing service.
    const coordinates = await polyline(points.map((p) => ({ lng: p[0], lat: p[1] })), false, avoidMotorways)

    if (!coordinates) {
      // If routing was unsuccessful, default to straight line (if desired by
      // caller).
      console.warn(`Routing unsuccessful. Returning ${defaultToStraightLine ? 'straight line' : 'null'}.`)
      if (defaultToStraightLine) {
        geometry = lineString(points).geometry
      } else {
        return null
      }
    } else {
      // If routing is successful, clean up shape if necessary
      const c0 = coordinates[0]
      const epsilon = 1e-6
      if (!coordinatesAreEqual(c0, points[0], epsilon)) {
        coordinates.unshift(points[0])
      }
      geometry = {
        type: 'LineString',
        coordinates
      }
    }
  } else {
    // If not snapping to streets, simply generate a line string from input
    // coordinates.
    geometry = lineString(points).geometry
  }
  return geometry
}

//! Changed content - used only here
// Fetch Data
// export function routeWithGraphHopper(points, avoidMotorways) {
//   console.info(6, { avoidMotorways });
//   if (points.length < 2) {
//     console.warn("need at least two points to route with graphhopper", points);
//     return null;
//   }
//   if (!process.env.GRAPH_HOPPER_KEY) {
//     throw new Error("GRAPH_HOPPER_KEY not set");
//   }

//   // Use custom url if it exists, otherwise default to the hosted service.
//   let graphHopperUrl = process.env.GRAPH_HOPPER_URL || "https://graphhopper.com/api/1/";
//   let graphHopperKey = process.env.GRAPH_HOPPER_KEY;

//   if (process.env.GRAPH_HOPPER_ALTERNATES) {
//     // $FlowFixMe This is a bit of a hack and now how env variables are supposed to work, but the yaml loader supports it.
//     const alternates = process.env.GRAPH_HOPPER_ALTERNATES;
//     alternates.forEach((alternative) => {
//       const { BBOX } = alternative;
//       if (BBOX.length !== 4) {
//         console.warn("Invalid BBOX for GRAPH_HOPPER_ALTERNATIVE");
//         return;
//       }
//       if (!alternative.URL && !alternative.KEY) {
//         console.warn("No URL or key provided for alternative graphhopper server.");
//         return;
//       }

//       if (
//         points.every(
//           (point) =>
//             !coordIsOutOfBounds(
//               point,
//               L.latLngBounds([alternative.BBOX[1], alternative.BBOX[0]], [alternative.BBOX[3], alternative.BBOX[2]])
//             )
//         )
//       ) {
//         if (alternative.URL) {
//           graphHopperUrl = alternative.URL;
//         }
//         if (alternative.KEY) {
//           graphHopperKey = alternative.KEY;
//         }
//       }
//     });
//   }

//   const params = {
//     key: graphHopperKey,
//     vehicle: "car",
//     debug: true,
//     type: "json",
//   };
//   const locations = points.map((p) => `point=${p.lat},${p.lng}`).join("&");
//   // Avoiding motorways requires a POST request with a formatted body
//   //! Changed content
//   const graphHopperRequest = avoidMotorways
//     ? isomorphicFetch(`${graphHopperUrl}route?key=${params.key}`, {
//         body: JSON.stringify({
//           "ch.disable": true,
//           // Custom model disincentives motorways
//           custom_model: {
//             priority: [
//               {
//                 if: "road_class == MOTORWAY",
//                 multiply_by: 0.1,
//               },
//             ],
//           },
//           debug: params.debug,
//           points: points.map((p) => [p.lng, p.lat]),
//           profile: params.vehicle,
//         }),
//         headers: {
//           "Content-Type": "application/json",
//         },
//         method: "POST",
//       })
//     : isomorphicFetch(`${graphHopperUrl}route?${locations}&${qs.stringify(params)}`); //! Changed content

//   const response = graphHopperRequest.then((res) => res.json());
//   return response;
// }

//* ---------------------------------------------------------------------------------------------------------------------------
//! New content!!!
//* 1. Base function
const getValhallaData = async (points, individualLegs, avoidMotorways) => {
  const pointLimit = +process.env.VALHALLA_POINT_LIMIT
  // console.info({ pointLimit });

  try {
    const chunkedPoints = chunkArrayWithOverlap(points, pointLimit)
    // console.info("chunkedPoints:", chunkedPoints);

    const fetchPromises = await chunkedPoints.map((chunk) => {
      return fetchValhallaData(chunk, avoidMotorways)
    })
    // console.info("fetchPromises:", fetchPromises);

    const encodedResults = await Promise.all(fetchPromises)
    // console.info("encodedResults:", encodedResults);

    const decodedChunkedData = encodedResults
      .map((elem) => elem.shapes)
      .flat(1)
      .map((shape) => decodeValhallaPolyline(shape, 6))
    // console.info("decodedChunkedData:", decodedChunkedData);

    const decodedDataConverted = decodedChunkedData.map((data) => convertLatLon(data))
    // console.info("decodedDataConverted:", decodedDataConverted);

    // Todo: What is individualLegs for?
    const dataToReturn = individualLegs ? decodedDataConverted : decodedDataConverted
    // console.info({ dataToReturn });
    return dataToReturn
  } catch (error) {
    console.info('error:', error)
    alert('Error:', error.toString())
  }
}

//* 2. Fetch Valhalla data
const fetchValhallaData = async (points, avoidMotorways) => {
  // console.info("points:", points);
  const preparedPoints = preparePoints(points)
  // console.info("preparedPoints:", preparedPoints);
  // console.info({ avoidMotorways });

  const dataToFetch = {
    locations: preparedPoints,
    costing_options: {
      auto: {
        avoid_motorways: avoidMotorways
      }
    },
    costing: 'bus',
    units: 'kilometers'
  }

  const baseUrl = process.env.VALHALLA_URL
  // const params = {
  //   json: JSON.stringify(dataToFetch),
  // };

  try {
    //* V1 -> GET
    // const response = await fetch(`${baseUrl}?${new URLSearchParams(params)}`, {
    //   method: "GET",
    //   headers: {
    // "Content-Type": "application/json", //* Not Allowed on the server!
    //     Accept: "application/json",
    //   },
    // });

    //* V2 -> POST
    const response = await fetch(baseUrl, {
      method: 'POST', // Change to POST
      headers: {
        Accept: 'application/json'
      },
      body: JSON.stringify(dataToFetch)
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    const {
      trip: { legs }
    } = data

    const shapes = legs.map((leg) => leg.shape)
    // console.info({ shapes });
    return { shapes }
  } catch (error) {
    console.error('Error fetching directions:', error)
    alert('Error:', error.toString())
    return null
  }
}

//* 3. Decode Valhalla Polyline string: https://valhalla.github.io/valhalla/decoding/#javascript
const decodeValhallaPolyline = (encoded, precision = 6) => {
  const factor = Math.pow(10, precision)
  let index = 0
  let lat = 0
  let lng = 0
  const coordinates = []

  while (index < encoded.length) {
    let result = 0
    let shift = 0
    let byte

    // Decode latitude
    do {
      byte = encoded.charCodeAt(index++) - 63
      result |= (byte & 0x1f) << shift
      shift += 5
    } while (byte >= 0x20)

    const latitudeChange = result & 1 ? ~(result >> 1) : result >> 1
    lat += latitudeChange

    result = 0
    shift = 0

    // Decode longitude
    do {
      byte = encoded.charCodeAt(index++) - 63
      result |= (byte & 0x1f) << shift
      shift += 5
    } while (byte >= 0x20)

    const longitudeChange = result & 1 ? ~(result >> 1) : result >> 1
    lng += longitudeChange

    // Store the decoded coordinates
    coordinates.push([lat / factor, lng / factor])
  }

  return coordinates
}

//* 4. Conversion [lat, lon] -> [lon, lat] and Vice Versa
const convertLatLon = (points) => {
  const changedPoints = points.map((point) => [point[1], point[0]])
  return changedPoints
}

//* 5. Helper function - divide to overlapping chunks
const chunkArrayWithOverlap = (array, chunkSize) => {
  const result = []
  for (let i = 0; i < array.length; i += chunkSize - 1) {
    result.push(array.slice(i, i + chunkSize))
  }
  return result.filter((elem) => elem.length >= 2)
}

//* 6 - Helper function prepare point data
const preparePoints = (points) => {
  const reversedPoints = points.map((point) => {
    return { lat: point.lat, lon: point.lng }
  })
  return reversedPoints
}
