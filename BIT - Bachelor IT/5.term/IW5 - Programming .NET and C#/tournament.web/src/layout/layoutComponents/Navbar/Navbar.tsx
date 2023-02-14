import React, {Component, useRef} from 'react';
import "./Navbar.css";
import {
    Container,
    Navbar as ReactStrapNavbar,
    NavbarBrand,
    NavItem,
    NavLink,
  } from "reactstrap";

import { Link } from "react-router-dom";
import {getAllNavLinks} from "../../../routes/routes";
import { useHistory } from "react-router";
import { setSearchText, search } from '../../../features/search/searchSlice';

import { useAppSelector, useAppDispatch } from '../../../app/hooks';

const NavBar: React.FC = () => {
    const dispatch = useAppDispatch();
    const history = useHistory();
    const searchInput = useRef<HTMLInputElement>(null);
        return(
            <ReactStrapNavbar>
                <Container>
                <p>
                    CSGO Tournament
                </p>
                {getAllNavLinks().map((route, index) => {
                    return(
                        <NavItem key={"Navbar_index"+index}>
                            <NavLink
                              tag={Link}
                              to={route.path}
                            >
                              {route.label}
                            </NavLink>
                        </NavItem>
                    )
                })
                }
                <div style={{float: "right"}}>
                    <input ref={searchInput} className="form-control mr-sm-2" style={{maxWidth: "200px"}} type="search" placeholder="Search" aria-label="Search" />
                    <button className="btn my-2 my-sm-0 btn-color" onClick={() => {dispatch(setSearchText(searchInput.current?.value));history.push("/Search")}}>Search</button>
                </div>


                </Container>    
            </ReactStrapNavbar>
        )
}

export default NavBar