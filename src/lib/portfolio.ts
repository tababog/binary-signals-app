/**
 * Portfólio da Tababog (etapa 7), sempre em inglês porque vai para o cliente (regra 9).
 * Texto "About us" aprovado pelo Alessandro em 05/11/2026 (docs/empresa.md); fotos só de trabalho acabado,
 * escolhidas da pasta "Fotos Portfolio" do Drive e guardadas em public/fotos-portfolio.
 * Avaliações: só as de 5 estrelas do Thumbtack, sem data (docs/avaliacoes-thumbtack.md).
 */

export const PORTFOLIO = {
  titulo: "Craftsmanship you can see in every detail",
  subtitulo: "Custom cabinets, drywall, basements, additions, doors & windows, flooring and decks.",
  capa: "/fotos-portfolio/escritorio-azul.jpg",
  numeros: [
    { valor: "2017", rotulo: "Founded" },
    { valor: "500+", rotulo: "Projects completed" },
    { valor: "25+", rotulo: "Years of combined experience" },
    { valor: "4.7★", rotulo: "Thumbtack rating" },
  ],
  sobre: [
    "Tababog Construction LLC was founded in 2017 in Bridgeport, Connecticut, by two craftsmen who came a long way to build a life in the United States and found their calling in construction.",
    "Alessandro, from Brazil, has lived in the U.S. for 10 years and has spent all of them in construction. Emmanuel, from Mexico, has lived in the U.S. for 20 years and has worked in construction for 16. Woodworking runs in his family: his father is a woodcarver in Mexico who hand-carves pieces like eagles and other figures, and it was from him that Emmanuel learned what quality work means.",
    "Together they bring more than 25 years of combined experience and have completed more than 500 projects, serving all of Connecticut with custom cabinets, drywall, basement remodeling, home additions, door and window installation, laminate flooring and decks.",
    "What sets us apart is our finish work: every detail is handled with the care of someone building for their own family.",
  ],
  socios: [
    { inicial: "A", nome: "Alessandro", texto: "Co-founder · From Brazil · 10 years in construction" },
    { inicial: "E", nome: "Emmanuel", texto: "Co-founder · From Mexico · 16 years in construction" },
  ],
  servicos: ["Custom cabinets", "Drywall", "Basement remodeling", "Home additions", "Doors & windows", "Laminate flooring", "Decks"],
  categorias: [
    {
      nome: "Custom Cabinets & Built-ins",
      texto: "Built-in shelving, entertainment centers, home offices, window seats and closets, designed and built to fit each room.",
      fotos: ["estante-sala-tv", "estantes-lareira", "estante-tv-cinza", "escritorio-azul", "escritorio-embutido", "biblioteca-azul", "quarto-banco-janela", "beliches", "closet"],
    },
    {
      nome: "Fine Woodwork",
      texto: "Hand-finished pieces and fireplace mantels, the craftsmanship Emmanuel learned from his father.",
      fotos: ["aparador-entalhado", "lareira-moldura", "lareira-lateral"],
    },
    {
      nome: "Basements & Flooring",
      texto: "Unused basements turned into finished living space, with new floors, doors and trim.",
      fotos: ["basement-portas", "basement-sala", "piso-laminado"],
    },
    {
      nome: "Decks",
      texto: "Decks designed and built from the ground up, with railings and stairs.",
      fotos: ["deck-cinza", "deck-escada"],
    },
  ],
  nota: "4.7",
  avaliacoes: [
    {
      nome: "Daniel C.",
      servico: "Deck",
      texto: "We had a great experience working with Alex and his team. They were very responsive and did an incredibly thorough job designing and building our deck from the ground up. The finished product was better than we could have expected, highly recommend them.",
    },
    {
      nome: "German C.",
      servico: "Drywall",
      texto: "Alex and his team did an amazing job with sheet rocking practically my entire kitchen, ceiling, and bathrooms. I never had a problem reaching him and he answered every question very professionally with great detail. …",
    },
    {
      nome: "Sai V.",
      servico: "Structural beam + doors",
      texto: "Alex and Manny are a pleasure to work with. Hired them for replacing a load bearing beam in the lower level, installing new doors around the house and they did an incredible job and I'm extremely satisfied with their work. Highly recommend!",
    },
    {
      nome: "Brian R.",
      servico: "Cabinets + backsplash",
      texto: "Alex and company did a fantastic job painting our kitchen cabinets and installing backsplash. The team was very professional, responsive and completed the job quickly. We were very happy with the finished product.",
    },
    {
      nome: "Gabriella T.",
      servico: null,
      texto: "They are the best! I highly recommend them. They are very professional, responsible and Their job is absolutely incredible. Their job is very detailed and built with care. …",
    },
    {
      nome: "Marisa D.",
      servico: "Drywall + trim",
      texto: "Alex and his team were reliable and did quality work. I needed Sheetrock installed and finished in my garage and trimming done with a new step. He completed the job in the discussed time frame and did quality work. I will definitely use Alex again in future projects. Thank you Alex!",
    },
  ],
  instagram: "@tababog_construction",
};

export const fotoPortfolio = (nome: string) => `/fotos-portfolio/${nome}.jpg`;
