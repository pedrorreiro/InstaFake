import 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getAuth, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, sendEmailVerification, updateEmail, sendPasswordResetEmail } from "firebase/auth";
import { getFirestore, collection, query, where, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore/lite';
import { ref, uploadBytes, getStorage, getDownloadURL, deleteObject } from 'firebase/storage';
import { criarPost, whenUpdateProfile } from './dbPost';
import { getDatabase } from "firebase/database";
import { getMessaging, getToken } from "firebase/messaging";

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

export const database = getDatabase(app);

export const auth = getAuth();

export const messaging = getMessaging(app);

const registerDB = async (data, auth) => {

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


        await enviarEmailVerificacao(auth.currentUser);

        return { sucesso: true, msg: 'Conta criada com sucesso!', type: 'success' };

    } catch (e) {
        console.log("Erro no banco de dados: " + e);

        return { sucesso: false, msg: 'Ocorreu um erro no sistema. Contate um administrador.', type: 'error' };

    }
}

export const enviarEmailVerificacao = async (auth) => {

    try {
        await sendEmailVerification(auth);

        return { sucesso: true, msg: 'Email de verificação enviado com sucesso!', type: 'success' };
    } catch (e) {
        console.log("Erro no envio de email de verificação: " + e);

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

        return await registerDB(data, auth); // Criação do usuário no banco de dados

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

    return signInWithEmailAndPassword(auth, email, password).then(async () => {

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
    console.log("dentro do getDataUser " + user.displayName);
    const usersRef = collection(db, "users");

    const q = query(usersRef, where('user', '==', user.displayName));

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const data = querySnapshot.docs[0].data();

        const followersUsers = data.followersUsers;
        const followingUsers = data.followingUsers;

        const followersUsersData = await Promise.all(followersUsers.map(async (u) => {
            const q = query(usersRef, where('user', '==', u));
            const userData = await getDocs(q);
            return userData.docs[0].data();
        }));

        const followingUsersData = await Promise.all(followingUsers.map(async (u) => {
            const q = query(usersRef, where('user', '==', u));
            const userData = await getDocs(q);
            return userData.docs[0].data();
        }));

        data.followersUsersData = followersUsersData;
        data.followingUsersData = followingUsersData;
 
        return data;
    }

    else return null;

}

export const getAllUsers = async () => {

    console.log("getAllUsers");

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

export const getIdByUser = async (user) => {
    const usersRef = collection(db, "users");

        const q = query(usersRef, where('user', '==', user));

        const result = await getDocs(q);

        const document = result.docs[0];

        const id = (document.data().id);

        return id;
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

        const id = await getIdByUser(auth.currentUser.displayName);

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

export const post = async (post) => {

    console.log(post);

    const username = post.user;

    const user = await getDataUser({ displayName: username });

    const dataParaPost = new Date().getTime().toString();

    const nomeImg = "post-" + username + "-" + dataParaPost;

    const imageRef = ref(storage, `posts/${username}/${nomeImg}`);

    post = { ...post, nomeImg };
    post.user = user;

    console.log(post);

    return uploadBytes(imageRef, post.image).then(async () => {
        //console.log("Upload realizado com sucesso");

        const downloadImage = await getDownloadURL(imageRef);

        await criarPost(post, downloadImage);

        await updateDoc(doc(db, "users", user.id), {
            posts: user.posts + 1
        });


        console.log("Post com sucesso!");

    }).catch((e) => {
        console.log("Erro ao realizar upload: " + e);
    });
}

export const excluirImgPost = async (post) => {
    const username = post.user;

    const imageRef = ref(storage, `posts/${username}/${post.nomeImg}`);

    await deleteObject(imageRef);

    const user = await getDataUser({ displayName: username });

    await updateDoc(doc(db, "users", post.idUser), {
        posts: user.posts - 1
    });
}

export const changeEmail = async (newEmail) => {

    return updateEmail(auth.currentUser, newEmail).then(async() => {

        const id = await getIdByUser(auth.currentUser.displayName);

        console.log(id);
        const userRef = doc(db, "users", id);
        const userData = {
            email: newEmail
        };
        await updateDoc(userRef, userData);

        return { sucess: true , msg: "Email alterado com sucesso"};
    }).catch((error) => {

        switch (error.code) {
            case 'auth/invalid-email':
                return { sucess: false, msg: 'E-mail inválido!', type: 'error' };
            default:
                return { sucess: false, msg: `Erro ao alterar e-mail. Contate um administrador (${error.code})`, type: 'error' };
        }
    })


}

export const changeSenha = async () => {

    console.log("Solicitação de alteração de senha...");

    return sendPasswordResetEmail(auth, auth.currentUser.email)
  .then(() => {
    return { sucess: true, msg: 'Um e-mail de redefinição de senha foi enviado. Verifique sua caixa de entrada e spam.' };
  })
  .catch((error) => {
    return { sucess: false, msg: `Ocorreu um erro! Contate um administrador. (${error.code})` }
    // ..
  });
}

export const exit = async () => {
    await signOut(auth);
    //console.log(auth);
}