// @flow

import {connect} from 'react-redux'

import GtfsMap from '../components/GtfsMap'
import {refreshGtfsElements} from '../actions/general'
import {updateMapState} from '../actions/filter'
import {getFilteredStops} from '../../manager/selectors'

import type {
  Feed,
  FeedVersion,
  GtfsRoute,
  GtfsStop
} from '../../types'
import type {AppState} from '../../types/reducers'

export type Props = {
  bounds?: Array<Array<number>>,
  disableRefresh?: boolean,
  disableScroll?: boolean,
  entities?: Array<string>,
  feeds?: Array<Feed>,
  height: number, // only px
  isochroneBand?: number,
  newEntityId?: number,
  onRouteClick?: (feed: Feed, route: GtfsRoute) => void,
  onStopClick?: ({entities: Array<GtfsStop>, feed: Feed}) => void,
  pattern?: any,
  popupActionPrefix?: string,
  renderTransferPerformance?: boolean,
  searchFocus?: string | null,
  showBounds?: boolean,
  showIsochrones?: boolean,
  showPatterns?: boolean,
  showStops?: boolean,
  stop?: any, // TODO: use more exact type
  version: ?FeedVersion,
  width: string // % or px
}

const mapStateToProps = (state: AppState, ownProps: Props) => {
  const {gtfs, ui} = state
  const {filter, patterns, routes, shapes} = gtfs
  const {dateTimeFilter, map, patternFilter, showAllRoutesOnMap} = filter
  return {
    dateTime: dateTimeFilter,
    mapState: map,
    patternFilter,
    patterns: patterns.data.patterns,
    routes: routes.allRoutes.data,
    shapes,
    showAllRoutesOnMap,
    sidebarExpanded: ui.sidebarExpanded,
    // If rendering GTFS map for a single feed version, use filtered stops
    // (from pattern or route currently displayed). Otherwise, if using map
    // for alerts, pass the stops taken from the stops reducer (map bounds
    // search).
    stops: ownProps.version ? getFilteredStops(state) : gtfs.stops.data
  }
}

const mapDispatchToProps = {
  refreshGtfsElements,
  updateMapState
}

const ActiveGtfsMap = connect(
  mapStateToProps,
  mapDispatchToProps
)(GtfsMap)

export default ActiveGtfsMap
