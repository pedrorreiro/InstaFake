import { getDatabase, ref, set, get, push, child, update } from "firebase/database";
import { database } from "./db";
import { excluirImgPost } from "./db";

export const criarPost = async (post, downloadImage) => {

    console.log(post);

    const username = post.user.user;

    const newPostKey = push(child(ref(database), "posts/" + post.user.user)).key;

    var updates = {};

    const postPronto = {
        user: username,
        idUser: post.user.id,
        userPhoto: post.userPhoto,
        descricao: post.descricao,
        photoURL: downloadImage,
        nomeImg: post.nomeImg,
        likes: 0,
        likesUsers: [],
        comments: [],
        createdAt: new Date(),
        id: newPostKey
    }

    updates[`posts/${post.user.user}/${newPostKey}`] = postPronto;

    await update(ref(database), updates);

}

export const excluirPost = async (post) => {
  
        const username = post.user;
        const postKey = post.id;

        console.log(postKey);
    
        var updates = {};
    
        updates[`posts/${username}/${postKey}`] = null;
    
        update(ref(database), updates).then(() => {
            console.log("Post excluído");
        }).catch(error => {
            console.log(error);
        });

        await excluirImgPost(post);
}