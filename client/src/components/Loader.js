import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import logo from '../logo.gif';
import '../css/progressBar.css'

// make vertical on center
const Backdrop = styled.div`
    position: absolute;
    height: 100%;
    width: 100%;
    background-color: #332882;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`
const Container = styled.div`
    padding-top: 200px;
`


function Logo() {
    return (
        <img src={logo} alt="logo" style={{ width: '300px' }} />
    );
}


// set up animations and add loading text
function ProgressBar() {
    return (
        <div className="loader">Loading...</div>
    )
}



export function Loader() {
    return (
        <Backdrop>
            <Container>
                <Logo />
                <ProgressBar/>
            </Container>
        </Backdrop>
    );
}