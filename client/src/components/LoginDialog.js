import { getCurrentUser, loginByGoogle, loginByTwitter } from "../logic/firebase";
import styled from 'styled-components';
import Button from '@mui/material/Button'
// import twitter icon
import TwitterIcon from '@mui/icons-material/Twitter';
import GroupIcon from '@mui/icons-material/Group';
import logo from '../logo.gif';
import { red } from '@mui/material/colors';

const color = red[500];

// add icon to top
const Icon = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    padding: 20px;
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
  border-radius: 16px;
  padding: 40px 60px 100px 60px;
  box-shadow: 0px 0px 10px #0000006f;
`

const CustomRoomWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  justify-content: center;
  .tip {
    font-size: 18px;
}
`

// scale buttons to same width
const ButtonWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
    justify-content: center;
    .Button {
        width: 250px;
    }
    padding: 30px 0 0 0;
`

const Title = styled.h1`
    font-size: 20px;
    font-weight: 800;
    color: #516dd2;
    text-align: center;
    margin: 0;
`

const LoginTitle = styled.h3`
    font-size: 20px;
    font-weight: 500;
    color: #555555;
    text-align: center;
    margin: 0;
}
`

function Logo() {
    return (
        <img src={logo} alt="logo" style={{ width: '40%', minWidth: '200px' }} />
    );
}
export default function LoginDialog() {
    return (
        <>
            <Icon><Logo/></Icon>
            <Backdrop>
                <Wrapper>
                    <CustomRoomWrapper>
                        <Title>WELCOME TO PFPCHAT</Title>
                        <ButtonWrapper>
                            <Button variant="outlined" startIcon={<TwitterIcon />} size="medium" style={{ width: '150px' }}>
                                Twitter
                            </Button>
                            <Button variant="outlined" startIcon={<GroupIcon />} size="medium" style={{ width: '150px', fontWeight: 800 }}>
                                GUEST
                            </Button>
                            <Button variant="contained" size="medium" style={{ width: '250px', fontWeight: 800 }} color='metamask' >
                                CONNECT METAMASK
                            </Button>
                        </ButtonWrapper>
                    </CustomRoomWrapper>
                </Wrapper>
            </Backdrop>
        </>
    )
}