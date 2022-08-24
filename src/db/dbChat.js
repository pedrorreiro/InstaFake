import { getDatabase, ref, set, get, push, child, update } from "firebase/database";
import { app } from "./db";

export const database = getDatabase(app);

export const criarConversa = async (me, receiver) => {
    // console.log(me);
    // console.log(receiver);

    // verifica se a conversa já existe

    get(ref(database, `chats/${me.user}/${receiver.user}`)).then(async (snapshot) => { // conversa meu usuário com o outro usuário
        if (snapshot.val() === null) { // cria a conversa se não existir
            await set(ref(database, "chats/" + me.user + "/" + receiver.user), {
                me: me.user,
                me_photo: me.photoURL,
                receiver: receiver.user,
                receiver_photo: receiver.photoURL,
            });

        };
    });

    get(ref(database, `chats/${receiver.user}/${me.user}`)).then(async (snapshot) => { // conversa outro usuário com meu usuário
        if (snapshot.val() === null) { // cria a conversa se não existir
            await set(ref(database, "chats/" + receiver.user + "/" + me.user), {
                me: receiver.user,
                me_photo: receiver.photoURL,
                receiver: me.user,
                receiver_photo: me.photoURL,
            });

        };
    });

}

export const sendMsg = async (me, receiver, msg) => {

    const minhaMensagem = {
        msg: msg,
        me: true,
        date: new Date().toLocaleString()
    };

    const mensagem = {
        msg: msg,
        me: false,
        date: new Date().toLocaleString()
    }

    const newMsgKey = push(child(ref(database), "chats/" + me.user + "/" + receiver.user + "/msgs")).key;

    var updates = {};

    updates[`chats/${me.user}/${receiver.user}/msgs/${newMsgKey}`] = minhaMensagem;
    updates[`chats/${receiver.user}/${me.user}/msgs/${newMsgKey}`] = mensagem;

    await update(ref(database), updates);

    console.log("Mensagens enviadas");

    // await set(ref(database, "chats/" + me.user + "/" + receiver.user + "/msgs/" + newMsgKey), minhaMensagem);
    // console.log("Enviei mensagem para " + receiver.user);
    // await set(ref(database, "chats/" + receiver.user + "/" + me.user + "/msgs/" + newMsgKey), mensagem);
    // console.log("Recebi mensagem de " + me.user);

}