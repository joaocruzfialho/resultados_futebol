(() => {
  const fallbackSnapshot = {
    season: "2025/26",
    generatedAt: new Date().toISOString(),
    sourceNote: "Snapshot local de demonstração",
    leagues: {
      england: {
        key: "england",
        name: "Premier League",
        country: "Inglaterra",
        season: "2025/26",
        matches: 0,
        homeGoalsAvg: 1.45,
        awayGoalsAvg: 1.15,
        firstHalfHomeGoalsAvg: 0.68,
        firstHalfAwayGoalsAvg: 0.46,
        homeXgAvg: 1.48,
        awayXgAvg: 1.12,
        dixonColesRho: -0.08,
        xgSource: "understat+proxy",
        lastMatchDate: "—",
        fixtures: [],
        teams: [
          {
            name: "Arsenal",
            played: 0,
            points: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            homePlayed: 1,
            homeGoalsFor: 2,
            homeGoalsAgainst: 1,
            awayPlayed: 1,
            awayGoalsFor: 1,
            awayGoalsAgainst: 1,
            homeFirstHalfGoalsFor: 1,
            homeFirstHalfGoalsAgainst: 0,
            awayFirstHalfGoalsFor: 0,
            awayFirstHalfGoalsAgainst: 0,
            homeXgFor: 1.8,
            homeXgAgainst: 0.9,
            awayXgFor: 1.2,
            awayXgAgainst: 1.1,
            homeShotsOnTargetFor: 6,
            awayShotsOnTargetFor: 4,
            xgSource: "understat",
            recentMatchLogs: [
              { venue: "home", result: "W", points: 3, xgFor: 1.8, xgAgainst: 0.9, goalsFor: 2, goalsAgainst: 1 },
              { venue: "away", result: "D", points: 1, xgFor: 1.2, xgAgainst: 1.1, goalsFor: 1, goalsAgainst: 1 }
            ],
            form: "WD",
            formScore: 0.667
          },
          {
            name: "Chelsea",
            played: 0,
            points: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            homePlayed: 1,
            homeGoalsFor: 1,
            homeGoalsAgainst: 1,
            awayPlayed: 1,
            awayGoalsFor: 1,
            awayGoalsAgainst: 2,
            homeFirstHalfGoalsFor: 1,
            homeFirstHalfGoalsAgainst: 1,
            awayFirstHalfGoalsFor: 0,
            awayFirstHalfGoalsAgainst: 1,
            homeXgFor: 1.1,
            homeXgAgainst: 1.1,
            awayXgFor: 1.0,
            awayXgAgainst: 1.5,
            homeShotsOnTargetFor: 4,
            awayShotsOnTargetFor: 3,
            xgSource: "understat",
            recentMatchLogs: [
              { venue: "home", result: "D", points: 1, xgFor: 1.1, xgAgainst: 1.1, goalsFor: 1, goalsAgainst: 1 },
              { venue: "away", result: "L", points: 0, xgFor: 1.0, xgAgainst: 1.5, goalsFor: 1, goalsAgainst: 2 }
            ],
            form: "DL",
            formScore: 0.167
          }
        ]
      }
    }
  };

  const snapshot = window.DATA_SNAPSHOT && window.DATA_SNAPSHOT.leagues && Object.keys(window.DATA_SNAPSHOT.leagues).length
    ? window.DATA_SNAPSHOT
    : fallbackSnapshot;

  const elements = {
    leagueSelect: document.getElementById("leagueSelect"),
    homeTeamSelect: document.getElementById("homeTeamSelect"),
    awayTeamSelect: document.getElementById("awayTeamSelect"),
    formWeight: document.getElementById("formWeight"),
    formWeightValue: document.getElementById("formWeightValue"),
    homeInjuries: document.getElementById("homeInjuries"),
    awayInjuries: document.getElementById("awayInjuries"),
    homeSuspensions: document.getElementById("homeSuspensions"),
    awaySuspensions: document.getElementById("awaySuspensions"),
    restInfo: document.getElementById("restInfo"),
    predictButton: document.getElementById("predictButton"),
    swapButton: document.getElementById("swapButton"),
    clearOddsButton: document.getElementById("clearOddsButton"),
    dataStatus: document.getElementById("dataStatus"),
    matchTitle: document.getElementById("matchTitle"),
    matchSubtitle: document.getElementById("matchSubtitle"),
    bestPick: document.getElementById("bestPick"),
    homeExpected: document.getElementById("homeExpected"),
    awayExpected: document.getElementById("awayExpected"),
    homeWin: document.getElementById("homeWin"),
    drawProb: document.getElementById("drawProb"),
    awayWin: document.getElementById("awayWin"),
    over25: document.getElementById("over25"),
    btts: document.getElementById("btts"),
    htHomeWin: document.getElementById("htHomeWin"),
    htDrawProb: document.getElementById("htDrawProb"),
    htAwayWin: document.getElementById("htAwayWin"),
    htNoGoal: document.getElementById("htNoGoal"),
    htOddsTable: document.getElementById("htOddsTable"),
    strengthTable: document.getElementById("strengthTable"),
    topScores: document.getElementById("topScores"),
    bookmakerTable: document.getElementById("bookmakerTable"),
    autoOddsNote: document.getElementById("autoOddsNote"),
    marketHomeOdd: document.getElementById("marketHomeOdd"),
    marketDrawOdd: document.getElementById("marketDrawOdd"),
    marketAwayOdd: document.getElementById("marketAwayOdd"),
    marketOver25Odd: document.getElementById("marketOver25Odd"),
    marketBttsOdd: document.getElementById("marketBttsOdd"),
    marketTable: document.getElementById("marketTable")
  };

  const PT_LEGAL_BOOKMAKERS = [
    {
      key: "betano",
      name: "Betano",
      sourceKeys: ["betano", "betano_pt", "betano_br"],
      aliases: ["betano", "betano pt", "betano portugal", "betano.pt"]
    },
    {
      key: "betclic",
      name: "Betclic",
      sourceKeys: ["betclic", "betclic_fr"],
      aliases: ["betclic", "betclic fr", "betclic france"]
    },
    {
      key: "bwin",
      name: "Bwin",
      sourceKeys: ["bwin", "bwin_pt"],
      aliases: ["bwin", "b win", "bwin pt", "bwin portugal"]
    },
    {
      key: "placard",
      name: "Placard",
      sourceKeys: ["placard"],
      aliases: ["placard", "placard apostas", "placard pt", "santa casa"]
    },
    {
      key: "solverde",
      name: "Solverde",
      sourceKeys: ["solverde", "solverde_pt"],
      aliases: ["solverde", "solverde pt", "casino solverde"]
    }
  ];

  const leagueKeys = Object.keys(snapshot.leagues);
  const DEFAULT_RHO = -0.08;
  const XG_WEIGHT = 0.55;
  const RECENCY_IMPACT_BASE = 0.55;
  const HALF_TIME_SHARE = 0.46;

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function normalizeBookmakerToken(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
  }

  function safePerGame(value, played) {
    return played > 0 ? value / played : 0;
  }

  function blend(primaryValue, secondaryValue, secondaryWeight = 0.35) {
    const primaryOk = Number.isFinite(primaryValue) && primaryValue > 0;
    const secondaryOk = Number.isFinite(secondaryValue) && secondaryValue > 0;

    if (primaryOk && secondaryOk) {
      return primaryValue * (1 - secondaryWeight) + secondaryValue * secondaryWeight;
    }

    if (secondaryOk) {
      return secondaryValue;
    }

    return primaryOk ? primaryValue : 1;
  }

  function shrinkToAverage(ratio, sampleSize) {
    const weight = clamp(sampleSize / 12, 0.45, 1);
    return 1 + (ratio - 1) * weight;
  }

  function factorial(n) {
    let result = 1;
    for (let i = 2; i <= n; i += 1) {
      result *= i;
    }
    return result;
  }

  function poisson(goals, lambda) {
    return (Math.exp(-lambda) * Math.pow(lambda, goals)) / factorial(goals);
  }

  function dixonColesTau(homeGoals, awayGoals, homeLambda, awayLambda, rho) {
    if (homeGoals === 0 && awayGoals === 0) {
      return clamp(1 - (homeLambda * awayLambda * rho), 0.01, 3);
    }

    if (homeGoals === 0 && awayGoals === 1) {
      return clamp(1 + (homeLambda * rho), 0.01, 3);
    }

    if (homeGoals === 1 && awayGoals === 0) {
      return clamp(1 + (awayLambda * rho), 0.01, 3);
    }

    if (homeGoals === 1 && awayGoals === 1) {
      return clamp(1 - rho, 0.01, 3);
    }

    return 1;
  }

  function formatPercent(value) {
    return `${(value * 100).toFixed(1)}%`;
  }

  function formatDecimal(value) {
    return Number(value).toFixed(2);
  }

  function formatOdd(value) {
    return Number.isFinite(value) && value > 1 ? value.toFixed(2) : "—";
  }

  function formatDays(days) {
    return Number.isFinite(days) ? `${days} dias` : "n/d";
  }

  function parseNumberInput(input) {
    const value = Number(input?.value);
    return Number.isFinite(value) && value >= 0 ? value : 0;
  }

  function parseMarketOdd(input) {
    const value = Number(input?.value);
    return Number.isFinite(value) && value > 1 ? value : null;
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

  function getFixtureTimestamp(fixture) {
    return parseFixtureDate(fixture?.date, fixture?.time)?.getTime() || 0;
  }

  function getCurrentLeague() {
    return snapshot.leagues[elements.leagueSelect.value];
  }

  function populateLeagueOptions() {
    elements.leagueSelect.innerHTML = leagueKeys
      .map((key) => {
        const league = snapshot.leagues[key];
        return `<option value="${key}">${league.country} • ${league.name}</option>`;
      })
      .join("");
  }

  function populateTeamOptions() {
    const league = getCurrentLeague();
    const previousHome = elements.homeTeamSelect.value;
    const previousAway = elements.awayTeamSelect.value;
    const teamNames = league.teams.map((team) => team.name);

    const optionsHtml = [...teamNames]
      .sort((a, b) => a.localeCompare(b, "pt-PT"))
      .map((teamName) => `<option value="${teamName}">${teamName}</option>`)
      .join("");

    elements.homeTeamSelect.innerHTML = optionsHtml;
    elements.awayTeamSelect.innerHTML = optionsHtml;

    const rankedTeams = [...league.teams].sort((a, b) => b.points - a.points || (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst));
    const defaultHome = rankedTeams[0]?.name || teamNames[0];
    const defaultAway = rankedTeams[1]?.name || teamNames[1] || teamNames[0];

    elements.homeTeamSelect.value = teamNames.includes(previousHome) ? previousHome : defaultHome;
    elements.awayTeamSelect.value = teamNames.includes(previousAway) && previousAway !== elements.homeTeamSelect.value ? previousAway : defaultAway;

    if (elements.homeTeamSelect.value === elements.awayTeamSelect.value && teamNames.length > 1) {
      const alternative = teamNames.find((name) => name !== elements.homeTeamSelect.value);
      elements.awayTeamSelect.value = alternative || defaultAway;
    }
  }

  function getTeamByName(teamName) {
    const league = getCurrentLeague();
    return league.teams.find((team) => team.name === teamName);
  }

  function getRecentVenueLogs(team, venue) {
    const source = Array.isArray(team.recentMatchLogs) ? team.recentMatchLogs : [];
    const expectedVenue = venue === "home" ? "home" : "away";

    return source
      .filter((log) => (log.venue || (log.h_a === "h" ? "home" : "away")) === expectedVenue)
      .slice(-5);
  }

  function getRecentProfile(team, venue, league) {
    const logs = getRecentVenueLogs(team, venue);

    if (!logs.length) {
      return {
        form: team.form || "—",
        pointsRate: team.formScore ?? 0.5,
        xgFor: 0,
        xgAgainst: 0,
        attackBoost: 1,
        defenseBoost: 1,
        momentumBoost: 1
      };
    }

    const weightedLogs = logs.map((log, index) => ({ log, weight: 1 + index * 0.28 }));
    const totalWeight = weightedLogs.reduce((sum, entry) => sum + entry.weight, 0) || 1;
    const weightedXgFor = weightedLogs.reduce((sum, entry) => sum + (Number(entry.log.xgFor) || 0) * entry.weight, 0) / totalWeight;
    const weightedXgAgainst = weightedLogs.reduce((sum, entry) => sum + (Number(entry.log.xgAgainst) || 0) * entry.weight, 0) / totalWeight;
    const weightedPointsRate = weightedLogs.reduce((sum, entry) => sum + (Number(entry.log.points) || 0) * entry.weight, 0) / (totalWeight * 3);
    const weightedGoalDiff = weightedLogs.reduce((sum, entry) => {
      const goalDiff = (Number(entry.log.goalsFor) || 0) - (Number(entry.log.goalsAgainst) || 0);
      return sum + goalDiff * entry.weight;
    }, 0) / totalWeight;

    const venueAttackBaseline = venue === "home"
      ? (league.homeXgAvg || league.homeGoalsAvg || 1.3)
      : (league.awayXgAvg || league.awayGoalsAvg || 1.1);

    const venueDefenseBaseline = venue === "home"
      ? (league.awayXgAvg || league.awayGoalsAvg || 1.1)
      : (league.homeXgAvg || league.homeGoalsAvg || 1.3);

    return {
      form: logs.map((log) => log.result || "D").join(""),
      pointsRate: weightedPointsRate,
      xgFor: weightedXgFor,
      xgAgainst: weightedXgAgainst,
      attackBoost: clamp(1 + (((weightedXgFor / venueAttackBaseline) - 1) * 0.35), 0.72, 1.35),
      defenseBoost: clamp(1 + (((weightedXgAgainst / venueDefenseBaseline) - 1) * 0.35), 0.72, 1.35),
      momentumBoost: clamp(1 + ((weightedPointsRate - 0.5) * 0.32) + (weightedGoalDiff * 0.03), 0.82, 1.18)
    };
  }

  function teamsMatch(fixtureTeam, selectedTeam) {
    if (fixtureTeam === selectedTeam) return true;
    const a = String(fixtureTeam || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
    const b = String(selectedTeam || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
    if (!a || !b) return false;
    return a === b || (a.length >= 4 && b.length >= 4 && (a.includes(b) || b.includes(a)));
  }

  function findRelevantFixture(league, homeTeamName, awayTeamName) {
    const fixtures = Array.isArray(league.fixtures) ? league.fixtures : [];

    // Try exact match first, then fuzzy
    let matched = fixtures.filter((f) => f.homeTeam === homeTeamName && f.awayTeam === awayTeamName);
    if (!matched.length) {
      matched = fixtures.filter((f) => teamsMatch(f.homeTeam, homeTeamName) && teamsMatch(f.awayTeam, awayTeamName));
    }

    if (!matched.length) {
      return null;
    }

    const upcoming = matched
      .filter((fixture) => !fixture.played)
      .sort((a, b) => getFixtureTimestamp(a) - getFixtureTimestamp(b));

    if (upcoming.length) {
      return upcoming[0];
    }

    return matched.sort((a, b) => getFixtureTimestamp(b) - getFixtureTimestamp(a))[0];
  }

  function getLastPlayedFixtureBefore(league, teamName, referenceTime) {
    const fixtures = Array.isArray(league.fixtures) ? league.fixtures : [];
    const validMatches = fixtures
      .filter((fixture) => fixture.played && (fixture.homeTeam === teamName || fixture.awayTeam === teamName) && getFixtureTimestamp(fixture) < referenceTime)
      .sort((a, b) => getFixtureTimestamp(b) - getFixtureTimestamp(a));

    return validMatches[0] || null;
  }

  function getRestDays(league, teamName, referenceTime) {
    const lastFixture = getLastPlayedFixtureBefore(league, teamName, referenceTime);
    const lastTime = getFixtureTimestamp(lastFixture);

    if (!lastTime || !referenceTime) {
      return null;
    }

    return Math.max(1, Math.round((referenceTime - lastTime) / 86400000));
  }

  function getRestAttackBoost(days) {
    if (!Number.isFinite(days)) return 1;
    if (days <= 2) return 0.89;
    if (days === 3) return 0.95;
    if (days >= 7 && days <= 10) return 1.04;
    if (days > 10) return 0.99;
    return 1;
  }

  function getOpponentFatigueBoost(days) {
    if (!Number.isFinite(days)) return 1;
    if (days <= 2) return 1.09;
    if (days === 3) return 1.04;
    return 1;
  }

  function getAvailabilityAttackFactor(injuries, suspensions) {
    return clamp(1 - (injuries * 0.035 + suspensions * 0.055), 0.74, 1);
  }

  function getOpponentAbsenceBoost(injuries, suspensions) {
    return clamp(1 + (injuries * 0.022 + suspensions * 0.038), 1, 1.24);
  }

  function buildMatchModel(league, homeTeam, awayTeam) {
    const leagueHomeAvg = league.homeGoalsAvg || 1.4;
    const leagueAwayAvg = league.awayGoalsAvg || 1.1;
    const leagueHomeXgAvg = league.homeXgAvg || leagueHomeAvg;
    const leagueAwayXgAvg = league.awayXgAvg || leagueAwayAvg;
    const leagueFirstHalfHomeAvg = league.firstHalfHomeGoalsAvg || (leagueHomeAvg * HALF_TIME_SHARE);
    const leagueFirstHalfAwayAvg = league.firstHalfAwayGoalsAvg || (leagueAwayAvg * HALF_TIME_SHARE);

    const fixture = findRelevantFixture(league, homeTeam.name, awayTeam.name);
    const fixtureTime = getFixtureTimestamp(fixture) || Date.now();
    const homeRestDays = getRestDays(league, homeTeam.name, fixtureTime);
    const awayRestDays = getRestDays(league, awayTeam.name, fixtureTime);

    const homeInjuries = parseNumberInput(elements.homeInjuries);
    const awayInjuries = parseNumberInput(elements.awayInjuries);
    const homeSuspensions = parseNumberInput(elements.homeSuspensions);
    const awaySuspensions = parseNumberInput(elements.awaySuspensions);

    const homeAttackGoal = shrinkToAverage((safePerGame(homeTeam.homeGoalsFor, homeTeam.homePlayed) || leagueHomeAvg) / leagueHomeAvg, homeTeam.homePlayed || 0);
    const awayAttackGoal = shrinkToAverage((safePerGame(awayTeam.awayGoalsFor, awayTeam.awayPlayed) || leagueAwayAvg) / leagueAwayAvg, awayTeam.awayPlayed || 0);
    const homeDefenseGoal = shrinkToAverage((safePerGame(homeTeam.homeGoalsAgainst, homeTeam.homePlayed) || leagueAwayAvg) / leagueAwayAvg, homeTeam.homePlayed || 0);
    const awayDefenseGoal = shrinkToAverage((safePerGame(awayTeam.awayGoalsAgainst, awayTeam.awayPlayed) || leagueHomeAvg) / leagueHomeAvg, awayTeam.awayPlayed || 0);

    const homeAttackXg = shrinkToAverage((safePerGame(homeTeam.homeXgFor ?? homeTeam.homeGoalsFor, homeTeam.homePlayed) || leagueHomeXgAvg) / leagueHomeXgAvg, homeTeam.homePlayed || 0);
    const awayAttackXg = shrinkToAverage((safePerGame(awayTeam.awayXgFor ?? awayTeam.awayGoalsFor, awayTeam.awayPlayed) || leagueAwayXgAvg) / leagueAwayXgAvg, awayTeam.awayPlayed || 0);
    const homeDefenseXg = shrinkToAverage((safePerGame(homeTeam.homeXgAgainst ?? homeTeam.homeGoalsAgainst, homeTeam.homePlayed) || leagueAwayXgAvg) / leagueAwayXgAvg, homeTeam.homePlayed || 0);
    const awayDefenseXg = shrinkToAverage((safePerGame(awayTeam.awayXgAgainst ?? awayTeam.awayGoalsAgainst, awayTeam.awayPlayed) || leagueHomeXgAvg) / leagueHomeXgAvg, awayTeam.awayPlayed || 0);

    const homeAttack = blend(homeAttackGoal, homeAttackXg, XG_WEIGHT);
    const awayAttack = blend(awayAttackGoal, awayAttackXg, XG_WEIGHT);
    const homeDefense = blend(homeDefenseGoal, homeDefenseXg, XG_WEIGHT);
    const awayDefense = blend(awayDefenseGoal, awayDefenseXg, XG_WEIGHT);

    const homeRecent = getRecentProfile(homeTeam, "home", league);
    const awayRecent = getRecentProfile(awayTeam, "away", league);
    const recencyWeight = Number(elements.formWeight.value) / 100;

    const homeFormBoost = 1 + ((homeTeam.formScore ?? 0.5) - 0.5) * (0.2 + recencyWeight * 1.4);
    const awayFormBoost = 1 + ((awayTeam.formScore ?? 0.5) - 0.5) * (0.2 + recencyWeight * 1.4);

    const recencyHomeBoost = 1 + (((homeRecent.attackBoost * awayRecent.defenseBoost * homeRecent.momentumBoost) - 1) * (RECENCY_IMPACT_BASE + recencyWeight * 2));
    const recencyAwayBoost = 1 + (((awayRecent.attackBoost * homeRecent.defenseBoost * awayRecent.momentumBoost) - 1) * (RECENCY_IMPACT_BASE + recencyWeight * 2));

    const availabilityHome = getAvailabilityAttackFactor(homeInjuries, homeSuspensions);
    const availabilityAway = getAvailabilityAttackFactor(awayInjuries, awaySuspensions);
    const versusAwayAbsences = getOpponentAbsenceBoost(awayInjuries, awaySuspensions);
    const versusHomeAbsences = getOpponentAbsenceBoost(homeInjuries, homeSuspensions);

    const goalModelHome = leagueHomeAvg * homeAttackGoal * awayDefenseGoal;
    const goalModelAway = leagueAwayAvg * awayAttackGoal * homeDefenseGoal;
    const xgModelHome = leagueHomeXgAvg * homeAttackXg * awayDefenseXg;
    const xgModelAway = leagueAwayXgAvg * awayAttackXg * homeDefenseXg;

    const expectedHomeGoals = clamp(
      blend(goalModelHome, xgModelHome, XG_WEIGHT)
      * homeFormBoost
      * recencyHomeBoost
      * availabilityHome
      * versusAwayAbsences
      * getRestAttackBoost(homeRestDays)
      * getOpponentFatigueBoost(awayRestDays),
      0.18,
      4.8
    );

    const expectedAwayGoals = clamp(
      blend(goalModelAway, xgModelAway, XG_WEIGHT)
      * awayFormBoost
      * recencyAwayBoost
      * availabilityAway
      * versusHomeAbsences
      * getRestAttackBoost(awayRestDays)
      * getOpponentFatigueBoost(homeRestDays),
      0.18,
      4.8
    );

    const homeFirstHalfAttack = shrinkToAverage((safePerGame(homeTeam.homeFirstHalfGoalsFor ?? 0, homeTeam.homePlayed) || leagueFirstHalfHomeAvg) / leagueFirstHalfHomeAvg, homeTeam.homePlayed || 0);
    const awayFirstHalfAttack = shrinkToAverage((safePerGame(awayTeam.awayFirstHalfGoalsFor ?? 0, awayTeam.awayPlayed) || leagueFirstHalfAwayAvg) / leagueFirstHalfAwayAvg, awayTeam.awayPlayed || 0);
    const homeFirstHalfDefense = shrinkToAverage((safePerGame(homeTeam.homeFirstHalfGoalsAgainst ?? 0, homeTeam.homePlayed) || leagueFirstHalfAwayAvg) / leagueFirstHalfAwayAvg, homeTeam.homePlayed || 0);
    const awayFirstHalfDefense = shrinkToAverage((safePerGame(awayTeam.awayFirstHalfGoalsAgainst ?? 0, awayTeam.awayPlayed) || leagueFirstHalfHomeAvg) / leagueFirstHalfHomeAvg, awayTeam.awayPlayed || 0);

    const expectedHomeGoalsHT = clamp(
      blend(leagueFirstHalfHomeAvg * homeFirstHalfAttack * awayFirstHalfDefense, expectedHomeGoals * HALF_TIME_SHARE, 0.42)
      * (1 + ((homeRecent.pointsRate ?? 0.5) - 0.5) * 0.24)
      * availabilityHome
      * versusAwayAbsences,
      0.05,
      3.1
    );

    const expectedAwayGoalsHT = clamp(
      blend(leagueFirstHalfAwayAvg * awayFirstHalfAttack * homeFirstHalfDefense, expectedAwayGoals * HALF_TIME_SHARE, 0.42)
      * (1 + ((awayRecent.pointsRate ?? 0.5) - 0.5) * 0.24)
      * availabilityAway
      * versusHomeAbsences,
      0.05,
      3.1
    );

    return {
      expectedHomeGoals,
      expectedAwayGoals,
      expectedHomeGoalsHT,
      expectedAwayGoalsHT,
      homeAttack,
      awayAttack,
      homeDefense,
      awayDefense,
      homeRecent,
      awayRecent,
      homeRestDays,
      awayRestDays,
      homeInjuries,
      awayInjuries,
      homeSuspensions,
      awaySuspensions,
      fixture,
      xgHomeFor: safePerGame(homeTeam.homeXgFor ?? homeTeam.homeGoalsFor, homeTeam.homePlayed || 1),
      xgHomeAgainst: safePerGame(homeTeam.homeXgAgainst ?? homeTeam.homeGoalsAgainst, homeTeam.homePlayed || 1),
      xgAwayFor: safePerGame(awayTeam.awayXgFor ?? awayTeam.awayGoalsFor, awayTeam.awayPlayed || 1),
      xgAwayAgainst: safePerGame(awayTeam.awayXgAgainst ?? awayTeam.awayGoalsAgainst, awayTeam.awayPlayed || 1),
      homeShotsOnTarget: safePerGame(homeTeam.homeShotsOnTargetFor ?? 0, homeTeam.homePlayed || 1),
      awayShotsOnTarget: safePerGame(awayTeam.awayShotsOnTargetFor ?? 0, awayTeam.awayPlayed || 1),
      rho: clamp(typeof league.dixonColesRho === "number" ? league.dixonColesRho : DEFAULT_RHO, -0.2, 0.2),
      xgSourceLabel: homeTeam.xgSource === "understat" && awayTeam.xgSource === "understat"
        ? "xG real Understat"
        : homeTeam.xgSource === "understat" || awayTeam.xgSource === "understat"
          ? "xG híbrido: Understat + proxy"
          : "xG proxy por remates"
    };
  }

  function calculateProbabilities(expectedHomeGoals, expectedAwayGoals, rho) {
    const maxGoals = 7;
    let total = 0;
    let homeWin = 0;
    let draw = 0;
    let awayWin = 0;
    let over25 = 0;
    let btts = 0;
    let zeroZero = 0;
    const exactScores = [];

    for (let homeGoals = 0; homeGoals <= maxGoals; homeGoals += 1) {
      const homeProbability = poisson(homeGoals, expectedHomeGoals);

      for (let awayGoals = 0; awayGoals <= maxGoals; awayGoals += 1) {
        const tau = dixonColesTau(homeGoals, awayGoals, expectedHomeGoals, expectedAwayGoals, rho);
        const probability = homeProbability * poisson(awayGoals, expectedAwayGoals) * tau;
        total += probability;

        if (homeGoals === 0 && awayGoals === 0) {
          zeroZero += probability;
        }

        exactScores.push({
          score: `${homeGoals}-${awayGoals}`,
          probability,
          homeGoals,
          awayGoals
        });

        if (homeGoals > awayGoals) {
          homeWin += probability;
        } else if (homeGoals === awayGoals) {
          draw += probability;
        } else {
          awayWin += probability;
        }

        if (homeGoals + awayGoals >= 3) {
          over25 += probability;
        }

        if (homeGoals > 0 && awayGoals > 0) {
          btts += probability;
        }
      }
    }

    const normalizer = total > 0 ? 1 / total : 1;
    return {
      homeWin: homeWin * normalizer,
      draw: draw * normalizer,
      awayWin: awayWin * normalizer,
      over25: over25 * normalizer,
      btts: btts * normalizer,
      zeroZero: zeroZero * normalizer,
      exactScores: exactScores
        .map((entry) => ({ ...entry, probability: entry.probability * normalizer }))
        .sort((a, b) => b.probability - a.probability)
        .slice(0, 6)
    };
  }

  function toFairOdd(probability) {
    return probability > 0 ? 1 / probability : null;
  }

  function getValueEdge(probability, marketOdd) {
    const fairOdd = toFairOdd(probability);
    if (!marketOdd || !fairOdd) {
      return null;
    }

    return ((marketOdd / fairOdd) - 1) * 100;
  }

  function badgeClass(value, inverted = false) {
    if (inverted) {
      if (value < 0.9) return "good";
      if (value > 1.1) return "bad";
      return "warn";
    }

    if (value > 1.1) return "good";
    if (value < 0.9) return "bad";
    return "warn";
  }

  function edgeClass(edge) {
    if (edge === null) return "warn";
    if (edge >= 4) return "good";
    if (edge <= -4) return "bad";
    return "warn";
  }

  function edgeText(edge) {
    if (edge === null) return "sem odd";
    if (edge >= 4) return "valor";
    if (edge <= -4) return "fraca";
    return "justa";
  }

  function renderStrengthTable(homeTeam, awayTeam, model) {
    elements.strengthTable.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>Equipa</th>
            <th>Ataque</th>
            <th>Defesa</th>
            <th>xG (for/agn)</th>
            <th>Recência</th>
            <th>Descanso</th>
            <th>Ausências</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>${homeTeam.name}</strong><br /><small class="small-meta">${homeTeam.xgSource === "understat" ? "xG real" : "xG proxy"}</small></td>
            <td><span class="badge ${badgeClass(model.homeAttack)}">${formatDecimal(model.homeAttack)}x</span></td>
            <td><span class="badge ${badgeClass(model.homeDefense, true)}">${formatDecimal(model.homeDefense)}x</span></td>
            <td>${formatDecimal(model.xgHomeFor)} / ${formatDecimal(model.xgHomeAgainst)}</td>
            <td>${model.homeRecent.form || homeTeam.form || "—"}<br /><small class="small-meta">${formatPercent(model.homeRecent.pointsRate || (homeTeam.formScore ?? 0.5))}</small></td>
            <td>${formatDays(model.homeRestDays)}</td>
            <td>${model.homeInjuries}L / ${model.homeSuspensions}S</td>
          </tr>
          <tr>
            <td><strong>${awayTeam.name}</strong><br /><small class="small-meta">${awayTeam.xgSource === "understat" ? "xG real" : "xG proxy"}</small></td>
            <td><span class="badge ${badgeClass(model.awayAttack)}">${formatDecimal(model.awayAttack)}x</span></td>
            <td><span class="badge ${badgeClass(model.awayDefense, true)}">${formatDecimal(model.awayDefense)}x</span></td>
            <td>${formatDecimal(model.xgAwayFor)} / ${formatDecimal(model.xgAwayAgainst)}</td>
            <td>${model.awayRecent.form || awayTeam.form || "—"}<br /><small class="small-meta">${formatPercent(model.awayRecent.pointsRate || (awayTeam.formScore ?? 0.5))}</small></td>
            <td>${formatDays(model.awayRestDays)}</td>
            <td>${model.awayInjuries}L / ${model.awaySuspensions}S</td>
          </tr>
        </tbody>
      </table>
    `;
  }

  function renderTopScores(scores) {
    elements.topScores.innerHTML = scores
      .map(
        (entry, index) => `
          <div class="score-row">
            <span>#${index + 1}</span>
            <strong>${entry.score}</strong>
            <span>${formatPercent(entry.probability)}</span>
          </div>
        `
      )
      .join("");
  }

  function renderHalfTimeTable(probabilities) {
    if (!elements.htOddsTable) {
      return;
    }

    elements.htHomeWin.textContent = formatPercent(probabilities.homeWin);
    elements.htDrawProb.textContent = formatPercent(probabilities.draw);
    elements.htAwayWin.textContent = formatPercent(probabilities.awayWin);
    elements.htNoGoal.textContent = formatPercent(probabilities.zeroZero);

    const rows = [
      { label: "HT 1", probability: probabilities.homeWin },
      { label: "HT X", probability: probabilities.draw },
      { label: "HT 2", probability: probabilities.awayWin },
      { label: "HT 0-0", probability: probabilities.zeroZero }
    ];

    elements.htOddsTable.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>Mercado HT</th>
            <th>Prob.</th>
            <th>Odd justa</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((row) => `
            <tr>
              <td><strong>${row.label}</strong></td>
              <td>${formatPercent(row.probability)}</td>
              <td>${formatOdd(toFairOdd(row.probability))}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  }

  function countAvailableBookmakerOdds(bookmaker) {
    return [bookmaker?.home, bookmaker?.draw, bookmaker?.away, bookmaker?.over25].filter((value) => Number.isFinite(value)).length;
  }

  function scoreImportedBookmaker(imported, bookmaker) {
    const importedKey = normalizeBookmakerToken(imported?.key);
    const importedName = normalizeBookmakerToken(imported?.name);
    const searchTokens = [
      bookmaker.key,
      bookmaker.name,
      ...(bookmaker.sourceKeys || []),
      ...(bookmaker.aliases || [])
    ].map(normalizeBookmakerToken).filter(Boolean);

    let score = 0;

    searchTokens.forEach((token) => {
      if (!token) return;

      if (importedKey === token) score = Math.max(score, 120);
      if (importedName === token) score = Math.max(score, 115);
      if (importedKey.startsWith(token) || importedKey.includes(token)) score = Math.max(score, 95);
      if (importedName.startsWith(token) || importedName.includes(token)) score = Math.max(score, 90);
      if (token.includes(importedKey) && importedKey) score = Math.max(score, 82);
      if (token.includes(importedName) && importedName) score = Math.max(score, 78);
    });

    const sourceBoost = String(imported?.source || "").startsWith("api") ? 6 : 0;
    const completenessBoost = countAvailableBookmakerOdds(imported);
    return score + sourceBoost + completenessBoost;
  }

  function findImportedBookmaker(sourceOdds, bookmaker, usedKeys) {
    const candidates = Object.values(sourceOdds || {})
      .filter((entry) => entry && !usedKeys.has(entry.key))
      .map((entry) => ({ entry, score: scoreImportedBookmaker(entry, bookmaker) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score || countAvailableBookmakerOdds(b.entry) - countAvailableBookmakerOdds(a.entry) || String(a.entry.name || "").localeCompare(String(b.entry.name || ""), "pt-PT"));

    return candidates[0]?.entry || null;
  }

  function formatBookmakerNote(bookmaker) {
    if (!bookmaker) {
      return "N/D na fonte";
    }

    const sourceLabel = String(bookmaker.source || "").startsWith("api") ? "API dedicada" : "fonte pública";
    return bookmaker.provider ? `${sourceLabel} • ${bookmaker.provider}` : sourceLabel;
  }

  function buildBookmakerRows(fixture) {
    const sourceOdds = fixture?.bookmakerOdds || {};
    const rows = [];
    const usedKeys = new Set();

    PT_LEGAL_BOOKMAKERS.forEach((bookmaker) => {
      const imported = findImportedBookmaker(sourceOdds, bookmaker, usedKeys);
      if (imported?.key) {
        usedKeys.add(imported.key);
      }

      rows.push({
        key: bookmaker.key,
        name: bookmaker.name,
        legalPt: true,
        home: imported?.home ?? null,
        draw: imported?.draw ?? null,
        away: imported?.away ?? null,
        over25: imported?.over25 ?? null,
        note: formatBookmakerNote(imported)
      });
    });

    Object.values(sourceOdds).forEach((bookmaker) => {
      if (usedKeys.has(bookmaker.key)) {
        return;
      }

      rows.push({
        key: bookmaker.key,
        name: bookmaker.name,
        legalPt: false,
        home: bookmaker.home ?? null,
        draw: bookmaker.draw ?? null,
        away: bookmaker.away ?? null,
        over25: bookmaker.over25 ?? null,
        note: formatBookmakerNote(bookmaker)
      });
    });

    return rows;
  }

  function getBestImportedOdds(rows) {
    const pickMax = (selector) => {
      const values = rows.map(selector).filter((value) => Number.isFinite(value));
      return values.length ? Math.max(...values) : null;
    };

    return {
      home: pickMax((row) => row.home),
      draw: pickMax((row) => row.draw),
      away: pickMax((row) => row.away),
      over25: pickMax((row) => row.over25)
    };
  }

  function renderOddValue(value, bestValue) {
    if (!Number.isFinite(value)) {
      return "—";
    }

    const isBest = Number.isFinite(bestValue) && Math.abs(value - bestValue) < 0.0001;
    return `<span class="${isBest ? "best-odd" : ""}">${formatOdd(value)}</span>`;
  }

  function updateMarketInputPlaceholders(bestImported) {
    const mappings = [
      [elements.marketHomeOdd, bestImported.home, "2.10"],
      [elements.marketDrawOdd, bestImported.draw, "3.40"],
      [elements.marketAwayOdd, bestImported.away, "3.20"],
      [elements.marketOver25Odd, bestImported.over25, "1.90"]
    ];

    mappings.forEach(([input, bestValue, defaultPlaceholder]) => {
      if (!input) return;
      if (!input.dataset.defaultPlaceholder) {
        input.dataset.defaultPlaceholder = defaultPlaceholder;
      }
      input.placeholder = Number.isFinite(bestValue) ? formatOdd(bestValue) : input.dataset.defaultPlaceholder;
    });
  }

  function renderBookmakerTable(fixture) {
    if (!elements.bookmakerTable) {
      return { home: null, draw: null, away: null, over25: null };
    }

    if (!fixture) {
      const hasKey = Boolean(getStoredApiKey());
      elements.autoOddsNote.textContent = hasKey
        ? "Sem odds encontradas para esta combinação. Clique em \"Buscar odds agora\" nas definições abaixo."
        : "Sem odds para este jogo. Configure a chave da The Odds API nas definições abaixo para importar odds ao vivo.";
      elements.bookmakerTable.innerHTML = `<p class="small-note">${hasKey ? "As odds aparecerão automaticamente quando existir um jogo agendado para estas equipas na API." : "Para ver odds ao vivo, registe-se grátis em <strong>the-odds-api.com</strong> e cole a chave na secção <strong>Definições de Odds ao Vivo</strong> abaixo."}</p>`;
      return { home: null, draw: null, away: null, over25: null };
    }

    const rows = buildBookmakerRows(fixture);
    const bestImported = getBestImportedOdds(rows);
    const statusLabel = fixture.played ? "linha histórica" : "jogo agendado";
    const providerLabel = fixture.apiProvider
      ? `${fixture.apiProvider}${fixture.oddsSource === "api+csv" ? " + CSV histórico" : ""}`
      : "fonte pública gratuita";
    elements.autoOddsNote.textContent = `Odds auto-importadas de ${fixture.date || "sem data"}${fixture.time ? ` ${fixture.time}` : ""} (${statusLabel}). Fonte: ${providerLabel}. N/D = não disponível na fonte atual.`;

    elements.bookmakerTable.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>Casa</th>
            <th>1</th>
            <th>X</th>
            <th>2</th>
            <th>Over 2.5</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((row) => `
            <tr>
              <td>
                <div class="bookmaker-name">
                  <strong>${row.name}</strong>
                  <small class="small-meta">${row.legalPt ? "principal PT" : "outra casa da fonte"}</small>
                </div>
              </td>
              <td>${renderOddValue(row.home, bestImported.home)}</td>
              <td>${renderOddValue(row.draw, bestImported.draw)}</td>
              <td>${renderOddValue(row.away, bestImported.away)}</td>
              <td>${renderOddValue(row.over25, bestImported.over25)}</td>
              <td>${row.note}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;

    return bestImported;
  }

  function resolveMarketOdd(input, fallbackOdd) {
    return parseMarketOdd(input) ?? fallbackOdd ?? null;
  }

  function renderMarketTable(probabilities, bestImported) {
    if (!elements.marketTable) {
      return;
    }

    updateMarketInputPlaceholders(bestImported);

    const rows = [
      { label: "Vitória casa", probability: probabilities.homeWin, marketOdd: resolveMarketOdd(elements.marketHomeOdd, bestImported.home) },
      { label: "Empate", probability: probabilities.draw, marketOdd: resolveMarketOdd(elements.marketDrawOdd, bestImported.draw) },
      { label: "Vitória fora", probability: probabilities.awayWin, marketOdd: resolveMarketOdd(elements.marketAwayOdd, bestImported.away) },
      { label: "Over 2.5", probability: probabilities.over25, marketOdd: resolveMarketOdd(elements.marketOver25Odd, bestImported.over25) },
      { label: "Ambas marcam", probability: probabilities.btts, marketOdd: parseMarketOdd(elements.marketBttsOdd) }
    ];

    elements.marketTable.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>Mercado</th>
            <th>Prob.</th>
            <th>Odd justa</th>
            <th>Odd mercado</th>
            <th>Edge</th>
            <th>Leitura</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((row) => {
            const fairOdd = toFairOdd(row.probability);
            const edge = getValueEdge(row.probability, row.marketOdd);
            const edgeDisplay = edge === null ? "—" : `${edge >= 0 ? "+" : ""}${edge.toFixed(1)}%`;

            return `
              <tr>
                <td><strong>${row.label}</strong></td>
                <td>${formatPercent(row.probability)}</td>
                <td>${formatOdd(fairOdd)}</td>
                <td>${row.marketOdd ? formatOdd(row.marketOdd) : "—"}</td>
                <td class="${edge === null ? "edge-neutral" : edge >= 0 ? "edge-positive" : "edge-negative"}">${edgeDisplay}</td>
                <td><span class="badge ${edgeClass(edge)}">${edgeText(edge)}</span></td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    `;
  }

  // ========= EXTENDED MARKETS =========
  function calculateExtendedMarkets(expectedHome, expectedAway, rho) {
    const maxGoals = 7;
    let total = 0;
    const b = { over05: 0, over15: 0, over25: 0, over35: 0, over45: 0, homeOver05: 0, homeOver15: 0, homeOver25: 0, awayOver05: 0, awayOver15: 0, awayOver25: 0 };

    for (let h = 0; h <= maxGoals; h++) {
      const hp = poisson(h, expectedHome);
      for (let a = 0; a <= maxGoals; a++) {
        const tau = dixonColesTau(h, a, expectedHome, expectedAway, rho);
        const p = hp * poisson(a, expectedAway) * tau;
        total += p;
        const tg = h + a;
        if (tg >= 1) b.over05 += p;
        if (tg >= 2) b.over15 += p;
        if (tg >= 3) b.over25 += p;
        if (tg >= 4) b.over35 += p;
        if (tg >= 5) b.over45 += p;
        if (h >= 1) b.homeOver05 += p;
        if (h >= 2) b.homeOver15 += p;
        if (h >= 3) b.homeOver25 += p;
        if (a >= 1) b.awayOver05 += p;
        if (a >= 2) b.awayOver15 += p;
        if (a >= 3) b.awayOver25 += p;
      }
    }

    const n = total > 0 ? 1 / total : 1;
    Object.keys(b).forEach(k => { b[k] *= n; });
    b.under05 = 1 - b.over05;
    b.under15 = 1 - b.over15;
    b.under25 = 1 - b.over25;
    b.under35 = 1 - b.over35;
    b.under45 = 1 - b.over45;
    return b;
  }

  // ========= HANDICAPS =========
  function calculateHandicaps(expectedHome, expectedAway, rho) {
    const maxGoals = 7;
    let total = 0;
    const results = {};
    const lines = [
      { label: "Casa -1", shift: -1 },
      { label: "Casa +1", shift: 1 },
      { label: "Casa -2", shift: -2 },
      { label: "Casa +2", shift: 2 }
    ];

    lines.forEach(l => { results[l.label] = { home: 0, draw: 0, away: 0 }; });

    for (let h = 0; h <= maxGoals; h++) {
      const hp = poisson(h, expectedHome);
      for (let a = 0; a <= maxGoals; a++) {
        const tau = dixonColesTau(h, a, expectedHome, expectedAway, rho);
        const p = hp * poisson(a, expectedAway) * tau;
        total += p;
        lines.forEach(l => {
          const adj = h + l.shift;
          if (adj > a) results[l.label].home += p;
          else if (adj === a) results[l.label].draw += p;
          else results[l.label].away += p;
        });
      }
    }

    const n = total > 0 ? 1 / total : 1;
    Object.keys(results).forEach(k => {
      results[k].home *= n;
      results[k].draw *= n;
      results[k].away *= n;
    });
    return results;
  }

  // ========= HT/FT COMBINED =========
  function calculateHtFtCombined(expectedHomeHT, expectedAwayHT, expectedHomeFT, expectedAwayFT) {
    const maxHT = 4;
    const max2H = 4;
    const combos = { "1/1": 0, "1/X": 0, "1/2": 0, "X/1": 0, "X/X": 0, "X/2": 0, "2/1": 0, "2/X": 0, "2/2": 0 };
    const home2H = Math.max(0.05, expectedHomeFT - expectedHomeHT);
    const away2H = Math.max(0.05, expectedAwayFT - expectedAwayHT);
    let total = 0;

    for (let h1 = 0; h1 <= maxHT; h1++) {
      for (let a1 = 0; a1 <= maxHT; a1++) {
        const pHT = poisson(h1, expectedHomeHT) * poisson(a1, expectedAwayHT);
        const htR = h1 > a1 ? "1" : h1 === a1 ? "X" : "2";
        for (let h2 = 0; h2 <= max2H; h2++) {
          for (let a2 = 0; a2 <= max2H; a2++) {
            const p2H = poisson(h2, home2H) * poisson(a2, away2H);
            const ftR = (h1 + h2) > (a1 + a2) ? "1" : (h1 + h2) === (a1 + a2) ? "X" : "2";
            const prob = pHT * p2H;
            combos[`${htR}/${ftR}`] += prob;
            total += prob;
          }
        }
      }
    }

    const n = total > 0 ? 1 / total : 1;
    Object.keys(combos).forEach(k => { combos[k] *= n; });
    return combos;
  }

  // ========= GOAL TIMING =========
  function estimateGoalTiming(expectedHome, expectedAway) {
    const weights = [0.14, 0.15, 0.17, 0.16, 0.18, 0.20];
    const labels = ["0-15", "16-30", "31-45", "46-60", "61-75", "76-90"];

    return labels.map((label, i) => {
      const hLam = expectedHome * weights[i];
      const aLam = expectedAway * weights[i];
      return {
        interval: label,
        homeGoalProb: 1 - Math.exp(-hLam),
        awayGoalProb: 1 - Math.exp(-aLam),
        anyGoalProb: 1 - Math.exp(-(hLam + aLam))
      };
    });
  }

  // ========= KELLY CRITERION =========
  function kellyStake(probability, odd, fraction) {
    if (!odd || odd <= 1 || probability <= 0) return 0;
    const kelly = (probability * odd - 1) / (odd - 1);
    return kelly > 0 ? kelly * (fraction || 0.25) : 0;
  }

  // ========= TIPS =========
  function generateTips(probabilities, extendedMarkets, bestImported) {
    const markets = [
      { label: "Vitória Casa (1)", prob: probabilities.homeWin, odd: bestImported.home },
      { label: "Empate (X)", prob: probabilities.draw, odd: bestImported.draw },
      { label: "Vitória Fora (2)", prob: probabilities.awayWin, odd: bestImported.away },
      { label: "Over 2.5", prob: probabilities.over25, odd: bestImported.over25 },
      { label: "DC 1X", prob: probabilities.homeWin + probabilities.draw, odd: null },
      { label: "DC X2", prob: probabilities.draw + probabilities.awayWin, odd: null },
      { label: "DC 12", prob: probabilities.homeWin + probabilities.awayWin, odd: null }
    ];

    return markets
      .filter(m => m.odd && m.odd > 1)
      .map(m => ({
        ...m,
        fairOdd: toFairOdd(m.prob),
        edge: getValueEdge(m.prob, m.odd),
        kelly: kellyStake(m.prob, m.odd, 0.25)
      }))
      .filter(m => m.edge !== null && m.edge > 0)
      .sort((a, b) => b.edge - a.edge);
  }

  // ========= POWER RANKING =========
  function buildPowerRanking(league) {
    const homeAvg = league.homeGoalsAvg || 1.4;
    const awayAvg = league.awayGoalsAvg || 1.1;

    return league.teams.map(team => {
      const ha = team.homePlayed > 0 ? (team.homeGoalsFor / team.homePlayed) / homeAvg : 1;
      const hd = team.homePlayed > 0 ? (team.homeGoalsAgainst / team.homePlayed) / awayAvg : 1;
      const aa = team.awayPlayed > 0 ? (team.awayGoalsFor / team.awayPlayed) / awayAvg : 1;
      const ad = team.awayPlayed > 0 ? (team.awayGoalsAgainst / team.awayPlayed) / homeAvg : 1;
      const attack = (ha + aa) / 2;
      const defense = (hd + ad) / 2;
      return {
        name: team.name,
        played: team.played,
        points: team.points,
        ppg: team.played > 0 ? (team.points / team.played) : 0,
        gd: team.goalsFor - team.goalsAgainst,
        attack,
        defense,
        supremacy: attack - defense,
        form: team.form || "—",
        formScore: team.formScore ?? 0.5
      };
    }).sort((a, b) => b.points - a.points || b.gd - a.gd || b.attack - a.attack);
  }

  // ========= RENDER: EXTENDED MARKETS =========
  function renderExtendedMarkets(extended, probabilities) {
    const el = document.getElementById("extendedMarketsTable");
    if (!el) return;

    const dc1x = probabilities.homeWin + probabilities.draw;
    const dcx2 = probabilities.draw + probabilities.awayWin;
    const dc12 = probabilities.homeWin + probabilities.awayWin;

    const rows = [
      { label: "DC 1X", prob: dc1x },
      { label: "DC X2", prob: dcx2 },
      { label: "DC 12", prob: dc12 },
      { label: "Over 0.5", prob: extended.over05 },
      { label: "Over 1.5", prob: extended.over15 },
      { label: "Over 2.5", prob: extended.over25 },
      { label: "Over 3.5", prob: extended.over35 },
      { label: "Over 4.5", prob: extended.over45 },
      { label: "Under 0.5", prob: extended.under05 },
      { label: "Under 1.5", prob: extended.under15 },
      { label: "Under 2.5", prob: extended.under25 },
      { label: "Under 3.5", prob: extended.under35 },
      { label: "Under 4.5", prob: extended.under45 },
      { label: "Casa Over 0.5", prob: extended.homeOver05 },
      { label: "Casa Over 1.5", prob: extended.homeOver15 },
      { label: "Casa Over 2.5", prob: extended.homeOver25 },
      { label: "Fora Over 0.5", prob: extended.awayOver05 },
      { label: "Fora Over 1.5", prob: extended.awayOver15 },
      { label: "Fora Over 2.5", prob: extended.awayOver25 }
    ];

    el.innerHTML = `
      <table>
        <thead><tr><th>Mercado</th><th>Prob.</th><th>Odd justa</th></tr></thead>
        <tbody>${rows.map(r => `
          <tr>
            <td><strong>${r.label}</strong></td>
            <td>${formatPercent(r.prob)}</td>
            <td>${formatOdd(toFairOdd(r.prob))}</td>
          </tr>`).join("")}
        </tbody>
      </table>`;
  }

  // ========= RENDER: HANDICAPS =========
  function renderHandicaps(handicaps) {
    const el = document.getElementById("handicapsTable");
    if (!el) return;

    const rows = Object.entries(handicaps);
    el.innerHTML = `
      <table>
        <thead><tr><th>Handicap</th><th>1</th><th>X</th><th>2</th></tr></thead>
        <tbody>${rows.map(([label, r]) => `
          <tr>
            <td><strong>${label}</strong></td>
            <td>${formatPercent(r.home)}</td>
            <td>${formatPercent(r.draw)}</td>
            <td>${formatPercent(r.away)}</td>
          </tr>`).join("")}
        </tbody>
      </table>`;
  }

  // ========= RENDER: HT/FT =========
  function renderHtFtTable(htft) {
    const el = document.getElementById("htftTable");
    if (!el) return;

    const keys = ["1/1", "1/X", "1/2", "X/1", "X/X", "X/2", "2/1", "2/X", "2/2"];
    el.innerHTML = `
      <div class="htft-grid">${keys.map(k => {
        const prob = htft[k] || 0;
        const intensity = Math.min(prob * 8, 1);
        return `
          <div class="htft-cell" style="background: rgba(97,169,255,${(intensity * 0.35).toFixed(2)})">
            <span class="htft-label">${k}</span>
            <strong>${formatPercent(prob)}</strong>
            <small>${formatOdd(toFairOdd(prob))}</small>
          </div>`;
      }).join("")}
      </div>`;
  }

  // ========= RENDER: GOAL TIMING =========
  function renderGoalTiming(timing) {
    const el = document.getElementById("goalTimingTable");
    if (!el) return;

    el.innerHTML = `
      <table>
        <thead><tr><th>Intervalo</th><th>Golo casa</th><th>Golo fora</th><th>Qualquer golo</th></tr></thead>
        <tbody>${timing.map(t => `
          <tr>
            <td><strong>${t.interval}'</strong></td>
            <td>${formatPercent(t.homeGoalProb)}</td>
            <td>${formatPercent(t.awayGoalProb)}</td>
            <td><strong>${formatPercent(t.anyGoalProb)}</strong></td>
          </tr>`).join("")}
        </tbody>
      </table>`;
  }

  // ========= RENDER: POWER RANKING =========
  function renderPowerRanking(league) {
    const el = document.getElementById("powerRankingTable");
    if (!el) return;

    const ranking = buildPowerRanking(league);
    el.innerHTML = `
      <table>
        <thead><tr><th>#</th><th>Equipa</th><th>J</th><th>Pts</th><th>PPG</th><th>Ataque</th><th>Defesa</th><th>Supremacia</th><th>Forma</th></tr></thead>
        <tbody>${ranking.map((t, i) => {
          const supClass = t.supremacy > 0.15 ? "edge-positive" : t.supremacy < -0.15 ? "edge-negative" : "edge-neutral";
          return `
          <tr>
            <td>${i + 1}</td>
            <td><strong>${t.name}</strong></td>
            <td>${t.played}</td>
            <td>${t.points}</td>
            <td>${t.ppg.toFixed(2)}</td>
            <td><span class="badge ${badgeClass(t.attack)}">${formatDecimal(t.attack)}</span></td>
            <td><span class="badge ${badgeClass(t.defense, true)}">${formatDecimal(t.defense)}</span></td>
            <td class="${supClass}"><strong>${t.supremacy >= 0 ? "+" : ""}${t.supremacy.toFixed(2)}</strong></td>
            <td>${t.form.split("").map(c => c === "W" ? "V" : c === "D" ? "E" : c === "L" ? "D" : c).join("")}</td>
          </tr>`;
        }).join("")}
        </tbody>
      </table>`;
  }

  // ========= RENDER: TIPS =========
  function renderTips(tips) {
    const el = document.getElementById("tipsContainer");
    if (!el) return;

    if (!tips.length) {
      el.innerHTML = '<p class="small-note">Sem value bets identificadas para este jogo com as odds disponíveis.</p>';
      return;
    }

    el.innerHTML = `
      <table>
        <thead><tr><th>Mercado</th><th>Prob.</th><th>Odd justa</th><th>Odd mercado</th><th>Edge</th><th>Kelly (25%)</th><th>Leitura</th></tr></thead>
        <tbody>${tips.map(t => `
          <tr>
            <td><strong>${t.label}</strong></td>
            <td>${formatPercent(t.prob)}</td>
            <td>${formatOdd(t.fairOdd)}</td>
            <td>${formatOdd(t.odd)}</td>
            <td class="edge-positive">+${t.edge.toFixed(1)}%</td>
            <td><strong>${(t.kelly * 100).toFixed(1)}%</strong></td>
            <td><span class="badge good">${t.edge >= 10 ? "forte" : "valor"}</span></td>
          </tr>`).join("")}
        </tbody>
      </table>`;
  }

  function renderContextInfo(model) {
    if (!elements.restInfo) {
      return;
    }

    const fixtureDateText = model.fixture?.date
      ? `${model.fixture.date}${model.fixture.time ? ` ${model.fixture.time}` : ""}`
      : "sem fixture auto identificado";

    elements.restInfo.innerHTML = `
      <strong>Calendário e descanso</strong><br />
      Referência do jogo: ${fixtureDateText}<br />
      Descanso casa: <strong>${formatDays(model.homeRestDays)}</strong> • Descanso fora: <strong>${formatDays(model.awayRestDays)}</strong><br />
      Ajuste manual: ${model.homeInjuries} lesões / ${model.homeSuspensions} suspensões na casa • ${model.awayInjuries} / ${model.awaySuspensions} fora.
    `;
  }

  function renderPrediction() {
    const league = getCurrentLeague();
    const homeTeam = getTeamByName(elements.homeTeamSelect.value);
    const awayTeam = getTeamByName(elements.awayTeamSelect.value);

    if (!homeTeam || !awayTeam) {
      return;
    }

    if (homeTeam.name === awayTeam.name) {
      elements.matchTitle.textContent = "Escolha duas equipas diferentes";
      return;
    }

    const model = buildMatchModel(league, homeTeam, awayTeam);
    const probabilities = calculateProbabilities(model.expectedHomeGoals, model.expectedAwayGoals, model.rho);
    const halfTimeProbabilities = calculateProbabilities(model.expectedHomeGoalsHT, model.expectedAwayGoalsHT, model.rho * 0.55);
    const topScore = probabilities.exactScores[0] || { score: "—", probability: 0 };
    const topHtScore = halfTimeProbabilities.exactScores[0] || { score: "—", probability: 0 };
    const bestImported = renderBookmakerTable(model.fixture);

    elements.matchTitle.textContent = `${homeTeam.name} vs ${awayTeam.name}`;
    elements.matchSubtitle.textContent = `${league.name} • ${league.matches} jogos analisados • último dado: ${league.lastMatchDate || "—"} • ${model.xgSourceLabel}`;
    elements.bestPick.innerHTML = `<strong>Mais provável FT:</strong><br />${topScore.score} • ${formatPercent(topScore.probability)}<br /><small>HT: ${topHtScore.score} • ${formatPercent(topHtScore.probability)} • ρ ${formatDecimal(model.rho)}</small>`;

    elements.homeExpected.textContent = formatDecimal(model.expectedHomeGoals);
    elements.awayExpected.textContent = formatDecimal(model.expectedAwayGoals);
    elements.homeWin.textContent = formatPercent(probabilities.homeWin);
    elements.drawProb.textContent = formatPercent(probabilities.draw);
    elements.awayWin.textContent = formatPercent(probabilities.awayWin);
    elements.over25.textContent = formatPercent(probabilities.over25);
    elements.btts.textContent = formatPercent(probabilities.btts);

    const extendedMarkets = calculateExtendedMarkets(model.expectedHomeGoals, model.expectedAwayGoals, model.rho);
    const handicaps = calculateHandicaps(model.expectedHomeGoals, model.expectedAwayGoals, model.rho);
    const htftProbs = calculateHtFtCombined(model.expectedHomeGoalsHT, model.expectedAwayGoalsHT, model.expectedHomeGoals, model.expectedAwayGoals);
    const goalTiming = estimateGoalTiming(model.expectedHomeGoals, model.expectedAwayGoals);
    const tips = generateTips(probabilities, extendedMarkets, bestImported);

    renderStrengthTable(homeTeam, awayTeam, model);
    renderTopScores(probabilities.exactScores);
    renderHalfTimeTable(halfTimeProbabilities);
    renderMarketTable(probabilities, bestImported);
    renderContextInfo(model);
    renderExtendedMarkets(extendedMarkets, probabilities);
    renderHandicaps(handicaps);
    renderHtFtTable(htftProbs);
    renderGoalTiming(goalTiming);
    renderPowerRanking(league);
    renderTips(tips);
  }

  function refreshDataStatus() {
    const date = snapshot.generatedAt ? new Date(snapshot.generatedAt) : null;
    const formattedDate = date && !Number.isNaN(date.getTime())
      ? `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`
      : "sem data";

    const realXgLeagues = leagueKeys.filter((key) => String(snapshot.leagues[key].xgSource || "").includes("understat")).length;
    elements.dataStatus.textContent = `Snapshot atualizado em ${formattedDate} • ${leagueKeys.length} ligas • ${realXgLeagues} com xG real • HT + odds auto`;
  }

  elements.leagueSelect.addEventListener("change", () => {
    populateTeamOptions();
    renderPrediction();
  });

  elements.homeTeamSelect.addEventListener("change", renderPrediction);
  elements.awayTeamSelect.addEventListener("change", renderPrediction);
  elements.predictButton.addEventListener("click", renderPrediction);
  elements.formWeight.addEventListener("input", () => {
    elements.formWeightValue.textContent = `${elements.formWeight.value}%`;
    renderPrediction();
  });

  elements.swapButton.addEventListener("click", () => {
    const currentHome = elements.homeTeamSelect.value;
    elements.homeTeamSelect.value = elements.awayTeamSelect.value;
    elements.awayTeamSelect.value = currentHome;
    renderPrediction();
  });

  [
    elements.homeInjuries,
    elements.awayInjuries,
    elements.homeSuspensions,
    elements.awaySuspensions,
    elements.marketHomeOdd,
    elements.marketDrawOdd,
    elements.marketAwayOdd,
    elements.marketOver25Odd,
    elements.marketBttsOdd
  ].filter(Boolean).forEach((input) => input.addEventListener("input", renderPrediction));

  if (elements.clearOddsButton) {
    elements.clearOddsButton.addEventListener("click", () => {
      [
        elements.marketHomeOdd,
        elements.marketDrawOdd,
        elements.marketAwayOdd,
        elements.marketOver25Odd,
        elements.marketBttsOdd
      ].filter(Boolean).forEach((input) => {
        input.value = "";
      });

      renderPrediction();
    });
  }

  // ========= LIVE ODDS FETCHING =========
  const ODDS_API_SPORT_KEYS = {
    portugal: "soccer_portugal_primeira_liga",
    spain: "soccer_spain_la_liga",
    england: "soccer_epl"
  };

  const oddsApiKeyInput = document.getElementById("oddsApiKeyInput");
  const saveApiKeyButton = document.getElementById("saveApiKeyButton");
  const clearApiKeyButton = document.getElementById("clearApiKeyButton");
  const fetchOddsNowButton = document.getElementById("fetchOddsNowButton");
  const oddsApiStatus = document.getElementById("oddsApiStatus");

  function getStoredApiKey() {
    return localStorage.getItem("oddsApiKey") || "";
  }

  function setStoredApiKey(key) {
    if (key) {
      localStorage.setItem("oddsApiKey", key.trim());
    } else {
      localStorage.removeItem("oddsApiKey");
    }
  }

  // Maps The Odds API team names → snapshot team names
  const ODDS_TEAM_ALIASES = {
    // Portugal
    "sporting cp": "Sp Lisbon", "sporting lisbon": "Sp Lisbon", "sporting": "Sp Lisbon",
    "fc porto": "Porto", "porto fc": "Porto",
    "sl benfica": "Benfica", "benfica": "Benfica",
    "sc braga": "Sp Braga", "sporting braga": "Sp Braga", "braga": "Sp Braga",
    "fc famalicao": "Famalicao", "famalicão": "Famalicao",
    "vitoria guimaraes": "Guimaraes", "vitória guimarães": "Guimaraes", "vitoria sc": "Guimaraes", "guimarães": "Guimaraes",
    "gil vicente fc": "Gil Vicente",
    "estoril praia": "Estoril", "gd estoril praia": "Estoril",
    "moreirense fc": "Moreirense",
    "rio ave fc": "Rio Ave",
    "cd santa clara": "Santa Clara", "santa clara": "Santa Clara",
    "estrela amadora": "Estrela", "cf estrela amadora": "Estrela", "estrela da amadora": "Estrela",
    "casa pia ac": "Casa Pia", "casa pia": "Casa Pia",
    "cd nacional": "Nacional", "nacional": "Nacional",
    "cd tondela": "Tondela", "tondela": "Tondela",
    "fc alverca": "Alverca", "alverca": "Alverca",
    "fc arouca": "Arouca", "arouca": "Arouca",
    "avs futebol sad": "AVS", "avs": "AVS",
    // Spain
    "atletico madrid": "Ath Madrid", "atlético madrid": "Ath Madrid", "atlético de madrid": "Ath Madrid", "atletico de madrid": "Ath Madrid", "club atletico de madrid": "Ath Madrid",
    "athletic bilbao": "Ath Bilbao", "athletic club": "Ath Bilbao", "athletic club bilbao": "Ath Bilbao",
    "real betis": "Betis", "real betis balompie": "Betis",
    "celta vigo": "Celta", "rc celta": "Celta", "celta de vigo": "Celta",
    "real sociedad": "Sociedad",
    "rcd espanyol": "Espanol", "espanyol": "Espanol", "rcd español": "Espanol",
    "rayo vallecano": "Vallecano",
    "deportivo alaves": "Alaves", "deportivo alavés": "Alaves", "alavés": "Alaves",
    "real oviedo": "Oviedo", "oviedo": "Oviedo",
    "ud levante": "Levante", "levante ud": "Levante",
    "cf elche": "Elche", "elche cf": "Elche",
    "rcd mallorca": "Mallorca",
    "sevilla fc": "Sevilla",
    "villarreal cf": "Villarreal",
    "girona fc": "Girona",
    "getafe cf": "Getafe",
    "ca osasuna": "Osasuna", "osasuna": "Osasuna",
    "valencia cf": "Valencia",
    // England
    "manchester city": "Man City", "man city": "Man City",
    "manchester united": "Man United", "man united": "Man United", "manchester utd": "Man United", "man utd": "Man United",
    "nottingham forest": "Nott'm Forest", "nottm forest": "Nott'm Forest",
    "wolverhampton wanderers": "Wolves", "wolverhampton": "Wolves",
    "newcastle united": "Newcastle", "newcastle utd": "Newcastle",
    "aston villa": "Aston Villa",
    "crystal palace": "Crystal Palace",
    "west ham united": "West Ham", "west ham utd": "West Ham",
    "tottenham hotspur": "Tottenham", "tottenham": "Tottenham", "spurs": "Tottenham",
    "leeds united": "Leeds", "leeds utd": "Leeds",
    "brighton and hove albion": "Brighton", "brighton hove albion": "Brighton",
    "afc bournemouth": "Bournemouth",
    "burnley fc": "Burnley",
    "sunderland afc": "Sunderland",
    "brentford fc": "Brentford",
    "everton fc": "Everton",
    "fulham fc": "Fulham",
    "arsenal fc": "Arsenal",
    "chelsea fc": "Chelsea",
    "liverpool fc": "Liverpool"
  };

  function normalizeForMatch(name) {
    return String(name || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
  }

  function resolveTeamName(apiName, leagueTeams) {
    // 1. Try alias map (case-insensitive)
    const lower = String(apiName || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    if (ODDS_TEAM_ALIASES[lower]) return ODDS_TEAM_ALIASES[lower];

    // 2. Try normalized match against snapshot teams
    const n = normalizeForMatch(apiName);
    const exact = leagueTeams.find(t => normalizeForMatch(t.name) === n);
    if (exact) return exact.name;

    // 3. Try partial match
    const partial = leagueTeams.find(t => {
      const tn = normalizeForMatch(t.name);
      return (tn.includes(n) || n.includes(tn)) && Math.min(tn.length, n.length) >= 4;
    });
    if (partial) return partial.name;

    return apiName;
  }

  function findFixtureForOddsEvent(league, homeTeam, awayTeam) {
    const fixtures = Array.isArray(league.fixtures) ? league.fixtures : [];
    const resolvedHome = resolveTeamName(homeTeam, league.teams || []);
    const resolvedAway = resolveTeamName(awayTeam, league.teams || []);
    const hn = normalizeForMatch(resolvedHome);
    const an = normalizeForMatch(resolvedAway);
    return fixtures.find(f => {
      const fh = normalizeForMatch(f.homeTeam);
      const fa = normalizeForMatch(f.awayTeam);
      return (fh === hn || fh.includes(hn) || hn.includes(fh)) && (fa === an || fa.includes(an) || an.includes(fa));
    }) || null;
  }

  function findOrCreateFixture(league, event) {
    let fixture = findFixtureForOddsEvent(league, event.home_team, event.away_team);
    if (fixture) return fixture;

    const homeName = resolveTeamName(event.home_team, league.teams || []);
    const awayName = resolveTeamName(event.away_team, league.teams || []);
    const eventDate = event.commence_time ? new Date(event.commence_time) : new Date();
    const dateStr = `${String(eventDate.getDate()).padStart(2, "0")}/${String(eventDate.getMonth() + 1).padStart(2, "0")}/${eventDate.getFullYear()}`;
    const timeStr = `${String(eventDate.getHours()).padStart(2, "0")}:${String(eventDate.getMinutes()).padStart(2, "0")}`;

    fixture = {
      date: dateStr,
      time: timeStr,
      dateIso: eventDate.toISOString(),
      homeTeam: homeName,
      awayTeam: awayName,
      played: false,
      homeGoals: null,
      awayGoals: null,
      halfTimeHomeGoals: null,
      halfTimeAwayGoals: null,
      bookmakerOdds: {},
      oddsSource: "live",
      apiProvider: "The Odds API (ao vivo)"
    };

    if (!Array.isArray(league.fixtures)) league.fixtures = [];
    league.fixtures.push(fixture);
    return fixture;
  }

  function parseOddsFromEvent(event) {
    const bookmakerOdds = {};
    const hn = normalizeForMatch(event.home_team);
    const an = normalizeForMatch(event.away_team);

    for (const bm of event.bookmakers || []) {
      const entry = {
        key: (bm.key || "").toLowerCase(),
        name: bm.title || bm.key || "Bookmaker",
        home: null, draw: null, away: null, over25: null, under25: null,
        source: "odds-api-live",
        provider: "The Odds API (ao vivo)"
      };

      for (const market of bm.markets || []) {
        if (market.key === "h2h") {
          for (const o of market.outcomes || []) {
            const price = Number(o.price);
            if (!Number.isFinite(price) || price <= 1) continue;
            const oName = normalizeForMatch(o.name);
            if (oName === hn || oName.includes(hn) || hn.includes(oName)) entry.home = price;
            else if (oName === an || oName.includes(an) || an.includes(oName)) entry.away = price;
            else if (oName === "draw") entry.draw = price;
          }
        }
        if (market.key === "totals") {
          for (const o of market.outcomes || []) {
            const price = Number(o.price);
            if (!Number.isFinite(price) || price <= 1) continue;
            const point = Number(o.point);
            if (Math.abs((point || 2.5) - 2.5) < 0.01) {
              if (String(o.name).toLowerCase() === "over") entry.over25 = price;
              else entry.under25 = price;
            }
          }
        }
      }

      if ([entry.home, entry.draw, entry.away, entry.over25].some(v => v !== null)) {
        bookmakerOdds[entry.key] = entry;
      }
    }

    return bookmakerOdds;
  }

  async function fetchLiveOdds() {
    const apiKey = getStoredApiKey();
    if (!apiKey) {
      if (oddsApiStatus) oddsApiStatus.textContent = "Sem chave API configurada. Introduza a chave da The Odds API acima para ver odds ao vivo.";
      return;
    }

    if (oddsApiStatus) oddsApiStatus.textContent = "A buscar odds ao vivo para todas as ligas...";

    let totalMatched = 0;
    let totalCreated = 0;
    let totalEvents = 0;
    const matchedGames = [];
    const errors = [];

    for (const leagueKey of leagueKeys) {
      const sportKey = ODDS_API_SPORT_KEYS[leagueKey];
      if (!sportKey) continue;

      const league = snapshot.leagues[leagueKey];
      try {
        const url = `https://api.the-odds-api.com/v4/sports/${sportKey}/odds?apiKey=${encodeURIComponent(apiKey)}&regions=eu,uk&markets=h2h,totals&oddsFormat=decimal&dateFormat=iso`;
        const response = await fetch(url);

        if (!response.ok) {
          const errorText = response.status === 401 ? "Chave API inválida" : response.status === 429 ? "Limite de pedidos atingido" : `Erro ${response.status}`;
          errors.push(`${league.name}: ${errorText}`);
          continue;
        }

        const remaining = response.headers.get("x-requests-remaining");
        const events = await response.json();
        totalEvents += events.length;

        for (const event of events) {
          const existingFixture = findFixtureForOddsEvent(league, event.home_team, event.away_team);
          const fixture = existingFixture || findOrCreateFixture(league, event);
          const isNew = !existingFixture;
          if (isNew) totalCreated++;

          const oddsData = parseOddsFromEvent(event);
          const oddsCount = Object.keys(oddsData).length;
          fixture.bookmakerOdds = { ...(fixture.bookmakerOdds || {}), ...oddsData };
          fixture.oddsSource = "live";
          fixture.apiProvider = "The Odds API (ao vivo)";
          fixture.lastOddsUpdate = new Date().toISOString();
          totalMatched++;

          matchedGames.push(`${fixture.homeTeam} vs ${fixture.awayTeam} (${oddsCount} casas${isNew ? ", novo" : ""})`);
        }

        if (remaining) {
          const rem = Number(remaining);
          if (rem < 100) {
            errors.push(`Restam ${rem} pedidos na API`);
          }
        }
      } catch (error) {
        errors.push(`${league.name}: ${error.message}`);
      }
    }

    if (oddsApiStatus) {
      const lines = [];
      if (totalMatched > 0) {
        lines.push(`✅ ${totalMatched} jogos com odds ao vivo (${totalCreated} novos) de ${totalEvents} eventos.`);
        lines.push(`Jogos: ${matchedGames.join(" | ")}`);
      } else if (totalEvents === 0) {
        lines.push(`⚠️ A API não devolveu jogos para nenhuma liga. Pode não haver jogos agendados de momento.`);
      } else {
        lines.push(`⚠️ ${totalEvents} eventos da API mas 0 jogos correspondidos. Possível problema de matching de nomes.`);
      }
      lines.push(`Atualizado às ${new Date().toLocaleTimeString("pt-PT")}.`);
      if (errors.length) lines.push(`Erros: ${errors.join("; ")}`);
      oddsApiStatus.innerHTML = lines.join("<br>");
    }

    // Refresh team selectors and prediction with new fixtures
    populateTeamOptions();
    renderPrediction();
  }

  if (saveApiKeyButton) {
    saveApiKeyButton.addEventListener("click", () => {
      const key = oddsApiKeyInput?.value || "";
      setStoredApiKey(key);
      if (oddsApiStatus) oddsApiStatus.textContent = key ? "Chave guardada. A buscar odds..." : "Chave removida.";
      if (key) fetchLiveOdds();
    });
  }

  if (clearApiKeyButton) {
    clearApiKeyButton.addEventListener("click", () => {
      setStoredApiKey("");
      if (oddsApiKeyInput) oddsApiKeyInput.value = "";
      if (oddsApiStatus) oddsApiStatus.textContent = "Chave removida.";
    });
  }

  if (fetchOddsNowButton) {
    fetchOddsNowButton.addEventListener("click", fetchLiveOdds);
  }

  // Restore saved key and auto-fetch on load
  if (oddsApiKeyInput) {
    const savedKey = getStoredApiKey();
    if (savedKey) {
      oddsApiKeyInput.value = savedKey;
    }
  }

  populateLeagueOptions();
  populateTeamOptions();
  refreshDataStatus();
  renderPrediction();

  // Auto-fetch odds on page load if key exists
  if (getStoredApiKey()) {
    fetchLiveOdds();
  }
})();
