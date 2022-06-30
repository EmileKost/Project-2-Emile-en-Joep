# README Repository Portofolio

## Over dit project
Bij projectweek twee heb ik met de Github API gecombineerd met Graphql een repository portofolio website gemaakt. Op deze website zijn al mijn repositories te vinden met wat introducerende informatie daarbij. Vanuit deze website kan de bezoeker direct door naar de Github repository die zij zoeken. Tevens kunnen gebruikers met een specifieke zoekterm zoeken naar een van mijn repositories.

## De interface
![Schermafbeelding 2022-06-30 om 13 25 29](https://user-images.githubusercontent.com/70690100/176665925-0a3ec6c2-7928-4785-8de7-56953a3e7072.png)

## Link naar mijn website

## Clone dit project
````
git clone https://github.com/EmileKost/RepositoryPortofolio_EmileKost.git
````
````
npm install
````
````
npm start
````

## Uitleg code
Voordat ik kon beginnen met het ophalen van mijn Github data moest ik eers een acces token aanvragen. Deze kon ik simpelweg op Github aanvragen en heb ik een verloopdatum van een jaar meegegeven. Deze token is in de code editor in een .env bestand gezet zodat deze informatie beschermd blijft. Om tot dit concept te komen heb ik verschillende libraries en middleware moeten gebruiken:

* body-parser om de waarde gemakkelijk vanuit de zoekbalk te verkrijgen
* graphql, graphql-defaults om zo graphql te kunnen gebruiken

### Testen van graphql layout
![Schermafbeelding 2022-06-30 om 13 36 03](https://user-images.githubusercontent.com/70690100/176667889-8dad8da9-4095-4fb8-b286-4a860ba5febe.png)

Voordat ik ging beginnen met code schrijven heb ik eerst de structuur van mijn graphql layout getest in de graphql explorer pagina van Github. Deze pagina is speciaal om de structuur van jouw graphql te testen. Na een paar aanpassingen kreeg ik de juiste layout en kon ik daadwerkelijk met code beginnen om de data van mijn Github profiel op te halen.

### Ophalen van Github data
````
app.get('/', (req, res) => {
  graphqlAuth(`{
    user(login: "EmileKost") {
        repositories(affiliations: OWNER, first: 20, privacy: PUBLIC, orderBy: {field: UPDATED_AT, direction: DESC}) {
          edges {
            node {
              name
              description
              createdAt
              owner {
                id
              }
              updatedAt
              url
            }
          }
        }
      }
  }`)
  .then((data) => {
      console.log(data.user.repositories.edges)
      res.render('index', {
          data: data.user.repositories.edges
      })
      
  })
})
````
Voor het ophalen van de data vanuit Github moest de structuur van de die ik wilde verkrijgen worden meegegeven. Tevens kon je bij de repositories nog verschillende dingen aangeven. Ik heb aangegeven dat ik de eerste twintig repositories wil ophalen en dat deze geordend moeten zijn op laatst geupdatet. In de node heb ik aangegeven welke data ik daarbij wil ophalen. Na de promise wordt deze afgehandelt met een .then. Hierin wordt aangegeven dat de indexpagina moet worden gerenderd en dat de opgehaalde data als een object moet worden meegegeven.

### Renderen van de data met EJS
````
 <% if(data.length) { %>
            <ul id="list">
            <% for(let i = 0; i < data.length; i++) { %>
               <div id="repository">
                   <h3><%= data[i].node.name %></h3>
                   <p><%= data[i].node.description %></p>
                   <h4>Status:</h4>
                   <ul>
                       <li>Created at: <%= data[i].node.createdAt %></li>
                       <li>Updated at: <%= data[i].node.updatedAt %> %></li>
                   </ul>
                   <a href="<%= data[i].node.url %>" adding the target=”_blank” >URL: <%= data[i].node.url %></a>
               </div>
                <% } %>
            </ul>
            <% } %>
````
Om de data te renderen heb ik gebruik gemaakt van EJS. Hierdoor kon ik gemakkelijk een for loop in de HTML schrijven waardoor alle data een voor een in de juiste volgorde wordt gerendert. EJS maakt dit een stuk makkelijker doordat er client side Javascript geschreven kan worden in de HTML.

### Zoekfunctie
````

app.post('/', (req, res) => {
  const input = req.body.search;
  graphqlAuth(`
    query { 
      user(login: "EmileKost") {
        repository(name: "${input}") {
              name
              description
              createdAt
              owner {
                id
              }
              updatedAt
              url
            }
          }
        }
  `)
  .then(result => {
    console.log(result)
    res.render('search', {
      data: result.user.repository
    })
    .catch(err => res.send(err))
  })
})
````
Gebruikers krijgen de optie om te zoeken naar de naam van een repository. Dit was voor mij een aardige opgave. Over zoeken met de Github API en Graphql kon ik niet super veel vinden om mij over in te lezen. De oplossing die ik nu heb werkt alleen bij succes goed. De code voor het ophalen van alle data en de zoekresultaten zijn bijna helemaal hetzelfde. In de app.post van de index pagina wordt de value van de zoekopdracht opgehaald. Dit wordt gedaan met behulp van body-parser. Om te zoeken wordt de waarde van de zoekopdracht (input) meegegeven aan graphql en zal alleen voor deze naam de data worden opgehaald en gerenderd. De gebruiker wordt doorgeleid naar de zoekpagina. Wat hier nog niet aan werkt is dat als de zoekterm afwijkt of niet matched met een bestaande repository, dat dan de app helaas crashet. Hier heb ik lang naar gekeken maar ben helaas in deze korte tijd nog niet met een passende oplossing gekomen.

## Features 
* Ophalen en renderen van mijn repositories met behulp van Github API en Graphql
* Zoekfunctie om te zoeken naar repositories

## Wishlist
* Repositories kunnen sorteren
* Goede afhandeling van "foute" zoekopdrachten

