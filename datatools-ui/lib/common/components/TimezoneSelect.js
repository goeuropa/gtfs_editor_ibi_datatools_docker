// @flow

import React, {Component} from 'react'
import { shallowEqual } from 'react-pure-render'
import Select from 'react-select'

import {getComponentMessages} from '../util/config'
import timezones from '../util/timezones'

type Option = {label: string, value: string}

type Props = {
  clearable?: boolean,
  onChange: Option => void,
  placeholder?: string,
  value: ?string
}

type State = {value: ?(string | Option)}

export default class TimezoneSelect extends Component<Props, State> {
  messages = getComponentMessages('TimezoneSelect')

  componentWillMount () {
    this.setState({
      value: this.props.value
    })
  }

  componentWillReceiveProps (nextProps: Props) {
    if (!shallowEqual(nextProps.value, this.props.value)) {
      this.setState({value: nextProps.value})
    }
  }

  onChange = (value: Option) => {
    const {onChange} = this.props
    this.setState({value})
    onChange && onChange(value)
  }

  render () {
    const {clearable, placeholder} = this.props
    const options = timezones.map(tz => ({value: tz, label: tz}))
    return (
      <Select
        ref='tzSelect'
        style={{marginBottom: '20px'}}
        filterOptions
        clearable={clearable}
        placeholder={placeholder || this.messages('placeholder')}
        options={options}
        value={this.state.value}
        onChange={this.onChange} />
    )
  }
}
