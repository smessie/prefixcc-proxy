const express = require('express');
const {createProxyMiddleware, responseInterceptor} = require('http-proxy-middleware');
const url = require('url');

const app = express();

app.use('/', createProxyMiddleware({
    target: 'http://prefix.cc',
    changeOrigin: true,
    selfHandleResponse: true,
    onProxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
        let response = responseBuffer.toString('utf8');
        if (process.env.HOSTNAME) {
            response = response.replaceAll('http://prefix.cc/', `https://${process.env.HOSTNAME}/`);
        }

        // Manually perform hostRewrite and protocolRewrite
        if (proxyRes.headers['location']) {
            const u = url.parse(proxyRes.headers['location']);
            if (process.env.HOSTNAME) {
                u.host = process.env.HOSTNAME;
                u.protocol = 'https';
            } else {
                console.log(u.host);
                console.log(req.headers['host']);
                u.host = req.headers['host'];
            }
            res.setHeader('location', u.format());
        }

        return response;
    })
}));
app.listen(8080);
