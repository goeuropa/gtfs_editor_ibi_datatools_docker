// @flow

import {connect} from 'react-redux'

import PatternLayout from '../components/PatternLayout'
import {updatePatternFilter} from '../../../../gtfs/actions/filter'
import {
  patternDateTimeFilterChange,
  patternRouteFilterChange
} from '../../../../gtfs/actions/patterns'
import {fetchRoutes} from '../../../../gtfs/actions/routes'
import {timetablePatternFilterChange} from '../../../../gtfs/actions/timetables'
import {getPatternData} from '../../../selectors'

import type {FeedVersion} from '../../../../types'
import type {AppState} from '../../../../types/reducers'

export type Props = {
  selectTab: string => void,
  version: FeedVersion
}

const mapStateToProps = (state: AppState, ownProps: Props) => {
  return {
    fetchStatus: state.gtfs.patterns.fetchStatus,
    namespace: ownProps.version.namespace,
    routes: state.gtfs.routes.allRoutes,
    routeFilter: state.gtfs.filter.routeFilter,
    patternData: getPatternData(state)
  }
}

const mapDispatchToProps = {
  fetchRoutes,
  patternDateTimeFilterChange,
  patternRouteFilterChange,
  timetablePatternFilterChange,
  updatePatternFilter
}

const Patterns = connect(
  mapStateToProps,
  mapDispatchToProps
)(PatternLayout)

export default Patterns
