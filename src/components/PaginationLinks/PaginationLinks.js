import React, { useState, useEffect, useRef } from 'react';
import {observerManager} from "../../models/AppManager/managers.js";
import { Pagination, PaginationItem,PaginationLink} from 'reactstrap';
import constants from "../../utils/constants.js";
import "./PaginationLinks.scss";

/***************************************************************/
const PaginationLinks = (input) => {
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
    const determineNumPages = (n) => {
        let np = Math.floor(n / constants.NUM_PER_PAGE);
        np += n % constants.NUM_PER_PAGE === 0? 0 : 1; 
        return np;
    }
    /***************************************************************/
    const handleOnClick = (e,i) => {
        console.log("We are in a link " + i);
        e.preventDefault();
        input.setPageNumber(i);
    }
    /***************************************************************/
    const makePaginationItems = (n) => {
        const items = [];
        for(let i = 0; i < n; i++){
            items.push((<PaginationItem>
                <PaginationLink 
                onClick={(e) => {
                    handleOnClick(e,i)
                }}
                href="#">
                  {i+1}
                </PaginationLink>
              </PaginationItem>));
        }

        return items;
    }
    /***************************************************************/
    return (
        <Pagination>
            <PaginationItem>
                <PaginationLink
                first
                href="#"
                />
            </PaginationItem>
            <PaginationItem>
                <PaginationLink
                href="#"
                previous
                />
            </PaginationItem>
            {makePaginationItems(determineNumPages(input.numElements))}
            <PaginationItem>
                <PaginationLink
                next
                href="#"
                />
            </PaginationItem>
            <PaginationItem>
                <PaginationLink
                href="#"
                last
                />
            </PaginationItem>
        </Pagination>
    );
}

export default PaginationLinks;
/**************************************************************/