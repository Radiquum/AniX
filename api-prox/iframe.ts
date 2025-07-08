export const Iframe = (url: string) => {
    return `
    <!DOCTYPE html>
    <html>
        <head>
            <title>Веб-плеер</title>
            <meta name='viewport' content='width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=yes' />
            <style>body, html {height: 100%; width: 100%; margin: 0px;padding: 0px;border: 0px;}</style>
        </head>
        <body>
            <iframe src="${url}" width='100%' height='100%' frameborder='0' AllowFullScreen allow="autoplay"></iframe>
        </body>
    </html>`
}
