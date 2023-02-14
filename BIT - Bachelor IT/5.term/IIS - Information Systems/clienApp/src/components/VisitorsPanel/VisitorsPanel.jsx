/**
 * Author: Lukáš Plevač
 */
import React, { useEffect, useState } from "react";
import TicketActions from "../../redux/tickets/ticketActions";
import TicketSelector from "../../redux/tickets/ticketSelector";
import Loading from "../Loading/Loading";
import { connect } from "react-redux";
import ButtonNormal from "../ButtonNormal/ButtonNormal";
import { Autocomplete } from "@material-ui/lab";
import TicketStatusSelect from "./TicketStatusSelect/TicketStatusSelect";

function VisitorsPanel(props) {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    props
      .getVisitors({ conference_id: props.conference_id })
      .then(_ => setLoading(false));
  }, []);


  if (loading) {
    return <Loading />;
  }
  return (
      <section>
            <div>
              <h1 style={{marginTop: "46px"}}>Visitors</h1>
            </div>
            {props.visitors.map((visitor, index) => (
              <div key={"mapVisitorsInVisitorPanel_"+index}>
                <div>
                  <div className="border-bottom p-1" style={{display: "flex"}}>
                    <div className="col-md-9">
                      <p className="m-0">
                        <b>{visitor.user?.name}</b>
                      </p>
                      <p>{visitor.user?.email}</p>
                    </div>
                    <div className="col-md-3">
                      {/*<p> <span className="badge bg-info">{visitor.status}</span></p>*/}
                          <TicketStatusSelect visitor={visitor}/>
                    </div>
                  </div>
                </div>
              </div>
            ))}
      </section>
  );
}

const mapStateToProps = (state, ownProps) => ({
  visitors: TicketSelector.getVisitors(state),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  getVisitors: (params) => dispatch(TicketActions.GetVisitors(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(VisitorsPanel);
