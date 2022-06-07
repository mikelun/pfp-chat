import logo from './logo.svg';
import './App.scss';
import styled from 'styled-components';
import LoginDialog from './components/LoginDialog';
import { Loader } from './components/Loader';
import { useSelector, useDispatch } from 'react-redux'
import './logic';

const Backdrop = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
`

function App() {

  const moralisUser = useSelector(state => state.login.moralisUser);
  const firebaseUser = useSelector(state => state.login.firebaseUser);
  
  let ui;
  if (moralisUser === -1 || firebaseUser === -1) {
    ui = <Loader />
  } else {
    ui = <LoginDialog />
  }

  return (
    <Backdrop>  
      {ui}
    </Backdrop>
  );
}

export default App;
