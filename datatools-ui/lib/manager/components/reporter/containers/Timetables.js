// @flow

import {connect} from 'react-redux'

import TimetableLayout from '../components/TimetableLayout'
import {fetchRoutes} from '../../../../gtfs/actions/routes'
import {
  fetchTimetablesWithFilters,
  timetableDateTimeFilterChange,
  timetablePatternFilterChange,
  timetableRouteFilterChange,
  timetableShowArrivalToggle,
  timetableTimepointToggle
} from '../../../../gtfs/actions/timetables'
import {getTimetableData} from '../../../selectors'

import type {FeedVersion} from '../../../../types'
import type {AppState} from '../../../../types/reducers'

export type Props = {
  selectTab: string => void,
  tableOptions: any,
  version: FeedVersion
}

const mapStateToProps = (state: AppState, ownProps: Props) => {
  const {gtfs} = state
  const {
    filter,
    patterns,
    routes,
    timetables
  } = gtfs

  return {
    filter,
    patterns,
    routes: routes.allRoutes,
    timetables,
    timetableTableData: getTimetableData(state)
  }
}

const mapDispatchToProps = {
  fetchRoutes,
  fetchTimetablesWithFilters,
  timetableDateTimeFilterChange,
  timetablePatternFilterChange,
  timetableRouteFilterChange,
  timetableShowArrivalToggle,
  timetableTimepointToggle
}

export default connect(mapStateToProps, mapDispatchToProps)(TimetableLayout)
