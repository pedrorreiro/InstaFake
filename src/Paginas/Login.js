import '../css/style.css';
import { Link } from 'react-router-dom';
import celulares from '../img/login/celulares.png';
import logo from '../img/login/logo.png';
import { login } from "../db/db.js"
import { useState } from 'react';
import { useEffect, useContext } from 'react';
import { Context } from '../Context';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

function Login(props) {

    const [user, setUser] = useContext(Context);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setErro] = useState(null);
    const [carregando, setCarregando] = useState(false);
    const [camposPreenchidos, setCamposPreenchidos] = useState(false);

    useEffect(() => {

        const verificaCampos = () => setCamposPreenchidos(email === '' || password === '');
        
        verificaCampos();
    }, [email, password]);

    const handleEmail = (e) => {
        setEmail(e.target.value);
    }

    const handlePassword = (e) => {
        setPassword(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            email,
            password
        };

        setCarregando(true);

        const result = await login(data);

        if(result.sucess){
            setUser(result.user);

        }
        
        else{
            setErro({
                msg: result.msg,
                type: result.type
            })
        }

        setCarregando(false);
    }

    return (
        <div className="Login">
            <img alt="celulares" id="Celulares" src={celulares}></img>

            <div id="LoginBox">
                <div id="Login" className='Box'>
                    <img alt="logo" id="Logo" src={logo}></img>

                    <form onSubmit={handleSubmit}>
                        <input type="email" placeholder='E-mail' maxLength={75} onChange={handleEmail} required></input>
                        <input type="password" placeholder='Senha' onChange={handlePassword} required></input>

                        {error ? <Alert className="error" severity={error.type}>{error.msg}</Alert> : null}

                        {carregando ? <CircularProgress /> : <input style={camposPreenchidos ? DisableButton : null} type="submit" value={"Entrar"}></input>}

                    </form>

                </div>

                <div id="Esqueceu" className='Box'>
                    <p>Não tem uma conta? <Link to='/signup'><span>Cadastre-se</span></Link></p>
                </div>
            </div>


        </div>
    );
}

var DisableButton = {
    backgroundColor: '#b2dffc',
}

export default Login;
