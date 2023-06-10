// @flow

import {connect} from 'react-redux'

import FeedSourceViewer from '../components/FeedSourceViewer'
import {
  onFeedSourceViewerMount,
  deleteFeedSource,
  updateExternalFeedResource,
  updateFeedSource
} from '../actions/feeds'
import {
  deleteFeedVersion,
  downloadFeedViaToken,
  uploadFeed,
  renameFeedVersion
} from '../actions/versions'
import {
  fetchNotesForFeedSource,
  fetchNotesForFeedVersion,
  postNoteForFeedSource,
  postNoteForFeedVersion
} from '../actions/notes'
import {loadFeedVersionForEditing} from '../../editor/actions/snapshots'
import {downloadGtfsPlusFeed} from '../../gtfsplus/actions/gtfsplus'
import {updateTargetForSubscription} from '../../manager/actions/user'
import {createDeploymentFromFeedSource} from '../../manager/actions/deployments'

import type {AppState, RouterProps} from '../../types/reducers'

export type Props = RouterProps

const mapStateToProps = (state: AppState, ownProps: Props) => {
  const {
    subpage: activeComponent,
    subsubpage: activeSubComponent,
    feedSourceId
  } = ownProps.routeParams
  const {all, isFetching} = state.projects
  const {user} = state
  // Helper function to find feed source.
  const findFeed = feedSource => feedSource.id === feedSourceId
  // Find the containing project
  const project = all
    ? all.find(p => p.feedSources && p.feedSources.findIndex(findFeed) !== -1)
    : null
  // Find the feed source
  const feedSource = (project && project.feedSources)
    ? project.feedSources.find(findFeed)
    : null
  return {
    feedSource,
    feedSourceId,
    activeComponent,
    activeSubComponent,
    project,
    user,
    isFetching
  }
}

const mapDispatchToProps = {
  createDeploymentFromFeedSource,
  deleteFeedSource,
  deleteFeedVersion,
  downloadFeedViaToken,
  downloadGtfsPlusFeed,
  fetchNotesForFeedSource,
  fetchNotesForFeedVersion,
  loadFeedVersionForEditing,
  onFeedSourceViewerMount,
  postNoteForFeedSource,
  postNoteForFeedVersion,
  renameFeedVersion,
  updateExternalFeedResource,
  updateFeedSource,
  updateTargetForSubscription,
  uploadFeed
}

const ActiveFeedSourceViewer = connect(mapStateToProps, mapDispatchToProps)(
  FeedSourceViewer
)

export default ActiveFeedSourceViewer
