import React, { useState, useEffect, useRef } from 'react';
import {appManager, observerManager} from "../../../../models/AppManager/managers.js";
import {Input,Form, FormGroup, Button} from 'reactstrap';
import "./FontStyles.scss";

/***************************************************************/
const FontStyles = (input) => {
    const ref = useRef(null);
    const [observerId, setObserverId] = useState(null);
    const [style, setStyle] = useState();

    /***************************************************************/
    useEffect(() => {
        // register a listener 
        if (observerId === null) {
            const id = observerManager.registerListener((dataChanged) => {
                if(dataChanged === "style"){
                    setStyle(appManager.getStyle());
                }
            });
            setObserverId(id);
        }
        const tempStyle = input.styles.includes("normal")? "normal" : input.styles[0];
        appManager.setStyle(tempStyle);
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
    const handleStyleChange = (s) => {
        appManager.setStyle(s);
        //input.handleStyleChange(s);
    }
    /***************************************************************/    
    return (
        <Form>
            <FormGroup>
                <Input
                ref={ref}
                data-font-id={input.fontId}   
                value={style}
                onChange={(e) => {
                    setStyle(e.target.value);
                }} 
                bsSize="sm"
                className="mb-3"
                type="select">{makeStyles(input.styles)}
                </Input>
                {input.addLinks && <Button 
                    onClick={(e) => {
                        e.preventDefault();
                        handleStyleChange(style);
                    }}
                    data-font-id={input.fontId} 
                    data-font-name={input.fontName}
                    color="primary">View Character Set</Button>}
            </FormGroup>
        </Form>
    );
    /***************************************************************/
}

export default FontStyles;
/**************************************************************/