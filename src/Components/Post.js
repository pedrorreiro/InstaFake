import { Admins } from "../Admins";
import { useContext } from "react";
import { Link } from 'react-router-dom';
import PostMenu from '../Components/PostMenu';
import { Context } from '../Context';
import Avatar from '@mui/material/Avatar';
import { diffTime } from '../Tools/DiffTime';
import { useState } from "react";
import { useEffect } from "react";
import DeleteIcon from '@mui/icons-material/Delete';

export const Post = (props) => {

    const [user] = useContext(Context);
    const post = props.post;
    const userData = props.userData;
    const [comment, setComment] = useState('');
    const [newComment, setNewComment] = useState(false);
    const elementoComments = [];

    const dataPost = new Date(post.createdAt);

    const diff = diffTime(dataPost);

    const linkPerfil = "/" + post.user;

    useEffect(() => {
        const msgs = document.querySelectorAll(".comments");

        [].forEach.call(msgs, function (msgs) {
            msgs.scrollTop = msgs.scrollHeight;
        })

    }, [newComment]);

    const comentarios = (msgs) => {

        var elem = [];

        if (msgs !== undefined && msgs !== null) {

            Object.values(msgs).forEach(c => {

                elem.push(
                    <div className="comment" key={c.id}>

                        <div className="commentContent">

                            <Avatar alt="Foto de perfil" sx={{ width: 32, height: 32 }} className="avatarComment" src={c.photoURL} />

                            <p className="commentText"><span className="commentUser">{c.user}</span>{c.msg}</p>
                        </div>

                        {c.user === userData.user || Admins.includes(user.email) ? <DeleteIcon className="deleteComment" sx={{ color: "#ba0413" }} onClick={() => {
                            props.deleteComment(post, c.id);
                        }
                        } /> : null}

                    </div>
                )
            });

        }

        return elem;
    }

    return (
        <div className="Post">
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
                    <p className="infoLikePost" onClick={() => props.mostrarUsersLike(post.likesUsers)}>Curtido por <strong>{post.likes}</strong> pessoas</p>
                    : null}

                {post.likes > 2 && post.likesUsers !== undefined ?
                    <p className="infoLikePost" onClick={() => props.mostrarUsersLike(post.likesUsers)}>Curtido por <strong>{post.likesUsers[0]}, {post.likesUsers[1]}</strong> e outras <strong>{post.likes - 2} pessoas</strong></p>
                    : null}

                <p className="dataPostada">{diff.toLocaleUpperCase()}</p>

            </div>

            <div className="commentsArea">


                <div className="comments">
                    {comentarios(post.comments)}

                </div>




                <div >
                    <form className="inputComment" onSubmit={(e) => {
                        e.preventDefault();
                        props.addComment(post, comment);
                        setComment('');
                        setNewComment(!newComment);
                    }}>

                        <input required className="inputText" placeholder="Adicione um comentário..." onChange={(e) => setComment(e.target.value)} value={comment} />
                        <input type="submit" value="Publicar" className="postComment" style={{
                            color: comment ? "#00a2f8" : "#b3e7fd",
                            background: "#ffffff",
                        }} />

                    </form>

                </div>


            </div>

        </div >
    )
}