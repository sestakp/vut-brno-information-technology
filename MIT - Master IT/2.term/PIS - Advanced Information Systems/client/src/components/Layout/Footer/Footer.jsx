
import React from "react"
import { Grid } from "@mui/material"

import "./footer.css"
import employeesClient from "../../../api/employeesClient"
import { connect } from "react-redux"
import employeesAction from "../../../redux/employees/employeesActions"


const Footer = (props) => {

    return(
        <footer>
                <Grid container>
                    <Grid item md={4} style={{padding: "30px"}}>

                    </Grid>
                    <Grid item md={4} style={{padding: "30px"}}>
                        <p><a href="/doc">Documentation</a></p>
                    </Grid>
                    <Grid item md={4} style={{padding: "30px"}}>
                        <p><a href="/credits">Credits</a></p>
                        <p onClick={() => props.init()}>Seed data</p>
                    </Grid>
                </Grid>
        </footer>
    )

}

const mapStateToProps = (state, ownProps) => ({  
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  init: () => dispatch(employeesAction.init())
});

export default connect(mapStateToProps, mapDispatchToProps)(Footer);