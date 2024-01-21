import React, { useState, useEffect, useRef } from 'react';
import {observerManager} from "../../models/AppManager/managers.js";
import { Pagination, PaginationItem,PaginationLink} from 'reactstrap';
import constants from "../../utils/constants.js";
import "./PaginationLinks.scss";

/***************************************************************/
const PaginationLinks = (input) => {
    const ref = useRef(null);
    const [observerId, setObserverId] = useState(null);
    const [pageNumber, setPageNumber] = useState(input.pageNumber);
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
        e.preventDefault();
        setPageNumber(i);
        input.setPageNumber(i);
    }
    /***************************************************************/
    const handlePrev = (e) => {
        e.preventDefault();
        const temp = pageNumber - 1; 
        if(temp >= 0){
            setPageNumber(temp);
            input.setPageNumber(temp);
        }
    }
    /***************************************************************/
    const makePaginationItems = (n) => {
        const items = [];
        for(let i = 0; i < n; i++){
            items.push((<PaginationItem key={input.objectName + i}>
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
    const handleGoToFirstPage = (e) => {
        e.preventDefault();
        setPageNumber(0);
        input.setPageNumber(0);
    }
    /***************************************************************/
    const handleGoToLastPage = (e) => {
        e.preventDefault();
        const lastPage = determineNumPages(input.numElements) - 1; 
        setPageNumber(lastPage);
        input.setPageNumber(lastPage);
    }
    /***************************************************************/
    const handleNext = (e) => {
        e.preventDefault();
        const temp = pageNumber + 1; 
        const lastPage = determineNumPages(input.numElements) - 1; 
        if(temp <= lastPage){
            setPageNumber(temp);
            input.setPageNumber(temp);
        }
    }
    /***************************************************************/
    return (
        <Pagination>
            <PaginationItem>
                <PaginationLink
                first
                onClick={handleGoToFirstPage}
                href="#"
                />
            </PaginationItem>
            <PaginationItem>
                <PaginationLink
                href="#"
                onClick={handlePrev}
                previous
                />
            </PaginationItem>
            {makePaginationItems(determineNumPages(input.numElements))}
            <PaginationItem>
                <PaginationLink
                next
                onClick={handleNext}
                href="#"
                />
            </PaginationItem>
            <PaginationItem>
                <PaginationLink
                href="#"
                onClick={handleGoToLastPage}
                last
                />
            </PaginationItem>
        </Pagination>
    );
}

export default PaginationLinks;
/**************************************************************/