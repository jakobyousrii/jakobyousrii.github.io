
const hamburger = document.querySelector(".hamburger");
const showLi = document.querySelectorAll(".hamb");
const search = document.querySelector("#search");
const input = document.querySelector(".input");
const section = document.querySelector(".searchSection");
const jumbotron = document.querySelector(".jumbotron");


hamburger.addEventListener("click", () => {

    for (let i = 0; i < showLi.length; i++) {
        showLi[0].classList.toggle("first");
        showLi[i].classList.toggle("displayOnSmall");
    }
});

search.addEventListener("click", () => {
    input.classList.toggle("searchClick");
})

input.addEventListener("change", async (e) => {
    //Removing elements from search
    const article = document.querySelectorAll("article");
    for (let artickl of article) {
        artickl.remove();
    }

    section.style.display = "none";

    const value = input.value.toLowerCase();
    if (value) {
        const resInfo = await axios.get(`https://pokeapi.co/api/v2/pokemon/${value}`);
        const pokeSpecies = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${value}`);
        const regionReq = await axios.get(`https://pokeapi.co/api/v2/pokemon-form/${value}`);

        SearchDom(resInfo, pokeSpecies, regionReq);
    }
    else {
        jumbotron.classList.remove("jumboMargin");
        typeOfPoke();
    }
});


const SearchDom = async (response, about, region) => {
    try {

        const img = document.createElement("img");
        const h4 = document.createElement("h4");
        const idandSeasson = document.createElement("span");
        const picAndName = document.createElement("div");
        const pokeAbout = document.createElement("p");
        const article = document.createElement("article");
        const typeOf = document.createElement("article");
        const openP = document.createElement("h4");
        const regionRes = await axios.get(region.data.version_group.url);

        //Weakness Pokemon
        const weakStrong = await axios.get(response.data.types[0].type.url);
        const doubleDamageFrom = weakStrong.data.damage_relations.double_damage_from;
        const doubleDamageTo = weakStrong.data.damage_relations.double_damage_to;
        const noDamageFrom = weakStrong.data.damage_relations.no_damage_from;
        const articleWeak = document.createElement("div");
        articleWeak.classList.add("weaknessArticle");
        const articleWS = document.createElement("article");
        articleWS.classList.add("strongAndWeak");
        const dblDmg = document.createElement("h4");
        dblDmg.textContent = "Weak against:"
        dblDmg.classList.add("h4Weakness");
        articleWeak.append(dblDmg);

        //adventagesTypes
        const articleStrong = document.createElement("div");
        articleStrong.classList.add("weaknessArticle");
        const dblAdvent = document.createElement("h4");
        dblAdvent.textContent = "Strong against:";
        dblAdvent.classList.add("h4strong");
        articleStrong.append(dblAdvent);

        //Appending weak and strong types
        if (response.data.types[0].type.name === "normal" && response.data.types.length === 1) {
            weak(doubleDamageFrom, bgOfType, articleWeak);
            weak(noDamageFrom, bgOfType, articleStrong);
        }
        else if (response.data.types[0].type.name === "normal" && response.data.types.length > 1) {
            const weakStrong = await axios.get(response.data.types[1].type.url);
            weak(weakStrong.data.damage_relations.double_damage_from, bgOfType, articleWeak);
            weak(weakStrong.data.damage_relations.double_damage_to, bgOfType, articleStrong);

        }

        else {
            weak(doubleDamageFrom, bgOfType, articleWeak);
            weak(doubleDamageTo, bgOfType, articleStrong);
        }

        //Type of a pokemon
        openP.innerText = "Type:";
        openP.classList.add("startType");
        typeOf.append(openP);

        for (let i of response.data.types) {
            for (let bg in bgOfType) {
                if (i.type.name === bg) {
                    const p = document.createElement("p");
                    p.innerText = i.type.name;
                    p.style.backgroundColor = bgOfType[bg][0];
                    p.style.border = `1px solid ${bgOfType[bg][1]}`
                    p.classList.add("typeOf");
                    typeOf.append(p);
                }
            }
        }

        //Photo and name of a pokemon     
        img.src = response.data.sprites.front_default;
        img.classList.add("imgClass");
        h4.classList.add("h4Pokemon");
        idandSeasson.textContent = `#${response.data.id} (${regionRes.data.pokedexes[0].name.toUpperCase()})`;
        h4.innerText = `${response.data.species.name.toUpperCase()}`;
        idandSeasson.classList.add("pKanto");
        picAndName.append(img, h4, idandSeasson);
        article.append(picAndName);

        //About pokemon
        const h4About = document.createElement("h3");
        h4About.append("About:");
        pokeAbout.innerHTML = about.data.flavor_text_entries[10].flavor_text;
        const aboutArticle = document.createElement("article");
        aboutArticle.classList.add("aboutPoke");
        aboutArticle.append(h4About, pokeAbout);

        //final append
        typeOf.classList.add("typeOfArticle");
        articleWS.append(articleWeak, articleStrong);
        section.append(article, typeOf, aboutArticle, articleWS);
        jumbotron.classList.add("jumboMargin");

        section.style.display = "flex";
        input.classList.toggle("searchClick");
        typeOfPoke();

    }
    catch (e) {
        console.log(`Sorry Error,${e}`);
    }

}

const bgOfType = {
    normal: ["#A8A878", "#8a7c65"],
    shadow: ["darkgrey"],
    unknown: ["grey"],
    fairy: ["#EE99AC", "#ad6da3"],
    dark: ["#705848", "#5c483b"],
    dragon: ["#7038F8", "#5f30d1"],
    ice: ["#98D8D8", "#72a6a6"],
    psychic: ["#F85888", "#d14770"],
    bug: ["#A8B820", "#859120"],
    electric: ["#F8D030", "#e3be2b"],
    grass: ["#8ed164", "#629443"],
    water: ["#6890F0", "#597ac9"],
    fire: ["#F08030", "#d47028"],
    steel: ["#B8B8D0", "#a0a0b8"],
    ghost: ["#705898", "#614d82"],
    rock: ["#B8A038", "#99852f"],
    ground: ["#E0C068", "#b59b53"],
    poison: ["#A040A0", "#822e82"],
    flying: ["#A890F0", "#8162a1"],
    fighting: ["#C03028", "#a62821"]
}


const weak = (dbldmge, colortype, article) => {
    for (let weak of dbldmge) {
        for (let beg in colortype) {
            if (beg === weak.name) {
                const p = document.createElement("p");
                p.textContent = weak.name;
                p.style.backgroundColor = bgOfType[beg][0];
                p.style.border = `1px solid ${bgOfType[beg][1]}`;
                p.classList.add("weaknessElements");
                article.append(p);
            }
        }
    }
}


//Adding pokemon types into all sections

const buttonType = document.querySelector(".buttonType");
const typeSection = document.querySelector(".normal");

const typeOfPoke = async () => {
    //Api for all Pokemon types
    const resWait = await axios.get("https://pokeapi.co/api/v2/type/");

    for (let type of resWait.data.results) {
        //Api for one type at the time

        if (type.name !== "unknown" && type.name !== "shadow") {
            const resOneType = await axios.get(type.url);

            //creating types strong and weak against
            //All pokemons
            const typeArticle = document.createElement("article");
            typeArticle.classList.add("articleContent");
            const h1typeOf = document.createElement("h1");
            const button = document.createElement("button");
            button.innerHTML = `<i class="fas fa-chevron-circle-down margin-far"></i>`;
            button.classList.add("buttonX");
            h1typeOf.textContent = `${type.name}`;
            h1typeOf.classList.add("h1type");
            h1typeOf.append(button);
            typeArticle.append(h1typeOf);

            changeColor(bgOfType, type.name, h1typeOf);

            const allPokemon = document.createElement("object");
            allPokemon.classList.add("pokeLocations");

            button.addEventListener("click", async (e) => {

                allPokemon.classList.toggle("aside");

                if (e.target.nodeName === "I") {


                    if (allPokemon.classList.contains("aside")) {
                        allPokemon.classList.remove("pokeLocations");
                        const rmPoke = document.querySelectorAll(".pokeName");
                        for (let rm of rmPoke) {
                            rm.remove();
                        }
                        button.innerHTML = `<i class="far fa-times-circle margin-far"></i>`;
                        for (let pokemon of resOneType.data.pokemon) {
                            const pokemonPhotoUrl = await axios.get(pokemon.pokemon.url);
                            if (pokemonPhotoUrl.data.sprites.front_default) {

                                const pokeDiv = document.createElement("div");
                                const pokemonName = document.createElement("h4");
                                pokemonName.textContent = pokemon.pokemon.name;
                                const pokePhoto = document.createElement("img");
                                pokePhoto.src = pokemonPhotoUrl.data.sprites.front_default;
                                pokePhoto.classList.add("imgClassTypes");
                                pokeDiv.append(pokePhoto, pokemonName);
                                pokeDiv.classList.add("pokeName");
                                allPokemon.append(pokeDiv);
                                typeArticle.append(allPokemon);
                            }
                        }

                    }
                    else {
                        allPokemon.classList.add("pokeLocations");
                        button.innerHTML = `<i class="fas fa-chevron-circle-down margin-far"></i>`;


                    }
                }

            });
            typeSection.append(typeArticle);

        }
    }
}


typeOfPoke();


const changeColor = (bgoftype, typeName, h1typeof) => {
    for (let color in bgoftype) {
        if (color === typeName) {
            h1typeof.style.backgroundColor = bgoftype[color][0];
            h1typeof.style.border = `1px solid ${bgoftype[color][1]}`;
        }
    }
}
