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
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
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
    font-size: 24px;
    font-family: 'Rubik', sans-serif;
    color: #282D4E;
    text-align: center;
    margin: 0;
    padding: 20px 0px 30px 0px;
`
const OrText = styled.p`
    font-size: 16px;
    font-weight: 600;
    font-family: 'Rubik', sans-serif;
    opacity: 0.5;
`

function Logo() {
    return (
        <img src={catLogo} alt="logo" style={{ width: '250px', }} />
    );
}

function TwitterButton() {
    return (
        <Button variant="outlined" onClick={() => loginByTwitter()} startIcon={<TwitterIcon />} size="medium" style={{ width: '300px', fontWeight: 600, borderRadius: '15px', borderColor: '#282D4E', color: '#282D4E', height: '40px', fontFamily: "'Rubik', sans-serif" }}>SIGN IN WITH TWITTER</Button>
    );
}

function EmailInput() {
    return (
        <input type="email" placeholder="Enter your email" style={{ fontFamily: "'Rubik', sans-serif", fontWeight:600, fontSize:'18px', width: '290px', height: '38px', borderRadius: '15px', border:'1px solid #282d4e', color: '#282D4E',  textIndent:'15px'  }} />
    );
}
function EmailButton() {
    return (
        <Button variant="contained" onClick={() => { loginByMoralis() }} size="medium" style={{ width: '300px', fontWeight: 600, borderRadius: '15px', borderColor: '#282D4E', color: '#282D4E', height: '40px', fontFamily: "'Rubik', sans-serif", backgroundColor: "#FFC44B", marginTop: '10px', }}>SIGN IN WITH EMAIL</Button>
    );
}


export default function LoginDialog() {
    return (
        <Background>
            <Backdrop>
                <Wrapper>
                    <Logo />
                    <Title>WELCOME TO PFPCHAT!</Title>
                    <TwitterButton />
                    <OrText>or</OrText>
                    <EmailInput/>
                    <EmailButton />
                </Wrapper>
            </Backdrop>
        </Background>
    )
}