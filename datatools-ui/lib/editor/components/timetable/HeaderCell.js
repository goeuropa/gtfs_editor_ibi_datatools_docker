// @flow

import React, {Component} from 'react'

import * as tripActions from '../../actions/trip'

// can't do this inline down below, so they are separated out here
type toggleAllRowsActionType = typeof tripActions.toggleAllRows
type toggleRowSelectionActionType = typeof tripActions.toggleRowSelection

type Props = {
  active: boolean,
  index: number,
  label: string,
  onChange?: toggleAllRowsActionType | toggleRowSelectionActionType,
  selectable?: boolean,
  style: {[string]: number | string},
  title?: string
}

type State = {
  active: boolean
}

const EDGE_DIFF = 0.5

export default class HeaderCell extends Component<Props, State> {
  static defaultProps = {
    active: false,
    index: 0,
    label: ''
  }

  componentWillMount () {
    this.setState({
      active: this.props.active
    })
  }

  componentWillReceiveProps (nextProps: Props) {
    const { active } = nextProps
    if (this.state.active !== active) {
      this.setState({active})
    }
  }

  _handleClick = () => {
    const {index, selectable, onChange} = this.props
    if (selectable) {
      this.setState({active: !this.state.active})
      onChange && onChange({active: !this.state.active, rowIndex: index})
    }
  }

  _handleKeyDown = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
    if (document.activeElement === e.target && e.which === 13) {
      this._handleClick()
    }
  }

  render () {
    const {label, selectable, style, title} = this.props
    const componentStyle = {
      backgroundColor: this.state.active ? '#A8D4BB' : '#eee',
      border: '1px solid #ddd',
      margin: `${-0.5 + EDGE_DIFF}px`,
      padding: `${-EDGE_DIFF}px`,
      UserSelect: 'none',
      userSelect: 'none',
      paddingTop: '6px',
      cursor: selectable ? 'pointer' : 'default',
      ...style
    }
    return (
      <div
        className='text-center small'
        tabIndex={0}
        title={title}
        role='button'
        style={componentStyle}
        onClick={this._handleClick}
        onKeyDown={this._handleKeyDown}>
        {label}
      </div>
    )
  }
}
