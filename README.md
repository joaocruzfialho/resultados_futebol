# Previsor de Resultados de Futebol 2025/26

Site local para prever resultados de jogos dos campeonatos de **Portugal**, **Espanha** e **Inglaterra** com base em:

- **Distribuição de Poisson**
- **Força de ataque**
- **Força de defesa**
- **Forma recente** (últimos 5 jogos)

## Como usar

### Opção 1: abrir no browser
Abra o ficheiro `index.html` no browser.

### Opção 2: correr um servidor local
```bash
npm start
```
Depois abra `http://localhost:3000`.

## Atualizar dados da época 2025/26
```bash
npm run update-data
```

Isto descarrega dados públicos do site `football-data.co.uk` e recria o ficheiro `data/snapshot.js`.

## Ligar APIs dedicadas de odds
Para melhorar a cobertura das casas de apostas, pode configurar **uma ou duas** chaves num ficheiro `.env` na raiz do projeto:

```bash
ODDS_API_KEY=cole_aqui_a_sua_chave
ODDS_API_REGIONS=eu,uk
ODDS_API_MARKETS=h2h,totals
ODDS_API_BOOKMAKERS=betclic_fr,betfair_sb_uk,betvictor,betway,ladbrokes_uk,leovegas,pinnacle,williamhill,sport888

API_FOOTBALL_KEY=cole_aqui_a_sua_chave
API_FOOTBALL_BASE_URL=https://v3.football.api-sports.io
```

Depois execute novamente:

```bash
npm run update-data
```

A app tenta combinar:
- `football-data.co.uk` para histórico e fallback
- **The Odds API** para cobertura ampla de bookmakers europeias
- **API-Football** como segundo provider para aumentar a cobertura e redundância

Sem chave, a app continua a usar a fonte pública gratuita e mostra `N/D` quando a casa não está disponível.

## Modelo atual

O cálculo base faz:

1. médias de golos da liga em casa e fora;
2. força ofensiva e defensiva de cada equipa;
3. ajuste leve pela forma recente;
4. probabilidades para `1X2`, `over 2.5`, `ambas marcam` e resultados exatos.

## Melhorias futuras possíveis

- correção de **Dixon-Coles**;
- usar **xG** em vez de apenas golos reais;
- considerar ausências, descanso e calendário.
