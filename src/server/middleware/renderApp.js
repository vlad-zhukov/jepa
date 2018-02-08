import render from '../render';

export default function renderApp(app) {
    // Игнорируем всё, что начинается на static, build или содержит точку
    app.get(/^\/(?!static|build|.*\.).*$/i, async (req, res, next) => {
        res.locals.location = req.url;

        try {
            // Render the view
            const result = await render(res.locals);
            res.type('html').status(200).send(result);
        }
        catch (e) {
            console.error(e);
            next();
        }
    });
}
