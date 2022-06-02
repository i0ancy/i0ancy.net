import express, { Request, Response } from "express"
import dotenv from "dotenv"
import path from "path"
import favicon from "serve-favicon"
import fs from "fs"
import geoip from "geoip-lite"

dotenv.config({ path: `${__dirname}/.env` })

const app = express()

// security concerns
app.disable("x-powered-by")

// favicon
app.use(favicon(path.join(__dirname, "../public", "favicon.ico")))

// env variables
const PORT = process.env.PORT || 8080

app.get("/", (req: Request, res: Response) => {
    let ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress) as string
    fs.appendFile("ip-logs.txt", `${ip} - ${geoip.lookup(ip)!.country}\n`, (err) => {
        if (err) return res.sendStatus(500)
        res.sendFile(path.join(__dirname, "../public/index.html"))
    })
})

app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`)
})