import { getDatabase, ref, set, get, push, child, update } from "firebase/database";
import { database } from "./db";
import { excluirImgPost } from "./db";

export const criarPost = async (post, downloadImage) => {

    console.log(post);

    const username = post.user.user;

    const newPostKey = push(child(ref(database), "posts/" + post.user.user + "/")).key;

    var updates = {};

    const postPronto = {
        user: username,
        idUser: post.user.id,
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

export const getPostById = async (id, user) => {
    return await get(ref(database, `posts/${user}/${id}`)).then(snapshot => {
        console.log(snapshot.val());
        return snapshot.val();
    }).catch(error => {
        console.log(error);
    });
}

export const likePost = async (p, user) => {
    console.log(user);
    console.log(p);
    var post = await getPostById(p.id, p.user);
    console.log(post);
    const username = post.user;
    const me = user.displayName;
    const postKey = p.id;
    // const userKey = user.id;
    console.log(me);
    console.log(post);
    var updates = {};

    if (post.likesUsers === undefined) {

        post.likesUsers = [];
        post.likesUsers.push(me);
        post.likes++;
        console.log("deu like (tava vazio)");
    }

    else if (post.likesUsers.includes(me)) {
        post.likesUsers = post.likesUsers.filter(user => user !== me);
        post.likes--;
        console.log("deu like");
    } else {
        post.likesUsers.push(me);
        post.likes++;
        console.log("deu dislike");
    }

    // push(child(ref(database), "posts/" + p.user + "/likesUsers"));
    updates[`posts/${username}/${postKey}`] = post;
    // updates[`posts/${username}/${postKey}/likesUsers`] = post.likesUsers;

    await update(ref(database), updates);

}