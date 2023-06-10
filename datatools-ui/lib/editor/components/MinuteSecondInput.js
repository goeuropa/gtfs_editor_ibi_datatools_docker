// @flow

import React, {Component} from 'react'
import {FormControl} from 'react-bootstrap'

import {
  convertSecondsToMMSSString,
  convertMMSSStringToSeconds
} from '../../common/util/date-time'

import type {Style} from '../../types'

type Props = {
  disabled?: boolean,
  onChange: number => void,
  seconds: number,
  style?: Style
}

type State = {
  seconds: number,
  string: string
}

const _getState = (seconds: number) => ({
  seconds: typeof seconds === 'undefined' ? 0 : seconds,
  string: convertSecondsToMMSSString(seconds)
})

export default class MinuteSecondInput extends Component<Props, State> {
  componentWillMount () {
    this.setState(_getState(this.props.seconds))
  }

  componentWillReceiveProps (nextProps: Props) {
    if (typeof nextProps.seconds !== 'undefined' && this.state.seconds !== nextProps.seconds) {
      this.setState(_getState(nextProps.seconds))
    }
  }

  _onChange = (evt: SyntheticInputEvent<HTMLInputElement>) => {
    const {onChange} = this.props
    const {value} = evt.target
    const seconds = convertMMSSStringToSeconds(value)
    if (seconds === this.state.seconds) {
      this.setState({string: value})
    } else {
      this.setState({seconds, string: value})
      onChange && onChange(seconds)
    }
  }

  render () {
    const {seconds, string} = this.state
    return (
      <FormControl
        defaultValue={
          typeof string !== 'undefined'
            ? string
            : convertSecondsToMMSSString(seconds)
        }
        placeholder={'mm:ss'}
        style={this.props.style}
        disabled={this.props.disabled}
        onChange={this._onChange} />
    )
  }
}
