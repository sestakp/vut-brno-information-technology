import React, { Component, ReactElement } from 'react';
import { Container } from 'reactstrap';
import Navbar from './layoutComponents/Navbar/Navbar';
import Footer from './layoutComponents/Footer/Footer';
import FlashMessage from "../components/FlashMessage/FlashMessage";
import "./BasicLayout.scss";
interface Props{
  children?: ReactElement
}

const BasicLayout: React.FC<Props> = ({ children }) => {

    return (
      <>
        <Navbar/>
            <FlashMessage />
            <Container className="Container layout layout-blur" style={{overflow: "unset"}}>
              {children}
            </Container>
        <Footer />
      </>
    );
};

export default BasicLayout;