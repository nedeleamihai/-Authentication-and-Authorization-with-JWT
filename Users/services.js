const {
    query
} = require('../data');

const {
    generateToken,
} = require('../security/Jwt');

const {
    ServerError
} = require('../errors');

const {
    hash,
    compare
} = require('../security/Password');

const addRole = async (value) => {
    await query('INSERT INTO roles (value) VALUES ($1)', [value]);
};

const getRoles = async() => {
    return await query('SELECT * FROM roles');
};

const add = async (username, password, role_id) => {
    // pas 1: cripteaza parola
    // pas 2: adauga (username, parola cripttata, role_id) in baza de date
    var hp = await hash(password)
    await query('INSERT INTO users (username, password, role_id) VALUES ($1, $2, $3)', [username, hp, role_id]);
};

const authenticate = async (username, password) => {
    const result = await query(`SELECT u.id, u.password, r.value as role FROM users u 
                                JOIN roles r ON r.id = u.role_id
                                WHERE u.username = $1`, [username]);
    if (result.length === 0) {
        throw new ServerError(`Utilizatorul cu username ${username} nu exista in sistem!`, 400);
    }
    const user = result[0];

    // pas 1: verifica daca parola este buna (hint: functia compare)
    // pas 1.1.: compare returneaza true sau false. Daca parola nu e buna, arunca eroare
    // pas 2: genereaza token cu payload-ul: {userId si userRole}
    // pas 3: returneaza token
    if(await compare(password, user.password)) {
        const token = await generateToken({
            userId: user.id,
            userRole: user.role
        })
        console.log(token);
        return token;
    }
};

module.exports = {
    add,
    addRole,
    getRoles,
    authenticate
}