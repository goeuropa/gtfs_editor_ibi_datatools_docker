// @flow

import { connect } from 'react-redux'

import GtfsFilter from '../components/GtfsFilter'
import {
  addActiveFeed,
  removeActiveFeed,
  addAllActiveFeeds,
  removeAllActiveFeeds
} from '../actions/filter'
import {getActiveProject} from '../../manager/selectors'
import {getActiveFeeds, getPublishedFeeds, getActiveAndLoadedFeeds, getAllFeeds} from '../../gtfs/selectors'

import type {AppState} from '../../types/reducers'

export type Props = {}

const mapStateToProps = (state: AppState, ownProps: Props) => {
  return {
    activeFeeds: getActiveFeeds(state),
    allFeeds: getAllFeeds(state),
    activeAndLoadedFeeds: getActiveAndLoadedFeeds(state),
    loadedFeeds: getPublishedFeeds(state),
    user: state.user,
    project: getActiveProject(state)
  }
}

const mapDispatchToProps = {
  addActiveFeed,
  addAllActiveFeeds,
  removeActiveFeed,
  removeAllActiveFeeds
}

const GlobalGtfsFilter = connect(mapStateToProps, mapDispatchToProps)(GtfsFilter)

export default GlobalGtfsFilter
