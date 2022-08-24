import React, { useEffect, useState, useContext} from "react";
import '../css/home.css';
import { useNavigate, Link } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { getDataUser, getFollowersPosts, post } from "../db/db";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { diffTime } from '../Tools/DiffTime';
import { Alert } from 'antd';
import { Context } from '../Context';

export default function Home(props) {

    const [user] = useContext(Context);

    const [uploading, setUploading] = useState(false);
    const [descricao, setDescricao] = useState(null);
    const [userData, setUserData] = useState(null);
    const [imageToPost, setImageToPost] = useState(null);
    const [posts, setPosts] = useState([]);
    const [showCriarPost, setShowCriarPost] = useState(false);

    const navigate = useNavigate();

    async function pegaPosts(user) {
        const posts = await getFollowersPosts(user);
        // console.log(posts);
        setPosts(posts);
    }

    const carregarImgPost = async (image) => {
        //console.log(image);
        if (image == null) return;

        setImageToPost(image);
    }

    const postar = async () => {

        if (imageToPost == null || descricao == null) {
            alert("Selecione uma imagem para postar");
            setUploading(false);
            return;
        }

        const postData = {
            user: userData,
            userPhoto: userData.photoURL,
            descricao: descricao,
            image: imageToPost
        }

        await post(postData);
        await pegaPosts(userData);
        setUploading(false);
    }

    useEffect(() => {

        if (user !== null) {
            async function getUser() {
                const dados = await getDataUser(user);
                setUserData(dados);
                pegaPosts(dados);
                // console.log(dados);
            }
            getUser();

            document.querySelectorAll(".MuiInputBase-input").placeholder = "O que está acontecendo?";

        }
    }, [user]);

    const hiddenFileInput = React.useRef(null);

    const handleClick = event => {
        hiddenFileInput.current.click();
    };

    return (
        <div id="page">

                <div id="mensagemNews">
                    <Alert
                        message={<strong>Funcionalidades do InstaFake</strong>}
                        description={<ul>
                            <li>O direct está funcionando! Nele você pode trocar mensagens em tempo real com as pessoas que você segue.</li>
                            <li>Agora você pode fazer novos posts no menu da direita.</li>
                            <li>Agora você pode ver as postagens dos seus amigos no feed.</li>
                            <li><strong>Aviso:</strong> o feed não é atualizado em tempo real. Portanto, para ver as novas postagens, atualize a página.</li>
                        </ul>}
                        type="info"
                        showIcon
                        closable
                    />
                </div>

                <div id="criarPost" onClick={() => setShowCriarPost(!showCriarPost)}>
                    Criar Post
                </div>

                {showCriarPost ? <div id="post-area">
                        <label>Descrição</label>

                        <input type="textarea" className="textarea" onChange={(e => setDescricao(e.target.value))} />

                        <div id="inputButton" onClick={handleClick}>
                            <span>Selecionar foto</span>
                        </div>

                        {imageToPost !== null ? <strong>{imageToPost.name}</strong> : null}

                        <input type="file" style={{ display: "none" }} accept="image/png,image/jpeg" ref={hiddenFileInput} onChange={async (e) => {

                            await carregarImgPost(e.target.files[0]);

                        }} />

                        <input type="submit" value="Publicar" onClick={() => {
                            setUploading(true);
                            postar();
                        }} />
                    </div> : null}

            <div id="Content">

                <div id="feed">

                    {posts.length === 0 ?

                        <div className="Post">
                            <div className="Post-Header">
                                <div className="Autor">
                                    <Avatar alt="Foto de perfil" />
                                    <span></span>
                                </div>

                                <MoreHorizIcon></MoreHorizIcon>

                            </div>

                            <div className="Photo">
                                <p>Não há posts ainda. Parece que você não tem amigos :(</p>
                            </div>
                            <div className="Post-Description"></div>
                        </div>

                        : null}

                    {posts.slice(0).reverse().map((post, index) => {

                        const linkPerfil = "/" + post.user;

                        const dataPost = post.createdAt.toDate();

                        const diff = diffTime(dataPost);

                        return (
                            <div className="Post" key={post.photoURL}>
                                <div className="Post-Header">
                                    <Link to={linkPerfil}><div className="Autor">
                                        <Avatar alt="Foto de perfil" src={post.userPhoto} />
                                        <span>{post.user} - Postado {diff}</span>
                                    </div>
                                    </Link>
                                    <MoreHorizIcon></MoreHorizIcon>

                                </div>

                                <div className="Photo">
                                    <img alt="Foto do usuário" src={post.photoURL}></img></div>
                                <div className="Post-Description">{post.descricao}</div>

                                <div className="Post-Footer">
                                    <i className="heart large outline icon"></i>
                                </div>

                            </div>
                        )
                    })}

                </div>

                <div id="right-side">
                    <div id="me" onClick={() => {

                        if (userData !== null) {

                            navigate('/' + user.displayName);
                        }

                    }}>
                        {user !== null ? <Avatar src={user.photoURL} /> : <Avatar />}

                        {user !== null && userData !== null ? (
                            <div id="me-info">
                                <div id="me-user">{user.displayName}</div>
                                <div id="me-name">{userData.name}</div>

                            </div>
                        ) : null}

                    </div>

                </div>

                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={uploading}
                >
                    <CircularProgress />
                </Backdrop>

            </div>
        </div>
    );
}