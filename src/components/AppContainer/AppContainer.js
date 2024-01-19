import React, { useState, useEffect, useRef } from 'react';
import { observerManager } from "../../models/AppManager/managers.js";
import utils from '../../utils/utils.js';
import "./AppContainer.scss";

/***************************************************************/
const AppContainer = (input) => {
    const ref = useRef(null);
    const [observerId, setObserverId] = useState(null);

    const [data, setdata] = useState({
        font: "",
        exists: false
    });
    /***************************************************************/
       // Using useEffect for single rendering
       useEffect(() => {
        // Using fetch to fetch the api from 
        // flask server it will be redirected to proxy
        fetch(utils.make_backend("/api/fonts/sans_serif/exists")).then((res) => {
            console.log(res)
            /*res.json().then((data) => {
                // Setting a data from api
                console.log(data)
                setdata({
                    font: data.font.name,
                    exists: data.exists
                });
            })*/
        }
        );
    }, []);
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
    return (
        <div>
            <h1>This is the main container</h1>
            <ul>
                <li><b>Font: </b> {data.font}</li>
                <li><b>Exists: </b> {data.exists}</li>
            </ul>
        </div>
    );
}

export default AppContainer;
/**************************************************************/