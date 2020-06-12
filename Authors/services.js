const {
    query
} = require('../data');

const add = async (first_name, last_name) => {
    await query('INSERT INTO authors (first_name, last_name) VALUES ($1, $2)', [first_name, last_name]);
};

const getAll = async () => {
    return await query('SELECT * FROM authors');
};

const getById = async (id) => {
    return await query('SELECT * FROM authors WHERE id = $1', [id]);
};

const updateById = async (id, first_name, last_name) => {
    console.log(first_name);
    console.log(last_name);
    await query('UPDATE authors SET first_name = $1, last_name = $2 WHERE id = $3', [first_name, last_name, id]);
};

const deleteById = async (id) => {
    await query('DELETE FROM authors WHERE id = $1', [id]);
};

module.exports = {
    add,
    getAll,
    getById,
    updateById,
    deleteById
}