import { useContext } from "react";
import { diffTime } from '../Tools/DiffTime';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import { Link } from 'react-router-dom';
import PostMenu from '../Components/PostMenu';
import Chip from '@mui/material/Chip';
import { Context } from '../Context';
import { Admins } from "../Admins";

export default function Feed(props) {

    const [user] = useContext(Context);
    const posts = props.posts;
    const userData = props.userData;

    return (
        <div id="feed">
            {posts.length === 0 ?

                <div className="Post" style={{ textAlign: "center" }}>

                    <CircularProgress />


                </div>

                : null
            }

            {posts.slice(0).reverse().map((post, index) => {

                const linkPerfil = "/" + post.user;

                const dataPost = new Date(post.createdAt);

                const diff = diffTime(dataPost);

                return (
                    <div className="Post" key={post.photoURL}>
                        <div className="Post-Header">
                            <Link to={linkPerfil}><div className="Autor">
                                <Avatar alt="Foto de perfil" src={post.userPhoto} />
                                <span>{post.user}</span>
                            </div>
                            </Link>
                            {/* {post.user === "pedrorreiro" ? <Chip label="Administrador"className="adm" sx={{ background: "#ed4956", color: "white" }}/> : null} */}
                            {post.user === userData.user || Admins.includes(user.email) ? <PostMenu setUploading={props.setUploading} post={post} /> : null}

                        </div>

                        <div className="Photo">
                            <img alt="Foto do usuário" src={post.photoURL}></img></div>
                        <div className="Post-Description">{post.descricao}</div>

                        <div className="Post-Footer">

                            {props.renderLike(post)}
                        </div>

                        <div className="Post-Footer">

                            {post.likes > 0 && post.likes < 3 ?
                                <p>Curtido por <strong>{post.likes}</strong> pessoas</p>
                                : null}

                            {post.likes > 2 ?
                                <p>Curtido por <strong>{post.likesUsers[0]}, {post.likesUsers[1]}</strong> e outras <strong>{post.likes - 2} pessoas</strong></p>
                                : null}

                            <p className="dataPostada">{diff.toLocaleUpperCase()}</p>

                        </div>

                    </div>
                )
            })}
        </div>
    )
}