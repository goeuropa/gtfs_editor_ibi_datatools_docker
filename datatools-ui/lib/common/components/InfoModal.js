// @flow

import React from 'react'
import { Modal, Button } from 'react-bootstrap'

type Props = {
  body?: string,
  title?: string
}

type State = {
  body: string,
  showModal: boolean,
  title: string
}

export default class InfoModal extends React.Component<Props, State> {
  state = {
    body: '',
    showModal: false,
    title: ''
  }

  close () {
    this.setState({
      showModal: false
    })
  }

  open (props: Props) {
    this.setState({
      showModal: true,
      title: props.title,
      body: props.body
    })
  }

  ok = () => {
    this.close()
  }

  render () {
    const {Body, Footer, Header, Title} = Modal
    return (
      <Modal show={this.state.showModal} onHide={this.close}>
        <Header>
          <Title>{this.state.title}</Title>
        </Header>

        <Body>
          <p>{this.state.body}</p>
        </Body>

        <Footer>
          <Button
            onClick={this.ok}>
            OK
          </Button>
        </Footer>
      </Modal>
    )
  }
}
