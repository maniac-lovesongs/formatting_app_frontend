import React, { useState, useEffect, useRef } from 'react';
import { observerManager } from "../../../models/AppManager/managers.js";
import { List, Container, Row, Col} from 'reactstrap';
import utils from '../../../utils/utils.js';
import { useParams } from "react-router-dom";
import FontStyles from '../Fonts/FontStyles/FontStyles.js';

import "./Font.scss";

/***************************************************************/
const Font = (input) => {
    const ref = useRef(null);
    const [observerId, setObserverId] = useState(null);
    const [font, setFont] = useState(null);
    const {id} = useParams();

    console.log(id)
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
            })
        );
    }, []);
    
    /***************************************************************/
    return (
        <div>
            <Container>
                <Row xs="1">
                    <Col className="bg-light border">
                        <h2>Font</h2>
                    </Col>
                </Row>
                <Row xs="2">
                    <Col className="bg-light border">
                        <b>Name: </b> <p>{font && font.name}</p>
                    </Col>
                    <Col className="bg-light border">
                        <b>Styles: </b>{font && <FontStyles addLinks={true} fontId={id} styles={font.styles} />}                
                    </Col>
                </Row>
            </Container>
        </div>
    );
    /***************************************************************/
}

export default Font;
/**************************************************************/