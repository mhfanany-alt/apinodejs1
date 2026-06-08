const mysql = require('mysql2/promise');
let sql;
const buatKoneksi = async () => {
    return await mysql.createConnection({
        host: '194.233.65.45',
        port: 3306,
        user: 'u3cfe03y_hilal',
        password: 'QQsVGFay6m7_Jms',
        database: 'u3cfe03y_transaksi'
    })
}
const getMetode = async () => {
    const db = await buatKoneksi();
    sql = "SELECT * FROM backup";
    const [rows] = await db.execute(sql);
    return rows.length > 0 ? rows : false;
}
const tambahBackup = async (id, nama, channel) => {
    const db = await buatKoneksi();
    sql = `INSERT INTO backup VALUES('${id}', '${nama}', '${channel}',NOW())`;
    try{
        await db.execute(sql);
        return "1";
    }catch(err){
        return "0";
    }
}
const tambahTransaksi = async (idx, id, waktux, nominalx, jenisx, deskripsix) => {
    const db = await buatKoneksi();
    sql = `INSERT INTO backup_transaksi VALUES('${idx}', '${id}', '${waktux}', '${nominalx}', '${jenisx}', '${deskripsix}')`;
    try{
        await db.execute(sql);
        return "1";
    }catch(err){
        return "0";
    }
}
const getTransaksi = async () => {
    const db = await buatKoneksi();
    sql = "SELECT * FROM backup_transaksi";
    const [rows] = await db.execute(sql);
    return rows.length > 0 ? rows : false;
}
module.exports = {buatKoneksi, getMetode, tambahBackup, tambahTransaksi, getTransaksi};