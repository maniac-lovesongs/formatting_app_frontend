import React, { useState, useEffect, useRef } from 'react';
import { observerManager } from "../../../models/AppManager/managers.js";
import {Row, Col, Input, Form, FormGroup, Label, Button} from 'reactstrap';
import "./Font.scss";

/***************************************************************/
const FontEditMode = (input) => {
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

        // once the component unmounts, remove the listener
        return () => {
            observerManager.unregisterListener(observerId);
            setObserverId(null);
        };

    }, []);
    /***************************************************************/
    return (
                <Row xs="1">
                    <Col className="bg-light border">
                        <Form>
                            <FormGroup>
                                <Label for="fontName"><b>Name</b></Label>
                                <Input type="text" data-font-id={input.id} value={input.name}/>
                                <Button color="primary">Edit</Button>
                            </FormGroup>
                        </Form>
                    </Col>
                </Row>        
    );
    /***************************************************************/
}

export default FontEditMode;
/**************************************************************/