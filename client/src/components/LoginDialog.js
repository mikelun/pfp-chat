import { loginByTwitter } from "../logic/firebase";
import styled from 'styled-components';
import Button from '@mui/material/Button'
// import twitter icon
import TwitterIcon from '@mui/icons-material/Twitter';
import GroupIcon from '@mui/icons-material/Group';
import catLogo from '../cat-logo.png';
import GoogleIcon from '@mui/icons-material/Google';
import { loginByMoralis } from "../logic/moralis";


const Background = styled.div`
    background-color: #5680e9;
    height: 100%;
    width: 100%;
    `;


const Backdrop = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  gap: 60px;
  align-items: center;
`

const Wrapper = styled.div`
  background: #ffffff;
  border-radius: 30px;
  padding: 40px 50px 60px 50px;
  box-shadow: 0px 0px 10px #0000006f;
`
// scale buttons to same width
const ButtonWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: 'Rubik', sans-serif;
    padding: 0px 0px 0px 0px;
`

const Title = styled.h1`
    font-size: 22px;
    font-family: 'Rubik', sans-serif;
    color: #282D4E;
    text-align: center;
    margin: 0;
    padding: 20px 0px 30px 0px;
`
const OrText = styled.p`
    font-size: 16px;
    font-weight: 800;
    font-family: 'Rubik', sans-serif;
    opacity: 0.5;
`

function Logo() {
    return (
        <img src={catLogo} alt="logo" style={{ width: '100%', minWidth: '100%', margin: '0px', padding: '0px' }} />
    );
}

function TwitterButton() {
    return (
        <Button variant="outlined" onClick={() => loginByTwitter()} startIcon={<TwitterIcon/>} size="medium" style={{ width: '300px', fontWeight: 800, borderRadius: '15px', borderColor: '#282D4E', color: '#282D4E', height: '40px', fontFamily: "'Rubik', sans-serif" }}>SIGN IN WITH TWITTER</Button>
    );
}

function MetamaskButton() {
    return (
        <Button variant="contained" onClick={() => {loginByMoralis()}} size="medium" style={{ width: '300px', fontWeight: 800, borderRadius: '15px', borderColor: '#282D4E', color: '#282D4E', height: '40px', fontFamily: "'Rubik', sans-serif", backgroundColor: "#FFC44B" }}>CONNECT METAMASK</Button>
    );
}


export default function LoginDialog() {
    return (
        <Background>
            <Backdrop>
                <Wrapper>
                        <Logo />
                        <Title>WELCOME TO PFPCHAT!</Title>
                        <ButtonWrapper>
                            <TwitterButton />
                            <OrText>or</OrText>
                            <MetamaskButton/>
                        </ButtonWrapper>
                </Wrapper>
            </Backdrop>
        </Background>
    )
}