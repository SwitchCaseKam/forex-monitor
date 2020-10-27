export interface Club {
  name: string;
  country: string;
}

export const clubs = new Map([
  ['1', [
      {name: 'Bayern', country: 'Germany'},
      {name: 'Sevilla', country: 'Spain'},
      {name: 'Real Madrid', country: 'Spain'},
      {name: 'Liverpool', country: 'England'},
      {name: 'Juventus', country: 'Italy'},
      {name: 'PSG', country: 'France'},
      {name: 'Zenit', country: 'Russia'},
      {name: 'FC Porto', country: 'Portugal'}
      ]
  ],
  ['2', [
      {name: 'FC Barcelona', country: 'Spain'},
      {name: 'Atletico Madryt', country: 'Spain'},
      {name: 'Manchester City', country: 'England'},
      {name: 'Manchester United', country: 'England'},
      {name: 'Szachtar Donieck', country: 'Ukraine'},
      {name: 'Borussia Dortmund', country: 'Germany'},
      {name: 'Chelsea', country: 'England'},
      {name: 'Ajax Amsterdam', country: 'Netherlands'}
      ]
  ],
  ['3', [
      {name: 'Dynamo Kiev', country: 'Ukraine'},
      {name: 'Red Bull Salzburg', country: 'Austria'},
      {name: 'RB Lipsk', country: 'Germany'},
      {name: 'Inter', country: 'Italy'},
      {name: 'Olympiakos', country: 'Greece'},
      {name: 'Lazio', country: 'Italy'},
      {name: 'FK Krasnodar', country: 'Russia'},
      {name: 'Atalanta', country: 'Italy'}
      ]
  ],
  ['4', [
      {name: 'Lokomotiw Moscow', country: 'Russia'},
      {name: 'Olympique Marseille', country: 'France'},
      {name: 'Club Brugge', country: 'Belgium'},
      {name: 'Borussia Monchengladbach', country: 'Germany'},
      {name: 'Istanbul Basaksehir', country: 'Turkey'},
      {name: 'FC Midtjylland', country: 'Denmark'},
      {name: 'Stade Rennes', country: 'France'},
      {name: 'Ferencvaros', country: 'Hungary'}
      ]
  ]
]);

export let groups = new Map<string, Club[]>([
  ['A', []],
  ['B', []],
  ['C', []],
  ['D', []],
  ['E', []],
  ['F', []],
  ['G', []],
  ['H', []]
]);
