import React, { useEffect, useState, useContext } from "react";
import '../css/home.css';
import { useNavigate, Link } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { getDataUser, getFollowersPosts, post } from "../db/db";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { diffTime } from '../Tools/DiffTime';
import { Alert } from 'antd';
import { onValue, ref } from "firebase/database";
import { Context } from '../Context';
import { database } from "../db/db";
import PostMenu from '../Components/PostMenu';

export default function Home(props) {

    const [user] = useContext(Context);

    const [uploading, setUploading] = useState(false);
    const [descricao, setDescricao] = useState(null);
    const [userData, setUserData] = useState(null);
    const [imageToPost, setImageToPost] = useState(null);
    const [posts, setPosts] = useState([]);
    const [showCriarPost, setShowCriarPost] = useState(false);
    const [open, setOpen] = useState(false);

    const navigate = useNavigate();

    const carregarImgPost = async (image) => {
        //console.log(image);
        if (image == null) return;

        setImageToPost(image);
    }

    const handleToggle = () => {
        setOpen(!open);
    };

    const postar = async () => {

        setUploading(true);

        if (imageToPost == null || descricao == null) {
            alert("Selecione uma imagem para postar");
            setUploading(false);
            return;
        }

        console.log(userData.user);

        const postData = {
            user: userData.user,
            userPhoto: userData.photoURL,
            descricao: descricao,
            image: imageToPost
        }

        await post(postData);

        setUploading(false);
    }

    useEffect(() => {

        if (user !== null) {
            async function getUser() {
                const dados = await getDataUser(user);
                setUserData(dados);

                const chatRef = ref(database, 'posts/' + dados.user);

                onValue(chatRef, (snapshot) => {
                    const data = snapshot.val();

                    if(data === null){
                        setPosts([]);
                        return;
                    }

                    var posts = [];

                    Object.values(data).forEach(post => {
                        if(dados.followingUsers.includes(post.user) || dados.user === post.user) {
                            posts.push(post);
                        }
                    });
                    setPosts(posts);
                });
            }
            getUser();

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

                {!uploading ? <input type="submit" value="Publicar" onClick={async () => {
                    await postar();
                }} /> : <p style={{marginTop: 20}}>Carregando...</p>}
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

                        const dataPost = new Date(post.createdAt);

                        const diff = diffTime(dataPost);

                        return (
                            <div className="Post" key={post.photoURL}>
                                <div className="Post-Header">
                                    <Link to={linkPerfil}><div className="Autor">
                                        <Avatar alt="Foto de perfil" src={post.userPhoto} />
                                        <span>{post.user} - Postado {diff}</span>
                                    </div>
                                    </Link>

                                    <PostMenu setUploading={setUploading} post={post} />

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