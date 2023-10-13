// @flow

import {connect} from 'react-redux'

import {toggleShowAllRoutesOnMap} from '../actions/shapes'
import ShowAllRoutesOnMapFilter from '../components/ShowAllRoutesOnMapFilter'

import type {FeedVersion} from '../../types'
import type {AppState} from '../../types/reducers'

export type Props = {version: FeedVersion}

const mapStateToProps = (state: AppState, ownProps: Props) => {
  return {
    fetchStatus: state.gtfs.shapes.fetchStatus,
    showAllRoutesOnMap: state.gtfs.filter.showAllRoutesOnMap
  }
}

const mapDispatchToProps = {
  toggleShowAllRoutesOnMap
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShowAllRoutesOnMapFilter)
