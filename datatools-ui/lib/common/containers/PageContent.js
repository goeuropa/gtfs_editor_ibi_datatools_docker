// @flow

import * as React from 'react'
import {connect} from 'react-redux'

import type {AppState} from '../../types/reducers'

type ContainerProps = {
  children: React.Node
}

type Props = ContainerProps & {
  sidebarExpanded: boolean
}

class Content extends React.Component<Props> {
  render () {
    return (
      <div style={{
        position: 'fixed',
        left: this.props.sidebarExpanded ? 130 : 50,
        right: 0,
        bottom: 0,
        top: 0,
        overflowY: 'scroll',
        overflowX: 'hidden'
      }}>
        {this.props.children}
      </div>
    )
  }
}

const mapStateToProps = (state: AppState, ownProps: ContainerProps) => {
  return {
    sidebarExpanded: state.ui.sidebarExpanded
  }
}

const mapDispatchToProps = {}

var PageContent = connect(
  mapStateToProps,
  mapDispatchToProps
)(Content)

export default PageContent
