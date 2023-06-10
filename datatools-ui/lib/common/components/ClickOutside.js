// @flow

import * as React from 'react'

type Props = {
  children: React.Node,
  onClickOutside: (MouseEvent | KeyboardEvent) => void
}

/**
 * Wrapper component that detects click or key press (ESC) and calls
 * onClickOutside function in response.
 */
export default class ClickOutside extends React.Component<Props> {
  container = null

  componentDidMount () {
    document.addEventListener('click', this.handle, true)
    document.addEventListener('keydown', this.handleKeyDown, true)
  }

  componentWillUnmount () {
    document.removeEventListener('click', this.handle, true)
    document.removeEventListener('keydown', this.handleKeyDown, true)
  }

  handle = (e: MouseEvent) => {
    const {onClickOutside} = this.props
    const el = this.container
    // $FlowFixMe
    if (!el.contains(e.target)) onClickOutside(e)
  }

  handleKeyDown = (e: KeyboardEvent) => {
    const {onClickOutside} = this.props
    // Handle ESC key press
    if (e.keyCode === 27) onClickOutside(e)
  }

  render () {
    const {children, onClickOutside, ...props} = this.props
    return <div
      {...props}
      ref={(ref) => { this.container = ref }}>
      {children}
    </div>
  }
}
