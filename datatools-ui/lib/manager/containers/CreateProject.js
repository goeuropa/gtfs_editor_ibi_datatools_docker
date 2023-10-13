// @flow

import { connect } from 'react-redux'

import { createProject } from '../actions/projects'
import CreateProject from '../components/CreateProject'

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user
  }
}

const mapDispatchToProps = {
  createProject
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateProject)
