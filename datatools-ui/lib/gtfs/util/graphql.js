// @flow

export const feed = `
query feedQuery($namespace: String) {
  feeds (namespace: $namespace) {
    namespace,
    # feed_publisher_name,
    # feed_publisher_url,
    # feed_lang,
    # feed_version,
    # route_count,
    # stop_count,
    mergedBuffer
  }
}
`

export const allRoutes = `
query allRoutesQuery($namespace: String) {
  feed(namespace: $namespace) {
    routes (limit: -1) {
      route_id
      route_short_name
      route_long_name
    }
  }
}
`

export const routeDetails = `
query routeDetailsQuery(
  $date: String,
  $namespace: String,
  $routeLimit: Int,
  $routeOffset: Int
) {
  feed(namespace: $namespace) {
    row_counts {
      routes
    }
    routes (limit: $routeLimit, offset: $routeOffset) {
      route_id
      route_short_name
      route_long_name
      route_desc
      stops (limit: -1) {
        stop_id
      }
      trips (limit: -1, date: $date) {
        pattern_id
        stop_times(limit: 1) {
          arrival_time
          departure_time
        }
        frequencies (limit: -1) {
          start_time
          end_time
          headway_secs
          exact_times
        }
      }
    }
  }
}
`

export const patternsForRoute = `
query patternsForRouteQuery(
  $namespace: String,
  $routeId: [String]
) {
  feed (namespace: $namespace) {
    routes (route_id: $routeId) {
      route_id
      route_short_name
      route_long_name
      route_type
      patterns (limit: -1) {
        pattern_id,
        name,
        shape (limit: -1) {
          lat: shape_pt_lat
          lon: shape_pt_lon
        }
      }
    }
  }
}
`

export const patterns = `
query patternsQuery(
  $date: String,
  $namespace: String,
  $routeId: [String]
) {
  feed (namespace: $namespace) {
    routes (route_id: $routeId) {
      route_id,
      route_short_name,
      route_long_name,
      patterns (limit: -1) {
        pattern_id,
        name,
        shape (limit: -1) {
          lat: shape_pt_lat
          lon: shape_pt_lon
        },
        stops (limit: -1) {
          stop_id
        }
        trips (
          date: $date,
          limit: -1
        ) {
          frequencies (limit: -1) {
            start_time
            end_time
            headway_secs
            exact_times
          }
          stop_times (limit: 1) {
            arrival_time
            departure_time
          }
        }
      }
      stops (limit: -1) {
        location_type
        stop_code
        stop_desc
        stop_id
        stop_lat
        stop_lon
        stop_name
        stop_url
        wheelchair_boarding
        zone_id
      }
    }
  }
}
`

export const stops = `
  query allStopsQuery($namespace: String) {
    stops(namespace: $namespace) {
      stops {
        stop_id,
        stop_name,
        stop_code,
        stop_desc,
        stop_lon,
        stop_lat,
        zone_id,
        stop_url,
        stop_timezone
      }
    }
  }
  `

export const timetables = `
query timetablesQuery(
  $namespace: String,
  $patternId: [String],
  $date: String,
  $from: Int,
  $to: Int
) {
  feed(namespace: $namespace) {
    patterns(pattern_id: $patternId) {
      stops(limit: -1) {
        stop_id
        stop_name
      }
      trips(date: $date, from: $from, to: $to, limit: -1) {
        direction_id
        pattern_id
        service_id
        stop_times(limit: -1) {
          arrival_time
          departure_time
          stop_id
          stop_sequence
          timepoint
        }
        trip_headsign
        trip_id
        trip_short_name
      }
    }
  }
}`

export const shapes = `
query shapesQuery ($namespace: String) {
  feed(namespace: $namespace) {
    shapes_as_polylines {
      shape_id
      polyline
    }
  }
}
`

export const allStops = `
query allStopsQuery($namespace: String) {
  stops(namespace: $namespace) {
    stops {
      stop_id,
      stop_name,
      stop_name,
      stop_code,
      stop_desc,
      stop_lon,
      stop_lat,
      zone_id,
      stop_url,
      stop_timezone
    }
  }
}
`

// FIXME: allows for multiple feedIds
export const patternsAndStopsForBoundingBox = (
  namespace: string,
  entities: Array<string>,
  maxLat: number,
  maxLon: number,
  minLat: number,
  minLon: number
) => `
  query patternsAndStopsGeo($namespace: String, $maxLat: Float, $maxLon: Float, $minLat: Float, $minLon: Float){
    feed (namespace: $namespace) {
  ${entities.indexOf('stops') !== -1
    ? `stops(limit: 100, maxLat: $maxLat, maxLon: $maxLon, minLat: $minLat, minLon: $minLon){
        stop_id,
        stop_code,
        stop_name,
        stop_desc,
        stop_lat,
        stop_lon
        child_stops {
          stop_id
          stop_name
          stop_code
        }
      }`
    : ''}
  ${entities.indexOf('routes') !== -1
    ? `patterns(limit: 10, maxLat: $maxLat, maxLon: $maxLon, minLat: $minLat, minLon: $minLon){
        id
        pattern_id
        route_id
        route {
          route_id
          route_long_name
          route_short_name
        }
        shape (limit: -1) {
          lat: shape_pt_lat
          lon: shape_pt_lon
        }
      }`
    : ''}
    }
  }
`

// for use in entity fetching for alerts and gtfsplus
// FIXME: Check that array length (if array) is greater than 0. Otherwise, we
// shouldn't try to fetch those entities.
export const stopsAndRoutes = (namespace: string, routeId: ?string | ?string[], stopId: ?string | ?string[]) => `
  query routeStopQuery($namespace: String, ${routeId ? '$routeId: [String],' : ''}, ${stopId ? '$stopId: [String],' : ''}){
    feed(namespace: $namespace){
      namespace,
  ${stopId
    ? `stops (limit: -1, stop_id: $stopId){
        stop_id,
        stop_name,
        stop_code
        child_stops {
          stop_id,
          stop_name,
          stop_code
        }
      },`
    : ''}
  ${routeId
    ? `routes(limit: -1, route_id: $routeId){
        route_id,
        route_short_name,
        route_long_name,
      },`
    : ''}
    }
  }
`

// FIXME: Stop stats are not supported yet in gtfs-api, so this is broken.
// TODO: add back in patternId filter
export function stopsFiltered (
  namespace: ?string,
  routeId: ?string,
  patternId: ?string,
  date: string,
  from: number,
  to: number
) {
  const hasFrom = typeof from !== 'undefined' && from !== null
  const hasTo = typeof to !== 'undefined' && to !== null
  const query = `
  query filteredStopsQuery(
    ${namespace ? '$namespace: String,' : ''}
    ${routeId ? '$routeId: [String],' : ''}
    ${patternId ? '$patternId: [String],' : ''}
    # ${date ? '$date: String,' : ''}
    # ${hasFrom ? '$from: Long,' : ''}
    # ${hasTo ? '$to: Long' : ''}
    ) {
    feed(${namespace ? 'namespace: $namespace' : ''}) {
      ${patternId ? 'patterns' : routeId ? 'routes' : 'stops'}
        (${routeId ? 'route_id: $routeId,' : ''} ${patternId ? 'pattern_id: $patternId' : ''}) {
        stops (limit: -1) {
          stop_id,
          stop_name,
          stop_name,
          stop_code,
          stop_desc,
          stop_lon,
          stop_lat,
${date && hasFrom && hasTo
    ? `# stats(date: $date, from: $from, to: $to){
    #   headway,
    #   tripCount
    # },
    # transferPerformance(date: $date, from: $from, to: $to){
    #   fromRoute,
    #   toRoute,
    #   bestCase,
    #   worstCase,
    #   typicalCase
    # },
    `
    : ''}
          # zone_id,
          # stop_url,
          # stop_timezone
        }
      }
    }
  }
  `
  return query
}

export const routeSearch = (filterStopsByRoute: boolean = false, limit?: number) => `routes (
  ${limit ? `limit: ${limit}` : ''},
  ${filterStopsByRoute ? 'route_id: $routeId' : 'search: $search'}
) {
    route_id
    route_long_name
    route_short_name
    ${filterStopsByRoute ? stopSearch() : ''}
  }`

/**
 * Constructs a query for stops with a search string variable OR a search for
 * routes for a given stop ID if stop filter provided.
 */
export const stopSearch = (filterRoutesByStop: boolean = false, limit?: number) => `stops (
  ${limit ? `limit: ${limit}` : ''},
  ${filterRoutesByStop ? 'stop_id: $stopId' : 'search: $search'}
) {
    stop_id
    stop_name
    stop_lat
    stop_lon
    stop_code
    child_stops {
      stop_id
      stop_name
      stop_code
    }
    ${filterRoutesByStop ? routeSearch() : ''}
  }`
