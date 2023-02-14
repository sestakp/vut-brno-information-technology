import React from 'react';
import Card from "./Cards/Card";
import Filter from './Filter/Filter';

import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import Model from "../../models/api/Model";
import entityLibrary from "../../models/utils/renderUtils/entityLibrary";
import { RootState } from '../../app/store';


interface Props{
  addSelectedRecord: ActionCreatorWithPayload<Model, string>,
  delSelectedRecord: ActionCreatorWithPayload<Model, string>,
  records: any[],
  recordLibrary:entityLibrary,
  setFilter: ActionCreatorWithPayload<{field: string, value: any}, any> 
  filter: {[key: string]: any},
  
  cardTableSetTitle: (record:any) => string,
  cardTableSetDescription: (record:any) => string,
  cardTableSetFooter: (record:any) => string,
  selectIsSelected: (state: RootState, record: Model) => boolean,
  cardTableHasImage: boolean,
}

function CardTable(props: Props){

    let records = props.records;
    return(
        <>
        <div className="row">
            <div className="col-md-2">
                <Filter recordLibrary={props.recordLibrary} setFilter={props.setFilter} filter={props.filter}/>
            </div>
            <div className="col-md-10">
                <div className="row">
                    {records.map((record, index) => {
                        return <Card
                            key={"CardTable_"+index}
                            record={record}
                            cardTableSetTitle={props.cardTableSetTitle}
                            cardTableSetDescription={props.cardTableSetDescription}
                            cardTableHasImage={props.cardTableHasImage}
                            cardTableSetFooter={props.cardTableSetFooter}
                            addSelectedRecord={props.addSelectedRecord}
                            delSelectedRecord={props.delSelectedRecord}
                            selectIsSelected={props.selectIsSelected}
                        />
                    })}
                </div>
            </div>
        </div>
        
        </>
    )  
}


export default CardTable;
