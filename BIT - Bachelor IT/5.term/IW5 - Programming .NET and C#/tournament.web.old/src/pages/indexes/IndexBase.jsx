import React, { useEffect } from "react";
import CardTable from "../../components/CardTable/CardTable";
import FormBase from "../Forms/FormBase";
import DetailBase from "../Details/DetailBase";

//redux
import { connect } from "react-redux";
import * as loadingActions from "../../redux/loading/loadingActions";
import Loading from "../../components/Loading/Loading";
import * as pagingActions from "../../redux/paging/pagingActions"; 
import pagingEnum from "../../redux/paging/PagingEnum"; 
import { setRecord } from "../../redux/record/recordActions";

const IndexBase = (props) => {

    let records = props.records;

    let loadingFlag = props.loading;
  
    useEffect(() => {
        props.setIndex();
        props.fetch();
    }, []);


  function handleAdd() {
    props.setRecord({});
    props.setForm();
  }

  function handleEdit(record) {
    props.setRecord(record);
    props.setForm();
  }

  function handleDelete(record) {
    alert("Handle delete: " + record.id);
    props.setRecord(record);
    props.setDetail();
  }

  function handleDetail(record){
      alert("Handle detail: " + record.id);
      props.setRecord(record);
      props.setDetail();
  }

  let addButton = loadingFlag ? "":
  (
    <button className="btn btn-primary" onClick={() => handleAdd()}>
    Add
    </button>
  )

  let content = props.isDetail ?  (<DetailBase/>) : "";

  content = props.isForm ?  (<FormBase recordLibrary={props.recordLibrary} collection={props.collection} actions={props.actions}/> ) : content;

  content = props.isIndex ? (
    <CardTable
        records={records}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
        handleDetail={handleDetail}
      />
  ) : content;

  content = loadingFlag ? (<Loading />) : (content);
    



  return (
    <>
      <div className="row">
        <div className="col-md-6">
          <h1>{props.header}</h1>
        </div>
        <div className="col-md-6">
          {addButton}
        </div>
      </div>
      {content}
    </>
  );
};

const mapStateToProps = (state, ownProps) => ({
  loading: state.loading,
  records: state[ownProps?.collection]?.records,
  record: state.record,
  isIndex: state.paging === pagingEnum.INDEX, 
  isForm: state.paging === pagingEnum.FORM,
  isDetail: state.paging === pagingEnum.DETAIL,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  delete: (model) => {
    dispatch(ownProps.actions?.Delete(model));
  },
  fetch: () => {
    dispatch(ownProps.actions?.Fetch());
  },
  setLoading: (bool) => {
    dispatch(loadingActions.setLoading(bool));
  },
  setIndex: () => {
      dispatch(pagingActions.setIndex());
  },
  setForm: () => {
      dispatch(pagingActions.setForm());
  },
  setDetail: () => {
      dispatch(pagingActions.setDetail());
  },
  setRecord: (record) => {
      dispatch(setRecord(record))
  }

});

export default connect(mapStateToProps, mapDispatchToProps)(IndexBase);
