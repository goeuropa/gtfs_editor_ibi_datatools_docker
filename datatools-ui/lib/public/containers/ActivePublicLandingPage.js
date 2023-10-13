// @flow

import { connect } from 'react-redux'

import PublicLandingPage from '../components/PublicLandingPage'
import { setVisibilitySearchText } from '../../manager/actions/visibilityFilter'
import { fetchProjects } from '../../manager/actions/projects'

import type { AppState, RouterProps } from '../../types/reducers'

export type Props = RouterProps

const mapStateToProps = (state: AppState, ownProps: Props) => {
  return {
    visibilitySearchText: state.projects.filter.searchText,
    projects: state.projects.all,
    user: state.user
  }
}

const mapDispatchToProps = {
  fetchProjects,
  setVisibilitySearchText
}

const ActivePublicLandingPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(PublicLandingPage)

export default ActivePublicLandingPage
