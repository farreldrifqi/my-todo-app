// src/js/db.js
import { openDB } from 'idb';

const DB_NAME = 'todo-app-FIXED'; 

export const initDB = async () => {
    return openDB(DB_NAME, 1, {
        upgrade(db, transaction) {
            
            // Membuat tabel 'users' (Primary Key: email)
            if (!db.objectStoreNames.contains('users')) {
                db.createObjectStore('users', { keyPath: 'email' });
            }

            // Membuat tabel 'tasks' (Primary Key: id auto-increment)
            let taskStore;
            if (!db.objectStoreNames.contains('tasks')) {
                // Kalau belum ada tabelnya, buat baru
                taskStore = db.createObjectStore('tasks', { keyPath: 'id', autoIncrement: true });
            } else {
                // Kalau sudah ada, ambil referensinya
                taskStore = transaction.objectStore('tasks');
            }

            // Membuat index 'userEmail' untuk relasi data
            if (!taskStore.indexNames.contains('userEmail')) {
                taskStore.createIndex('userEmail', 'userEmail', { unique: false });
            }
        },
    });
};

export const registerUser = async (userData) => {
    const db = await initDB();
    return db.add('users', userData);
};

export const loginUser = async (email, password) => {
    const db = await initDB();
    const user = await db.get('users', email);
    if (!user || user.password !== password) throw new Error('Email atau Password salah!');
    const { password: _, ...cleanUser } = user;
    return cleanUser;
};

// Fungsi ambil data user lengkap (termasuk password)
export const getUser = async (email) => {
    const db = await initDB();
    return db.get('users', email);
};

// update user
export const updateUser = async (userData) => {
    const db = await initDB();
    // .put() akan menimpa data lama berdasarkan keyPath (email)
    return db.put('users', userData);
};

export const addTask = async (taskData) => {
    const db = await initDB();
    // Validasi: Pastikan tugas terikat pada email pengguna
    if (!taskData.userEmail) throw new Error("User Email wajib ada!");
    return db.add('tasks', taskData);
};

export const getTasksByUser = async (userEmail) => {
    const db = await initDB();
    return db.getAllFromIndex('tasks', 'userEmail', userEmail);
};

export const updateTask = async (taskData) => {
    const db = await initDB();
    return db.put('tasks', taskData);
};

export const deleteTask = async (taskId) => {
    const db = await initDB();
    return db.delete('tasks', taskId);
};

export const getTaskById = async (taskId) => {
    const db = await initDB();
    return db.get('tasks', taskId);
};

export const clearDatabase = async () => {
    const db = await initDB();
    const tx = db.transaction(['users', 'tasks'], 'readwrite');
    await tx.objectStore('users').clear();
    await tx.objectStore('tasks').clear();
    await tx.done;
};

export const deleteDatabase = async () => {
    await indexedDB.deleteDatabase(DB_NAME);
};

export const exportDatabase = async () => {
    const db = await initDB();
    const users = await db.getAll('users');
    const tasks = await db.getAll('tasks');
    return { users, tasks };
}   ;

export const importDatabase = async (data) => {
    const db = await initDB();
    const tx = db.transaction(['users', 'tasks'], 'readwrite');
    for (const user of data.users) {
        await tx.objectStore('users').put(user);
    }
    for (const task of data.tasks) {
        await tx.objectStore('tasks').put(task);
    }
    await tx.done;
};