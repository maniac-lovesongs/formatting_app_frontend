import React, { useState, useEffect, useRef } from 'react';
import { observerManager } from "../../../models/AppManager/managers.js";
import { Table, Input, Form, FormGroup, Label, Container,Row,Col} from 'reactstrap';
import FontStyles from './FontStyles/FontStyles.js';
import Search from '../../Search/Search.js';
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
    const [displayedFonts, setDisplayedFonts] = useState([]);
    const [styleFilters, setStyleFilters] = useState([]);
    const [fontsLookup, setFontsLookUp] = useState({});
    const [numElements, setNumElements] = useState(0);
    const [pageNumber, setPageNumber] = useState(0);
    const [range,setRange] = useState([1,constants.NUM_PER_PAGE]);
    
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
                const temp = {};
                data.fonts.forEach((elm,i) => {
                    temp[elm.id] = {
                        "font": elm                   
                    };
                });
                setFontsLookUp(temp);
                setNumElements(data.fonts.length);
                setDisplayedFonts(data.fonts);
                setFonts(data.fonts);
            })
        );
    }, []);
    /***************************************************************/
    const handleFilter = (filteredData) => {
        if(filteredData === null)
            filteredData = fonts; 
        setDisplayedFonts(filteredData);
        const end = filteredData.length < constants.NUM_PER_PAGE? filteredData.length : constants.NUM_PER_PAGE;
        setPageNumber(0);
        setRange([1,end]);
    }
    /***************************************************************/
    const makeFonts = (fonts) => {
        fonts.sort(sortBy('name'));
        return fonts.slice(range[0]-1,range[1]).map((f,i) => {
            return (
                <tr>
                    <td>{range[0] + i}</td>
                    <td>{f.id}</td>
                    <td data-font-id={f.id}>{f.name}</td>
                    <td>
                        <FontStyles styles={f.styles} fontId={f.id}/>
                    </td>
                    <td>
                        <Input data-font-id={f.id} type="checkbox" />
                    </td>
                    <td>
                        <a href={"/admin/fonts/view/" + f.id}>View</a>
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
            <Container>
                <Row xs="1">
                    <Col className="bg-light border">
                        <h2>View All</h2>
                    </Col>
                </Row>
                <Row xs="4">
                    <Col className="bg-light border">
                        <b>Number of Fonts </b> <p>{displayedFonts.length > 0 && displayedFonts.length}</p>
                    </Col>
                    <Col className="bg-light border">
                        <b>Showing</b> 
                        <p>{range[0]} to {range[1]}</p>      
                    </Col>
                    <Col className="bg-light border">
                        <b>Search</b> 
                        <Search 
                        handleFilter={handleFilter}
                        filter={(d,v) => {
                            let re = new RegExp(`^${v}`, 'g');
                            const matched = d.name.toLowerCase().match(re);
                            console.log(styleFilters);
                            return matched;
                        }}
                        data={fonts}
                        displayedFonts={displayedFonts}/>     
                    </Col>
                    <Col className="bg-light border">
                        <b>Filter</b> 
                        <p><i>Styles: </i></p>      
                        <Form>
                            <FormGroup>
                                <FormGroup>
                                    <Input id="normal_checkbox" name="normal" type="checkbox" />
                                    <Label check>normal</Label>
                                </FormGroup>
                                <FormGroup>
                                    <Input id="bold_checkbox" name="bold" type="checkbox" />
                                    <Label check>bold</Label>
                                </FormGroup>
                                <FormGroup>
                                    <Input id="italic_checkbox" name="italic" type="checkbox" />
                                    <Label check>italic</Label>
                                </FormGroup>
                                <FormGroup>
                                    <Input id="bold_italic_checkbox" name="bold italic" type="checkbox" />
                                    <Label check>bold italic</Label>
                                </FormGroup>
                            </FormGroup>
                        </Form>
                    </Col>
                </Row>
                <Row xs="1">
                    <Col className="bg-light border">
                            <Table>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>id</th>
                                        <th>Name</th>
                                        <th>Styles</th>
                                        <th>Delete</th>
                                        <th>View</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {makeFonts(displayedFonts)}
                                </tbody>            
                            </Table>
                            <PaginationLinks 
                                pageNumber={pageNumber}
                                setPageNumber={handlePageNumberChanged}
                                numElements={displayedFonts.length}/>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Fonts;
/**************************************************************/