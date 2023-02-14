import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { Navbar } from '../navbar/Navbar';
import { Footer } from '../footer/Footer';

export class Layout extends Component {

  render () {
    return (
      <>
        <Navbar userName={this.props.userName} />
            <Container className="Container" style={{paddingBottom: "200px"}}>
              {this.props.children}
            </Container>
        <Footer />
      </>
    );
  }
}
