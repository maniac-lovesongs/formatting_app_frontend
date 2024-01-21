import React, { useState, useEffect, useRef } from 'react';
import { appManager, observerManager } from "../../../models/AppManager/managers.js";
import {  
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    NavbarText,
    Row, 
    Col, 
    Input, 
    Form, 
    FormGroup, 
    Label, 
    Button} from 'reactstrap';
import "./Header.scss";

/***************************************************************/
const Header = (input) => {
    const ref = useRef(null);
    const [observerId, setObserverId] = useState(null);
    const [collapsed, setCollapsed] = useState(true);

    const toggleNavbar = () => setCollapsed(!collapsed);
  
    /***************************************************************/
    useEffect(() => {
        // register a listener 
        if (observerId === null) {
            const id = observerManager.registerListener((dataChanged) => {
                //console.log("Something interesting happened to the app, and as a listener I need to update ");
            });
            setObserverId(id);
        }

        // once the component unmounts, remove the listener
        return () => {
            observerManager.unregisterListener(observerId);
            setObserverId(null);
        };

    }, []);
    /***************************************************************/
    return (
    <Navbar light={true} full={true} color='light'>
        <NavbarBrand href="/">instastylr admin</NavbarBrand>
        <NavbarToggler onClick={toggleNavbar} className="me-2" />
        <Collapse isOpen={!collapsed} navbar>
          <Nav navbar>
            <NavItem>
              <NavLink href="/components/">Components</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="https://github.com/reactstrap/reactstrap">
                GitHub
              </NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar> 
    );
    /***************************************************************/
}

export default Header;
/**************************************************************/