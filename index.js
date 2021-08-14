const api = require('./api');
const express = require('express');
const cache = require('cache-manager');

const memoryCache = cache.caching({ store: 'memory', ttl: 21600})

const server = express();

server.get("/", (req, res) => {
    return res.send("Pesquise um heroi usando '/search?q={parametro} ou /hero/{slug}");
});

async function getCache(){
    const response = await memoryCache.get('all');

    if (!response) {
        const response = await api.get("all.json");
        await memoryCache.set('all', response)
        return response.data;
    }

    return response.data;

}

async function searchHero(teste){
    const response = await getCache()
    let hero = []

    response.filter( function(item){
        if (item.name.toLowerCase().includes(teste.toLowerCase())){
            hero.push(item)
        }
        else if (JSON.stringify(item.appearance).toLowerCase().includes(teste.toLowerCase())){
            hero.push(item)
        }
        else if (JSON.stringify(item.biography).toLowerCase().includes(teste.toLowerCase())){
            hero.push(item)
        }
        else if (JSON.stringify(item.work).toLowerCase().includes(teste.toLowerCase())){
            hero.push(item)
        }
    });
    
    return hero
}

server.get("/search", async (req, res) => {
    let teste = req.query.q

    if (teste.length < 3){
        return res.status(400).send({ error: "A pesquisa deve conter mais que 3 caracteres." });
    }

    const response = await searchHero(teste)

    if (response.length === 0){
        return res.status(204).send()
    }
    return res.status(200).send(response)
    
});

server.get("/hero/:slug", async (req, res) => {
    const { slug } = req.params;
    const response = await getCache()
    let hero = ""
    try {
        hero = response.filter(item => item.slug.toLowerCase().includes(slug.toLowerCase()))

        if(hero.length === 0){
            return res.status(404).send({error: "Herói não encontrado."});
        }
        
        return res.status(200).send(hero);

    } catch (error) {
        res.send({ error: error.message });
        
    }
});

PORT = process.env.PORT || 8080
server.listen(PORT, () => {
    console.log("Servidor rodando")
})