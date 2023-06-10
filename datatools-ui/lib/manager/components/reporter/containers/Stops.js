// @flow

import {connect} from 'react-redux'

import StopLayout from '../components/StopLayout'
import {updatePatternFilter} from '../../../../gtfs/actions/filter'
import {
  patternDateTimeFilterChange,
  patternRouteFilterChange
} from '../../../../gtfs/actions/patterns'
import {fetchRoutes} from '../../../../gtfs/actions/routes'
import {getFilteredStops} from '../../../selectors'

import type {FeedVersion} from '../../../../types'
import type {AppState} from '../../../../types/reducers'

export type Props = {
  selectTab: (string) => void,
  tableOptions: any,
  version: FeedVersion
}

const mapStateToProps = (state: AppState, ownProps: Props) => {
  const {gtfs} = state
  const {filter, patterns, routes} = gtfs
  const {patternFilter, routeFilter} = filter

  return {
    patternFilter,
    patterns: patterns.data.patterns,
    routeFilter,
    routes: routes.allRoutes,
    stops: getFilteredStops(state)
  }
}

const mapDispatchToProps = {
  fetchRoutes,
  patternDateTimeFilterChange,
  patternRouteFilterChange,
  updatePatternFilter
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StopLayout)
