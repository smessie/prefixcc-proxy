const express = require('express');
const {createProxyMiddleware} = require('http-proxy-middleware');

const app = express();

app.use('/', createProxyMiddleware({target: 'http://prefix.cc', changeOrigin: true}));
app.listen(8080);
