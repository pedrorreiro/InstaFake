import '../css/direct.css';
import { useEffect, useState } from "react";
import Chat from '../Components/Chat';
import { getDataUser } from "../db/db";
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