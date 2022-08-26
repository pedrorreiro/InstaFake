import '../css/direct.css';
import { useEffect, useState } from "react";
import Chat from '../Components/Chat';
import { getDataUser, enviarEmailVerificacao } from "../db/db";
import Avatar from '@mui/material/Avatar';
import { Context } from "../Context";
import { useContext } from "react";

export default function (props) {

    const userData = props.userData;
    const [user, setUser] = useContext(Context);
    const [seguindoDados, setSeguindoDados] = useState([]);
    const [userSelecionado, setUserSelecionado] = useState(null);

    var count = 0;

    const getFollowersData = async (user) => {
        const seguindo = user.followingUsers;
        //console.log(seguindo);

        var dadosSeguidores = [];

        for (const usuario of seguindo) {
            const seguindoDados = await getDataUser({ displayName: usuario });
            dadosSeguidores.push(seguindoDados);
        }

        // console.log(dadosSeguidores);
        setSeguindoDados(dadosSeguidores);
        console.log(dadosSeguidores);

        if (dadosSeguidores !== null && dadosSeguidores.length > 0) {
            setUserSelecionado(dadosSeguidores[0]);
        }

    }

    useEffect(() => {

        async function getFollowers() {

            getFollowersData(userData);
        }

        if (userData) {
            getFollowers();
        }

    }, [userData]);

    if (user !== null && !user.emailVerified) {
        return (<div id='erroVerificacao'>
            <h1>Eii, parece que você ainda não verificou seu e-mail.</h1>

            <h2>Clique <strong className="link" onClick={async () => {
                const retorno = await enviarEmailVerificacao(user);
                alert(retorno.msg);
            }}>aqui</strong> para enviarmos um e-mail de verificação.
            </h2>

        </div>)
    }

    else {
        return (
            <div id="direct">


                {seguindoDados.length > 0 ?
                    <div id="direct-box">
                        <div id="direct-contatos">
                            {seguindoDados.map(contato => {

                                count++;

                                return (
                                    <div id="contato" key={count} onClick={() => {
                                        setUserSelecionado(contato);
                                    }}>
                                        <Avatar src={contato.photoURL} id="fotoAvatar"></Avatar>
                                        <p>{contato.user}</p>
                                    </div>

                                )
                            })}
                        </div>

                        {userSelecionado !== null ? <Chat userData={userData} userSelecionado={userSelecionado} /> : null}

                    </div> : null
                }

                {seguindoDados.length <= 0 && user ? <div>
                    <h1 style={{ textAlign: "center" }}>Que pena, você ainda não segue ninguém 😕</h1>
                </div> : null}

            </div>
        )
    }
}