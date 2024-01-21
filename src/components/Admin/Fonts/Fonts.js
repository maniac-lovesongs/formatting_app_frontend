import React, { useState, useEffect, useRef } from 'react';
import { observerManager } from "../../../models/AppManager/managers.js";
import { List, Table, Input} from 'reactstrap';
import PaginationLinks from "../../PaginationLinks/PaginationLinks.js";
import utils from '../../../utils/utils.js';
import constants from '../../../utils/constants.js';
import sortBy from "sort-by";

import "./Fonts.scss";

/***************************************************************/
const Fonts = (input) => {
    const ref = useRef(null);
    const [observerId, setObserverId] = useState(null);
    const [fonts, setFonts] = useState([]);
    const [numElements, setNumElements] = useState(0);
    const [pageNumber, setPageNumber] = useState(0);
    const [range,setRange] = useState([1,10]);
    
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
        fetch(utils.make_backend("/api/fonts/all")).then((res) =>
            res.json().then((data) => {
                setNumElements(data.fonts.length);
                setFonts(data.fonts);
            })
        );
    }, []);
    /***************************************************************/
    const makeStyles = (styles) => {
        return styles.map((s,i) => {
            return (<option>{s}</option>)
        });
    }
    /***************************************************************/
    const makeFonts = (fonts) => {
        return fonts.slice(range[0]-1,range[1]).map((f,i) => {
            return (
                <tr>
                    <td>{range[0] + i}</td>
                    <td>{f.id}</td>
                    <td>{f.name}</td>
                    <td>
                        <Input     
                            bsSize="sm"
                            className="mb-3"
                            type="select">{makeStyles(f.styles)}
                    </Input>
                    </td>
                    <td>
                        <Input type="checkbox" />
                    </td>
                    <td>
                        <Input type="checkbox" />
                    </td>
                </tr>
            )
        });
    }
    /***************************************************************/
    const handlePageNumberChanged = (pageNumber) => {
        const start = pageNumber*constants.NUM_PER_PAGE + 1;
        const temp = (pageNumber + 1)*constants.NUM_PER_PAGE;
        const end = temp > numElements? numElements : temp; 
        setPageNumber(pageNumber);
        setRange([start,end]);
    }
    /***************************************************************/
    return (
        <div>
            <h2>Fonts</h2>
            <List type="unstyled">
                <li><b>Number of Fonts: </b>{fonts.length}</li>
                <li>Showing {range[0]} to {range[1]}</li>
            </List>
            <Table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>id</th>
                        <th>Name</th>
                        <th>Styles</th>
                        <th>Delete</th>
                        <th>Edit</th>
                    </tr>
                </thead>
                <tbody>
                {makeFonts(fonts)}
                </tbody>            
            </Table>
            <PaginationLinks 
                pageNumber={pageNumber}
                setPageNumber={handlePageNumberChanged}
                numElements={fonts.length}/>
        </div>
    );
}

export default Fonts;
/**************************************************************/