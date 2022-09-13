import { newComment, deleteComment } from "../db/dbPost";
import { likePost } from "../db/dbPost";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

export const addComment = async (post, comment, userData) => {

    comment = {
        user: userData.user,
        userPhoto: userData.photoURL,
        msg: comment
    }

    await newComment(post, comment);
}

export const deletComment = async (post, comment) => {

    await deleteComment(post, comment);

    // console.log(post);
    // console.log(comment);
}

export const renderLike = (post, user, userData) => {

    var deiLike = false;

    if (post.likesUsers?.includes(user.displayName)) {
        deiLike = true;
    }

    if (deiLike) {
        return <FavoriteIcon className="likeIcon" sx={{ color: "#ed4956" }} onClick={async () => likePost(post, userData)} key={post.id} />
    }

    else {
        return <FavoriteBorderIcon className="likeIcon" onClick={async () => likePost(post, userData)} />
    }
}