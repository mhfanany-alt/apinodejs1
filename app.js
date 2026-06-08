const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./db.js");
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", "view");
app.use(express.static(__dirname + '/public'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/backup", async (req, res) => {
    try {
        if (!req.body.nama_backup || !req.body.dtx) {
            return res.status(400).json({
                status: "error",
                message: "nama_backup dan dtx wajib diisi"
            });
        }

        let pesanx, kodex;
        let nama = req.body.nama_backup;

        // FIX decode base64
        let dtx = Buffer.from(req.body.dtx, 'base64').toString('utf-8');

        let id = Date.now();
        let arr_data = dtx.split("#");

        let proses = await db.tambahBackup(id, nama, "nodeJS");

        if (proses == "1") {
            let berhasil = 0;
            let gagal = 0;

            for (let k of arr_data) {
                let arr_data2 = k.split("|");

                let idx = arr_data2[0]; 
                let deskripsix = arr_data2[1];
                let waktux = arr_data2[2];
                let nominalx = arr_data2[3];
                let jenisx = arr_data2[4];

                let proses2 = await db.tambahTransaksi(
                    `${id}-${idx}`, id, waktux, nominalx, jenisx, deskripsix
                );

                proses2 == "1" ? berhasil++ : gagal++;
            }

            pesanx = {
                kode: "01",
                status: "Proses Backup Berhasil",
                berhasil: berhasil,
                gagal: gagal
            };
            kodex = 200;

        } else {
            pesanx = {
                kode: "00",
                status: "Proses Backup Gagal"
            };
            kodex = 500;
        }

        return res.status(kodex).json(pesanx);

    } catch (err) {
        console.error("ERROR:", err);
        return res.status(500).json({
            status: "error",
            message: err.message
        });
    }
});

app.get("/daftar_backup", async (req, res) => {
    const dtx = await db.bacaBackup();
    if(dtbackup == false){
        res.send('{"kode": "00", "pesan":"Data Backup Tidak Ditemukan"}');
    }
});

// TAMBAHAN UNTUK MENAMPILKAN DATA DI BERANDA
app.get("/", async (req, res) => {
    const dtx = await db.getMetode();
    res.render("beranda", { data: dtx }); 
})

app.get("/status", (req, res) => {
    res.json({
        kode: "01",
        status: "API Berbasis ExpressJS OK"
    });
});

app.listen(port, () => {
    console.log(`API berjalan di port: ${port}`);
});

app.get("/status", (req, res) => {
    res.send(
        '{"kode":"01", "status":"API Berbasis ExpressJS OK"}'
    );
})

app.listen(port, () => {
    console.log(`API berjalan di port: ${port}`);
})