import React, { useState, useEffect, useRef } from 'react';
import {observerManager} from "../../models/AppManager/managers.js";
import { Input} from 'reactstrap';
import "./Search.scss";

/***************************************************************/
const Search = (input) => {
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
            <Input
                onChange={(e) => {
                    if(e.target.value.trim() === ""){
                        input.setSearchValue("");
                        input.handleFilter(null);
                    }
                    else{
                        const temp = input.data.filter((d) => {
                            const v = e.target.value.trim().toLowerCase();
                            return input.filter(d, v);
                        });
                        input.setSearchValue(e.target.trim().toLowerCase());
                        input.handleFilter(temp);
                    }
                }}
            />
    );
    /***************************************************************/
}

export default Search;
/**************************************************************/