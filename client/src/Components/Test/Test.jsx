import React, { useState } from "react";
import {
    MBDBtn,
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
    MDBModalFooter,
} from "mdb-react-ui-kit";

class Test extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            now: 0,
        };
        this.containerDiv = React.createRef();
    }

    render() {
        return (
            <div class="container" ref={this.containerDiv}>
                <h1>Hola mundo!</h1>
            </div>
        );
    }
}

export default Test;