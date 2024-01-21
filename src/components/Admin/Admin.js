import React, { useState, useEffect, useRef } from 'react';
import { appManager, observerManager } from "../../models/AppManager/managers.js";
import {Container, Row,Col} from "reactstrap";
import Font from "./Font/Font.js";
import Fonts from "./Fonts/Fonts.js";
import Header from './Header/Header.js';
import "./Admin.scss";

/***************************************************************/
const Admin = (input) => {
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
        if(input.content === "admin.fonts"){
            return <Fonts/>
        }
        else if(input.content === "admin.font"){
            return <Font/>
        }
    }
    /***************************************************************/
    return (
        <div id="admin-wrapper">
            <header>
                <Header/>
            </header>
            <section>
                {contentFactory()}
            </section>
        </div>
    );
    /***************************************************************/
}

export default Admin;
/**************************************************************/