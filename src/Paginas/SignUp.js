import '../css/style.css';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import logo from '../img/login/logo.png';
import { useState } from 'react';
import { register } from "../db/db.js"
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

function SignUp() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [user, setUser] = useState('');
    const [camposPreenchidos, setCamposPreenchidos] = useState(false);
    const [error, setError] = useState(null);
    const [carregando, setCarregando] = useState(false);

    useEffect(() => {

        const verificaCampos = () => setCamposPreenchidos(email === '' || password === '' || confirmPassword === '' || name === '');

        verificaCampos();
    } , [email, password, confirmPassword, name, user]);

    const newAccount = async () => {

        setCarregando(true);

        const data = {
            email,
            password,
            confirmPassword,
            name,
            user
        };

        const result = await register(data);

        if(result.sucess){
            alert('Usuário criado com sucesso');
            setCarregando(false);
            window.location.href = '/';
        }
        
        else{
            setError({
                msg: result.msg,
                type: result.type
            })
            setCarregando(false);
        }

    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError({
                msg: 'As senhas não conferem',
                type: 'warning'
            })
    
        } else {
            await newAccount();
        }
    }

    const handleEmail = (e) => {
        setEmail(e.target.value);
    }

    const handlePassword = (e) => {
        setPassword(e.target.value);
    }

    const handleConfirmPassword = (e) => {
        setConfirmPassword(e.target.value);
    }

    const handleName = (e) => {
        setName(e.target.value);
    }

    const handleUser = (e) => {
        setUser(e.target.value);
    }

    return (
        <div className="SignUp">

            <div id="SignUp" className='Box'>
                <img alt="logo" id="Logo" src={logo}></img>

                <p>Cadastre-se para ver fotos e <br></br>vídeos dos seus amigos.</p>

                <form onSubmit={handleSubmit}>
                    <input type="email" placeholder='Email' maxLength={75} onChange={handleEmail} required></input>
                    <input type="text" placeholder='Nome completo' maxLength={75} onChange={handleName} required></input>
                    <input type="text" placeholder='Nome de usuário' maxLength={75} onChange={handleUser} required></input>
                    <input type="password" placeholder='Senha' onChange={handlePassword} required></input>
                    <input type="password" placeholder='Confirmar senha' onChange={handleConfirmPassword} required></input>

                    <p className='Info'>As pessoas que usam nosso serviço podem ter carregado suas informações de contato no Instagram. <span>Saiba mais</span></p>

                    <p className='Info'>Ao se cadastrar, você concorda com nossos <span>Termos, Política de Privacidade</span> e <span>Política de Cookies.</span></p>

                    {carregando ? <CircularProgress /> : <input style={camposPreenchidos ? DisableButton : null} type="submit" value={"Cadastre-se"}></input>}

                    {error ? <Alert className="error" severity={error.type}>{error.msg}</Alert> : null}
                </form>

            </div>

            <div id="JaTem" className='Box'>
                <p>Tem uma conta? <Link to='/'><span>Conecte-se</span></Link></p>
            </div>

        </div>
    );
}

var DisableButton = {
    backgroundColor: '#b2dffc',
}

export default SignUp;
