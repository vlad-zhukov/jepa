export default async function sslRedirect(app) {
    let portString;
    function sslRedirectInternal(req, res, next) {
        if (req.secure) {
            next();
            return;
        }

        // Don't redirect connections from localhost
        if (req.ip === '127.0.0.1') {
            next();
            return;
        }

        res.redirect(302, `https://${req.hostname}${portString}${req.originalUrl}`);
    }

    if (process.env.SSL === 'force') {
        const port = process.env.SSL_PORT;
        if (Number(port) === 443) {
            portString = '';
        }
        else {
            portString = `:${port}`;
        }
        app.use(sslRedirectInternal);
    }
}
