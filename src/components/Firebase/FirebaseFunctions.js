async function checkFullAccess(firebase) {
    const user = firebase.getUserMail();
    const doc = await firebase.getDocument('Members', 'Roles');
    const data = doc.data();
    return data.Members.includes(user);
}

export default checkFullAccess;
