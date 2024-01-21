import React, { useState, useEffect, useRef } from 'react';
import { observerManager } from "../../../models/AppManager/managers.js";
import {Nav,
    NavItem,
    NavLink, 
    Container, 
    Row, 
    Col} from 'reactstrap';
import utils from '../../../utils/utils.js';
import { useParams } from "react-router-dom";
import FontViewMode from './FontViewMode.js';
import FontEditMode from './FontEditMode.js';
import CharacterSet from "./CharacterSet/CharacterSet.js";
import "./Font.scss";

/***************************************************************/
const Font = (input) => {
    const ref = useRef(null);
    const [observerId, setObserverId] = useState(null);
    const [font, setFont] = useState(null);
    const [mode, setMode] = useState("view");
    const [characterSet, setCharacterSet] = useState(null);
    const {id} = useParams();

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
    useEffect(() => {
        // Using fetch to fetch the api from 
        // flask server it will be redirected to proxy
        const link = utils.make_backend("/api/fonts/by_id/" + id);
        fetch(link).then((res) =>
            res.json().then((data) => {
                setFont(data.font);
                const charSet = data.font.styles.includes("normal")? "normal" : data.font.styles[0];
                console.log("The character set is " + charSet);
                setCharacterSet(charSet);
            })
        );
    }, []);
    
    /***************************************************************/
    const contentFactory = (font) => {
        if(font && mode === "view")
            return <FontViewMode id={id} font={font}/>
        else if(font && mode === "edit")
            return <FontEditMode id={id} name={font.name}/>
        return null; 
    }
    /***************************************************************/
    return (
        <div>
            <Container>
                <Row xs="1">
                    <Col className="bg-light border">
                        <h2>Font</h2>
                    </Col>
                </Row>
                <Row xs="1">
                    <Nav tabs>
                        <NavItem 
                            onClick={(e) => {
                                setMode("view");
                            }}>
                            <NavLink
                                onClick={(e) => {
                                    e.preventDefault();
                                }} 
                                href="#" active={mode === "view"}>
                                View
                            </NavLink>
                        </NavItem>
                        <NavItem 
                            onClick={(e) =>{
                                setMode("edit");
                            }}>
                            <NavLink 
                                onClick={(e) => {
                                    e.preventDefault();
                                }}
                                href="#" active={mode === "edit"}>
                                Edit
                            </NavLink>
                        </NavItem>
                    </Nav>
                </Row>
                {contentFactory(font)}
                <Row>
                    {font && <CharacterSet font={font} style={characterSet} />}
                </Row>
            </Container>
        </div>
    );
    /***************************************************************/
}

export default Font;
/**************************************************************/