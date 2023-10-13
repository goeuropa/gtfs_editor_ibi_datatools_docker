// @flow

import type {AdminActions} from '../admin/actions/admin'
import type {OrganizationsActions} from '../admin/actions/organizations'
import type {ActiveAlertActions} from '../alerts/actions/activeAlert'
import type {AlertsActions} from '../alerts/actions/alerts'
import type {AlertVisibilityFilterActions} from '../alerts/actions/visibilityFilter'
import type {EditorActiveActions} from '../editor/actions/active'
import type {EditorActions} from '../editor/actions/editor'
import type {SnapshotActions} from '../editor/actions/snapshots'
import type {EditorTripActions} from '../editor/actions/trip'
import type {EditorTripPatternActions} from '../editor/actions/tripPattern'
import type {EditorMapActions} from '../editor/actions/map'
import type {GtfsFilterActions} from '../gtfs/actions/filter'
import type {GtfsGeneralActions} from '../gtfs/actions/general'
import type {GtfsPatternActions} from '../gtfs/actions/patterns'
import type {RouteActions} from '../gtfs/actions/routes'
import type {GtfsShapesActions} from '../gtfs/actions/shapes'
import type {GtfsTimetableActions} from '../gtfs/actions/timetables'
import type {DeploymentActions} from '../manager/actions/deployments'
import type {FeedActions} from '../manager/actions/feeds'
import type {LanguageActions} from '../manager/actions/languages'
import type {NoteActions} from '../manager/actions/notes'
import type {ProjectActions} from '../manager/actions/projects'
import type {StatusActions} from '../manager/actions/status'
import type {UserActions} from '../manager/actions/user'
import type {VersionActions} from '../manager/actions/versions'
import type {VisibilityFilterActions} from '../manager/actions/visibilityFilter'

// currently we export a generic action because of a bug in flow
// that makes type checking reducers not work
// Bug has been reported here: https://github.com/facebook/flow/issues/6782
// See datatools-ui issue here: https://github.com/catalogueglobal/datatools-ui/issues/181
export type Action = {
  payload: any,
  type: string
}

export type Action2 = ActiveAlertActions |
  AdminActions |
  AlertsActions |
  AlertVisibilityFilterActions |
  DeploymentActions |
  EditorActions |
  EditorMapActions |
  EditorActiveActions |
  EditorTripActions |
  EditorTripPatternActions |
  FeedActions |
  GtfsFilterActions |
  GtfsGeneralActions |
  GtfsPatternActions |
  GtfsShapesActions |
  GtfsTimetableActions |
  LanguageActions |
  NoteActions |
  OrganizationsActions |
  ProjectActions |
  RouteActions |
  SnapshotActions |
  StatusActions |
  UserActions |
  VersionActions |
  VisibilityFilterActions
