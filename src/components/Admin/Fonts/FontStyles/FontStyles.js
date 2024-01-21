import React, { useState, useEffect, useRef } from 'react';
import {observerManager} from "../../../../models/AppManager/managers.js";
import {Input,Form, FormGroup, Button} from 'reactstrap';
import "./FontStyles.scss";

/***************************************************************/
const FontStyles = (input) => {
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
    const makeStyles = (styles) => {
        return styles.map((s,i) => {
            return (<option value={s}>{s}</option>)
        });
    }
    /***************************************************************/    
    return (
        <Form>
            <FormGroup>
                <Input
                ref={ref}
                data-font-id={input.fontId}    
                bsSize="sm"
                className="mb-3"
                type="select">{makeStyles(input.styles)}
                </Input>
                <Button data-font-id={input.fontId} color="primary">View Character Set</Button>
            </FormGroup>
        </Form>
    );
    /***************************************************************/
}

export default FontStyles;
/**************************************************************/