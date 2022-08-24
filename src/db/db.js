import 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getAuth, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getFirestore, collection, query, where, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore/lite';
import { ref, uploadBytes, getStorage, getDownloadURL } from 'firebase/storage';


const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: "projeto-instagram-93637.firebaseapp.com",
    projectId: "projeto-instagram-93637",
    storageBucket: "projeto-instagram-93637.appspot.com",
    messagingSenderId: "565751004441",
    databaseURL: "https://projeto-instagram-93637-default-rtdb.firebaseio.com/",
    appId: "1:565751004441:web:3ac6ea830471f20bf21988",
    measurementId: "G-B0HR936FKW"
};

export const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const storage = getStorage(app);

export const auth = getAuth();

const registerDB = async (data) => {

    const { email, name, user, password } = data;

    try { // Criação do usuário no banco de dados
        const docRef = await addDoc(collection(db, "users"), {
            email,
            name,
            user,
            createdAt: new Date(),
            posts: 0,
            followers: 0,
            following: 0,
            followingUsers: [],
            followersUsers: [],
            bio: "Hey! I'm using Instagram!",
        });

        //console.log("Document written with ID: ", docRef.id);

        // criando campo de id no usuário

        await updateDoc(doc(db, "users", docRef.id),
            {
                id: docRef.id
            });

        return { sucesso: true, msg: 'Conta criada com sucesso!', type: 'success' };

    } catch (e) {
        console.log("Erro no banco de dados: " + e);

        return { sucesso: false, msg: 'Ocorreu um erro no sistema. Contate um administrador.', type: 'error' };

    }
}

export const getUser = () => {
    return auth.currentUser;
}

export const register = async (data) => {

    const { email, password, user } = data;

    return createUserWithEmailAndPassword(auth, email, password).then(async () => { // Autenticação do usuário
        //console.log('Autenticação efetuada com sucesso');

        await updateProfile(auth.currentUser, {
            displayName: user
        }).then(function () {
            //console.log("Username atualizado!");
        }, function (error) {
            console.log("Erro ao atualizar username. " + error);
        });

        return await registerDB(data); // Criação do usuário no banco de dados

    }).catch(error => {

        switch (error.code) {
            case 'auth/email-already-in-use':
                return { sucess: false, msg: 'Este e-mail já está sendo utilizado.', type: 'error' };
            case 'auth/invalid-email':
                return { sucess: false, msg: 'Este e-mail não é válido.', type: 'error' };
            case 'auth/weak-password':
                return { sucess: false, msg: 'A senha deve conter no mínimo 6 caracteres.', type: 'error' };
            default:
                return { sucess: false, msg: 'Ocorreu um erro no sistema. Contate um administrador.', type: 'error' };
        }

    });



}

export const login = async (data) => {

    const { email, password } = data;

    return signInWithEmailAndPassword(auth, email, password).then(() => {
        //console.log('Autenticação efetuada com sucesso');

        return { sucess: true, msg: 'Login efetuado com sucesso!', type: 'success', user: auth.currentUser };

    }).catch(error => {

        switch (error.code) {
            case 'auth/user-not-found':
                return { sucess: false, msg: 'Usuário não encontrado', type: 'error' };
            case 'auth/wrong-password':
                return { sucess: false, msg: 'Senha incorreta', type: 'error' };
            default:
                return { sucess: false, msg: 'Erro ao efetuar login. Contate um administrador', type: 'error', user: {} };
        }
    });
}

export const getDataUser = async (user) => {

    const usersRef = collection(db, "users");

    const q = query(usersRef, where('user', '==', user.displayName));

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data();
    }

    else return null;

}

export const getAllUsers = async () => {

    const usersRef = collection(db, "users");

    const q = query(usersRef);

    const querySnapshot = await getDocs(q);

    var users = [];

    if (!querySnapshot.empty) {
        querySnapshot.forEach(doc => {
            users.push(doc.data());
        }
        );
    }

    else return null;

    return users;

}

export const changeAvatar = async (file, username) => {

    //console.log(username);
    //console.log(file);

    const imageRef = ref(storage, `avatar/${username}/${username}`);

    return uploadBytes(imageRef, file).then(async () => {
        console.log("Upload realizado com sucesso");

        await updateProfile(auth.currentUser, {
            photoURL: `https://firebasestorage.googleapis.com/v0/b/projeto-instagram-93637.appspot.com/o/avatar%2F${username}%2F${username}?alt=media`
        })

        // Pegando o uid da coleção users

        const usersRef = collection(db, "users");

        const q = query(usersRef, where('user', '==', username));

        const result = await getDocs(q);

        const document = result.docs[0];

        const id = (document.data().id);

        await updateDoc(doc(db, "users", id),
            {
                photoURL: `https://firebasestorage.googleapis.com/v0/b/projeto-instagram-93637.appspot.com/o/avatar%2F${username}%2F${username}?alt=media`
            });


    }).catch((e) => {
        console.log("Erro ao realizar upload: " + e);
    });

}

export const getProfileImage = async (username) => {

    const imageRef = ref(storage, `avatar/${username}/${username}`);

    return getDownloadURL(imageRef);

}

export const follow = async (user, following) => {
    // seguidores da pessoa

    const seguidoresDaPessoa = following.followersUsers;
    const quemEuSigo = user.followingUsers;

    await updateDoc(doc(db, "users", user.id), {
        following: user.following + 1,
        followingUsers: [...quemEuSigo, following.user]
    });

    await updateDoc(doc(db, "users", following.id), {
        followers: seguidoresDaPessoa.length + 1,
        followersUsers: [...seguidoresDaPessoa, user.user]
    });

    const novosDadosUser = await getDataUser({ displayName: user.user });
    const novosDadosFollowing = await getDataUser({ displayName: following.user });

    // console.log("Seguidor adicionado com sucesso");

    return {
        user: novosDadosUser,
        following: novosDadosFollowing
    }

}

export const unFollow = async (user, following) => {

    // seguidores da pessoa
    const seguidoresDaPessoa = following.followersUsers;
    const quemEuSigo = user.followingUsers;

    await updateDoc(doc(db, "users", user.id), {
        following: user.following - 1,
        followingUsers: quemEuSigo.filter(item => item !== following.user)
    });

    await updateDoc(doc(db, "users", following.id), {
        followers: following.followers - 1,
        followersUsers: seguidoresDaPessoa.filter(item => item !== user.user)
    });

    const novosDadosUser = await getDataUser({ displayName: user.user });
    const novosDadosFollowing = await getDataUser({ displayName: following.user });

    // console.log("Seguidor removido com sucesso");

    return {
        user: novosDadosUser,
        following: novosDadosFollowing
    }

}

export const verifyFollow = async (user, following) => {
    const quemEuSigo = user.followingUsers;

    return (quemEuSigo.includes(following.user)); // retorna se eu sigo a pessoa ou não

}

export const getFollowersPosts = async (user) => {

    const quemEuSigo = user.followingUsers;

    quemEuSigo.push(user.user); // inserindo o perfil atual, para mostrar os próprios posts na timeline

    if (quemEuSigo.length > 0) { // se eu sigo pelo menos 1 pessoa
        const usersRef = collection(db, "posts");

        const q = query(usersRef, where('user', 'in', quemEuSigo));

        const result = await getDocs(q);

        if (!result.empty) {

            var posts = [];

            result.docs.forEach(doc => {
                posts.push(doc.data());
            })

            return posts;
        }

        else return [];


    }

    else return [];

}

export const getUserPosts = async (user) => {


    const usersRef = collection(db, "posts");

    const q = query(usersRef, where('user', '==', user));

    const result = await getDocs(q);

    if (!result.empty) {

        var posts = [];

        result.docs.forEach(doc => {
            posts.push(doc.data());
        })

        return posts;
    }

}

export const post = async (post) => {

    //console.log(post);
    const username = post.user.user;

    const imageRef = ref(storage, `posts/${username}/${"post-" + username + "-" + new Date()}`);

    return uploadBytes(imageRef, post.image).then(async () => {
        //console.log("Upload realizado com sucesso");

        const downloadImage = await getDownloadURL(imageRef);

        await addDoc(collection(db, "posts"), {
            user: username,
            userPhoto: post.userPhoto,
            descricao: post.descricao,
            photoURL: downloadImage,
            createdAt: new Date()
        });

        // const idPost = docRef.id;

    }).catch((e) => {
        console.log("Erro ao realizar upload: " + e);
    }).then(async (id) => {

        await updateDoc(doc(db, "users", post.user.id), {
            posts: post.user.posts + 1
        });

        //console.log("A contagem de posts foi atualizado no perfil.")

        return id;
    }).catch((e) => {
        console.log("Erro ao atualizar os posts do usuário usuário: " + e);
    });
}

export const exit = async () => {
    await signOut(auth);
    //console.log(auth);
}