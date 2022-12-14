import { useContext } from "react";
import { diffTime } from '../Tools/DiffTime';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import { Link } from 'react-router-dom';
import PostMenu from '../Components/PostMenu';
import Chip from '@mui/material/Chip';
import { Context } from '../Context';
import { Admins } from "../Admins";
import { Post } from "./Post";

export default function Feed(props) {

    const posts = props.posts;
    const userData = props.userData;

    return (
        <div id="feed">
            {posts?.length === 0 ?

                <div className="Post" style={{ textAlign: "center" }}>

                    <CircularProgress />

                </div>

                : null
            }

            {
                posts === null ?
                    <h4 style={{margin: "auto"}}>Não há nenhum post no momento.</h4>
                    : null
            }

            {posts?.slice(0).reverse().map((post, index) => {

                const linkPerfil = "/" + post.user;

                const dataPost = new Date(post.createdAt);

                const diff = diffTime(dataPost);

                return (
                    <Post post={post} userData={userData} key={post.id} setUploading={props.setUploading}/>
                )
            })}
        </div>
    )
}