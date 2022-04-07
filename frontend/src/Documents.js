import React, { useEffect, useState } from "react";

const Documents = () => {

    //dummy docs - replace with DB getDocs GET
const docs = ['document1', 'document2', 'document3'];

const documentMapping = docs.map((document, index) => 
    <a href='#' key={index + document} >{document} </a>
);
    return(
        
        <div>
            {documentMapping}
        </div>
    )

}

export default Documents