import React, {Component} from 'react';
import "./Navbar.css";
import {
    Container,
    Navbar as ReactStrapNavbar,
    NavbarBrand,
    NavItem,
    NavLink,
  } from "reactstrap";

import { Link } from "react-router-dom";
import {getAllNavLinks} from '../../../routes/routes.js';

export class Navbar extends Component{


    render(){

        return(
            <ReactStrapNavbar>
                <Container>
                <NavbarBrand tag={Link} className="text-light" to="/">
                    Tournament
                </NavbarBrand>
                {getAllNavLinks().map((route) => {
                    return(
                        <NavItem>
                            <NavLink
                              tag={Link}
                              className="text-light"
                              to={route.path}
                            >
                              {route.label}
                            </NavLink>
                        </NavItem>
                    )
                })

                }

                </Container>    
            </ReactStrapNavbar>
        )

    }
}