const express = require("express");
const app = express();
const cors = require("cors");
const db = require('./db.js');
const port = 5775;

const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

app.set("view engine", "ejs");
app.set("views", "view");
app.use(express.static(__dirname + '/public'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.get("/status", (req, res) => {
    res.send(
        '{"kode":"01", "status":"API Berbasis ExpressJS OK"}'
    );
})

app.get("/", async (req, res) => {
    const dtx = await db.getMetode();
    res.render("beranda", {data: dtx || []});
})
app.post("/backup", async (req, res) => {
    let pesanx, kodex;
    let nama = req.body.nama_backup;
    let dtx = Buffer.from(req.body.dtx, 'base64').toString('utf-8');
    let id = Date.now();
    let arr_data = dtx.split("#");
    let proses = await db.tambahBackup(id, nama, "nodejs");
    if(proses == "1"){
        let berhasil = 0;
        let gagal = 0;
        for(let k of arr_data){
            if (k == "") continue;
            let arr_data2 = k.split("|");
            let idx = arr_data2[0];
            let deskripsix = arr_data2[1];
            let waktux = arr_data2[2];
            let nominalx = arr_data2[3];
            let jenisx = arr_data2[4];
            let proses2 = await db.tambahTransaksi(`${id}-${idx}`, id, waktux, nominalx, jenisx, deskripsix);
            proses2 == "1" ? berhasil++ : gagal++;
        }
        const sekarang = new Date();
        const tanggalAman = sekarang.toLocaleDateString('id-ID') + ' ' + sekarang.toLocaleTimeString('id-ID');
        kirimKeSemuaClient({
            id: id,
            nama: nama,
            channel: "nodejs",
            waktu: tanggalAman
        });
        pesanx = {kode: "01", status: "Proses Backup Berhasil Dengan Rincian", berhasil: berhasil, gagal: gagal};
        kodex = 200;
    }else{
        pesanx = {kode: "00", status: "Proses Backup Gagal, Periksa Kembali Data Anda"};
        kodex = 500;
    }
    return res.status(kodex).json(pesanx);
})
// io.on("connection", (socket) => {
//     console.log("Ada Klien Website terhubung ke socket ID:", socket.id);
// })
// server.listen(port, () => {
//     console.log(`API dan Socket berjalan di port ${port}`);
// })


// Untuk SSE (Server-Sent Events)
let clients = [];
app.get("/stream", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    clients.push(res);
    req.on("close", () => {
        clients = clients.filter(c => c !== res);
    });
});

// fungsi kirim event ke suama client SSE
const kirimKeSemuaClient = (data) => {
    clients.forEach(client => {
        client.write(`data: ${JSON.stringify(data)}\n\n`);
    });
};