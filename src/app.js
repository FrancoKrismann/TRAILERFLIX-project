const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT;
const DB_PATH = path.resolve(process.cwd(), process.env.DB_PATH);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', routes);
app.use(express.static('public'));

let TRAILERFLIX = [];
try {
    const fullPath = path.resolve(DB_PATH);
    const data = fs.readFileSync(fullPath, 'utf-8');
    TRAILERFLIX = JSON.parse(data);
    console.log('✅ Base de datos cargada correctamente.');
} catch (error) {
    console.error('❌ Error al leer o procesar el archivo JSON:', error.message);
}

// console.log(TRAILERFLIX)
// Ruta Raíz: Mensaje de bienvenida en formato HTML
app.get('/', (req, res) => {
    res.status(200).send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Trailerflix API</title>
            <style>
                {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }
                body {
                    font-family: Arial, sans-serif;
                   background-image: linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url('/clapperboard-cola-near-spilled-popcorn.jpg');
                    background-size: cover;
                    background-position: center;
                    background-repeat: no-repeat;
                    background-attachment: fixed;
                    color: #ffffff;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    padding: 20px;
                }
                h1 { 
                    color: #e50914; 
                    margin-bottom: 30px; 
                    text-align: center;
                }
                .btn-container {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                    gap: 15px;
                    width: 100%;
                    max-width: 1000px;
                }
                .btn {
                    background-color: #2f2f2f;
                    color: #46d369;
                    text-decoration: none;
                    padding: 16px;
                    border-radius: 6px;
                    font-size: 0.95rem;
                    font-family: monospace;
                    text-align: center;
                    font-weight: bold;
                    transition: background-color 0.2s ease, transform 0.1s ease;
                    border: 1px solid #444;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .btn:hover {
                    background-color: #3e3e3e;
                    transform: translateY(-2px);
                }
                .btn:active {
                    transform: translateY(0);
                }
                h1 { color: #e50914; margin-bottom: 10px; }
                p { font-size: 1.1rem; color: #b3b3b3; }
                ul { list-style: none; padding: 0; }
                li { background: #2f2f2f; margin: 8px 0; padding: 10px 20px; border-radius: 4px; }
                code { color: #46d369; font-weight: bold; 
            }
            .btn-container {
                    display: flex;
                    flex-direction: row; /* Alinea los botones horizontalmente */
                    flex-wrap: wrap; /* Permite que se acomoden si la pantalla es más pequeña */
                    justify-content: center;
                    align-items: center;
                    gap: 12px;
                    width: 100%;
                    max-width: 1200px;
                }
                .btn {
                    background-color: #2f2f2f;
                    color: #46d369;
                    text-decoration: none;
                    padding: 12px 18px;
                    border-radius: 6px;
                    font-size: 0.95rem;
                    font-family: monospace;
                    text-align: center;
                    font-weight: bold;
                    transition: background-color 0.2s ease, transform 0.1s ease;
                    border: 1px solid #444;
                    white-space: nowrap; /* Evita que el texto dentro del botón se rompa en varias líneas */
                }
                .btn:hover {
                    background-color: #3e3e3e;
                    transform: translateY(-2px);
                }
                .btn:active {
                    transform: translateY(0);
                }
            </style>
        </head>
        <body>
            <h1>🍿 ¡Bienvenido/a Trailerflix!</h1>
    <ul>
            <li><code><a class="btn" href="/catalogo" target="_blank">Ver todo el catálogo</a>
                <a class="btn" href="/titulo/the" target="_blank">Búsqueda por título</a>
                <a class="btn" href="/categoria/película" target="_blank">Categoría (serie o película)</a>
                <a class="btn" href="/reparto/pedro" target="_blank">Búsqueda por actor/actriz</a>
                <a class="btn" href="/trailer/1" target="_blank">Obtener tráiler disponible 
                de una película/serie</a>
    <ul> 
        </body>
        </html>
    `);
}); 

// 1. Endpoint /catalogo: Retorna todo el contenido visual en tarjetas
app.get('/catalogo', (req, res) => {
    const htmlCards = TRAILERFLIX.map(item => `
        <div class="card">
            <span class="badge ${item.categoria === 'Serie' ? 'badge-serie' : 'badge-pelicula'}">
                ${item.categoria}
            </span>
            <h2>${item.titulo}</h2>
            <p class="genero"><strong>Género:</strong> ${item.genero}</p>
            ${item.temporadas && item.temporadas !== 'N/A' ? `<p class="temporadas"><strong>Temporadas:</strong> ${item.temporadas}</p>` : ''}
            <p class="sinopsis">${item.sinopsis}</p>
            <p class="reparto"><strong>Reparto:</strong> ${item.reparto}</p>
            <a href="${item.trailer}" target="_blank" class="btn-trailer">▶ Ver Tráiler</a>
        </div>
    `).join('');

    res.status(200).send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Catálogo - Trailerflix</title>
            <style>
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body {
                    font-family: Arial, sans-serif;
                    background-color: #141414;
                    color: #ffffff;
                    padding: 30px 20px;
                }
                h1 {
                    color: #e50914;
                    text-align: center;
                    margin-bottom: 30px;
                    font-size: 2.2rem;
                }
                .grid-container {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 20px;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .card {
                    background-color: #1f1f1f;
                    border: 1px solid #333;
                    border-radius: 10px;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    position: relative;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.5);
                    transition: transform 0.2s ease, border-color 0.2s ease;
                }
                .card:hover {
                    transform: translateY(-5px);
                    border-color: #e50914;
                }
                .badge {
                    align-self: flex-start;
                    padding: 4px 10px;
                    border-radius: 12px;
                    font-size: 0.75rem;
                    font-weight: bold;
                    margin-bottom: 10px;
                    text-transform: uppercase;
                }
                .badge-serie { background-color: #007bc7; color: white; }
                .badge-pelicula { background-color: #e50914; color: white; }
                .card h2 {
                    font-size: 1.4rem;
                    margin-bottom: 10px;
                    color: #fff;
                }
                .genero, .temporadas, .reparto {
                    font-size: 0.85rem;
                    color: #aaa;
                    margin-bottom: 8px;
                }
                .sinopsis {
                    font-size: 0.9rem;
                    color: #ddd;
                    margin: 12px 0;
                    line-height: 1.4;
                    flex-grow: 1;
                }
                .btn-trailer {
                    display: block;
                    text-align: center;
                    background-color: #2f2f2f;
                    color: #46d369;
                    text-decoration: none;
                    padding: 10px;
                    border-radius: 6px;
                    font-weight: bold;
                    margin-top: 15px;
                    border: 1px solid #444;
                    transition: background-color 0.2s ease;
                }
                .btn-trailer:hover {
                    background-color: #46d369;
                    color: #141414;
                }
            </style>
        </head>
        <body>
            <h1>🎬 Catálogo de Trailerflix</h1>
            <div class="grid-container">
                ${htmlCards}
            </div>
        </body>
        </html>
    `);
});

app.get('/titulo/:title', (req, res) => {
    const searchTitle = req.params.title.toLowerCase();

    const resultados = TRAILERFLIX.filter(item => 
        item.titulo && item.titulo.toLowerCase().includes(searchTitle)
    );

    if (resultados.length === 0) {
        return res.status(404).send(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <title>No encontrado</title>
                <style>
                    body { font-family: Arial; background-color: #141414; color: #fff; text-align: center; padding: 50px; }
                    h2 { color: #e50914; }
                    a { color: #46d369; text-decoration: none; font-weight: bold; }
                </style>
            </head>
            <body>
                <h2>No se encontraron coincidencias para "${req.params.title}"</h2>
                <br>
                <a href="/">⬅ Volver al inicio</a>
            </body>
            </html>
        `);
    }

    const htmlCards = resultados.map(item => `
        <div class="card">
            <span class="badge ${item.categoria === 'Serie' ? 'badge-serie' : 'badge-pelicula'}">
                ${item.categoria}
            </span>
            <h2>${item.titulo}</h2>
            <p class="genero"><strong>Género:</strong> ${item.genero}</p>
            ${item.temporadas && item.temporadas !== 'N/A' ? `<p class="temporadas"><strong>Temporadas:</strong> ${item.temporadas}</p>` : ''}
            <p class="sinopsis">${item.sinopsis}</p>
            <p class="reparto"><strong>Reparto:</strong> ${item.reparto}</p>
            ${item.trailer ? `<a href="${item.trailer}" target="_blank" class="btn-trailer">▶ Ver Tráiler</a>` : ''}
        </div>
    `).join('');

    res.status(200).send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Resultados para "${req.params.title}"</title>
            <style>
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body { font-family: Arial, sans-serif; background-color: #141414; color: #ffffff; padding: 30px 20px; }
                h1 { color: #e50914; text-align: center; margin-bottom: 30px; font-size: 2rem; }
                .grid-container { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; max-width: 1200px; margin: 0 auto; }
                .card { background-color: #1f1f1f; border: 1px solid #333; border-radius: 10px; padding: 20px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 10px rgba(0,0,0,0.5); }
                .card:hover { border-color: #e50914; }
                .badge { align-self: flex-start; padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: bold; margin-bottom: 10px; text-transform: uppercase; }
                .badge-serie { background-color: #007bc7; color: white; }
                .badge-pelicula { background-color: #e50914; color: white; }
                .card h2 { font-size: 1.4rem; margin-bottom: 10px; color: #fff; }
                .genero, .temporadas, .reparto { font-size: 0.85rem; color: #aaa; margin-bottom: 8px; }
                .sinopsis { font-size: 0.9rem; color: #ddd; margin: 12px 0; line-height: 1.4; flex-grow: 1; }
                .btn-trailer { display: block; text-align: center; background-color: #2f2f2f; color: #46d369; text-decoration: none; padding: 10px; border-radius: 6px; font-weight: bold; margin-top: 15px; border: 1px solid #444; }
                .btn-trailer:hover { background-color: #46d369; color: #141414; }
                .back-btn { display: block; width: fit-content; margin: 0 auto 25px auto; color: #46d369; text-decoration: none; font-weight: bold; font-family: monospace; }
            </style>
        </head>
        <body>
            <a href="/" class="back-btn">⬅ Volver al inicio</a>
            <h1>Resultados de búsqueda: "${req.params.title}"</h1>
            <div class="grid-container">
                ${htmlCards}
            </div>
        </body>
        </html>
    `);
});

// 3. Endpoint /categoria/:cat: Filtrar por categoría (serie o película)
app.get('/categoria/:cat', (req, res) => {
    const searchCategory = req.params.cat.toLowerCase();

    const resultados = TRAILERFLIX.filter(item =>
        item.categoria && item.categoria.toLowerCase() === searchCategory
    );

    if (resultados.length === 0) {
        return res.status(404).send(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <title>No encontrado</title>
                <style>
                    body { font-family: Arial; background-color: #141414; color: #fff; text-align: center; padding: 50px; }
                    h2 { color: #e50914; }
                    a { color: #46d369; text-decoration: none; font-weight: bold; }
                </style>
            </head>
            <body>
                <h2>No se encontraron contenidos para la categoría: "${req.params.cat}"</h2>
                <br>
                <a href="/">⬅ Volver al inicio</a>
            </body>
            </html>
        `);
    }

    const htmlCards = resultados.map(item => `
        <div class="card">
            <span class="badge ${item.categoria.toLowerCase() === 'serie' ? 'badge-serie' : 'badge-pelicula'}">
                ${item.categoria}
            </span>
            <h2>${item.titulo}</h2>
            <p class="genero"><strong>Género:</strong> ${item.genero}</p>
            ${item.temporadas && item.temporadas !== 'N/A' ? `<p class="temporadas"><strong>Temporadas:</strong> ${item.temporadas}</p>` : ''}
            <p class="sinopsis">${item.sinopsis}</p>
            <p class="reparto"><strong>Reparto:</strong> ${item.reparto}</p>
            ${item.trailer ? `<a href="${item.trailer}" target="_blank" class="btn-trailer">▶ Ver Tráiler</a>` : ''}
        </div>
    `).join('');

    res.status(200).send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Categoría: ${req.params.cat}</title>
            <style>
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body { font-family: Arial, sans-serif; background-color: #141414; color: #ffffff; padding: 30px 20px; }
                h1 { color: #e50914; text-align: center; margin-bottom: 25px; font-size: 2rem; text-transform: capitalize; }
                .grid-container { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; max-width: 1200px; margin: 0 auto; }
                .card { background-color: #1f1f1f; border: 1px solid #333; border-radius: 10px; padding: 20px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 10px rgba(0,0,0,0.5); }
                .card:hover { border-color: #e50914; }
                .badge { align-self: flex-start; padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: bold; margin-bottom: 10px; text-transform: uppercase; }
                .badge-serie { background-color: #007bc7; color: white; }
                .badge-pelicula { background-color: #e50914; color: white; }
                .card h2 { font-size: 1.4rem; margin-bottom: 10px; color: #fff; }
                .genero, .temporadas, .reparto { font-size: 0.85rem; color: #aaa; margin-bottom: 8px; }
                .sinopsis { font-size: 0.9rem; color: #ddd; margin: 12px 0; line-height: 1.4; flex-grow: 1; }
                .btn-trailer { display: block; text-align: center; background-color: #2f2f2f; color: #46d369; text-decoration: none; padding: 10px; border-radius: 6px; font-weight: bold; margin-top: 15px; border: 1px solid #444; }
                .btn-trailer:hover { background-color: #46d369; color: #141414; }
                .back-btn { display: block; width: fit-content; margin: 0 auto 20px auto; color: #46d369; text-decoration: none; font-weight: bold; font-family: monospace; }
            </style>
        </head>
        <body>
            <a href="/" class="back-btn">⬅ Volver al inicio</a>
            <h1>Categoría: ${req.params.cat}</h1>
            <div class="grid-container">
                ${htmlCards}
            </div>
        </body>
        </html>
    `);
});

// 4. Endpoint /reparto/:act: Búsqueda parcial en reparto, retorna solo { titulo, reparto }
app.get('/reparto/:act', (req, res) => {
    const searchActor = req.params.act.toLowerCase();

    const resultados = TRAILERFLIX.filter(item =>
        item.reparto && item.reparto.toLowerCase().includes(searchActor)
    );

    if (resultados.length === 0) {
        return res.status(404).send(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <title>No encontrado</title>
                <style>
                    body { font-family: Arial; background-color: #141414; color: #fff; text-align: center; padding: 50px; }
                    h2 { color: #e50914; }
                    a { color: #46d369; text-decoration: none; font-weight: bold; }
                </style>
            </head>
            <body>
                <h2>No se encontraron títulos con el actor/actriz: "${req.params.act}"</h2>
                <br>
                <a href="/">⬅ Volver al inicio</a>
            </body>
            </html>
        `);
    }

    const htmlCards = resultados.map(item => `
        <div class="card">
            <span class="badge ${item.categoria && item.categoria.toLowerCase() === 'serie' ? 'badge-serie' : 'badge-pelicula'}">
                ${item.categoria}
            </span>
            <h2>${item.titulo}</h2>
            <p class="genero"><strong>Género:</strong> ${item.genero}</p>
            ${item.temporadas && item.temporadas !== 'N/A' ? `<p class="temporadas"><strong>Temporadas:</strong> ${item.temporadas}</p>` : ''}
            <p class="sinopsis">${item.sinopsis}</p>
            <p class="reparto"><strong>Reparto:</strong> ${item.reparto}</p>
            ${item.trailer ? `<a href="${item.trailer}" target="_blank" class="btn-trailer">▶ Ver Tráiler</a>` : ''}
        </div>
    `).join('');

    res.status(200).send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reparto: ${req.params.act}</title>
            <style>
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body { font-family: Arial, sans-serif; background-color: #141414; color: #ffffff; padding: 30px 20px; }
                h1 { color: #e50914; text-align: center; margin-bottom: 25px; font-size: 2rem; }
                .grid-container { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; max-width: 1200px; margin: 0 auto; }
                .card { background-color: #1f1f1f; border: 1px solid #333; border-radius: 10px; padding: 20px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 10px rgba(0,0,0,0.5); }
                .card:hover { border-color: #e50914; }
                .badge { align-self: flex-start; padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: bold; margin-bottom: 10px; text-transform: uppercase; }
                .badge-serie { background-color: #007bc7; color: white; }
                .badge-pelicula { background-color: #e50914; color: white; }
                .card h2 { font-size: 1.4rem; margin-bottom: 10px; color: #fff; }
                .genero, .temporadas, .reparto { font-size: 0.85rem; color: #aaa; margin-bottom: 8px; }
                .sinopsis { font-size: 0.9rem; color: #ddd; margin: 12px 0; line-height: 1.4; flex-grow: 1; }
                .btn-trailer { display: block; text-align: center; background-color: #2f2f2f; color: #46d369; text-decoration: none; padding: 10px; border-radius: 6px; font-weight: bold; margin-top: 15px; border: 1px solid #444; }
                .btn-trailer:hover { background-color: #46d369; color: #141414; }
                .back-btn { display: block; width: fit-content; margin: 0 auto 20px auto; color: #46d369; text-decoration: none; font-weight: bold; font-family: monospace; }
            </style>
        </head>
        <body>
            <a href="/" class="back-btn">⬅ Volver al inicio</a>
            <h1>Resultados para el reparto: "${req.params.act}"</h1>
            <div class="grid-container">
                ${htmlCards}
            </div>
        </body>
        </html>
    `);
});

// 5. Endpoint /trailer/:id: Busca un único contenido por su ID o código
app.get('/trailer-disponibles', (req, res) => {
    // Filtrar solo los elementos que poseen URL de tráiler
    const disponibles = TRAILERFLIX.filter(item => item.trailer && item.trailer.trim() !== '');

    if (disponibles.length === 0) {
        return res.status(404).send(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <title>No encontrados</title>
                <style>
                    body { font-family: Arial; background-color: #141414; color: #fff; text-align: center; padding: 50px; }
                    h2 { color: #e50914; }
                    a { color: #46d369; text-decoration: none; font-weight: bold; }
                </style>
            </head>
            <body>
                <h2>No hay tráilers disponibles en este momento.</h2>
                <br>
                <a href="/">⬅ Volver al inicio</a>
            </body>
            </html>
        `);
    }

    const htmlCards = disponibles.map(item => `
        <div class="card">
            <span class="badge ${item.categoria && item.categoria.toLowerCase() === 'serie' ? 'badge-serie' : 'badge-pelicula'}">
                ${item.categoria}
            </span>
            <h2>${item.titulo}</h2>
            <p class="genero"><strong>Género:</strong> ${item.genero}</p>
            ${item.temporadas && item.temporadas !== 'N/A' ? `<p class="temporadas"><strong>Temporadas:</strong> ${item.temporadas}</p>` : ''}
            <p class="sinopsis">${item.sinopsis}</p>
            <p class="reparto"><strong>Reparto:</strong> ${item.reparto}</p>
            <a href="/trailer/${item.codigo || item.id}" class="btn-trailer">▶ Ver Detalle del Tráiler</a>
        </div>
    `).join('');

    res.status(200).send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Tráilers Disponibles</title>
            <style>
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body { font-family: Arial, sans-serif; background-color: #141414; color: #ffffff; padding: 30px 20px; }
                h1 { color: #e50914; text-align: center; margin-bottom: 25px; font-size: 2rem; }
                .grid-container { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; max-width: 1200px; margin: 0 auto; }
                .card { background-color: #1f1f1f; border: 1px solid #333; border-radius: 10px; padding: 20px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 10px rgba(0,0,0,0.5); }
                .card:hover { border-color: #e50914; }
                .badge { align-self: flex-start; padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: bold; margin-bottom: 10px; text-transform: uppercase; }
                .badge-serie { background-color: #007bc7; color: white; }
                .badge-pelicula { background-color: #e50914; color: white; }
                .card h2 { font-size: 1.4rem; margin-bottom: 10px; color: #fff; }
                .genero, .temporadas, .reparto { font-size: 0.85rem; color: #aaa; margin-bottom: 8px; }
                .sinopsis { font-size: 0.9rem; color: #ddd; margin: 12px 0; line-height: 1.4; flex-grow: 1; }
                .btn-trailer { display: block; text-align: center; background-color: #2f2f2f; color: #46d369; text-decoration: none; padding: 10px; border-radius: 6px; font-weight: bold; margin-top: 15px; border: 1px solid #444; }
                .btn-trailer:hover { background-color: #46d369; color: #141414; }
                .back-btn { display: block; width: fit-content; margin: 0 auto 20px auto; color: #46d369; text-decoration: none; font-weight: bold; font-family: monospace; }
            </style>
        </head>
        <body>
            <a href="/" class="back-btn">⬅ Volver al inicio</a>
            <h1>🎬 Tráilers Disponibles (${disponibles.length})</h1>
            <div class="grid-container">
                ${htmlCards}
            </div>
        </body>
        </html>
    `);
});

//trailer/:id
// Muestra el tráiler o detalle de UN SOLO contenido según su ID o Código
// =============================================================================
app.get('/trailer/:id', (req, res) => {
    const { id } = req.params;

    // Buscar coincidencia por 'codigo' o 'id'
    const item = TRAILERFLIX.find(e => String(e.codigo || e.id) === String(id));

    if (!item) {
        return res.status(404).send(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <title>No encontrado</title>
                <style>
                    body { font-family: Arial; background-color: #141414; color: #fff; text-align: center; padding: 50px; }
                    h2 { color: #e50914; }
                    a { color: #46d369; text-decoration: none; font-weight: bold; }
                </style>
            </head>
            <body>
                <h2>No se encontró ningún contenido con el ID/Código: "${id}"</h2>
                <br>
                <a href="/">⬅ Volver al inicio</a>
            </body>
            </html>
        `);
    }

    const urlTrailer = item?.trailer;

    res.status(200).send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Tráiler - ${item.titulo}</title>
            <style>
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body { font-family: Arial, sans-serif; background-color: #141414; color: #ffffff; padding: 30px 20px; display: flex; flex-direction: column; align-items: center; min-height: 100vh; }
                h1 { color: #e50914; text-align: center; margin-bottom: 25px; font-size: 2rem; }
                .card-container { width: 100%; max-width: 500px; margin: 0 auto; }
                .card { background-color: #1f1f1f; border: 1px solid #333; border-radius: 10px; padding: 25px; text-align: center; box-shadow: 0 4px 10px rgba(0,0,0,0.5); }
                .badge { display: inline-block; padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: bold; margin-bottom: 15px; text-transform: uppercase; }
                .badge-id { background-color: #333; color: #46d369; border: 1px solid #46d369; }
                .card h2 { font-size: 1.6rem; margin-bottom: 15px; color: #fff; }
                .msg-error { color: #e50914; font-weight: bold; margin: 15px 0; background: #2a1515; padding: 12px; border-radius: 6px; }
                .btn-trailer { display: inline-block; background-color: #2f2f2f; color: #46d369; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; margin-top: 15px; border: 1px solid #444; transition: background-color 0.2s; }
                .btn-trailer:hover { background-color: #46d369; color: #141414; }
                .back-btn { display: block; margin-bottom: 20px; color: #46d369; text-decoration: none; font-weight: bold; font-family: monospace; }
            </style>
        </head>
        <body>
            <a href="/trailers-disponibles" class="back-btn">⬅ Volver a tráilers disponibles</a>
            <h1>Tráiler del Contenido</h1>
            <div class="card-container">
                <div class="card">
                    <span class="badge badge-id">ID / Código: ${item.codigo || item.id}</span>
                    <h2>${item.titulo}</h2>
                    ${urlTrailer ? `
                        <a href="${urlTrailer}" target="_blank" class="btn-trailer">▶ Ver en YouTube</a>
                    ` : `
                        <div class="msg-error">⚠ El contenido seleccionado no posee un tráiler disponible.</div>
                    `}
                </div>
            </div>
        </body>
        </html>
    `);
});


// Manejo de rutas inexistentes (404)
app.use((req, res) => {
    res.status(404).send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>404 - No Encontrado</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #141414;
                    color: #ffffff;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    margin: 0;
                    text-align: center;
                }
                h1 { font-size: 5rem; color: #e50914; margin: 0; }
                h2 { font-size: 1.5rem; margin-bottom: 20px; }
                p { color: #aaa; margin-bottom: 30px; }
                .btn-home {
                    background-color: #2f2f2f;
                    color: #46d369;
                    text-decoration: none;
                    padding: 12px 24px;
                    border-radius: 6px;
                    font-weight: bold;
                    font-family: monospace;
                    border: 1px solid #444;
                    transition: background-color 0.2s ease;
                }
                .btn-home:hover {
                    background-color: #3e3e3e;
                }
            </style>
        </head>
        <body>
            <h1>404</h1>
            <h2>¡Ruta no encontrada!</h2>
            <p>El apartado que estas buscando no existe en Trailerflix.</p>
            <a href="/" class="btn-home">⬅ Volver al inicio</a>
        </body>
        </html>
    `);
});


app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use(errorHandler);

module.exports = app;
