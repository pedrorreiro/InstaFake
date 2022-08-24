import { useParams } from 'react-router-dom';
import { useEffect, useContext, useState } from 'react';
import '../css/profile.css';
import { getDataUser } from "../db/db.js";
import Avatar from '@mui/material/Avatar';
import Backdrop from '@mui/material/Backdrop';
import { CircularProgress } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { follow, verifyFollow, unFollow, changeAvatar } from "../db/db";
import { getUserPosts } from '../db/db';
import { Context } from '../Context';

function Profile(props) {

    const navigate = useNavigate();

    const [user] = useContext(Context);

    const { username } = useParams();

    const [userData, setUserData] = useState(null);
    // const [logado, setLogado] = useState(false);
    const [meusDadosCompletos, setMeusDadosCompletos] = useState(null);
    const [euSigo, setEuSigo] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [mostrandoSeguindo, setMostrandoSeguindo] = useState(false);
    const [mostrandoSeguidores, setMostrandoSeguidores] = useState(false);
    const [posts, setPosts] = useState([]);

    const uploadImage = async (image) => {
        console.log(user);
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

    }, [username, user])

    // const msgDeslogado = "Você precisa estar logado para acessar o perfil.";

    if (user !== null) {
        return (
            <div>
                {userData ?
                    <div>
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
                                    <div className='listaPessoas'>
                                        {userData.followersUsers.map((usuario) => {
                                            return (
                                                <div key={usuario}>
                                                    <Avatar src={usuario.photoURL}></Avatar>
                                                    <p>{usuario}</p>
                                                </div>
                                            )
                                        })}

                                    </div>
                                </Backdrop>

                                <Backdrop
                                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                                    open={mostrandoSeguindo}
                                    onClick={() => setMostrandoSeguindo(false)}
                                >
                                    <div className='listaPessoas'>
                                        {userData.followingUsers.map((usuario) => {
                                            return (
                                                <div key={usuario}>
                                                    <Avatar src={usuario.photoURL}></Avatar>
                                                    <p>{usuario}</p>
                                                </div>
                                            )
                                        })}

                                    </div>
                                </Backdrop>


                                <div id="User-Data-Info">
                                    <div id="User-Options">
                                        <div id="User-Data-Name">{userData.user}</div>
                                        {username !== user.displayName ?
                                            <div id="Profile-Buttons">
                                                <div className='Profile-Button' onClick={async () => {
                                                    navigate(`/direct`);
                                                }}>Enviar mensagem</div>

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

                            {userData.user === user.displayName ? (
                                <div id="alterarFoto">
                                    <p>Alterar foto de perfil</p>

                                    <input type={"file"} accept="image/png,image/jpeg" onChange={async (e) => {

                                        setUploading(true);

                                        console.log("a")

                                        await uploadImage(e.target.files[0]);

                                        alert("Sucesso! Para ver a alteração, logue novamente.");

                                    }} />
                                </div>
                            ) : null}

                            <div id="User-Public-Data-Mobile">
                                <span><strong>{userData.posts}</strong> publicações</span>
                                <span onClick={() => setMostrandoSeguidores(true)}><strong>{userData.followers}</strong> seguidores</span>
                                <span onClick={() => setMostrandoSeguindo(true)}><strong>{userData.following}</strong> seguindo</span>
                            </div>

                            {/* <div id="Post-Profile-Area">
                                {posts.map((post) => {
                                    return (
                                        <div className="Post-Profile" key={post.photoURL}>
                                            <img src={post.photoURL}></img>
                                        </div>
                                    )
                                })}
                            </div> */}

                        </div>
                    </div>
                    :
                    <div className="carregando">
                        <CircularProgress />
                    </div>
                }
            </div>
        )
    }

    else {
        return (
            <div className="carregando">
                <CircularProgress />
            </div>
        )
    }
}

export default Profile;