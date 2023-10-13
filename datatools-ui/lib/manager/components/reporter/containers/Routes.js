// @flow

import {connect} from 'react-redux'

import RouteLayout from '../components/RouteLayout'
import {fetchRoutes, fetchRouteDetails, routeOffsetChange} from '../../../../gtfs/actions/routes'
import {patternRouteFilterChange} from '../../../../gtfs/actions/patterns'
import {getRouteData} from '../../../selectors'

import type {FeedVersion} from '../../../../types'
import type {AppState} from '../../../../types/reducers'

export type Props = {
  selectTab: string => void,
  version: FeedVersion
}

const mapStateToProps = (state: AppState, ownProps: Props) => {
  const {namespace} = ownProps.version
  const {gtfs} = state
  const {filter, routes} = gtfs
  const {routeOffset} = filter
  const {data, fetchStatus} = routes.routeDetails

  return {
    fetchStatus,
    namespace,
    allRoutes: state.gtfs.routes.allRoutes,
    numRoutes: data ? data.numRoutes : 0,
    routeData: getRouteData(state),
    routeOffset
  }
}

const mapDispatchToProps = {
  fetchRouteDetails,
  fetchRoutes,
  patternRouteFilterChange,
  routeOffsetChange
}

const Routes = connect(
  mapStateToProps,
  mapDispatchToProps
)(RouteLayout)

export default Routes
