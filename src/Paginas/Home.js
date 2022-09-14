import React, { useEffect, useState, useContext } from "react";
import '../css/home.css';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import { getDataUser, post } from "../db/db";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { onValue, ref } from "firebase/database";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { Context } from '../Context';
import { database, enviarEmailVerificacao } from "../db/db";
import Feed from "../Components/Feed";

export default function Home(props) {

    const [user] = useContext(Context);

    const [uploading, setUploading] = useState(false);
    const [descricao, setDescricao] = useState(null);
    const [userData, setUserData] = useState(null);
    const [imageToPost, setImageToPost] = useState(null);
    const [posts, setPosts] = useState([]);
    const [showCriarPost, setShowCriarPost] = useState(false);
    const [open, setOpen] = useState(false);
    const [mostrandoDadosUserLike, setMostrandoDadosUserLike] = useState(false);
    const [usersLike, setUsersLike] = useState([]);

    const navigate = useNavigate();

    const mostrarUsersLike = (users) => {

        setUsersLike(users);

        setMostrandoDadosUserLike(true);
    }

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

        if (imageToPost == null) {
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

                var usersData = [];

                const chatRef = ref(database, 'posts/');

                onValue(chatRef, async (snapshot) => {

                    const allPosts = snapshot.val();

                    if (allPosts === null) {
                        setPosts([]);
                        return;
                    }

                    var posts = [];
                    var postsToShow = [];

                    for (let i in allPosts) {
                        for (let j in allPosts[i]) {
                            const p = allPosts[i][j];
                            posts.push(p);
                        }
                    }


                    for (let i in posts) {

                        if (posts[i].user === dados.user) {
                            posts[i] = { ...posts[i], userPhoto: dados.photoURL };
                            postsToShow.push(posts[i]);
                        }

                        else {
                            dados.followingUsers.forEach(u => {

                                if (posts[i].user === u) {

                                    posts[i] = { ...posts[i], userPhoto: `https://firebasestorage.googleapis.com/v0/b/projeto-instagram-93637.appspot.com/o/avatar%2F${u}%2F${u}?alt=media` };
                                    postsToShow.push(posts[i]);
                                }
                            })
                        }


                    }

                    postsToShow.sort(function (a, b) {
                        return new Date(a.createdAt) - new Date(b.createdAt);
                    });

                    if (postsToShow.length > 0) {
                        setPosts(postsToShow);
                    }

                    else {
                        setPosts(null);
                    }

                });
            }
            getUser();

        }
    }, []);

    const hiddenFileInput = React.useRef(null);

    const handleClick = event => {
        hiddenFileInput.current.click();
    };

    return (
        <div id="page">

            <div id="mensagemNews">

                <Alert severity="info">
                    <AlertTitle>Novo aqui?</AlertTitle>
                    <p>Na <strong>barra de pesquisa</strong> lá em cima, pesquise por "pedrorreiro" e me siga. Você vai conseguir visualizar, curtir e comentar as postagens tanto no meu perfil, quanto na sua timeline.</p>

                </Alert>


                {!user.emailVerified ?
                    <Alert severity="warning">
                        <AlertTitle>Verifique seu e-mail</AlertTitle>

                        <div>
                            <p>Você ainda não verificou seu e-mail.
                                Verifique na sua <strong>caixa de entrada</strong> ou no <strong>span</strong>.
                                Com seu e-mail verificado você pode conversar com seus amigos no direct!</p>
                            <p>Se você não recebeu um e-mail verificação, clique <strong className="link" onClick={async () => {
                                const retorno = await enviarEmailVerificacao(user);
                                alert(retorno.msg);
                            }}>aqui</strong> para enviarmos novamente.</p>

                        </div>
                    </Alert> : null}

            </div>

            <div id="Content">

                <Feed posts={posts} userData={userData} setUploading={setUploading} />

                <div id="post-area">
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

                    <div id="criarPost" onClick={() => setShowCriarPost(!showCriarPost)}>
                        Criar Post
                    </div>

                    {showCriarPost ? <div id="post-area">
                        <label>Descrição</label>

                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            await postar();
                        }}>

                            <input type="textarea" className="textarea" required onChange={(e => setDescricao(e.target.value))} />

                            <div id="inputButton" onClick={handleClick}>
                                <AddPhotoAlternateIcon />
                                <span>Selecionar foto</span>
                            </div>

                            {imageToPost !== null ? <p>{imageToPost.name}</p> : null}

                            <input type="file" style={{ display: "none" }} accept="image/png,image/jpeg" ref={hiddenFileInput} onChange={async (e) => {

                                await carregarImgPost(e.target.files[0]);

                            }} />

                            {!uploading ? <input type="submit" value="Publicar" /> : <p style={{ marginTop: 20 }}>Carregando...</p>}

                        </form>
                    </div> : null}

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