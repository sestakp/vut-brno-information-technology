/**
 * Author: Vojtěch Kulíšek
 */
import React from 'react';
import Filter from './Filter/Filter';
import { connect } from "react-redux";

function CardTable(props){

    let records = props.recordLibrary.filter(props.records, props.filter);
    return(
            <div className="row" style={{
                width: "100%",
                margin: "0"
            }}>
                <div className="col-md-2" style={{
                    paddingLeft: "0"
                }}>
                    <Filter recordLibrary={props.recordLibrary} actions={props.actions} filter={props.filter}/>
                </div>
                <div className="col-md-10" style={{
                    paddingRignt: "0"
                }}>
                <div className="row">
                    {records.map((record, index) => {
                        return <props.Card
                            key={"CardTable_"+index}
                            id={record.id}
                            record={record}
                            actions={props.actions}
                            selector={props.selector}
                            detailLink={props.detailLink}
                            cardTableHasImage={props.cardTableHasImage}
                            recordLibrary={props.recordLibrary}
                            presentationApproving={props.presentationApproving}
                        />
                    })}
                </div>
            </div>
        </div>
    )  
}


const mapStateToProps = (state, ownProps) => ({
    records: ownProps.selector.getAll(state),
    filter: ownProps.selector.getFilter(state),
  });
  
  const mapDispatchToProps = (dispatch, ownProps) => ({
  });
  
  export default connect(mapStateToProps, mapDispatchToProps)(CardTable);