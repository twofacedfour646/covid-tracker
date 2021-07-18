import React from 'react';
import {Card, CardContent, Typography} from "@material-ui/core";
import "./InfoBox.css";
import AddIcon from '@material-ui/icons/Add';

function InfoBox(props) {
    return (
        <Card className={`infoBox ${props.active && "infoBox--selected"} ${props.isRed && props.active && "infoBox--red"}`} onClick={props.onClick}>
            <CardContent>
                <Typography color="textSecondary" className="infoBox__title">
                    {props.title}
                </Typography>

                <h2 className="infoBox__cases">
                    <span className={props.caseType}><AddIcon fontSize="large"/> {props.cases}</span>
                </h2>

                <Typography className="infoBox__total">
                    {props.total} Total
                </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox
