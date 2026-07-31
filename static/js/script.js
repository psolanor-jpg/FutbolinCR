let careerData = {
    matchesPlayed: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsScored: 0,
    goalsConceded: 0
};

function loadCareerData() {
    const saved = localStorage.getItem('careerData');
    if (saved) {
        careerData = JSON.parse(saved);
    }
    updateCareerUI();
}

function saveCareerData() {
    localStorage.setItem('careerData', JSON.stringify(careerData));
    updateCareerUI();
}

function updateCareerUI() {
    const matchesEl = document.getElementById('stat-matches');
    const recordEl = document.getElementById('stat-record');
    const goalsEl = document.getElementById('stat-goals');

    if (matchesEl) matchesEl.innerText = careerData.matchesPlayed;
    if (recordEl) recordEl.innerText = `${careerData.wins}G - ${careerData.draws}E - ${careerData.losses}P`;
    if (goalsEl) goalsEl.innerText = `${careerData.goalsScored}:${careerData.goalsConceded}`;
}


function showView(viewId) {
    const views = document.querySelectorAll('.view');
    views.forEach(v => v.classList.remove('active'));
    
    const target = document.getElementById(viewId);
    if (target) {
        target.classList.add('active');
    }
}


document.addEventListener('DOMContentLoaded', () => {
    loadCareerData();

    const btnStartCareer = document.getElementById('btn-start-career');
    const btnGoMatch = document.getElementById('btn-go-match');
    const btnBackHub = document.getElementById('btn-back-hub');
    const btnExitCareer = document.getElementById('btn-exit-career');

    if (btnStartCareer) btnStartCareer.addEventListener('click', () => showView('career-hub-view'));
    if (btnGoMatch) btnGoMatch.addEventListener('click', () => showView('match-preview-view'));
    if (btnBackHub) btnBackHub.addEventListener('click', () => showView('career-hub-view'));
    if (btnExitCareer) btnExitCareer.addEventListener('click', () => showView('main-menu-view'));
    

    initPlayers();
    drawPitch();
    drawPlayers();
    drawBall();
});



const canvas = document.getElementById('footballPitch');
const ctx = canvas.getContext('2d');

let isMatchRunning = false;
let isKickoffPhase = false;
let kickoffTeam = 'home';
let scoreHome = 0;
let scoreAway = 0;
let timeRemaining = 120;
let timerInterval = null;

let teamPassCount = 0; 

let ball = { 
    x: 450, y: 275, 
    vx: 0, vy: 0, 
    curveX: 0, curveY: 0, 
    radius: 4, 
    holder: null, 
    passCooldown: 0 
};
let holdTimer = 0;

const formation433Home = [
    { num: '1', role: 'PO', x: 45, y: 275 },
    { num: '2', role: 'DEF', x: 160, y: 80 },
    { num: '4', role: 'DEF', x: 140, y: 210 },
    { num: '5', role: 'DEF', x: 140, y: 340 },
    { num: '3', role: 'DEF', x: 160, y: 470 },
    { num: '6', role: 'MED', x: 260, y: 275 },
    { num: '8', role: 'MED', x: 310, y: 160 },
    { num: '10', role: 'MED', x: 310, y: 390 },
    { num: '7', role: 'DEL', x: 410, y: 110 },
    { num: '9', role: 'DEL', x: 430, y: 275 },
    { num: '11', role: 'DEL', x: 410, y: 440 }
];

const formation433Away = [
    { num: '1', role: 'PO', x: 855, y: 275 },
    { num: '2', role: 'DEF', x: 740, y: 470 },
    { num: '4', role: 'DEF', x: 760, y: 340 },
    { num: '5', role: 'DEF', x: 760, y: 210 },
    { num: '3', role: 'DEF', x: 740, y: 80 },
    { num: '6', role: 'MED', x: 640, y: 275 },
    { num: '8', role: 'MED', x: 590, y: 390 },
    { num: '10', role: 'MED', x: 590, y: 160 },
    { num: '7', role: 'DEL', x: 490, y: 440 },
    { num: '9', role: 'DEL', x: 470, y: 275 },
    { num: '11', role: 'DEL', x: 490, y: 110 }
];

let players = [];

function initPlayers() {
    players = [];
    const createPlayer = (p, team, color) => ({
        id: (team === 'home' ? 'H' : 'A') + p.num,
        team: team,
        number: p.num,
        role: p.role,
        baseX: p.x,
        baseY: p.y,
        x: p.x,
        y: p.y,
        radius: p.role === 'PO' ? 7.5 : 9, 
        color: color,
        baseSpeed: p.role === 'PO' ? 0.65 : (0.9 + Math.random() * 0.25),
        energy: 100,
        maxEnergy: 100,
        isExhausted: false,
        decisionTimer: Math.floor(Math.random() * 20),
        personalOffsetX: (Math.random() - 0.5) * 20,
        personalOffsetY: (Math.random() - 0.5) * 20,
        targetX: p.x,
        targetY: p.y,
        recoveredTimer: 0,
        stunnedTimer: 0,
        isTackling: false
    });

    formation433Home.forEach(p => players.push(createPlayer(p, 'home', '#ef4444')));
    formation433Away.forEach(p => players.push(createPlayer(p, 'away', '#3b82f6')));
}

function resetPlayersAndPositions() {
    players.forEach(p => {
        p.x = p.baseX;
        p.y = p.baseY;
        p.targetX = p.baseX;
        p.targetY = p.baseY;
        p.energy = p.maxEnergy;
        p.isExhausted = false;
        p.recoveredTimer = 0;
        p.stunnedTimer = 0;
        p.isTackling = false;
    });

    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.vx = 0;
    ball.vy = 0;
    ball.curveX = 0;
    ball.curveY = 0;
    ball.holder = null;

    drawPitch();
    drawPlayers();
    drawBall();
}

function drawPitch() {
    ctx.fillStyle = '#2e7d32';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(15, 15, canvas.width - 30, canvas.height - 30);

    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 15);
    ctx.lineTo(canvas.width / 2, canvas.height - 15);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 60, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeRect(15, 140, 110, 270);
    ctx.strokeRect(canvas.width - 125, 140, 110, 270);

    // Marcos de gol
    ctx.fillStyle = '#1e5323';
    ctx.fillRect(2, 215, 13, 120);
    ctx.strokeRect(2, 215, 13, 120);

    ctx.fillRect(canvas.width - 15, 215, 13, 120);
    ctx.strokeRect(canvas.width - 15, 215, 13, 120);
}

function drawPlayers() {
    players.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        
        ctx.fillStyle = p.stunnedTimer > 0 ? '#fbbf24' : (p.recoveredTimer > 0 ? '#9ca3af' : p.color);
        ctx.fill();
        ctx.strokeStyle = p.isExhausted ? '#ef4444' : (p.isTackling ? '#f59e0b' : '#ffffff');
        ctx.lineWidth = (p.isTackling || p.isExhausted || p.stunnedTimer > 0) ? 2.5 : 1.2;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 8px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.number, p.x, p.y);

        let staminaRatio = p.energy / p.maxEnergy;
        ctx.fillStyle = p.isExhausted ? '#ef4444' : (staminaRatio > 0.5 ? '#10b981' : '#f59e0b');
        ctx.fillRect(p.x - 8, p.y - 14, 16 * staminaRatio, 2);
    });
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.stroke();
}

function setupKickoffFormation(teamWhoKicks) {
    isKickoffPhase = true;
    teamPassCount = 0;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.vx = 0;
    ball.vy = 0;
    ball.curveX = 0;
    ball.curveY = 0;
    ball.holder = null;

    players.forEach(p => {
        p.x = p.baseX;
        p.y = p.baseY;
        p.targetX = p.baseX;
        p.targetY = p.baseY;
        p.recoveredTimer = 0;
        p.stunnedTimer = 0;
    });

    let taker = players.find(p => p.team === teamWhoKicks && p.number === '9');
    if (taker) {
        taker.x = canvas.width / 2 - (teamWhoKicks === 'home' ? 8 : -8);
        taker.y = canvas.height / 2;
        ball.holder = taker;
    }

    drawPitch();
    drawPlayers();
    drawBall();
}

function performInitialPass() {
    isKickoffPhase = false;
    if (!ball.holder) return;

    let kicker = ball.holder;
    let targetCentral = players.find(p => p.team === kicker.team && (p.number === '6' || p.number === '8'));

    ball.holder = null;
    ball.passCooldown = 15;

    let targetX = targetCentral ? targetCentral.x : (kicker.team === 'home' ? 260 : 640);
    let targetY = targetCentral ? targetCentral.y : 275;

    let angle = Math.atan2(targetY - kicker.y, targetX - kicker.x);
    ball.vx = Math.cos(angle) * 3.5;
    ball.vy = Math.sin(angle) * 3.5;
}

function enforcePitchBounds() {
    let minX = 24, maxX = canvas.width - 24;
    let minY = 24, maxY = canvas.height - 24;

    players.forEach(p => {
        if (p.role === 'PO') {
            let poMinX = p.team === 'home' ? 24 : canvas.width - 116;
            let poMaxX = p.team === 'home' ? 116 : canvas.width - 24;
            p.x = Math.max(poMinX, Math.min(poMaxX, p.x));
            p.y = Math.max(149, Math.min(401, p.y));
        } else {
            p.x = Math.max(minX, Math.min(maxX, p.x));
            p.y = Math.max(minY, Math.min(maxY, p.y));
        }
    });
}

function handleCollisions() {
    for (let i = 0; i < players.length; i++) {
        for (let j = i + 1; j < players.length; j++) {
            let p1 = players[i], p2 = players[j];
            let dx = p2.x - p1.x, dy = p2.y - p1.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            let minDist = p1.radius + p2.radius + 3;

            if (dist < minDist && dist > 0) {
                let overlap = minDist - dist;
                let nx = dx / dist, ny = dy / dist;
                p1.x -= nx * (overlap / 2);
                p1.y -= ny * (overlap / 2);
                p2.x += nx * (overlap / 2);
                p2.y += ny * (overlap / 2);
            }
        }
    }
}

function isPassLineBlocked(fromP, toP) {
    let opponents = players.filter(p => p.team !== fromP.team);
    for (let opp of opponents) {
        let distToLine = distanceToSegment({ x: opp.x, y: opp.y }, { x: fromP.x, y: fromP.y }, { x: toP.x, y: toP.y });
        if (distToLine < 18) return true;
    }
    return false;
}

function distanceToSegment(p, v, w) {
    let l2 = Math.pow(v.x - w.x, 2) + Math.pow(v.y - w.y, 2);
    if (l2 === 0) return Math.sqrt(Math.pow(p.x - v.x, 2) + Math.pow(p.y - v.y, 2));
    let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.sqrt(Math.pow(p.x - (v.x + t * (w.x - v.x)), 2) + Math.pow(p.y - (v.y + t * (w.y - v.y)), 2));
}

function getClosestPlayer(team) {
    let closest = null, minDist = Infinity;
    players.filter(p => p.team === team && p.recoveredTimer === 0 && p.stunnedTimer === 0).forEach(p => {
        let dist = Math.hypot(ball.x - p.x, ball.y - p.y);
        if (dist < minDist) {
            minDist = dist;
            closest = p;
        }
    });
    return closest;
}

function resetAfterGoal() {
    kickoffTeam = kickoffTeam === 'home' ? 'away' : 'home';
    setupKickoffFormation(kickoffTeam);
    setTimeout(() => performInitialPass(), 1200);
}

function checkGoals() {
    let isGoalHeight = (ball.y >= 215 && ball.y <= 335);

    if (ball.x <= 15 && isGoalHeight) {
        scoreAway++;
        const awayScoreEl = document.querySelector('#team-away span');
        if (awayScoreEl) awayScoreEl.innerText = scoreAway;
        resetAfterGoal();
    } 
    else if (ball.x >= canvas.width - 15 && isGoalHeight) {
        scoreHome++;
        const homeScoreEl = document.querySelector('#team-home span');
        if (homeScoreEl) homeScoreEl.innerText = scoreHome;
        resetAfterGoal();
    }
}

function updateAI() {
    if (isKickoffPhase) return;

    if (ball.passCooldown > 0) ball.passCooldown--;

    let homeChaser = getClosestPlayer('home');
    let awayChaser = getClosestPlayer('away');

    players.forEach((p, index) => {
        if (p.recoveredTimer > 0) {
            p.recoveredTimer--;
            return;
        }

        if (p.stunnedTimer > 0) {
            p.stunnedTimer--;
        }

        if (p.energy <= 0) p.isExhausted = true;
        if (p.isExhausted) {
            p.energy += 0.08;
            if (p.energy >= 40) p.isExhausted = false;
        }

        let isChaser = (p === homeChaser || p === awayChaser);
        let distToBall = Math.hypot(ball.x - p.x, ball.y - p.y);
        
        let staminaRatio = p.energy / p.maxEnergy;
        let currentSpeed = p.stunnedTimer > 0 
            ? p.baseSpeed * 0.25 
            : (p.isExhausted ? p.baseSpeed * 0.45 : p.baseSpeed * (0.65 + staminaRatio * 0.35));

        let catchRadius = (p.role === 'PO' ? p.radius + 1 : p.radius + ball.radius + 2);
        if (distToBall < catchRadius && !ball.holder && ball.passCooldown === 0) {
            if (p.role === 'PO' && Math.hypot(ball.vx, ball.vy) > 3.0) {
                p.stunnedTimer = 90; 
            }

            if (ball.holder && ball.holder.team !== p.team) {
                teamPassCount = 0; 
            }
            ball.holder = p;
            holdTimer = 0;
            ball.curveX = 0;
            ball.curveY = 0;
        }

        if (ball.holder && ball.holder !== p && p.team !== ball.holder.team) {
            let holder = ball.holder;
            let distToHolder = Math.hypot(holder.x - p.x, holder.y - p.y);
            let isDefensiveArea = p.team === 'home' ? holder.x < 350 : holder.x > 550;
            
            if (p.role === 'DEF' && isDefensiveArea && distToHolder < 130 && !isChaser) {
                p.targetX = holder.x;
                p.targetY = holder.y;
            }

            if (distToHolder < 26) {
                p.isTackling = true;
                if (Math.random() < 0.12) {
                    let dribbleSkill = holder.role === 'DEL' ? 0.60 : 0.35;
                    
                    if (Math.random() < dribbleSkill) {
                        holder.y += (Math.random() < 0.5 ? 20 : -20);
                        holder.x += (holder.team === 'home' ? 20 : -20);
                        p.recoveredTimer = 40;
                        p.isTackling = false;
                    } else {
                        ball.holder = p;
                        ball.passCooldown = 15;
                        holdTimer = 0;
                        teamPassCount = 0;
                        p.isTackling = false;
                    }
                }
            } else {
                p.isTackling = false;
            }
        }

        if (ball.holder === p) {
            if (!p.isExhausted) p.energy = Math.max(0, p.energy - 0.08);
            holdTimer++;

            let targetGoalX = p.team === 'home' ? canvas.width - 15 : 15;
            let enemyKeeper = players.find(k => k.team !== p.team && k.role === 'PO');
            let dirX = p.team === 'home' ? 1 : -1;

            p.x += dirX * (currentSpeed * 0.6);
            ball.x = p.x + (dirX * 7);
            ball.y = p.y;

            let distToGoal = Math.abs(targetGoalX - p.x);
            let teammates = players.filter(t => t.team === p.team && t !== p && t.role !== 'PO' && t.recoveredTimer === 0);

            if (p.isExhausted) {
                let nearbyTeammate = teammates.find(t => Math.hypot(t.x - p.x, t.y - p.y) < 130 && !isPassLineBlocked(p, t));
                if (nearbyTeammate) {
                    ball.holder = null;
                    ball.passCooldown = 15;
                    teamPassCount++;
                    let angle = Math.atan2(nearbyTeammate.y - p.y, nearbyTeammate.x - p.x);
                    ball.vx = Math.cos(angle) * 4.5;
                    ball.vy = Math.sin(angle) * 4.5;
                    return;
                }
            }

            if (teamPassCount >= 4 && distToGoal < 300) {
                if (Math.random() < 0.05) {
                    ball.holder = null;
                    ball.passCooldown = 20;

                    let enemy = players.find(e => e.team !== p.team && Math.hypot(e.x - p.x, e.y - p.y) < 100);
                    if (enemy && Math.random() < 0.6) {
                        let angle = Math.atan2(enemy.y - p.y, enemy.x - p.x);
                        ball.vx = Math.cos(angle) * 3.0;
                        ball.vy = Math.sin(angle) * 3.0;
                        teamPassCount = 0;
                    } else {
                        let angle = Math.atan2(275 - p.y, targetGoalX - p.x);
                        ball.vx = Math.cos(angle) * 8.5;
                        ball.vy = Math.sin(angle) * 8.5;
                    }
                    return;
                }
            }

            if (distToGoal < 260) {
                let wellPositionedPartner = teammates.find(t => 
                    (p.team === 'home' ? t.x > p.x - 10 : t.x < p.x + 10) && 
                    Math.abs(t.y - 275) < 140 && !isPassLineBlocked(p, t)
                );

                if (wellPositionedPartner && Math.random() < 0.25) {
                    ball.holder = null;
                    ball.passCooldown = 18;
                    teamPassCount++;
                    let angle = Math.atan2(wellPositionedPartner.y - p.y, wellPositionedPartner.x - p.x);
                    ball.vx = Math.cos(angle) * 5.2;
                    ball.vy = Math.sin(angle) * 5.2;
                } else if (Math.random() < 0.08 || distToGoal < 160) {
                    ball.holder = null;
                    ball.passCooldown = 25;
                    teamPassCount = 0;

                    let targetY = 275;
                    if (enemyKeeper) {
                        targetY = enemyKeeper.y > 275 ? 220 + Math.random() * 30 : 300 + Math.random() * 30;
                    } else {
                        targetY = Math.random() < 0.5 ? 220 : 330;
                    }

                    let angle = Math.atan2(targetY - p.y, targetGoalX - p.x);
                    let shotPower = 7.5 + Math.random() * 2.5;

                    if (Math.random() < 0.4) {
                        ball.curveY = (p.y > 275 ? -1 : 1) * (0.15 + Math.random() * 0.1);
                    }

                    ball.vx = Math.cos(angle) * shotPower;
                    ball.vy = Math.sin(angle) * shotPower;

                    if (enemyKeeper && Math.random() < 0.75) {
                        enemyKeeper.targetY = targetY;
                    }
                }
            } 
            else if (teammates.length > 0 && Math.random() < 0.04) {
                let clearOptions = teammates.filter(t => !isPassLineBlocked(p, t));
                if (clearOptions.length > 0) {
                    let partner = clearOptions[Math.floor(Math.random() * clearOptions.length)];
                    ball.holder = null;
                    ball.passCooldown = 18;
                    teamPassCount++;

                    let angle = Math.atan2(partner.y - p.y, partner.x - p.x);
                    let dist = Math.hypot(partner.x - p.x, partner.y - p.y);
                    ball.vx = Math.cos(angle) * Math.min(7.0, Math.max(4.0, dist * 0.04));
                    ball.vy = Math.sin(angle) * Math.min(7.0, Math.max(4.0, dist * 0.04));
                }
            }
        } 
        else if (isChaser && !ball.holder) {
            if (!p.isExhausted) p.energy = Math.max(0, p.energy - 0.05);

            let dx = ball.x - p.x, dy = ball.y - p.y;
            let dist = Math.hypot(dx, dy);
            if (dist > 2) {
                p.x += (dx / dist) * (currentSpeed * 1.25);
                p.y += (dy / dist) * (currentSpeed * 1.25);
            }
        } 
        else {
            p.decisionTimer++;

            let decisionThreshold = 12 + (index % 7) * 4; 

            if (p.decisionTimer > decisionThreshold) {
                p.decisionTimer = 0;

                let isMyTeamInPossession = ball.holder && ball.holder.team === p.team;
                let isBallInMyHalf = p.team === 'home' ? ball.x < 450 : ball.x > 450;
                
                let zoneX = p.baseX;
                let zoneY = p.baseY;

                if (isMyTeamInPossession) {
                    let advance = p.team === 'home' ? 140 : -140;
                    zoneX += advance;

                    if (Math.abs(ball.y - p.baseY) < 60) {
                        zoneY += (p.number % 2 === 0 ? 45 : -45);
                    }
                } else if (isBallInMyHalf) {
                    let retreat = p.team === 'home' ? -20 : 20;
                    zoneX += retreat;
                    zoneY += (ball.y - 275) * 0.35;
                } else {
                    zoneX += (p.team === 'home' ? 40 : -40);
                }

                let sameTeamPlayers = players.filter(other => other.team === p.team && other !== p && other.role === p.role);
                sameTeamPlayers.forEach(other => {
                    if (Math.abs(other.targetY - zoneY) < 30) {
                        zoneY += (p.number > other.number ? 35 : -35);
                    }
                });

                p.personalOffsetX = (Math.sin(Date.now() * 0.003 + index) * 20);
                p.personalOffsetY = (Math.cos(Date.now() * 0.003 + index) * 20);

                p.targetX = zoneX + p.personalOffsetX;
                p.targetY = Math.max(35, Math.min(canvas.height - 35, zoneY + p.personalOffsetY));
            }

            let dx = p.targetX - p.x;
            let dy = p.targetY - p.y;
            let dist = Math.hypot(dx, dy);

            if (dist > 4) {
                p.x += (dx / dist) * (currentSpeed * 0.55);
                p.y += (dy / dist) * (currentSpeed * 0.55);
            } else {
                if (p.energy < p.maxEnergy) p.energy += 0.06;
            }
        }
    });

    if (!ball.holder) {
        ball.x += ball.vx;
        ball.y += ball.vy;

        ball.vx += ball.curveX;
        ball.vy += ball.curveY;

        ball.vx *= 0.97;
        ball.vy *= 0.97;
        ball.curveX *= 0.88;
        ball.curveY *= 0.88;

        let isAtGoalHeight = (ball.y >= 215 && ball.y <= 335);

        if (!isAtGoalHeight) {
            if (ball.x <= 15 || ball.x >= canvas.width - 15) { 
                ball.vx *= -0.8; 
                ball.curveX = 0; 
                ball.x = ball.x <= 15 ? 16 : canvas.width - 16;
            }
        } else {
            if (ball.x <= 4 || ball.x >= canvas.width - 4) { 
                ball.vx *= -0.2; 
                ball.curveX = 0; 
            }
        }

        if (Math.abs(ball.y - 215) < 5 || Math.abs(ball.y - 335) < 5) {
            if (Math.abs(ball.x - 15) < 5 || Math.abs(ball.x - (canvas.width - 15)) < 5) {
                ball.vx *= -0.85;
                ball.vy *= -0.85;
            }
        }

        if (ball.y <= 15 || ball.y >= canvas.height - 15) { 
            ball.vy *= -0.8; 
            ball.curveY = 0; 
            ball.y = ball.y <= 15 ? 16 : canvas.height - 16;
        }
    }
}

function updateTimer() {
    if (isKickoffPhase) return;

    let minutes = Math.floor(timeRemaining / 60);
    let seconds = timeRemaining % 60;
    const timerEl = document.getElementById('match-timer');
    if (timerEl) {
        timerEl.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    if (timeRemaining <= 0) {
        clearInterval(timerInterval);
        isMatchRunning = false;
        
        // Actualizar estadísticas acumuladas en el Modo Carrera
        careerData.matchesPlayed++;
        careerData.goalsScored += scoreHome;
        careerData.goalsConceded += scoreAway;

        if (scoreHome > scoreAway) {
            careerData.wins++;
        } else if (scoreHome === scoreAway) {
            careerData.draws++;
        } else {
            careerData.losses++;
        }

        saveCareerData();
        resetPlayersAndPositions();

        alert(`¡Final del Partido! Resultado: LOCAL ${scoreHome} - ${scoreAway} VISITANTE`);
        
        // Regresar automáticamente al Modo Carrera tras finalizar el juego
        showView('career-hub-view');
    } else {
        timeRemaining--;
    }
}

function updateMatch() {
    if (!isMatchRunning) return;

    updateAI();
    handleCollisions();
    enforcePitchBounds();
    checkGoals();

    drawPitch();
    drawPlayers();
    drawBall();

    requestAnimationFrame(updateMatch);
}

/* ==========================================
   4. EVENTOS DE SORTEO Y COMIENZO DE PARTIDO
   ========================================== */

// 1. Mostrar Modal y preparar partido
const btnStartMatch = document.getElementById('btn-start-match');
if (btnStartMatch) {
    btnStartMatch.addEventListener('click', () => {
        showView('match-view'); // Transición a la cancha
        if (!isMatchRunning) {
            scoreHome = 0;
            scoreAway = 0;
            
            const homeScoreEl = document.querySelector('#team-home span');
            const awayScoreEl = document.querySelector('#team-away span');
            if (homeScoreEl) homeScoreEl.innerText = '0';
            if (awayScoreEl) awayScoreEl.innerText = '0';
            
            timeRemaining = 120;

            resetPlayersAndPositions();

            const modal = document.getElementById('coin-toss-modal');
            const coin = document.getElementById('coin');
            const resultText = document.getElementById('toss-result');
            const spinBtn = document.getElementById('btn-spin-coin');

            if (modal) modal.style.display = 'flex';
            if (resultText) resultText.innerText = "Presioná el botón para sortear el saque";
            if (coin) coin.style.transform = 'rotateY(0deg)';
            if (spinBtn) spinBtn.style.display = 'block';
        }
    });
}

// 2. Girar Moneda y comenzar bucle de juego
const btnSpinCoin = document.getElementById('btn-spin-coin');
if (btnSpinCoin) {
    btnSpinCoin.addEventListener('click', function() {
        const coin = document.getElementById('coin');
        const resultText = document.getElementById('toss-result');
        const modal = document.getElementById('coin-toss-modal');

        this.style.display = 'none';
        if (resultText) resultText.innerText = "¡Girando moneda...";

        let winner = Math.random() < 0.5 ? 'home' : 'away';
        kickoffTeam = winner;

        let rotations = winner === 'home' ? 1800 : 1980;
        if (coin) coin.style.transform = `rotateY(${rotations}deg)`;

        setTimeout(() => {
            let teamName = winner === 'home' ? 'LOCAL (Rojo)' : 'VISITANTE (Azul)';
            if (resultText) resultText.innerText = `¡Gana el saque: ${teamName}!`;
        }, 2000);

        setTimeout(() => {
            if (modal) modal.style.display = 'none';
            setupKickoffFormation(kickoffTeam);
            isMatchRunning = true;
            requestAnimationFrame(updateMatch);

            setTimeout(() => {
                performInitialPass();
                if (timerInterval) clearInterval(timerInterval);
                timerInterval = setInterval(updateTimer, 1000);
            }, 1000);

        }, 3500);
    });
}

function tomarDecision(opcion) {
    alert("Tomaste la decisión: " + opcion);
}