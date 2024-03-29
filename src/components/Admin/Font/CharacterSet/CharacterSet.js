import React, { useState, useEffect, useRef } from 'react';
import { appManager, observerManager } from "../../../../models/AppManager/managers.js";
import { Table, Input, Container,Row,Col, Form, FormGroup, Label, Button} from 'reactstrap';
import Search from '../../../Search/Search.js';
import PaginationLinks from "../../../PaginationLinks/PaginationLinks.js";
import utils from '../../../../utils/utils.js';
import constants from '../../../../utils/constants.js';
import sortBy from "sort-by";

import "./CharacterSet.scss";

/***************************************************************/
const CharacterSet = (input) => {
    const ref = useRef(null);
    const [observerId, setObserverId] = useState(null);
    const [characters, setCharacters] = useState([]);
    const [displayedCharacters, setDisplayedCharacters] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [numElements, setNumElements] = useState(0);
    const [setFilters, setSetFilters] = useState({"lowercase": false, "uppercase": false, "numbers": false});
    const [style, setStyle] = useState(input.style);
    const [fontName, setFontName] = useState(input.font.name);
    const [pageNumber, setPageNumber] = useState(0);
    const [range,setRange] = useState([1,constants.NUM_PER_PAGE]);
    
    /***************************************************************/
    const getCharacterSet = async (s,f) => {
        const link = "/api/fonts/character_sets/font/" + f + "/style/" + s; 
        fetch(utils.make_backend(link)).then((res) =>
            res.json().then((data) => {
                const chs = [];
                Object.keys(data.characters).forEach((v,i) => {
                    chs.push(data.characters[v]);
                });
                setStyle(s);
                setNumElements(chs.length);
                setDisplayedCharacters(chs);
                setCharacters(chs);
            })
        );       
    }
    /***************************************************************/
    useEffect(() => {
        // register a listener 
        if (observerId === null) {
            const id = observerManager.registerListener((dataChanged) => {
                //console.log("Something interesting happened to the app, and as a listener I need to update ");
                if(dataChanged === "style"){
                    const tempStyle = appManager.getStyle();
                    getCharacterSet(tempStyle,fontName);
                }
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
        getCharacterSet(input.style,input.font.name);
    }, []);
    /***************************************************************/
    const setFilterer = (c,s) => {
        const lowercase = "abcdefghijklmnopqrstuvwxyz".split("");
        const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
        const numbers = "0123456789".split("");

        const inLowercase = s["lowercase"] && lowercase.includes(c.value);
        const inUppercase = s["uppercase"] && uppercase.includes(c.value);
        const inNumbers = s["numbers"] && numbers.includes(c.value);
        
        return inLowercase || inNumbers || inUppercase;
    }
    /***************************************************************/
    const handleSetFilter = (e) => {
        const s = e.target.name.trim();
        const checked = e.target.checked;
        let temp_setFilters = {...setFilters};
        temp_setFilters[s] = checked;

        if(!temp_setFilters["lowercase"] && !temp_setFilters["uppercase"] && !temp_setFilters["numbers"]){
            setDisplayedCharacters(characters);
      
        }else{
            const filtered_data = characters.filter((c) => {
                return setFilterer(c,temp_setFilters);
            });
    
            setDisplayedCharacters(filtered_data);
        }
        setSetFilters(temp_setFilters);
        setPageNumber(0);      
    };
    /*********************************************************************/
    const handleFilter = (filteredData) => {
        if(filteredData === null)
            filteredData = characters; 
        setDisplayedCharacters(filteredData);
        const end = filteredData.length < constants.NUM_PER_PAGE? filteredData.length : constants.NUM_PER_PAGE;
        setPageNumber(0);
        setRange([1,end]);
    }
    /***************************************************************/
    const makeCharacters = (characters) => {
        characters.sort(sortBy('value'));
        return characters.slice(range[0]-1,range[1]).map((c,i) => {
            return (
                <tr id={fontName+"-"+style+"-"+c.id} key={fontName+"-"+style+"-"+c.id}>
                    <td>{range[0] + i}</td>
                    <td>{c.id}</td>
                    <td data-char-id={c.id}>{c.value}</td>
                    <td data-char-id={c.id}>
                        {c.symbol}
                    </td>
                    <td>
                        <Input 
                            data-char-id={c.id} 
                            type="checkbox" />
                    </td>
                    <td>
                        <a href={"/admin/fonts/view/" + c.id}>Edit</a>
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
            <Container>
                <Row xs="1">
                    <Col className="bg-light border">
                        <h3>{"Character Set: " + style}</h3>
                    </Col>
                </Row>
                <Row xs="4">
                    <Col className="bg-light border">
                        <b>Number of Characters </b> <p>{displayedCharacters.length > 0 && displayedCharacters.length}</p>
                    </Col>
                    <Col className="bg-light border">
                        <b>Showing</b> 
                        <p>{range[0]} to {range[1]}</p>      
                    </Col>
                    <Col className="bg-light border">
                        <b>Search</b> 
                        <Search 
                        handleFilter={handleFilter}
                        setSearchValue={setSearchValue}
                        filter={(d,v) => {
                            let re = new RegExp(`^${v}`, 'g');
                            const matched = d.value.toLowerCase().match(re);
                            return matched;
                        }}
                        data={characters}
                        displayedFonts={displayedCharacters}/>     
                    </Col>
                    <Col className="bg-light border">
                        <b>Filter</b> 
                        <p><i>Sets: </i></p>      
                        <Form>
                            <FormGroup>
                                <FormGroup>
                                    <Input 
                                    onChange={handleSetFilter}
                                    id="uppercase_checkbox" 
                                    name="uppercase" 
                                    type="checkbox" />
                                    <Label check>uppercase letters</Label>
                                </FormGroup>
                                <FormGroup>
                                    <Input 
                                    onChange={handleSetFilter}
                                    id="lowercase_checkbox" 
                                    name="lowercase" 
                                    type="checkbox" />
                                    <Label check>lowercase letters</Label>
                                </FormGroup>
                                <FormGroup>
                                    <Input
                                    onChange={handleSetFilter} 
                                    id="numbers_checkbox" 
                                    name="numbers" 
                                    type="checkbox" />
                                    <Label check>numbers</Label>
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
                                        <th>Value</th>
                                        <th>Symbol</th>
                                        <th>Delete</th>
                                        <th>Edit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {makeCharacters(displayedCharacters)}
                                </tbody>            
                            </Table>
                            <Button color="primary">Delete Selected</Button>
                            <PaginationLinks 
                                objectName="characterSet"
                                pageNumber={pageNumber}
                                setPageNumber={handlePageNumberChanged}
                                numElements={displayedCharacters.length}/>
                    </Col>
                </Row>
            </Container>
    );
}

export default CharacterSet;
/**************************************************************/