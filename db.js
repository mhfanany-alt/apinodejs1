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
// website
const getMetode = async () => {
    const db = await buatKoneksi();
    sql = `
    SELECT
        b.id,
        b.nama,
        b.channel,
        b.waktu,

        COUNT(bt.id) AS jumlah_transaksi,
        
        IFNULL(
            SUM(
                CASE
                    WHEN bt.jenis='+' THEN bt.nominal
                    ELSE 0
                END
            ),0
        ) AS total_masuk,

        
        IFNULL(
            SUM(
                CASE
                    WHEN bt.jenis='-' THEN bt.nominal
                    ELSE 0
                END
            ),0
        ) AS total_keluar
    FROM backup b

    LEFT JOIN backup_transaksi bt
        ON b.id = bt.id_backup

    GROUP BY
        b.id,
        b.nama,
        b.channel,
        b.waktu

    ORDER BY b.waktu DESC
    `;
    const [rows] = await db.execute(sql);
    return rows.length > 0 ? rows : false;
}
// detail backup
const getDetailBackup = async(id_backup) => {
    const db = await buatKoneksi();
    sql = `SELECT * FROM backup_transaksi WHERE id_backup=? ORDER BY tgl_jam ASC`;
    const [rows] = await db.execute(sql,[id_backup]);
    return rows;
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
module.exports = {buatKoneksi, getMetode, getDetailBackup, tambahBackup, tambahTransaksi, getTransaksi};