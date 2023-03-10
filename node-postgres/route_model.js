const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'us-lvm1.southcentralus.cloudapp.azure.com',
    database: 'busdetector',
    password: 'Bu$det3ctoR2023',
    port: 5432,
});

const getRoutes = (query) =>  {
    return pool.query(query);
}
// const getRoutes = () => {
//     return new Promise(function (resolve, reject) {
//         pool.query('SELECT * FROM routes', (error, results) => {
//             if (error) {
//                 reject(error)
//             }
//             resolve(results.rows);
//         })
//     })
// }

module.exports = {
    getRoutes,
}