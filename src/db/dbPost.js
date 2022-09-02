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
        return snapshot.val();
    }).catch(error => {
        console.log(error);
    });
}

export const likePost = async (p, user) => {
    
    var post = await getPostById(p.id, p.user);

    const username = post.user;
    const me = user.user;
    const postKey = p.id;

    var updates = {};

    if (post.likesUsers === undefined) {
        post.likesUsers = [me];
        post.likes++;
        // console.log("deu like (tava vazio)");
    }

    else if (post.likesUsers.includes(me)) {
        post.likesUsers = post.likesUsers.filter(user => user !== me);
        post.likes--;
        // console.log("deu deslike");
    } else {
        post.likesUsers.push(me);
        post.likes++;
        // console.log("deu like");
    }

    // push(child(ref(database), "posts/" + p.user + "/likesUsers"));
    updates[`posts/${username}/${postKey}`] = post;
    // updates[`posts/${username}/${postKey}/likesUsers`] = post.likesUsers;

    await update(ref(database), updates);

}

export const getUserPosts = async (user) => {
    return await get(ref(database, `posts/${user}`)).then(snapshot => {
        const data = snapshot.val();
        const posts = [];

        for (let i in data) {
            posts.push(data[i]);
        }

        return posts;

    }).catch(error => {
        console.log(error);
    });
}