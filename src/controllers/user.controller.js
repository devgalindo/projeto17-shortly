import connection from "../database/database.js";

export async function getUserUrls(req, res) {
    const {user} = res.locals
    delete user.email
    delete user.password
    try {
        const urls = await connection.query('SELECT urls.id, urls."shortUrl", urls.url, COUNT(visits."urlId") - 1 AS "visitCount" FROM urls JOIN visits ON urls.id=visits."urlId" WHERE urls."userId"=$1 GROUP BY urls.id ORDER BY urls.id;'
        , [user.id])
        const userMe = {
            ...user,
            shortenedUrls: [
                ...urls.rows
            ]
        }
        res.status(200).send(userMe)
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
}

export async function getUsersUrlsRanking(req, res) {
    try {
        const ranking = await connection.query('SELECT users.id, users.name, users."linksCount", COUNT(visits."userId") AS "visitCount" FROM users JOIN visits ON users.id=visits."userId" GROUP BY users.id ORDER BY "visitCount" DESC LIMIT 10;')
        res.status(200).send(ranking.rows)
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
}