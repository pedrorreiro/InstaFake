import "../css/chat.css";
import { useEffect, useState } from "react";
import Avatar from '@mui/material/Avatar';
import SendIcon from '@mui/icons-material/Send';
import { sendMsg, database } from "../db/dbChat";
import { onValue, ref } from "firebase/database";
import { Link } from "react-router-dom";

export default function Chat(props) {

    const userSelecionado = props.userSelecionado;
    const userData = props.userData;

    const [mensagens, setMensagens] = useState([]);
    const [mensagem, setMensagem] = useState("");

    const mandarMsg = () => {
        if (mensagem === "") return;

        sendMsg(userData, userSelecionado, mensagem);

    }

    useEffect(() => {

        const chatRef = ref(database, 'chats/' + userData.user + '/' + userSelecionado.user + '/msgs');

        onValue(chatRef, (snapshot) => {
            const data = snapshot.val();
            setMensagens(data);
            //console.log("oi");
            // rolar para final do chat

            const chat = document.getElementById("mensagens");

            chat.scrollBy(0, 3000000);


        });

    }, [userSelecionado]);

    var elementoMensagens = [];

    var counter = 0;

    if (mensagens) {
        Object.values(mensagens).forEach(mensagem => {

            var tipoMsg = "";
            counter++;

            var justify;

            if (mensagem.me) {
                tipoMsg = "minha";
                justify = "flex-end";
            }
            else tipoMsg = "naoMinha"

            elementoMensagens.push(
                <div className="areaMsg" key={counter} style={{
                    display: "flex",
                    justifyContent: justify

                }}>
                    <div className={`mensagem ${tipoMsg}`}>
                        {/* <Avatar src={mensagem.photoURL} id="fotoAvatar"/> */}
                        <span>{mensagem.msg}</span>
                    </div>
                </div>

            )
        });
    }

    return (
        <div id="chat">

            <div id="header-chat">
                {userSelecionado !== null && userSelecionado !== undefined ?
                
                    <Link to={`/${userSelecionado.user}`}>
                        <Avatar src={userSelecionado.photoURL} id="fotoAvatar" />
                    </Link>
                    :
                    <Avatar id="fotoAvatar" />



                }

                {userSelecionado !== null && userSelecionado !== undefined ? <p>{userSelecionado.name}</p> : <p>Nenhum usuário encontrado</p>}

            </div>

            {mensagens ? <div id="mensagens">

                {elementoMensagens}

            </div> : null}

            <div id="footer-chat">
                <input type="text" onChange={(e) => { setMensagem(e.target.value) }} value={mensagem} onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        mandarMsg();
                        setMensagem("");
                    }

                }} />

                <SendIcon id="enviar" onClick={() => {
                    mandarMsg();
                    setMensagem("");
                }} />


            </div>
        </div>
    );
}