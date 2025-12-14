const API_BASE = "http://localhost:5000/api";

async function handleRes(res) {
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw json;
    return json;
}

export async function getUserGroups(userId) {
    const res = await fetch(`${API_BASE}/getUserGroups/${userId}`, {
        credentials: "include",
    });
    return handleRes(res);
}

export async function getGroupMessages(groupId) {
    const res = await fetch(`${API_BASE}/getGroupMessages/${groupId}`, {
        credentials: "include",
    });
    return handleRes(res);
}

export async function createOrGetOneToOneGroup(user1, user2) {
    const res = await fetch(`${API_BASE}/createOrGetOneToOneGroup`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user1, user2 }),
    });
    return handleRes(res);
}

export async function sendMessageRest(payload) {
    const res = await fetch(`${API_BASE}/sendMessage`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return handleRes(res);
}

export const getChatContacts = async (usersId) => {
    const res = await fetch(`http://localhost:5000/api/getChatContacts/${usersId}`);
    return res.json();
};

export const searchUsers = async (query, currentUserId) => {
    const res = await fetch(
        `http://localhost:5000/api/searchUsers?q=${query}&currentUserId=${currentUserId}`
    );
    return res.json();
};
