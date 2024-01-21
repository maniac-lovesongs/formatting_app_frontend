import React, { useState, useEffect, useRef } from 'react';
import { appManager, observerManager } from "../../../models/AppManager/managers.js";
import { Row, Col} from 'reactstrap';
import FontStyles from '../Fonts/FontStyles/FontStyles.js';
import "./Font.scss";

/***************************************************************/
const FontViewMode = (input) => {
    const ref = useRef(null);
    const [observerId, setObserverId] = useState(null);

    /***************************************************************/
    useEffect(() => {
        // register a listener 
        if (observerId === null) {
            const id = observerManager.registerListener((dataChanged) => {
                //console.log("Something interesting happened to the app, and as a listener I need to update ");
            });
            setObserverId(id);
        }
        appManager.setFont(input.font.name);
        // once the component unmounts, remove the listener
        return () => {
            observerManager.unregisterListener(observerId);
            setObserverId(null);
        };

    }, []);
    /***************************************************************/
    return (
                <Row xs="2">
                    <Col className="bg-light border">
                        <b>Name: </b> <p>{input.font.name}</p>
                    </Col>
                    <Col className="bg-light border">
                        <b>Styles: </b>{<FontStyles 
                        handleStyleChange={input.handleStyleChange} 
                        addLinks={true} 
                        fontName={input.font.name} 
                        fontId={input.id} 
                        styles={input.font.styles} />}                
                    </Col>
                </Row>        
    );
    /***************************************************************/
}

export default FontViewMode;
/**************************************************************/