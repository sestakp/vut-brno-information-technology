import React from 'react';
import Card from "./Card/Card";


function CardTable(props){

    let records = props.records;
    return(
        <div className="row">
            {records.map((record, index) => {
                return <Card
                    key={"CardTable_"+index}
                    title={record.name}
                    description={record.description}
                    id={record.id}
                    handleEdit={props.handleEdit}
                    handleDelete={props.handleDelete}
                    handleDetail={props.handleDetail}
                    record={record}
                />
            })}
        </div>
    )  
}


export default CardTable;