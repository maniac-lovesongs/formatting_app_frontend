import React, { useState, useEffect, useRef } from 'react';
import { observerManager } from "../../models/AppManager/managers.js";
import Fonts from "../Admin/Fonts/Fonts.js";
import utils from '../../utils/utils.js';
import "./AppContainer.scss";

/***************************************************************/
const AppContainer = (input) => {
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
    const contentFactory = () => {
        if(input.content === "fonts"){
            return <Fonts/>
        }
    }
    /***************************************************************/
    return (
        <div>
            <h1>Admin</h1>
            {contentFactory()}
        </div>
    );
}

export default AppContainer;
/**************************************************************/