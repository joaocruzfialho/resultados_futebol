import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.resolve(__dirname, "../data/snapshot.js");

const SEASON = "2025/26";
const SEASON_START = "2025";
const RECENT_MATCH_LIMIT = 8;
const LEAGUES = [
  {
    key: "portugal",
    country: "Portugal",
    name: "Primeira Liga",
    url: "https://www.football-data.co.uk/mmz4281/2526/P1.csv",
    oddsApiSportKey: "soccer_portugal_primeira_liga",
    apiFootballLeagueId: 94
  },
  {
    key: "spain",
    country: "Espanha",
    name: "La Liga",
    url: "https://www.football-data.co.uk/mmz4281/2526/SP1.csv",
    understatKey: "La liga",
    oddsApiSportKey: "soccer_spain_la_liga",
    apiFootballLeagueId: 140
  },
  {
    key: "england",
    country: "Inglaterra",
    name: "Premier League",
    url: "https://www.football-data.co.uk/mmz4281/2526/E0.csv",
    understatKey: "EPL",
    oddsApiSportKey: "soccer_epl",
    apiFootballLeagueId: 39
  }
];

const TEAM_NAME_ALIASES = {
  england: {
    mancity: "Manchester City",
    manunited: "Manchester United",
    manutd: "Manchester United",
    newcastle: "Newcastle United",
    nottmforest: "Nottingham Forest",
    wolves: "Wolverhampton Wanderers",
    tottenham: "Tottenham",
    westham: "West Ham",
    brighton: "Brighton",
    crystalpalace: "Crystal Palace"
  },
  spain: {
    athbilbao: "Athletic Club",
    athmadrid: "Atletico Madrid",
    amadrid: "Atletico Madrid",
    atleticomadrid: "Atletico Madrid",
    sociedad: "Real Sociedad",
    realsociedad: "Real Sociedad",
    celta: "Celta Vigo",
    betis: "Real Betis",
    vallecano: "Rayo Vallecano",
    rayovallecano: "Rayo Vallecano",
    espanol: "Espanyol",
    espanyol: "Espanyol"
  }
};

const BOOKMAKER_DEFINITIONS = [
  { key: "bet365", name: "Bet365", home: "B365H", draw: "B365D", away: "B365A", over25: "B365>2.5", under25: "B365<2.5" },
  { key: "betfair", name: "Betfair Sportsbook", home: "BFDH", draw: "BFDD", away: "BFDA" },
  { key: "betmgm", name: "BetMGM", home: "BMGMH", draw: "BMGMD", away: "BMGMA" },
  { key: "betvictor", name: "BetVictor", home: "BVH", draw: "BVD", away: "BVA" },
  { key: "bwin", name: "Bwin", home: "BWH", draw: "BWD", away: "BWA" },
  { key: "pinnacle", name: "Pinnacle", home: "PSH", draw: "PSD", away: "PSA", over25: "P>2.5", under25: "P<2.5" },
  { key: "ladbrokes", name: "Ladbrokes", home: "LBH", draw: "LBD", away: "LBA" }
];

const ODDS_API_CONFIG = {
  providerName: "The Odds API",
  apiKey: process.env.ODDS_API_KEY || "",
  baseUrl: (process.env.ODDS_API_BASE_URL || "https://api.the-odds-api.com/v4").replace(/\/+$/, ""),
  regions: process.env.ODDS_API_REGIONS || "eu,uk",
  markets: process.env.ODDS_API_MARKETS || "h2h,totals",
  bookmakers: process.env.ODDS_API_BOOKMAKERS || "betclic_fr,betfair_sb_uk,betvictor,betway,ladbrokes_uk,leovegas,pinnacle,williamhill,sport888"
};

const API_FOOTBALL_CONFIG = {
  providerName: "API-Football",
  apiKey: process.env.API_FOOTBALL_KEY || process.env.APIFOOTBALL_KEY || "",
  baseUrl: (process.env.API_FOOTBALL_BASE_URL || "https://v3.football.api-sports.io").replace(/\/+$/, "")
};

function parseCsvLine(line) {
  const values = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  values.push(current);
  return values;
}

function round(value, digits = 3) {
  return Number(Number(value).toFixed(digits));
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function normalizeTeamName(name) {
  return String(name || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]/g, "");
}

function parseFixtureDate(dateString, timeString = "12:00") {
  if (!dateString) {
    return null;
  }

  const [day, month, year] = String(dateString).split("/").map(Number);
  const [hours = 12, minutes = 0] = String(timeString || "12:00").split(":").map(Number);
  const parsed = new Date(year, (month || 1) - 1, day || 1, hours || 0, minutes || 0, 0, 0);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function getNumber(row, index, fallback = 0) {
  const value = index >= 0 ? Number(row[index]) : NaN;
  return Number.isFinite(value) ? value : fallback;
}

function getOddValue(row, index) {
  const value = index >= 0 ? Number(row[index]) : NaN;
  return Number.isFinite(value) && value > 1 ? round(value, 2) : null;
}

function parseIsoDate(value) {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function getClosestTotalPrice(outcomes, label) {
  const filtered = (outcomes || [])
    .filter((outcome) => String(outcome.name || "").toLowerCase() === label && Number.isFinite(Number(outcome.price)) && Number(outcome.price) > 1)
    .sort((a, b) => Math.abs((Number(a.point) || 2.5) - 2.5) - Math.abs((Number(b.point) || 2.5) - 2.5));

  return filtered.length ? round(Number(filtered[0].price), 2) : null;
}

function parseOddsApiBookmakers(bookmakers, homeTeamName, awayTeamName) {
  const normalizedHome = normalizeTeamName(homeTeamName);
  const normalizedAway = normalizeTeamName(awayTeamName);
  const parsed = {};

  for (const bookmaker of Array.isArray(bookmakers) ? bookmakers : []) {
    const entry = {
      key: bookmaker.key || normalizeTeamName(bookmaker.title || "bookmaker"),
      name: bookmaker.title || bookmaker.key || "Bookmaker",
      home: null,
      draw: null,
      away: null,
      over25: null,
      under25: null,
      source: "odds-api",
      provider: ODDS_API_CONFIG.providerName,
      lastUpdate: bookmaker.last_update || null
    };

    for (const market of Array.isArray(bookmaker.markets) ? bookmaker.markets : []) {
      const outcomes = Array.isArray(market.outcomes) ? market.outcomes : [];

      if (market.key === "h2h") {
        for (const outcome of outcomes) {
          const price = Number(outcome.price);
          if (!Number.isFinite(price) || price <= 1) {
            continue;
          }

          const outcomeName = normalizeTeamName(outcome.name);
          if (outcomeName === normalizedHome) {
            entry.home = round(price, 2);
          } else if (outcomeName === normalizedAway) {
            entry.away = round(price, 2);
          } else if (outcomeName === "draw") {
            entry.draw = round(price, 2);
          }
        }
      }

      if (market.key === "totals") {
        entry.over25 = entry.over25 ?? getClosestTotalPrice(outcomes, "over");
        entry.under25 = entry.under25 ?? getClosestTotalPrice(outcomes, "under");
      }
    }

    if ([entry.home, entry.draw, entry.away, entry.over25, entry.under25].some((value) => value !== null)) {
      parsed[entry.key] = entry;
    }
  }

  return parsed;
}

function findMatchingFixture(fixtures, event) {
  const homeKey = normalizeTeamName(event?.home_team);
  const awayKey = normalizeTeamName(event?.away_team);
  const eventTime = parseIsoDate(event?.commence_time)?.getTime() || 0;
  const candidates = (fixtures || []).filter((fixture) => normalizeTeamName(fixture.homeTeam) === homeKey && normalizeTeamName(fixture.awayTeam) === awayKey);

  if (!candidates.length) {
    return null;
  }

  return candidates.sort((a, b) => {
    const diffA = Math.abs((parseFixtureDate(a.date, a.time)?.getTime() || eventTime) - eventTime);
    const diffB = Math.abs((parseFixtureDate(b.date, b.time)?.getTime() || eventTime) - eventTime);
    return diffA - diffB;
  })[0] || null;
}

function mergeOddsIntoFixture(fixture, incomingOdds, providerName, lastUpdate = "") {
  if (!fixture || !incomingOdds || !Object.keys(incomingOdds).length) {
    return false;
  }

  const existingOdds = fixture.bookmakerOdds || {};
  fixture.bookmakerOdds = {
    ...existingOdds,
    ...incomingOdds
  };
  fixture.oddsSource = Object.keys(existingOdds).length ? "api+csv" : "api";

  const providerSet = new Set(Array.isArray(fixture.apiProviders) ? fixture.apiProviders : []);
  providerSet.add(providerName);
  fixture.apiProviders = [...providerSet];
  fixture.apiProvider = fixture.apiProviders.join(" + ");

  const updates = [fixture.lastOddsUpdate, lastUpdate].filter(Boolean).sort();
  fixture.lastOddsUpdate = updates.length ? updates[updates.length - 1] : "";
  return true;
}

async function fetchTheOddsApiForLeague(leagueConfig, fixtures) {
  if (!ODDS_API_CONFIG.apiKey || !leagueConfig.oddsApiSportKey || !Array.isArray(fixtures) || !fixtures.length) {
    return {
      configured: false,
      provider: ODDS_API_CONFIG.providerName,
      matchedFixtures: 0,
      bookmakerCount: 0
    };
  }

  const url = new URL(`${ODDS_API_CONFIG.baseUrl}/sports/${leagueConfig.oddsApiSportKey}/odds`);
  url.searchParams.set("apiKey", ODDS_API_CONFIG.apiKey);
  url.searchParams.set("regions", ODDS_API_CONFIG.regions);
  url.searchParams.set("markets", ODDS_API_CONFIG.markets);
  url.searchParams.set("oddsFormat", "decimal");
  url.searchParams.set("dateFormat", "iso");

  if (ODDS_API_CONFIG.bookmakers) {
    url.searchParams.set("bookmakers", ODDS_API_CONFIG.bookmakers);
  }

  const response = await fetch(url, {
    headers: {
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`Falha ao descarregar odds dedicadas (${leagueConfig.name}): ${response.status}`);
  }

  const events = await response.json();
  let matchedFixtures = 0;
  const bookmakerKeys = new Set();

  for (const event of Array.isArray(events) ? events : []) {
    const fixture = findMatchingFixture(fixtures, event);
    if (!fixture) {
      continue;
    }

    const apiOdds = parseOddsApiBookmakers(event.bookmakers, event.home_team, event.away_team);
    if (!Object.keys(apiOdds).length) {
      continue;
    }

    if (mergeOddsIntoFixture(
      fixture,
      apiOdds,
      ODDS_API_CONFIG.providerName,
      event.bookmakers?.map((bookmaker) => bookmaker.last_update).filter(Boolean).sort().pop() || event.commence_time || ""
    )) {
      matchedFixtures += 1;
      Object.keys(apiOdds).forEach((key) => bookmakerKeys.add(key));
    }
  }

  return {
    configured: true,
    provider: ODDS_API_CONFIG.providerName,
    matchedFixtures,
    bookmakerCount: bookmakerKeys.size
  };
}

function parseApiFootballOdd(values, desiredOutcome) {
  const normalizedDesired = desiredOutcome.toLowerCase();
  const candidates = (values || [])
    .filter((value) => {
      const label = String(value.value || "").toLowerCase();
      if (normalizedDesired === "home") return label === "home" || label === "1";
      if (normalizedDesired === "draw") return label === "draw" || label === "x";
      if (normalizedDesired === "away") return label === "away" || label === "2";
      return false;
    })
    .sort((a, b) => Number(Boolean(b.main)) - Number(Boolean(a.main)));

  const odd = Number(candidates[0]?.odd);
  return Number.isFinite(odd) && odd > 1 ? round(odd, 2) : null;
}

function parseApiFootballTotal(values, label) {
  const normalizedLabel = label.toLowerCase();
  const candidates = (values || [])
    .filter((value) => {
      const text = String(value.value || "").toLowerCase();
      const handicap = Number(String(value.handicap || "").replace(",", "."));
      const nearTwoPointFive = !Number.isFinite(handicap) || Math.abs(handicap - 2.5) < 0.01 || text.includes("2.5");
      return text.includes(normalizedLabel) && nearTwoPointFive;
    })
    .sort((a, b) => Number(Boolean(b.main)) - Number(Boolean(a.main)));

  const odd = Number(candidates[0]?.odd);
  return Number.isFinite(odd) && odd > 1 ? round(odd, 2) : null;
}

function parseApiFootballBookmakers(bookmakers) {
  const parsed = {};

  for (const bookmaker of Array.isArray(bookmakers) ? bookmakers : []) {
    const entry = {
      key: normalizeTeamName(bookmaker.name || bookmaker.id || "bookmaker"),
      name: bookmaker.name || `Bookmaker ${bookmaker.id || ""}`.trim(),
      home: null,
      draw: null,
      away: null,
      over25: null,
      under25: null,
      source: "api-football",
      provider: API_FOOTBALL_CONFIG.providerName
    };

    for (const bet of Array.isArray(bookmaker.bets) ? bookmaker.bets : []) {
      const betName = String(bet.name || "").toLowerCase();
      const values = Array.isArray(bet.values) ? bet.values : [];

      if (betName.includes("match winner") || betName === "winner") {
        entry.home = entry.home ?? parseApiFootballOdd(values, "home");
        entry.draw = entry.draw ?? parseApiFootballOdd(values, "draw");
        entry.away = entry.away ?? parseApiFootballOdd(values, "away");
      }

      if (betName.includes("goals over/under") || betName.includes("over/under")) {
        entry.over25 = entry.over25 ?? parseApiFootballTotal(values, "over");
        entry.under25 = entry.under25 ?? parseApiFootballTotal(values, "under");
      }
    }

    if ([entry.home, entry.draw, entry.away, entry.over25, entry.under25].some((value) => value !== null)) {
      parsed[entry.key] = entry;
    }
  }

  return parsed;
}

async function fetchApiFootballOddsForLeague(leagueConfig, fixtures) {
  if (!API_FOOTBALL_CONFIG.apiKey || !leagueConfig.apiFootballLeagueId || !Array.isArray(fixtures) || !fixtures.length) {
    return {
      configured: false,
      provider: API_FOOTBALL_CONFIG.providerName,
      matchedFixtures: 0,
      bookmakerCount: 0
    };
  }

  let page = 1;
  let totalPages = 1;
  let matchedFixtures = 0;
  const bookmakerKeys = new Set();

  do {
    const url = new URL(`${API_FOOTBALL_CONFIG.baseUrl}/odds`);
    url.searchParams.set("league", String(leagueConfig.apiFootballLeagueId));
    url.searchParams.set("season", SEASON_START);
    url.searchParams.set("page", String(page));
    url.searchParams.set("timezone", "Europe/Lisbon");

    const response = await fetch(url, {
      headers: {
        "x-apisports-key": API_FOOTBALL_CONFIG.apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`Falha ao descarregar odds API-Football (${leagueConfig.name}): ${response.status}`);
    }

    const payload = await response.json();
    totalPages = Math.min(Number(payload?.paging?.total) || 1, 6);

    for (const item of Array.isArray(payload?.response) ? payload.response : []) {
      const event = {
        home_team: item?.teams?.home?.name || item?.fixture?.teams?.home?.name || "",
        away_team: item?.teams?.away?.name || item?.fixture?.teams?.away?.name || "",
        commence_time: item?.fixture?.date || item?.update || ""
      };

      const fixture = findMatchingFixture(fixtures, event);
      if (!fixture) {
        continue;
      }

      const apiOdds = parseApiFootballBookmakers(item.bookmakers);
      if (!Object.keys(apiOdds).length) {
        continue;
      }

      if (mergeOddsIntoFixture(fixture, apiOdds, API_FOOTBALL_CONFIG.providerName, item?.update || item?.fixture?.date || "")) {
        matchedFixtures += 1;
        Object.keys(apiOdds).forEach((key) => bookmakerKeys.add(key));
      }
    }

    page += 1;
  } while (page <= totalPages);

  return {
    configured: true,
    provider: API_FOOTBALL_CONFIG.providerName,
    matchedFixtures,
    bookmakerCount: bookmakerKeys.size
  };
}

async function fetchDedicatedOddsForLeague(leagueConfig, fixtures) {
  const providerResults = [];

  for (const fetcher of [fetchTheOddsApiForLeague, fetchApiFootballOddsForLeague]) {
    try {
      providerResults.push(await fetcher(leagueConfig, fixtures));
    } catch (error) {
      providerResults.push({
        configured: false,
        provider: fetcher === fetchTheOddsApiForLeague ? ODDS_API_CONFIG.providerName : API_FOOTBALL_CONFIG.providerName,
        matchedFixtures: 0,
        bookmakerCount: 0,
        error: error.message
      });
    }
  }

  const activeProviders = providerResults.filter((result) => result.configured);
  const bookmakerKeys = new Set();
  for (const fixture of Array.isArray(fixtures) ? fixtures : []) {
    Object.keys(fixture.bookmakerOdds || {}).forEach((key) => bookmakerKeys.add(key));
  }

  return {
    configured: activeProviders.length > 0,
    provider: activeProviders.length ? activeProviders.map((result) => result.provider).join(" + ") : "football-data.co.uk",
    providers: providerResults,
    matchedFixtures: fixtures.filter((fixture) => Array.isArray(fixture.apiProviders) && fixture.apiProviders.length > 0).length,
    bookmakerCount: bookmakerKeys.size
  };
}

function estimateExpectedGoalsProxy(shots, shotsOnTarget) {
  const adjustedShots = Math.max(shots, shotsOnTarget);
  return round(clamp(((adjustedShots - shotsOnTarget) * 0.03) + (shotsOnTarget * 0.30), 0.05, 4.5), 3);
}

function estimateDixonColesRho(scoreCounts, matches, homeLambda, awayLambda) {
  if (!matches || homeLambda <= 0 || awayLambda <= 0) {
    return -0.08;
  }

  const observed = (homeGoals, awayGoals) => (scoreCounts.get(`${homeGoals}-${awayGoals}`) || 0) / matches;
  const base00 = Math.exp(-(homeLambda + awayLambda));
  const base01 = base00 * awayLambda;
  const base10 = base00 * homeLambda;
  const base11 = base00 * homeLambda * awayLambda;

  const candidates = [];

  if (base00 > 0 && homeLambda * awayLambda > 0) {
    candidates.push((1 - (observed(0, 0) / base00)) / (homeLambda * awayLambda));
  }
  if (base01 > 0 && homeLambda > 0) {
    candidates.push(((observed(0, 1) / base01) - 1) / homeLambda);
  }
  if (base10 > 0 && awayLambda > 0) {
    candidates.push(((observed(1, 0) / base10) - 1) / awayLambda);
  }
  if (base11 > 0) {
    candidates.push(1 - (observed(1, 1) / base11));
  }

  const valid = candidates.filter((value) => Number.isFinite(value));
  const average = valid.length ? valid.reduce((sum, value) => sum + value, 0) / valid.length : -0.08;
  return round(clamp(average, -0.15, 0.15), 3);
}

function buildBookmakerOdds(row, indexes) {
  const odds = {};

  for (const definition of BOOKMAKER_DEFINITIONS) {
    const entry = {
      key: definition.key,
      name: definition.name,
      home: getOddValue(row, indexes[definition.home]),
      draw: getOddValue(row, indexes[definition.draw]),
      away: getOddValue(row, indexes[definition.away]),
      over25: definition.over25 ? getOddValue(row, indexes[definition.over25]) : null,
      under25: definition.under25 ? getOddValue(row, indexes[definition.under25]) : null,
      source: "csv",
      provider: "football-data.co.uk"
    };

    if ([entry.home, entry.draw, entry.away, entry.over25, entry.under25].some((value) => value !== null)) {
      odds[definition.key] = entry;
    }
  }

  return odds;
}

function ensureTeam(map, name) {
  if (!map.has(name)) {
    map.set(name, {
      name,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      points: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      homePlayed: 0,
      homeGoalsFor: 0,
      homeGoalsAgainst: 0,
      awayPlayed: 0,
      awayGoalsFor: 0,
      awayGoalsAgainst: 0,
      homeFirstHalfGoalsFor: 0,
      homeFirstHalfGoalsAgainst: 0,
      awayFirstHalfGoalsFor: 0,
      awayFirstHalfGoalsAgainst: 0,
      homeShotsFor: 0,
      homeShotsAgainst: 0,
      awayShotsFor: 0,
      awayShotsAgainst: 0,
      homeShotsOnTargetFor: 0,
      homeShotsOnTargetAgainst: 0,
      awayShotsOnTargetFor: 0,
      awayShotsOnTargetAgainst: 0,
      homeXgFor: 0,
      homeXgAgainst: 0,
      awayXgFor: 0,
      awayXgAgainst: 0,
      xgSource: "proxy",
      recentResults: [],
      recentMatchLogs: []
    });
  }

  return map.get(name);
}

function pushRecentResult(team, result) {
  team.recentResults.push(result);
  if (team.recentResults.length > 5) {
    team.recentResults.shift();
  }
}

function pushRecentMatchLog(team, log) {
  team.recentMatchLogs.push(log);
  if (team.recentMatchLogs.length > RECENT_MATCH_LIMIT) {
    team.recentMatchLogs.shift();
  }
}

function getPoints(result) {
  return result === "W" ? 3 : result === "D" ? 1 : 0;
}

function normalizeResultCode(result) {
  const code = String(result || "").trim().toUpperCase();
  return code.startsWith("W") ? "W" : code.startsWith("D") ? "D" : "L";
}

function updateTeam(team, venue, goalsFor, goalsAgainst, result, stats) {
  team.played += 1;
  team.goalsFor += goalsFor;
  team.goalsAgainst += goalsAgainst;
  team.points += getPoints(result);

  if (result === "W") team.wins += 1;
  if (result === "D") team.draws += 1;
  if (result === "L") team.losses += 1;

  if (venue === "home") {
    team.homePlayed += 1;
    team.homeGoalsFor += goalsFor;
    team.homeGoalsAgainst += goalsAgainst;
    team.homeFirstHalfGoalsFor += stats.firstHalfGoalsFor;
    team.homeFirstHalfGoalsAgainst += stats.firstHalfGoalsAgainst;
    team.homeShotsFor += stats.shotsFor;
    team.homeShotsAgainst += stats.shotsAgainst;
    team.homeShotsOnTargetFor += stats.shotsOnTargetFor;
    team.homeShotsOnTargetAgainst += stats.shotsOnTargetAgainst;
    team.homeXgFor += stats.xgFor;
    team.homeXgAgainst += stats.xgAgainst;
  } else {
    team.awayPlayed += 1;
    team.awayGoalsFor += goalsFor;
    team.awayGoalsAgainst += goalsAgainst;
    team.awayFirstHalfGoalsFor += stats.firstHalfGoalsFor;
    team.awayFirstHalfGoalsAgainst += stats.firstHalfGoalsAgainst;
    team.awayShotsFor += stats.shotsFor;
    team.awayShotsAgainst += stats.shotsAgainst;
    team.awayShotsOnTargetFor += stats.shotsOnTargetFor;
    team.awayShotsOnTargetAgainst += stats.shotsOnTargetAgainst;
    team.awayXgFor += stats.xgFor;
    team.awayXgAgainst += stats.xgAgainst;
  }

  pushRecentResult(team, result);
  pushRecentMatchLog(team, {
    date: stats.date || "",
    venue,
    result,
    points: getPoints(result),
    goalsFor,
    goalsAgainst,
    firstHalfGoalsFor: stats.firstHalfGoalsFor,
    firstHalfGoalsAgainst: stats.firstHalfGoalsAgainst,
    xgFor: round(stats.xgFor),
    xgAgainst: round(stats.xgAgainst)
  });
}

async function fetchUnderstatLeagueData(understatKey) {
  if (!understatKey) {
    return new Map();
  }

  const url = `https://understat.com/getLeagueData/${encodeURIComponent(understatKey)}/${SEASON_START}`;
  const response = await fetch(url, {
    headers: {
      Accept: "application/json, text/plain, */*",
      "X-Requested-With": "XMLHttpRequest",
      Referer: `https://understat.com/league/${encodeURIComponent(understatKey).replace(/%20/g, "_")}/${SEASON_START}`
    }
  });

  if (!response.ok) {
    throw new Error(`Falha ao descarregar xG real do Understat (${understatKey}): ${response.status}`);
  }

  const rawText = await response.text();
  const parsed = JSON.parse(rawText);
  const teamMap = new Map();

  for (const team of Object.values(parsed.teams || {})) {
    teamMap.set(normalizeTeamName(team.title), team);
  }

  return teamMap;
}

function findUnderstatTeam(teamName, understatMap, leagueKey) {
  const normalized = normalizeTeamName(teamName);
  const aliasTarget = TEAM_NAME_ALIASES[leagueKey]?.[normalized] || teamName;
  const direct = understatMap.get(normalizeTeamName(aliasTarget)) || understatMap.get(normalized);

  if (direct) {
    return direct;
  }

  for (const [key, value] of understatMap.entries()) {
    if (key.includes(normalized) || normalized.includes(key)) {
      return value;
    }
  }

  return null;
}

function applyUnderstatData(teams, understatMap, leagueKey) {
  let matchedTeams = 0;

  for (const team of teams.values()) {
    const understatTeam = findUnderstatTeam(team.name, understatMap, leagueKey);

    if (!understatTeam) {
      continue;
    }

    matchedTeams += 1;
    team.xgSource = "understat";
    team.homeXgFor = 0;
    team.homeXgAgainst = 0;
    team.awayXgFor = 0;
    team.awayXgAgainst = 0;

    const logs = [];

    for (const match of understatTeam.history || []) {
      const venue = match.h_a === "h" ? "home" : "away";
      const result = normalizeResultCode(match.result);
      const xgFor = Number(match.xG) || 0;
      const xgAgainst = Number(match.xGA) || 0;
      const goalsFor = Number(match.scored) || 0;
      const goalsAgainst = Number(match.missed) || 0;

      if (venue === "home") {
        team.homeXgFor += xgFor;
        team.homeXgAgainst += xgAgainst;
      } else {
        team.awayXgFor += xgFor;
        team.awayXgAgainst += xgAgainst;
      }

      logs.push({
        date: match.date || "",
        venue,
        result,
        points: getPoints(result),
        goalsFor,
        goalsAgainst,
        xgFor: round(xgFor),
        xgAgainst: round(xgAgainst)
      });
    }

    if (logs.length) {
      team.recentMatchLogs = logs.slice(-RECENT_MATCH_LIMIT);
    }
  }

  return matchedTeams;
}

async function buildLeagueSnapshot(leagueConfig) {
  const response = await fetch(leagueConfig.url);
  if (!response.ok) {
    throw new Error(`Falha ao descarregar ${leagueConfig.name}: ${response.status}`);
  }

  const csv = await response.text();
  const lines = csv.split(/\r?\n/).filter(Boolean);
  const header = parseCsvLine(lines[0]);

  const indexes = {
    date: header.indexOf("Date"),
    time: header.indexOf("Time"),
    homeTeam: header.indexOf("HomeTeam"),
    awayTeam: header.indexOf("AwayTeam"),
    fullTimeHomeGoals: header.indexOf("FTHG"),
    fullTimeAwayGoals: header.indexOf("FTAG"),
    halfTimeHomeGoals: header.indexOf("HTHG"),
    halfTimeAwayGoals: header.indexOf("HTAG"),
    homeShots: header.indexOf("HS"),
    awayShots: header.indexOf("AS"),
    homeShotsOnTarget: header.indexOf("HST"),
    awayShotsOnTarget: header.indexOf("AST")
  };

  for (const definition of BOOKMAKER_DEFINITIONS) {
    indexes[definition.home] = header.indexOf(definition.home);
    indexes[definition.draw] = header.indexOf(definition.draw);
    indexes[definition.away] = header.indexOf(definition.away);
    if (definition.over25) indexes[definition.over25] = header.indexOf(definition.over25);
    if (definition.under25) indexes[definition.under25] = header.indexOf(definition.under25);
  }

  const teams = new Map();
  const fixtures = [];
  const scoreCounts = new Map();
  let matches = 0;
  let totalHomeGoals = 0;
  let totalAwayGoals = 0;
  let totalFirstHalfHomeGoals = 0;
  let totalFirstHalfAwayGoals = 0;
  let totalHomeShotsOnTarget = 0;
  let totalAwayShotsOnTarget = 0;
  let lastMatchDate = "";

  for (const line of lines.slice(1)) {
    const row = parseCsvLine(line);
    const homeName = row[indexes.homeTeam]?.trim();
    const awayName = row[indexes.awayTeam]?.trim();

    if (!homeName || !awayName) {
      continue;
    }

    const date = row[indexes.date] || "";
    const time = indexes.time >= 0 ? (row[indexes.time] || "") : "";
    const homeGoals = getNumber(row, indexes.fullTimeHomeGoals, NaN);
    const awayGoals = getNumber(row, indexes.fullTimeAwayGoals, NaN);
    const firstHalfHomeGoals = getNumber(row, indexes.halfTimeHomeGoals, NaN);
    const firstHalfAwayGoals = getNumber(row, indexes.halfTimeAwayGoals, NaN);
    const played = Number.isFinite(homeGoals) && Number.isFinite(awayGoals);
    const homeShots = getNumber(row, indexes.homeShots, 0);
    const awayShots = getNumber(row, indexes.awayShots, 0);
    const homeShotsOnTarget = getNumber(row, indexes.homeShotsOnTarget, 0);
    const awayShotsOnTarget = getNumber(row, indexes.awayShotsOnTarget, 0);
    const homeXg = estimateExpectedGoalsProxy(homeShots, homeShotsOnTarget);
    const awayXg = estimateExpectedGoalsProxy(awayShots, awayShotsOnTarget);
    const bookmakerOdds = buildBookmakerOdds(row, indexes);
    const fixtureDate = parseFixtureDate(date, time);

    fixtures.push({
      date,
      time,
      dateIso: fixtureDate ? fixtureDate.toISOString() : "",
      homeTeam: homeName,
      awayTeam: awayName,
      played,
      homeGoals: played ? homeGoals : null,
      awayGoals: played ? awayGoals : null,
      halfTimeHomeGoals: Number.isFinite(firstHalfHomeGoals) ? firstHalfHomeGoals : null,
      halfTimeAwayGoals: Number.isFinite(firstHalfAwayGoals) ? firstHalfAwayGoals : null,
      bookmakerOdds
    });

    if (!played) {
      continue;
    }

    const homeTeam = ensureTeam(teams, homeName);
    const awayTeam = ensureTeam(teams, awayName);
    const homeResult = homeGoals > awayGoals ? "W" : homeGoals === awayGoals ? "D" : "L";
    const awayResult = awayGoals > homeGoals ? "W" : awayGoals === homeGoals ? "D" : "L";

    updateTeam(homeTeam, "home", homeGoals, awayGoals, homeResult, {
      date,
      firstHalfGoalsFor: Number.isFinite(firstHalfHomeGoals) ? firstHalfHomeGoals : 0,
      firstHalfGoalsAgainst: Number.isFinite(firstHalfAwayGoals) ? firstHalfAwayGoals : 0,
      shotsFor: homeShots,
      shotsAgainst: awayShots,
      shotsOnTargetFor: homeShotsOnTarget,
      shotsOnTargetAgainst: awayShotsOnTarget,
      xgFor: homeXg,
      xgAgainst: awayXg
    });

    updateTeam(awayTeam, "away", awayGoals, homeGoals, awayResult, {
      date,
      firstHalfGoalsFor: Number.isFinite(firstHalfAwayGoals) ? firstHalfAwayGoals : 0,
      firstHalfGoalsAgainst: Number.isFinite(firstHalfHomeGoals) ? firstHalfHomeGoals : 0,
      shotsFor: awayShots,
      shotsAgainst: homeShots,
      shotsOnTargetFor: awayShotsOnTarget,
      shotsOnTargetAgainst: homeShotsOnTarget,
      xgFor: awayXg,
      xgAgainst: homeXg
    });

    matches += 1;
    totalHomeGoals += homeGoals;
    totalAwayGoals += awayGoals;
    totalFirstHalfHomeGoals += Number.isFinite(firstHalfHomeGoals) ? firstHalfHomeGoals : 0;
    totalFirstHalfAwayGoals += Number.isFinite(firstHalfAwayGoals) ? firstHalfAwayGoals : 0;
    totalHomeShotsOnTarget += homeShotsOnTarget;
    totalAwayShotsOnTarget += awayShotsOnTarget;
    lastMatchDate = date || lastMatchDate;

    const scoreKey = `${homeGoals}-${awayGoals}`;
    scoreCounts.set(scoreKey, (scoreCounts.get(scoreKey) || 0) + 1);
  }

  let matchedUnderstatTeams = 0;

  if (leagueConfig.understatKey) {
    try {
      const understatMap = await fetchUnderstatLeagueData(leagueConfig.understatKey);
      matchedUnderstatTeams = applyUnderstatData(teams, understatMap, leagueConfig.key);
    } catch (error) {
      console.warn(`Aviso: xG real indisponível para ${leagueConfig.name}. Vou usar proxy.`, error.message);
    }
  }

  let dedicatedOdds = {
    configured: false,
    provider: ODDS_API_CONFIG.providerName,
    matchedFixtures: 0,
    bookmakerCount: 0
  };

  try {
    dedicatedOdds = await fetchDedicatedOddsForLeague(leagueConfig, fixtures);
  } catch (error) {
    console.warn(`Aviso: odds dedicadas indisponíveis para ${leagueConfig.name}. Vou manter CSV público.`, error.message);
  }

  const totalHomeXg = [...teams.values()].reduce((sum, team) => sum + team.homeXgFor, 0);
  const totalAwayXg = [...teams.values()].reduce((sum, team) => sum + team.awayXgFor, 0);
  const homeGoalsAvg = round(matches ? totalHomeGoals / matches : 0, 3);
  const awayGoalsAvg = round(matches ? totalAwayGoals / matches : 0, 3);
  const firstHalfHomeGoalsAvg = round(matches ? totalFirstHalfHomeGoals / matches : homeGoalsAvg * 0.46, 3);
  const firstHalfAwayGoalsAvg = round(matches ? totalFirstHalfAwayGoals / matches : awayGoalsAvg * 0.46, 3);
  const homeXgAvg = round(matches ? totalHomeXg / matches : homeGoalsAvg, 3);
  const awayXgAvg = round(matches ? totalAwayXg / matches : awayGoalsAvg, 3);

  const teamList = [...teams.values()]
    .map((team) => {
      const recentPoints = team.recentResults.reduce((sum, result) => sum + getPoints(result), 0);
      const goalDifference = team.goalsFor - team.goalsAgainst;

      return {
        name: team.name,
        played: team.played,
        wins: team.wins,
        draws: team.draws,
        losses: team.losses,
        points: team.points,
        goalDifference,
        goalsFor: team.goalsFor,
        goalsAgainst: team.goalsAgainst,
        homePlayed: team.homePlayed,
        homeGoalsFor: team.homeGoalsFor,
        homeGoalsAgainst: team.homeGoalsAgainst,
        awayPlayed: team.awayPlayed,
        awayGoalsFor: team.awayGoalsFor,
        awayGoalsAgainst: team.awayGoalsAgainst,
        homeFirstHalfGoalsFor: team.homeFirstHalfGoalsFor,
        homeFirstHalfGoalsAgainst: team.homeFirstHalfGoalsAgainst,
        awayFirstHalfGoalsFor: team.awayFirstHalfGoalsFor,
        awayFirstHalfGoalsAgainst: team.awayFirstHalfGoalsAgainst,
        homeShotsFor: team.homeShotsFor,
        homeShotsAgainst: team.homeShotsAgainst,
        awayShotsFor: team.awayShotsFor,
        awayShotsAgainst: team.awayShotsAgainst,
        homeShotsOnTargetFor: team.homeShotsOnTargetFor,
        homeShotsOnTargetAgainst: team.homeShotsOnTargetAgainst,
        awayShotsOnTargetFor: team.awayShotsOnTargetFor,
        awayShotsOnTargetAgainst: team.awayShotsOnTargetAgainst,
        homeXgFor: round(team.homeXgFor),
        homeXgAgainst: round(team.homeXgAgainst),
        awayXgFor: round(team.awayXgFor),
        awayXgAgainst: round(team.awayXgAgainst),
        xgSource: team.xgSource,
        recentMatchLogs: team.recentMatchLogs,
        form: team.recentResults.join(""),
        formScore: round(team.recentResults.length ? recentPoints / (team.recentResults.length * 3) : 0.5, 3)
      };
    })
    .sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference || b.goalsFor - a.goalsFor || a.name.localeCompare(b.name, "pt"));

  return {
    key: leagueConfig.key,
    country: leagueConfig.country,
    name: leagueConfig.name,
    season: SEASON,
    source: leagueConfig.url,
    xgSource: matchedUnderstatTeams > 0 ? "understat+proxy" : "proxy",
    understatMatchedTeams: matchedUnderstatTeams,
    oddsProvider: dedicatedOdds.configured ? dedicatedOdds.provider : "football-data.co.uk",
    dedicatedOdds,
    matches,
    lastMatchDate,
    homeGoalsAvg,
    awayGoalsAvg,
    firstHalfHomeGoalsAvg,
    firstHalfAwayGoalsAvg,
    homeXgAvg,
    awayXgAvg,
    homeShotsOnTargetAvg: round(matches ? totalHomeShotsOnTarget / matches : 0, 3),
    awayShotsOnTargetAvg: round(matches ? totalAwayShotsOnTarget / matches : 0, 3),
    dixonColesRho: estimateDixonColesRho(scoreCounts, matches, homeGoalsAvg, awayGoalsAvg),
    fixtures: fixtures.sort((a, b) => {
      const timeA = parseFixtureDate(a.date, a.time)?.getTime() || 0;
      const timeB = parseFixtureDate(b.date, b.time)?.getTime() || 0;
      return timeA - timeB;
    }),
    teams: teamList
  };
}

async function main() {
  const snapshot = {
    season: SEASON,
    generatedAt: new Date().toISOString(),
    sourceNote: "Dados públicos recolhidos de football-data.co.uk com xG real do Understat (quando disponível), contexto de descanso, estatísticas HT e odds por casa. Se existir ODDS_API_KEY, a app junta odds ao vivo via The Odds API.",
    leagues: {}
  };

  for (const league of LEAGUES) {
    const builtLeague = await buildLeagueSnapshot(league);
    snapshot.leagues[league.key] = builtLeague;
  }

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `window.DATA_SNAPSHOT = ${JSON.stringify(snapshot, null, 2)};\n`, "utf8");

  console.log(`Snapshot atualizado: ${outputPath}`);
  for (const league of Object.values(snapshot.leagues)) {
    const oddsSummary = league.dedicatedOdds?.configured
      ? `odds ${league.dedicatedOdds.provider}: ${league.dedicatedOdds.matchedFixtures} fixtures / ${league.dedicatedOdds.bookmakerCount} casas`
      : "odds API não configurada";
    console.log(`- ${league.country} / ${league.name}: ${league.matches} jogos, ${league.teams.length} equipas, ${league.fixtures.length} fixtures, xG ${league.xgSource}, rho ${league.dixonColesRho}, ${oddsSummary}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
