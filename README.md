BrewAtlas ☕
Discover coffee shops worth finding.

BrewAtlas is an independent, map-based web application for discovering coffee shops. It currently focuses on Nashville, Tennessee. I'm building it to develop my skills in web development, location-based search, and creating useful interactive experiences.

Status: In development
Features
- Interactive coffee shop map: Explore the Nashville area by panning and zooming.
- Coffee shop markers: Select a marker to see the shop's name and, when available, its address.
- Find in this area: Search for coffee shops in a new area after moving the map.
- Map and satellite views: Switch between standard and satellite map styles.
- Search feedback: See the number of shops loaded, loading messages, and search errors.
- App navigation: Switch between the map and a profile page. The profile page is currently a placeholder.
Built with

Technology	Purpose
Next.js 15 and React 19	Web application framework and interface
TypeScript	Application logic and type safety
Mapbox GL JS	Interactive maps, markers, and popups
Mapbox Search Box API	Location-based coffee shop searches
CSS	Interface styling and responsive layout
Git and GitHub	Version control


The project also includes Tailwind CSS tooling, although its current interface mainly uses CSS.
Getting started
Requirements
- Node.js and npm
- A Mapbox account and an appropriately scoped public access token
Run the project locally
1. Clone the repository:
   git clone https://github.com/eligonzalez23/brewatlas.git
   cd brewatlas
2. Install dependencies:
   npm install
3. Create a .env.local file in the project root and add your own Mapbox public token:
   NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_public_access_token
   NEXT_PUBLIC_ variables can be included in browser-side code. Use a public token with appropriate restrictions. Never add secret credentials to this file or commit secrets to GitHub.
4. Start the development server:
   npm run dev
5. Open http://localhost:3000. The homepage redirects to the map.
How the coffee shop search works
When BrewAtlas loads, it starts with a broad search around Nashville. The application divides the search area into smaller geographic sections and sends requests through a Next.js API route to Mapbox's coffee-category search endpoint.

The responses are combined, duplicate coffee shops are removed using their Mapbox place IDs, and the results appear as interactive markers. After moving the map, users can select Find in this area to search the currently visible region.
What's next
BrewAtlas is still a work in progress. The mapping and coffee shop search interface are implemented, while the profile page is currently a placeholder. Features I'd like to explore as the project grows include richer coffee shop details, saved favorites, a more polished mobile experience, and discovery beyond Nashville.

Why I built BrewAtlas
I'm pursuing a Computer Science degree at Southern New Hampshire University, and I wanted to work on something outside my coursework that I could continue improving over time. BrewAtlas gives me hands-on experience turning an idea into a working application, integrating APIs, debugging code, and designing an interface people can use.

GitHub: eligonzalez23/brewatlas
