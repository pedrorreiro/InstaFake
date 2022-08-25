import React, { useEffect, useState, useContext } from "react";
import '../css/home.css';
import { useNavigate, Link } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { getDataUser, post } from "../db/db";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { diffTime } from '../Tools/DiffTime';
import { Alert } from 'antd';
import { onValue, ref } from "firebase/database";
import { Context } from '../Context';
import { database } from "../db/db";
import PostMenu from '../Components/PostMenu';
import { likePost } from "../db/dbPost";

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

                const chatRef = ref(database, 'posts/');

                onValue(chatRef, async (snapshot) => {
                    const data = snapshot.val();
                    
                    if (data === null) {
                        setPosts([]);
                        return;
                    }

                    var posts = [];

                    for (let i in data) {
                        for (let j in data[i]) {
                            posts.push(data[i][j]);
                        }
                    }

                    var postsToShow = [];

                    for (let i in posts) {
                        if(dados.followingUsers.includes(posts[i].user) || dados.user === posts[i].user) {
                            const u = await getDataUser({displayName: posts[i].user});
                  
                            posts[i] = {...posts[i], userPhoto: u.photoURL};

                            postsToShow.push(posts[i]);
                        }
                    }

                    postsToShow.sort(function(a,b){
                        return new Date(a.createdAt) - new Date(b.createdAt);
                      });

                    console.log(postsToShow);
                    setPosts(postsToShow);

                    
                });
            }
            getUser();

        }
    }, [user]);

    const hiddenFileInput = React.useRef(null);

    const handleClick = event => {
        hiddenFileInput.current.click();
    };

    const renderLike = (post) => {
       
        if (post.likesUsers !== undefined) {
            // console.log(user);
            if (post.likesUsers.includes(userData.user)) {
                return <FavoriteIcon sx={{ color: "#ed4956" }} onClick={async () => likePost(post, user)} key={post.id} />
            }

            else {
                return <FavoriteBorderIcon onClick={async () => likePost(post, user)} />
            }

        }

        else {
            return <FavoriteBorderIcon onClick={async () => likePost(post, user)} />
        }
    }

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
                }} /> : <p style={{ marginTop: 20 }}>Carregando...</p>}
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

                                    {post.user === userData.user ? <PostMenu setUploading={setUploading} post={post} /> : null}

                                </div>

                                <div className="Photo">
                                    <img alt="Foto do usuário" src={post.photoURL}></img></div>
                                <div className="Post-Description">{post.descricao}</div>

                                <div className="Post-Footer">

                                    {renderLike(post)}
                                </div>

                                <div className="Post-Footer">

                                    {post.likes > 0 && post.likes < 3 ? 
                                        <p>Curtido por <strong>{post.likes}</strong> pessoas</p> 
                                    : null}

                                    {post.likes > 2 ?
                                        <p>Curtido por <strong>{post.likesUsers[0]}, {post.likesUsers[1]}</strong> e outras <strong>{post.likes - 2} pessoas</strong></p> 
                                    : null}

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