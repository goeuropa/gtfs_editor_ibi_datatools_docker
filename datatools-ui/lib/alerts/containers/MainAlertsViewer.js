// @flow

import { connect } from 'react-redux'

import {createAlert, fetchRtdAlerts, onAlertsViewerMount} from '../actions/alerts'
import {addActiveEntity} from '../actions/activeAlert'
import AlertsViewer from '../components/AlertsViewer'
import {getActiveAndLoadedFeeds} from '../../gtfs/selectors'
import {getActiveProject} from '../../manager/selectors'

import type {AppState, RouterProps} from '../../types/reducers'

export type Props = RouterProps

const mapStateToProps = (state: AppState, ownProps: Props) => {
  return {
    activeFeeds: getActiveAndLoadedFeeds(state),
    alerts: state.alerts.all,
    fetched: state.alerts.fetched,
    isFetching: state.alerts.isFetching,
    permissionFilter: state.gtfs.filter.permissionFilter,
    project: getActiveProject(state),
    user: state.user
  }
}

const mapDispatchToProps = {
  addActiveEntity,
  createAlert,
  fetchRtdAlerts,
  onAlertsViewerMount
}

const MainAlertsViewer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AlertsViewer)

export default MainAlertsViewer
