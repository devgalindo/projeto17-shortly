import connection from "../database/database.js"
import {urlSchema} from "../schemas/urlSchemas.js"

export async function urlSchemaValidation(req, res, next) {
    const url = req.body
    const {error} = urlSchema.validate(url, {abortEarly: false})
    if (error) {
        const errors = error.details.map((detail) => detail.message)
        return res.status(422).send(errors)
    }
    next()
}


export async function verifyShortenUrlExistenceByUrl(req, res, next) {
    const {shortUrl} = req.params
    try {
        const urlObject = await connection.query('SELECT * FROM urls WHERE "shortUrl"=$1', [shortUrl])
        if (!urlObject.rows[0] || !shortUrl) return res.sendStatus(404)
        res.locals.urlObject = urlObject.rows[0]
        next()
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
}


