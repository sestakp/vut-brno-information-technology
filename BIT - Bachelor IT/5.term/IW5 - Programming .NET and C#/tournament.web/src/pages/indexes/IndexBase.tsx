import React, { useEffect } from "react";
import { AsyncThunk, ActionCreatorWithPayload, ActionCreatorWithoutPayload } from '@reduxjs/toolkit';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { RootState } from "../../app/store";
import CardTable from "../../components/CardTable/CardTable";
import Model from "../../models/api/Model";
import entityLibrary from "../../models/utils/renderUtils/entityLibrary";
import RecordEditPanel from "../../components/RecordEditPanel/RecordEditPanel";
import { useHistory } from "react-router";
import Loading from "../../components/Loading/Loading";
import "./IndexBase.css";

interface Props{
  fetchAsync: AsyncThunk<any[], void, {}>,

  selectAll: (state: RootState) => any[],
  selectIsSelected: (state: RootState, record: Model) => boolean,
  selectFirstSelectedRecord: (state: RootState) => Model,
  selectIsAnyRecordSelected: (state: RootState) => boolean,
  selectIsOneRecordSelected: (state: RootState) => boolean,
  selectIsLoading: (state: RootState) => boolean,
  selectFilter: (state: RootState) => object,
  selectSelectedRecords: (state: RootState) => Model[],

  addSelectedRecord: ActionCreatorWithPayload<Model, string>,
  delSelectedRecord: ActionCreatorWithPayload<Model, string>,
  clearSelectedRecords: ActionCreatorWithoutPayload<string>,
  setFilter: ActionCreatorWithPayload<{field: string, value: any}, any> 
  cardTableHasImage: boolean,
  deleteAsync: AsyncThunk<void, Model, {}>,

  cardTableSetTitle: (record:any) => string,
  cardTableSetDescription: (record:any) => string,
  cardTableSetFooter: (record:any) => string,

  recordLibrary: entityLibrary,
  header: string,
  updateLink: string,
  detailLink: string,
}

const IndexBase = (props: Props) => {
  const history = useHistory();


  let records = useAppSelector(props.selectAll);
  const isLoading = useAppSelector(props.selectIsLoading);
  const filter = useAppSelector(props.selectFilter);

  records = props.recordLibrary.filter(records, filter);
  const dispatch = useAppDispatch();
  
    useEffect(() => {
      if(records.length === 0){
        dispatch(props.fetchAsync());
      }
    }, []);

  

  return (
    <>
      <RecordEditPanel 
        clearSelectedRecords={props.clearSelectedRecords}
        detailLink={props.detailLink}
        updateLink={props.updateLink}
        selectFirstSelectedRecord={props.selectFirstSelectedRecord}
        selectIsAnyRecordSelected={props.selectIsAnyRecordSelected}
        selectIsOneRecordSelected={props.selectIsOneRecordSelected}
        deleteAsync={props.deleteAsync}
        selectSelectedRecords={props.selectSelectedRecords}
      />
      <div className="row">
        <div className="col-md-6">
          <h1>{props.header}</h1>
        </div>
        <div className="col-md-6 button-pos">
          <button className="btn btn-color float-end" onClick={() => {dispatch(props.clearSelectedRecords()); history.push(props.updateLink);}}>
            Add
          </button>
        </div>
      </div>
      {isLoading ? 
        <Loading />
        :
        <CardTable
          records={records}
          addSelectedRecord={props.addSelectedRecord}
          cardTableHasImage={props.cardTableHasImage}
          cardTableSetTitle={props.cardTableSetTitle}
          cardTableSetDescription={props.cardTableSetDescription}
          cardTableSetFooter={props.cardTableSetFooter}
          delSelectedRecord={props.delSelectedRecord}
          recordLibrary={props.recordLibrary}
          selectIsSelected={props.selectIsSelected}
          setFilter={props.setFilter}
          filter={filter}
        />
      }
      
    </>
  );
};

export default IndexBase