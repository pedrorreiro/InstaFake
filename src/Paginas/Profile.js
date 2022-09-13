import { useParams } from 'react-router-dom';
import { useEffect, useContext, useState } from 'react';
import '../css/profile.css';
import { getDataUser } from "../db/db.js";
import Avatar from '@mui/material/Avatar';
import Backdrop from '@mui/material/Backdrop';
import { CircularProgress } from '@mui/material';
import { database, follow, verifyFollow, unFollow, changeAvatar } from "../db/db";
import { onValue, ref } from "firebase/database";
import { getUserPosts } from '../db/dbPost';
import { Context } from '../Context';
import { useNavigate } from 'react-router-dom';
import ListaPessoas from '../Components/ListaPessoas';
import { Post } from '../Components/Post';

function Profile(props) {

    const navigate = useNavigate();

    const [user] = useContext(Context);

    const { username } = useParams();

    const [userData, setUserData] = useState(undefined);
    const [meusDadosCompletos, setMeusDadosCompletos] = useState(null);
    const [euSigo, setEuSigo] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadingDeletePhoto, setUploadingDeletePhoto] = useState(false);
    const [mostrandoSeguindo, setMostrandoSeguindo] = useState(false);
    const [mostrandoSeguidores, setMostrandoSeguidores] = useState(false);
    const [posts, setPosts] = useState([]);
    const [postSelecionado, setPostSelecionado] = useState(null);
    const [mostrandoPostSelecionado, setMostrandoPostSelecionado] = useState(false);
    const [postSelecionadoData, setPostSelecionadoData] = useState(null);

    useEffect(() => {

        if (postSelecionado != null) {
            const chatRef = ref(database, `posts/${postSelecionado.user}/${postSelecionado.id}`);


            onValue(chatRef, async (snapshot) => {

                const p = snapshot.val();

                setPostSelecionadoData(p);

            });
        }


    }, [postSelecionado]);

    useEffect(() => {
        if (uploadingDeletePhoto) {
            setMostrandoPostSelecionado(false);
        }
    },[uploadingDeletePhoto]);

    const uploadImage = async (image) => {
        if (image == null) return;

        await changeAvatar(image, userData.user);

        setUploading(false);

    }

    async function seguir() {
        await follow(meusDadosCompletos, userData);
        await pegaDadosUsuario();

    }

    async function pararDeSeguir() {
        await unFollow(meusDadosCompletos, userData);
        await pegaDadosUsuario();

    }

    async function pegaDadosUsuario() {
        const dados = await getDataUser({ displayName: username });
        const meusDados = await getDataUser({ displayName: user.displayName });
        setUserData(dados);

        setMeusDadosCompletos(meusDados);

        if (dados !== null) { // caso o usuário existir
            setEuSigo(await verifyFollow(meusDados, dados));
        }
    }

    async function pegaPostsUsuario() {
        const posts = await getUserPosts(username);
        setPosts(posts);
    }

    useEffect(() => {


        async function isLogged() {
            if (user) {
                await pegaDadosUsuario();
                await pegaPostsUsuario();
            }
        }

        isLogged();

    }, [username, user]);

    if (user !== null && userData) {
        return (
            <div id="Content-Profile">
                <div id="User-Data">
                    <Avatar id="Profile-Photo" src={userData.photoURL}></Avatar>

                    <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={uploading}
                    >
                        <CircularProgress />
                    </Backdrop>

                    <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={mostrandoSeguidores}
                        onClick={() => setMostrandoSeguidores(false)}
                    >
                        <ListaPessoas usuarios={userData.followersUsers} tipo={"Seguidores"} />
                    </Backdrop>

                    {mostrandoPostSelecionado &&

                        <div className="Backdrop-Post">
                            {postSelecionadoData !== null && <Post id="postSelecionado" post={postSelecionadoData} userData={userData} setUploading={setUploadingDeletePhoto} />}
                            {mostrandoPostSelecionado && <div className="Fundo-Preto" onClick={() => { setMostrandoPostSelecionado(null) }}></div>}
                        </div>

                    }

                    <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={uploadingDeletePhoto}
                    >
                        <CircularProgress />
                    </Backdrop>

                    <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={mostrandoSeguindo}
                        onClick={() => setMostrandoSeguindo(false)}
                    >
                        <ListaPessoas usuarios={userData.followingUsers} tipo={"Seguindo"} />
                    </Backdrop>


                    <div id="User-Data-Info">
                        <div id="User-Options">
                            <div id="User-Data-Name">{userData.user}</div>
                            {username !== user.displayName ?
                                <div id="Profile-Buttons">
                                    {/* <div className='Profile-Button' onClick={async () => {
                                                    navigate(`/direct`);
                                                }}>Enviar mensagem</div> */}

                                    {!loading ? <div>

                                        {!euSigo ?
                                            <div className='Profile-Button' onClick={async () => {
                                                setLoading(true);
                                                await seguir();
                                                setLoading(false);
                                            }}>Seguir</div>
                                            :

                                            <div className='Profile-Button' style={{
                                                backgroundColor: "white",
                                                color: "black",
                                                border: "1px solid #dbdbdb"
                                            }} onClick={async () => {
                                                setLoading(true);
                                                await pararDeSeguir();
                                                setLoading(false);
                                            }}>Parar de Seguir</div>

                                        }

                                    </div> : <span>Carregando...</span>}

                                </div>
                                : null}

                        </div>


                        <div id="User-Public-Data-Desktop">
                            <span><strong>{userData.posts}</strong> publicações</span>
                            <span onClick={() => setMostrandoSeguidores(true)}><strong>{userData.followers}</strong> seguidores</span>
                            <span onClick={() => setMostrandoSeguindo(true)}><strong>{userData.following}</strong> seguindo</span>
                        </div>

                        <div id="Full-Name"><strong>{userData.name}</strong></div>
                        <div id="User-Bio">{userData.bio}</div>

                    </div>
                </div>

                <div id="User-Public-Data-Mobile">
                    <span><strong>{userData.posts}</strong> publicações</span>
                    <span onClick={() => setMostrandoSeguidores(true)}><strong>{userData.followers}</strong> seguidores</span>
                    <span onClick={() => setMostrandoSeguindo(true)}><strong>{userData.following}</strong> seguindo</span>
                </div>

                <div id="Posts-Title">PUBLICAÇÕES</div>

                {posts.length > 0 ?
                    <div id="Post-Profile-Area">
                        {posts.map((post) => {
                            return (
                                <div className="Post-Profile" key={post.photoURL}>
                                    <img src={post.photoURL} onClick={() => {
                                        setPostSelecionado(post);
                                        setMostrandoPostSelecionado(true);

                                    }}></img>
                                </div>
                            )
                        })}
                    </div>
                    : null}


            </div>
        )
    }

    else {
        return (
            <div className="carregando">
                {userData === undefined ? <CircularProgress /> : null}

                {userData === null ? <div>Usuário não encontrado</div> : null}

            </div>
        )
    }
}

export default Profile;