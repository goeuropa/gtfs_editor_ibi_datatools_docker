// @flow

import { connect } from 'react-redux'

import StatusMessage from '../components/StatusMessage'

import type {AppState} from '../../types/reducers'

export type Props = {}

const mapStateToProps = (state: AppState, ownProps: Props) => {
  return {
    message: state.status.message,
    sidebarExpanded: state.ui.sidebarExpanded
  }
}

var CurrentStatusMessage = connect(
  mapStateToProps
)(StatusMessage)

export default CurrentStatusMessage
