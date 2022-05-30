import { initializeApp } from "firebase/app";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    onSnapshot,
    query,
    setDoc,
    updateDoc,
} from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";

const config = {
    apiKey: "AIzaSyBM-cD-Ba2HuwsQnOX1P_STq0usUxEb8qg",
    authDomain: "wroddit.firebaseapp.com",
    projectId: "wroddit",
    storageBucket: "wroddit.appspot.com",
    messagingSenderId: "421392756715",
    appId: "1:421392756715:web:629bbf9a0ccbc59aebb3ae",
};

const COMMUNITIES = "communities";
const USERS = "users";
const POSTS = "posts";
const MODERATORS = "moderators";
const UP = "up";
const DOWN = "down";
const COMMENTS = "comments";
const REPLIES = "replies";

const app = initializeApp(config);

const db = getFirestore(app);

const auth = getAuth(app);

const storage = getStorage(app);

const authUser = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

const logOut = () => {
    return auth.signOut();
};

const createUser = async (email, password, username) => {
    await createUserWithEmailAndPassword(auth, email, password);
    return await setDoc(doc(db, USERS, email), {
        dark: false,
        joined: new Date().getTime(),
        username,
        email,
    });
};

const getUserInfo = (userEmail) => {
    return getDoc(doc(db, USERS, userEmail));
};

const updateUserInfo = (user, data) => {
    return setDoc(doc(db, USERS, user), data, { merge: true });
};

const getCommunityInfo = (community) => {
    return getDoc(doc(db, COMMUNITIES, community));
};

const getCommunityPosts = async (community) => {
    const output = [];

    const list = (await getDocs(query(collection(db, COMMUNITIES, community, POSTS)))).docs;

    for (let postRef of list) {
        const post = await getDoc(doc(db, POSTS, postRef.id));

        if (post.exists()) output.push({ ...post.data(), uid: post.id });
    }

    return output;
};

const getPostInfo = (post) => {
    return getDoc(doc(db, POSTS, post));
};

const getPostData = async (post) => {
    const upVotes = (await getPostUpVotes(post)).docs.map((item) => {
        return { ...item.data(), uid: item.id };
    });
    const downVotes = (await getPostDownVotes(post)).docs.map((item) => {
        return { ...item.data(), uid: item.id };
    });
    const comments = (await getPostComments(post)).docs.map((item) => {
        return { ...item.data(), uid: item.id };
    });

    return { upVotes, downVotes, comments };
};

const getPostRef = async (post) => {
    const res = await getDoc(doc(db, POSTS, post));
    return { uid: res.id, ...res.data() };
};

const createCommunityPost = async (post) => {
    const res = await addDoc(collection(db, POSTS), post);
    await setDoc(doc(db, COMMUNITIES, post.community, POSTS, res.id), post);

    return { ...post, uid: res.id };
};

const isUserInCommunity = async (user, community) => {
    const output = (await getDoc(doc(db, COMMUNITIES, community, USERS, user))).exists();

    return output;
};

const isCommunityInUser = async (user, community) => {
    const output = (await getDoc(doc(db, USERS, user, COMMUNITIES, community))).exists();

    return output;
};

const joinCommunity = async (user, community) => {
    const isUserSubscribed = await isUserInCommunity(user, community);
    const isCommunityInList = await isCommunityInUser(user, community);

    if (isCommunityInList && isUserSubscribed) {
        return false;
    }

    const joinDate = new Date().getTime();

    await setDoc(doc(db, COMMUNITIES, community, USERS, user), { joined: joinDate });
    await setDoc(doc(db, USERS, user, COMMUNITIES, community), { joined: joinDate });

    return true;
};

const leaveCommunity = async (user, community) => {
    const isUserSubscribed = await isUserInCommunity(user, community);
    const isCommunityInList = await isCommunityInUser(user, community);

    if (!isCommunityInList && !isUserSubscribed) {
        return false;
    }

    await deleteDoc(doc(db, COMMUNITIES, community, USERS, user));
    await deleteDoc(doc(db, USERS, user, COMMUNITIES, community));

    return true;
};

const getCommunityUsers = async (community) => {
    return (await getDocs(query(collection(db, COMMUNITIES, community, USERS)))).docs.map(
        (user) => {
            return { ...user.data(), email: user.id };
        }
    );
};

const getUserCommunties = (user) => {
    return getDocs(query(collection(db, USERS, user, COMMUNITIES)));
};

const createCommunity = async (name, title, admin, description, tags = []) => {
    const exist = (await getDoc(doc(db, COMMUNITIES, name))).exists();

    if (exist) {
        return false;
    }

    await setDoc(doc(db, COMMUNITIES, name), {
        banner: "",
        created: new Date().getTime(),
        description,
        name,
        picture: "",
        title,
        tags,
    });

    return setDoc(doc(db, COMMUNITIES, name, MODERATORS, admin), {
        email: admin,
        joined: new Date().getTime(),
        type: "admin",
    });
};

const doesCommunityExist = async (community) => {
    return (await getDoc(doc(db, COMMUNITIES, community))).exists();
};

const uploadImage = async (
    name,
    file,
    onProgres = () => {},
    onCompleted = () => {},
    onError = () => {}
) => {
    const task = uploadBytesResumable(ref(storage, name), file);

    task.on(
        "state_changed",
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

            onProgres(progress);
        },
        () => onError(task),
        () => onCompleted(task)
    );
};

const updateCommunityInfo = async (community, data) => {
    return updateDoc(doc(db, COMMUNITIES, community), data);
};

const getAssetLink = async (name) => {
    return getDownloadURL(ref(storage, name));
};

const getPostUpVotes = async (post) => {
    return getDocs(query(collection(db, POSTS, post, UP)));
};

const getPostDownVotes = async (post) => {
    return getDocs(query(collection(db, POSTS, post, DOWN)));
};

const getPostComments = async (post) => {
    return getDocs(query(collection(db, POSTS, post, COMMENTS)));
};

const upVotePost = async (user, post) => {
    await deleteDoc(doc(db, POSTS, post, DOWN, user));

    const isAlreadyUpVoted = (await getDoc(doc(db, POSTS, post, UP, user))).exists();

    if (isAlreadyUpVoted) return false;

    await setDoc(doc(db, POSTS, post, UP, user), {
        email: user,
        date: new Date().getTime(),
    });

    return true;
};

const removeUpVote = async (user, post) => {
    const isAlreadyUpVoted = (await getDoc(doc(db, POSTS, post, UP, user))).exists();

    if (!isAlreadyUpVoted) return false;

    await deleteDoc(doc(db, POSTS, post, UP, user));

    return true;
};

const downVotePost = async (user, post) => {
    await deleteDoc(doc(db, POSTS, post, UP, user));

    const isAlreadyUpVoted = (await getDoc(doc(db, POSTS, post, DOWN, user))).exists();

    if (isAlreadyUpVoted) return false;

    await setDoc(doc(db, POSTS, post, DOWN, user), {
        email: user,
        date: new Date().getTime(),
    });

    return true;
};

const removeDownVote = async (user, post) => {
    const isAlreadyUpVoted = (await getDoc(doc(db, POSTS, post, DOWN, user))).exists();

    if (!isAlreadyUpVoted) return false;

    await deleteDoc(doc(db, POSTS, post, DOWN, user));

    return true;
};

const upVoteComment = async (user, path) => {
    await deleteDoc(doc(db, path, DOWN, user));

    return setDoc(doc(db, path, UP, user), { user, date: Date.now() });
};

const removeUpVoteComment = async (user, path) => {
    return deleteDoc(doc(db, path, UP, user));
};

const downVoteComment = async (user, path) => {
    deleteDoc(doc(db, path, UP, user));

    return setDoc(doc(db, path, DOWN, user), { user, date: Date.now() });
};

const removeDownVoteComment = async (user, path) => {
    return deleteDoc(doc(db, path, DOWN, user));
};

const getCommentData = async (path, uid) => {
    const up = (await getDocs(query(collection(db, path, UP)))).docs.map((item) => {
        return { ...item.data(), uid: item.id };
    });
    const down = (await getDocs(query(collection(db, path, DOWN)))).docs.map((item) => {
        return { ...item.data(), uid: item.id };
    });
    const replies = (await getDocs(query(collection(db, path, REPLIES)))).docs.map((item) => {
        return { ...item.data(), uid: item.id };
    });

    return { up, down, replies, uid };
};

const addReply = async (path, subPath, replyType, parent, text, user) => {
    const data = {
        user,
        text,
        created: Date.now(),
        path: `${path}/${subPath}/${parent}`,
        uid: `${Date.now()}-${user}`,
    };

    const replyPath = `${path}/${subPath}/${parent}/${replyType}`;

    await setDoc(doc(db, replyPath, `${Date.now()}-${user}`), data);

    return data;
};

const getSearchResult = async (searchQuery) => {
    const communities = (await getDocs(query(collection(db, COMMUNITIES)))).docs
        .filter((community) => {
            return (
                community.data().name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                community.data().title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                community.data().tags.toString().includes(searchQuery.toLowerCase())
            );
        })
        .map((community) => community.data());

    const users = (await getDocs(query(collection(db, USERS)))).docs
        .filter((user) => {
            return user.data().username.toLowerCase().includes(searchQuery);
        })
        .map((user) => user.data());

    return { communities, users };
};

const getSubscriptions = async (user) => {
    const list = (await getDocs(query(collection(db, USERS, user, COMMUNITIES)))).docs.map(
        (item) => {
            return { name: item.id, ...item.data() };
        }
    );

    const communities = [];

    for (let item of list) {
        const res = (await getCommunityInfo(item.name)).data();
        communities.push(res);
    }

    const feed = [];

    for (let community of communities) {
        const posts = await getCommunityPosts(community.name);

        feed.push(...posts);
    }

    return feed;
};

const getRandomPosts = async () => {
    const posts = (await getDocs(query(collection(db, POSTS)))).docs
        .map((item) => {
            return { ...item.data(), uid: item.id };
        })
        .sort((a, b) => b.created - a.created)
        .slice(0, 100);

    return posts;
};

const watchUserSubscription = (user, onLoaded, onAdded, onDeleted) => {
    const subscriptionQuery = query(collection(db, USERS, user, COMMUNITIES));

    let firstTime = true;

    return onSnapshot(subscriptionQuery, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === "added" && !firstTime) {
                onAdded(change.doc.id);
            }
            if (change.type === "removed") {
                onDeleted(change.doc.id);
            }
            if (firstTime) {
                onLoaded(
                    snapshot.docs.map((item) => {
                        return { ...item.data(), uid: item.id };
                    })
                );
                firstTime = false;
            }
        });
    });
};

const watchCommunityPosts = (community, onLoaded, onAdded) => {
    const communityQuery = query(collection(db, COMMUNITIES, community, POSTS));

    let time = Date.now();
    let firstTime = true;

    return onSnapshot(communityQuery, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === "added" && change.doc.data().created > time) {
                onAdded(change.doc.id);
            }

            if (firstTime) {
                onLoaded();
                firstTime = false;
            }
        });
    });
};

const updateMedia = (post, link) => {
    return updateDoc(doc(db, POSTS, post), { media: link });
};

export {
    updateMedia,
    getPostData,
    watchCommunityPosts,
    watchUserSubscription,
    updateUserInfo,
    logOut,
    getRandomPosts,
    authUser,
    getUserInfo,
    getPostInfo,
    createUser,
    getCommunityInfo,
    getCommunityPosts,
    createCommunityPost,
    joinCommunity,
    leaveCommunity,
    getCommunityUsers,
    getUserCommunties,
    createCommunity,
    doesCommunityExist,
    uploadImage,
    updateCommunityInfo,
    getAssetLink,
    getPostUpVotes,
    getPostDownVotes,
    getPostComments,
    upVotePost,
    downVotePost,
    removeDownVote,
    removeUpVote,
    upVoteComment,
    downVoteComment,
    removeUpVoteComment,
    removeDownVoteComment,
    getCommentData,
    addReply,
    getSearchResult,
    getSubscriptions,
    getPostRef,
};
