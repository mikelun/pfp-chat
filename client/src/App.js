import logo from './logo.svg';
import './App.scss';
import styled from 'styled-components';
import LoginDialog from './components/LoginDialog';

const Backdrop = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
`

function App() {
  return (
    <Backdrop>  
        <LoginDialog/>
    </Backdrop>
  );
}

export default App;
