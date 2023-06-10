// @flow

import React from 'react'
import {
  Checkbox,
  Col,
  ControlLabel,
  FormControl,
  FormGroup
} from 'react-bootstrap'

import {getComponentMessages} from '../../common/util/config'
import type {FormProps} from '../../types'

type Props = {
  field: FormProps,
  messageRoot?: string,
  onChange: any,
  shouldRender: () => boolean,
  value?: any
}

export default class FormInput extends React.Component<Props> {
  static defaultProps = {
    shouldRender: () => true
  }

  messages = getComponentMessages('FormInput')

  getPrefix = () => {
    const {messageRoot} = this.props
    return messageRoot ? `${messageRoot}.` : ''
  }

  renderCheckbox = () => {
    const { field, onChange, value } = this.props
    return (
      <FormGroup>
        <Checkbox checked={value} name={field.name} onChange={onChange}>
          {this.messages(`${this.getPrefix()}${field.name}`)}
          {field.required ? ' *' : ''}
        </Checkbox>
      </FormGroup>
    )
  }

  renderLabelAndFormControl = () => {
    const {field, onChange, value} = this.props
    const {effects, split, ...fieldProps} = field
    const prefix = this.getPrefix()
    const isSelect = field.type.indexOf('select') !== -1
    return (
      <FormGroup>
        <ControlLabel>
          {this.messages(`${prefix}${field.name}`)}
          {field.required ? ' *' : ''}
        </ControlLabel>
        <FormControl
          value={value === null ? '' : value}
          {...fieldProps}
          placeholder={isSelect
            ? undefined
            : field.placeholder || this.messages(`${prefix}${field.name}Placeholder`)
          }
          name={field.name}
          children={field.children
            ? field.children.sort((a, b) => {
              if (a.value < b.value) return -1
              if (a.value > b.value) return 1
              return 0
            }).map((o, i) => (
              <option key={i} {...o} />
            ))
            : undefined
          }
          onChange={onChange} />
      </FormGroup>
    )
  }

  render () {
    const {field, shouldRender} = this.props
    // If should render is false, do not render form element (for conditional
    // visibility of form elements).
    if (!shouldRender()) return null
    const isCheckbox = field.type === 'checkbox'
    return (
      <Col xs={field.width || 6}>
        {isCheckbox
          ? this.renderCheckbox()
          : this.renderLabelAndFormControl()
        }
      </Col>
    )
  }
}
