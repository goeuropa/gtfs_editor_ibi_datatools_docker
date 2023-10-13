// @flow

import {Component} from 'react'

type Props = {
  children: string
}

export default class Title extends Component<Props> {
  oldTitle = ''

  componentWillMount () {
    this.oldTitle = document.title
    document.title = this.props.children
  }

  componentWillUnmount () {
    document.title = this.oldTitle
  }

  componentWillReceiveProps (nextProps: Props) {
    if (nextProps.children !== this.props.children) {
      document.title = nextProps.children
    }
  }

  shouldComponentUpdate (nextProps: Props) {
    // Never update the component when the title changes.
    return false
  }

  render () {
    return null
  }
}
