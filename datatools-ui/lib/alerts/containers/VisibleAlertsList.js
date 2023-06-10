// @flow

import {connect} from 'react-redux'

import {
  editAlert,
  deleteAlert
} from '../actions/alerts'
import {
  setAlertAgencyFilter,
  setAlertSort,
  setVisibilityFilter,
  setVisibilitySearchText
} from '../actions/visibilityFilter'
import {getFeedsForPermission} from '../../common/util/permissions'
import AlertsList from '../components/AlertsList'
import {getActiveProject} from '../../manager/selectors'
import {getVisibleAlerts} from '../selectors'

import type {AppState} from '../../types/reducers'

export type Props = {}

const mapStateToProps = (state: AppState, ownProps: Props) => {
  const activeProject = getActiveProject(state)
  return {
    alerts: getVisibleAlerts(state),
    editableFeeds: getFeedsForPermission(activeProject, state.user, 'edit-alert'),
    feeds: activeProject && activeProject.feedSources ? activeProject.feedSources : [],
    fetched: state.alerts.fetched,
    filterCounts: state.alerts.counts,
    isFetching: state.alerts.isFetching,
    publishableFeeds: getFeedsForPermission(activeProject, state.user, 'approve-alert'),
    visibilityFilter: state.alerts.filter
  }
}

const mapDispatchToProps = {
  deleteAlert,
  editAlert,
  setAlertAgencyFilter,
  setAlertSort,
  setVisibilityFilter,
  setVisibilitySearchText
}

const VisibleAlertsList = connect(mapStateToProps, mapDispatchToProps)(AlertsList)

export default VisibleAlertsList
