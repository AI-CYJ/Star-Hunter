(function () {
    const VERB_ALIASES = {
        zh: {
            help: ['帮助', '命令', '指令'],
            inventory: ['背包', '物品'],
            objective: ['目标', '任务', '进度'],
            look: ['查看', '观察', '检查', '看'],
            go: ['前往', '移动', '进入', '去', '走'],
            talk: ['对话', '交谈', '询问', '聊天', '问'],
            take: ['拾取', '拿起', '获取', '拿'],
            use: ['使用', '连接', '安装', '插入', '交给', '用']
        },
        en: {
            help: ['help'],
            inventory: ['inventory', 'inv', 'i'],
            objective: ['objective', 'obj'],
            look: ['look', 'inspect', 'examine'],
            go: ['go', 'move', 'enter'],
            talk: ['talk', 'speak', 'chat', 'ask'],
            take: ['take', 'grab', 'pick'],
            use: ['use', 'connect', 'attach', 'insert', 'give']
        }
    };

    const USE_CONNECTORS = {
        zh: ['交给', '连接到', '安装到', '插入到', '插入', '安装', '连接', '给', '对', '在'],
        en: ['onto', 'with', 'into', 'to', 'on']
    };

    const ENGINE_TEXT = {
        zh: {
            missionBlocked: '条件还没满足，现在还不能出发。',
            lookMissingTarget: '你看了看，却没找到这个目标。试试查看当前房间里真正存在的东西。',
            goMissingTarget: '你想去哪里？可以输入“前往主控台”或“前往机库连桥”。',
            goNoExit: '这里没有这条路。你可以先查看房间里的可前往地点。',
            goBlocked: '现在还过不去，条件似乎还不够。',
            takeMissingTarget: '你想拿什么？',
            takeNoItem: '这里没有能让你拿走的这个东西。',
            takeCant: function (params) { return `${params.name}并不是能直接带走的东西。`; },
            takeDone: function (params) { return `你收起了${params.name}。`; },
            talkMissingTarget: '你想和谁对话？',
            talkNoTarget: '对方不在这里，或者你还没有找到能回应你的人。',
            talkNoNew: function (params) { return `${params.name}暂时没有新的回应。`; },
            talkDefault: function (params) { return `${params.name}点了点头。`; },
            useMissingItem: '你打算使用什么？',
            useNoItem: '你手里没有这个物件，也没在周围看到它。',
            useNotOwned: function (params) { return `你还没有拿到${params.name}。`; },
            useNoPair: function (params) {
                return params.target
                    ? `${params.item}和${params.target}之间暂时没有可执行的配合。`
                    : `${params.item}暂时没有明确的使用对象。可以试试“使用${params.item}在某个目标”。`;
            },
            useTooEarly: '现在还不是使用它的正确时机。',
            commandEmpty: '请输入命令，例如“查看主控台”或“对话烬行”。',
            help: '可用命令：查看、前往、对话、拿、使用、背包、目标。\n示例：查看主控终端 / 前往机库连桥 / 对话烬行 / 使用解码片在主控终端。',
            inventoryEmpty: '你的随身物品栏还是空的。',
            inventoryList: function (params) { return `你现在携带：${params.items}。`; },
            objectiveEmpty: '当前没有明确目标。',
            unknownCommand: '系统没能理解这条指令。可以输入“帮助”查看当前支持的命令格式。',
            exitLead: function (params) { return `从这里可以前往${params.name}。`; },
            exitLeadId: function (params) { return `这条路通往 ${params.id}。`; },
            actorWaiting: function (params) { return `${params.name}正等着你开口。`; },
            itemWaiting: function (params) { return `${params.name}静静躺在那里。`; }
        },
        en: {
            missionBlocked: 'The conditions are not ready yet. You cannot set out right now.',
            lookMissingTarget: 'You look around, but you cannot find that target here. Try looking at something that actually exists in the room.',
            goMissingTarget: 'Where do you want to go? Try something like “go main console” or “go hangar bridge”.',
            goNoExit: 'There is no route by that name here. Check the available exits first.',
            goBlocked: 'You still cannot go there. Something is missing.',
            takeMissingTarget: 'What do you want to take?',
            takeNoItem: 'There is nothing here by that name that you can take.',
            takeCant: function (params) { return `${params.name} is not something you can simply carry away.`; },
            takeDone: function (params) { return `You take ${params.name}.`; },
            talkMissingTarget: 'Who do you want to talk to?',
            talkNoTarget: 'That person is not here, or you have not found anyone who can answer you yet.',
            talkNoNew: function (params) { return `${params.name} has nothing new to say right now.`; },
            talkDefault: function (params) { return `${params.name} gives a small nod.`; },
            useMissingItem: 'What are you trying to use?',
            useNoItem: 'You do not have that item, and you cannot see it nearby either.',
            useNotOwned: function (params) { return `You have not obtained ${params.name} yet.`; },
            useNoPair: function (params) {
                return params.target
                    ? `${params.item} cannot be meaningfully used with ${params.target} right now.`
                    : `${params.item} does not have a clear target yet. Try something like “use ${params.item} on a target”.`;
            },
            useTooEarly: 'This is not the right moment to use that yet.',
            commandEmpty: 'Enter a command, for example “look main console” or “talk jinxing”.',
            help: 'Available commands: look, go, talk, take, use, inventory, objective, help.\nExamples: look main console / go hangar bridge / talk jinxing / use decoder chip on main console.',
            inventoryEmpty: 'Your inventory is currently empty.',
            inventoryList: function (params) { return `You are carrying: ${params.items}.`; },
            objectiveEmpty: 'There is no clear objective at the moment.',
            unknownCommand: 'The system could not understand that command. Type “help” to see the supported command format.',
            exitLead: function (params) { return `You can go to ${params.name} from here.`; },
            exitLeadId: function (params) { return `This route leads to ${params.id}.`; },
            actorWaiting: function (params) { return `${params.name} seems ready to answer.`; },
            itemWaiting: function (params) { return `${params.name} is resting here quietly.`; }
        }
    };

    function uniqueList(list) {
        return Array.from(new Set((list || []).filter(Boolean)));
    }

    function normalizeText(text) {
        return String(text || '')
            .trim()
            .replace(/[，。！？、,.!?:：；;（()）“”"'‘’]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function normalizeKey(text) {
        return normalizeText(text).toLowerCase().replace(/\s+/g, '');
    }

    function resolveLocale(locale) {
        return locale === 'en' ? 'en' : 'zh';
    }

    function engineText(locale, key, params) {
        const bundle = ENGINE_TEXT[resolveLocale(locale)] || ENGINE_TEXT.zh;
        const entry = bundle[key];
        return typeof entry === 'function' ? entry(params || {}) : entry;
    }

    function cloneLog(log) {
        return Array.isArray(log) ? log.map(function (entry) {
            return Object.assign({}, entry);
        }) : [];
    }

    function createBaseSession(adventure) {
        return {
            adventureId: adventure.id,
            roomId: adventure.startRoomId,
            inventory: [],
            worldFlags: {},
            turnCount: 0,
            visitedRooms: {},
            log: [],
            completed: false
        };
    }

    function mergeSession(base, saved) {
        const merged = Object.assign({}, base, saved || {});
        merged.inventory = uniqueList([].concat(base.inventory, saved && saved.inventory));
        merged.worldFlags = Object.assign({}, base.worldFlags, saved && saved.worldFlags);
        merged.visitedRooms = Object.assign({}, base.visitedRooms, saved && saved.visitedRooms);
        merged.log = cloneLog(saved && saved.log);
        merged.turnCount = typeof merged.turnCount === 'number' ? merged.turnCount : 0;
        merged.completed = !!merged.completed;
        if (!merged.roomId) merged.roomId = base.roomId;
        return merged;
    }

    function appendLog(session, kind, text) {
        if (!text) return;
        session.log.push({ kind: kind || 'system', text: String(text) });
        if (session.log.length > 32) {
            session.log.splice(0, session.log.length - 32);
        }
    }

    function getRoom(adventure, roomId) {
        return adventure && adventure.rooms ? adventure.rooms[roomId] || null : null;
    }

    function getItem(adventure, itemId) {
        return adventure && adventure.items ? adventure.items[itemId] || null : null;
    }

    function getActor(adventure, actorId) {
        return adventure && adventure.actors ? adventure.actors[actorId] || null : null;
    }

    function conditionsMet(session, conditions) {
        if (!conditions) return true;
        const flags = session.worldFlags || {};
        const inventory = session.inventory || [];

        if (conditions.flagsAll && !conditions.flagsAll.every(function (flag) { return !!flags[flag]; })) return false;
        if (conditions.flagsAny && !conditions.flagsAny.some(function (flag) { return !!flags[flag]; })) return false;
        if (conditions.flagsNot && !conditions.flagsNot.every(function (flag) { return !flags[flag]; })) return false;
        if (conditions.inventoryAll && !conditions.inventoryAll.every(function (itemId) { return inventory.includes(itemId); })) return false;
        if (conditions.inventoryAny && !conditions.inventoryAny.some(function (itemId) { return inventory.includes(itemId); })) return false;
        if (conditions.inventoryNot && !conditions.inventoryNot.every(function (itemId) { return !inventory.includes(itemId); })) return false;
        if (typeof conditions.turnAtLeast === 'number' && session.turnCount < conditions.turnAtLeast) return false;
        return true;
    }

    function pickConditionalEntry(entries, session) {
        for (const entry of entries || []) {
            if (conditionsMet(session, entry.conditions)) return entry;
        }
        return null;
    }

    function evaluateConditionalText(source, session, fallbackText) {
        if (!source) return fallbackText || '';
        if (typeof source === 'string') return source;
        if (Array.isArray(source)) {
            const matched = pickConditionalEntry(source, session);
            return matched ? matched.text || '' : fallbackText || '';
        }
        return source.text || fallbackText || '';
    }

    function getVisibleItemIds(adventure, session, room) {
        return Object.keys(adventure.items || {}).filter(function (itemId) {
            const item = getItem(adventure, itemId);
            if (!item || item.location !== room.id) return false;
            if ((session.inventory || []).includes(itemId)) return false;
            if (item.hidden) return false;
            if (item.hiddenUntilFlag && !session.worldFlags[item.hiddenUntilFlag]) return false;
            if (item.hiddenIfFlag && session.worldFlags[item.hiddenIfFlag]) return false;
            return true;
        });
    }

    function getVisibleActorIds(adventure, session, room) {
        return Object.keys(adventure.actors || {}).filter(function (actorId) {
            const actor = getActor(adventure, actorId);
            if (!actor || actor.location !== room.id) return false;
            if (actor.hiddenUntilFlag && !session.worldFlags[actor.hiddenUntilFlag]) return false;
            if (actor.hiddenIfFlag && session.worldFlags[actor.hiddenIfFlag]) return false;
            return true;
        });
    }

    function createAliasPairs(kind, entries) {
        const pairs = [];
        for (const entry of entries) {
            const aliases = uniqueList([entry.name, entry.label].concat(entry.aliases || []));
            for (const alias of aliases) {
                const key = normalizeKey(alias);
                if (key) pairs.push({ kind: kind, id: entry.id, key: key });
            }
        }
        return pairs.sort(function (left, right) {
            return right.key.length - left.key.length;
        });
    }

    function resolveRoomExit(room, text) {
        const input = normalizeKey(text);
        const exits = (room && room.exits) || [];
        const pairs = createAliasPairs('exit', exits.map(function (exit) {
            return Object.assign({ id: exit.to, name: exit.label || exit.to }, exit);
        }));
        const matched = pairs.find(function (pair) {
            return pair.key === input;
        });
        if (!matched) return null;
        return exits.find(function (exit) {
            return exit.to === matched.id;
        }) || null;
    }

    function resolveEntity(adventure, session, text, options) {
        const currentRoom = getRoom(adventure, session.roomId);
        const normalized = normalizeKey(text);
        if (!normalized) return null;
        const opts = options || {};
        const entries = [];

        if (opts.items) {
            const roomItemIds = getVisibleItemIds(adventure, session, currentRoom);
            const inventoryIds = session.inventory || [];
            const uniqueItemIds = uniqueList(roomItemIds.concat(opts.includeInventory !== false ? inventoryIds : []));
            for (const itemId of uniqueItemIds) {
                const item = getItem(adventure, itemId);
                if (item) entries.push(Object.assign({ id: itemId }, item));
            }
        }

        if (opts.actors) {
            for (const actorId of getVisibleActorIds(adventure, session, currentRoom)) {
                const actor = getActor(adventure, actorId);
                if (actor) entries.push(Object.assign({ id: actorId }, actor));
            }
        }

        const pairs = createAliasPairs('entity', entries);
        const matched = pairs.find(function (pair) {
            return pair.key === normalized;
        });
        if (!matched) return null;
        return entries.find(function (entry) {
            return entry.id === matched.id;
        }) || null;
    }

    function applyEffects(adventure, session, effects) {
        const result = {
            movedRoom: false,
            startedMission: null,
            advancedScene: false
        };
        if (!effects) return result;

        if (effects.setFlags) {
            for (const flag of effects.setFlags) session.worldFlags[flag] = true;
        }
        if (effects.clearFlags) {
            for (const flag of effects.clearFlags) delete session.worldFlags[flag];
        }
        if (effects.addItems) {
            session.inventory = uniqueList(session.inventory.concat(effects.addItems));
        }
        if (effects.removeItems) {
            session.inventory = session.inventory.filter(function (itemId) {
                return !effects.removeItems.includes(itemId);
            });
        }
        if (effects.moveTo) {
            session.roomId = effects.moveTo;
            result.movedRoom = true;
        }
        if (effects.complete) {
            session.completed = true;
        }
        if (effects.startMission) {
            result.startedMission = Object.assign({}, effects.startMission);
        }
        if (effects.advanceScene) {
            result.advancedScene = true;
        }
        return result;
    }

    function describeRoom(adventure, session, forceLong) {
        const room = getRoom(adventure, session.roomId);
        if (!room) return '';
        const firstVisit = !session.visitedRooms[room.id];
        const longText = evaluateConditionalText(room.descriptionRules || room.description, session, room.description);
        const shortText = evaluateConditionalText(room.shortDescriptionRules || room.shortDescription, session, room.shortDescription || room.description);
        session.visitedRooms[room.id] = true;
        return forceLong || firstVisit ? longText : shortText;
    }

    function getCurrentObjective(adventure, session) {
        return evaluateConditionalText(adventure.objectiveRules, session, adventure.objective || '');
    }

    function getMissionTrigger(adventure, session, compactInput, locale) {
        for (const trigger of adventure.commandTriggers || []) {
            const matched = (trigger.aliases || []).some(function (alias) {
                return normalizeKey(alias) === compactInput;
            });
            if (!matched) continue;
            if (!conditionsMet(session, trigger.conditions)) {
                return { blocked: true, text: trigger.failText || engineText(locale, 'missionBlocked') };
            }
            return { blocked: false, text: trigger.text || '', flow: trigger.flow || null };
        }
        return null;
    }

    function splitVerb(compactInput, locale) {
        const pairs = [];
        for (const [verb, aliases] of Object.entries(VERB_ALIASES[resolveLocale(locale)] || VERB_ALIASES.zh)) {
            for (const alias of aliases) {
                pairs.push({ verb: verb, alias: normalizeKey(alias) });
            }
        }
        pairs.sort(function (left, right) {
            return right.alias.length - left.alias.length;
        });

        for (const pair of pairs) {
            if (compactInput === pair.alias) return { verb: pair.verb, remainder: '' };
            if (compactInput.startsWith(pair.alias)) {
                return { verb: pair.verb, remainder: compactInput.slice(pair.alias.length) };
            }
        }

        if (resolveLocale(locale) === 'zh' && compactInput.endsWith(normalizeKey('对话'))) {
            return { verb: 'talk', remainder: compactInput.slice(0, compactInput.length - normalizeKey('对话').length) };
        }
        return { verb: null, remainder: compactInput };
    }

    function parseUseRemainder(compactRemainder, locale) {
        for (const connector of USE_CONNECTORS[resolveLocale(locale)] || USE_CONNECTORS.zh) {
            const key = normalizeKey(connector);
            const index = compactRemainder.indexOf(key);
            if (index > 0 && index < compactRemainder.length - key.length) {
                return {
                    objectText: compactRemainder.slice(0, index),
                    targetText: compactRemainder.slice(index + key.length)
                };
            }
        }
        return { objectText: compactRemainder, targetText: '' };
    }

    function startSession(adventure, savedSession, options) {
        const session = mergeSession(createBaseSession(adventure), savedSession);
        if (!session.log.length) {
            const settings = options || {};
            if (settings.entryTitle) appendLog(session, 'system', settings.entryTitle);
            if (adventure.introText) appendLog(session, 'system', adventure.introText);
            appendLog(session, 'system', describeRoom(adventure, session, true));
        }
        return session;
    }

    function getViewModel(adventure, session) {
        const room = getRoom(adventure, session.roomId);
        const visibleItemIds = room ? getVisibleItemIds(adventure, session, room) : [];
        const visibleActorIds = room ? getVisibleActorIds(adventure, session, room) : [];
        const exits = (room && room.exits) ? room.exits.map(function (exit) {
            return exit.label || getRoom(adventure, exit.to) && getRoom(adventure, exit.to).name || exit.to;
        }) : [];
        const trigger = (adventure.commandTriggers || []).find(function (entry) {
            return conditionsMet(session, entry.conditions);
        }) || null;
        return {
            title: adventure.title,
            subtitle: adventure.subtitle,
            objective: getCurrentObjective(adventure, session),
            roomName: room ? room.name : '',
            roomDescription: evaluateConditionalText(room && (room.overlayDescription || room.description), session, room && room.description || ''),
            roomBackgroundKey: room && room.backgroundKey || null,
            visibleItems: visibleItemIds.map(function (itemId) { return getItem(adventure, itemId).name; }),
            visibleActors: visibleActorIds.map(function (actorId) { return getActor(adventure, actorId).name; }),
            exits: exits,
            inventory: (session.inventory || []).map(function (itemId) {
                const item = getItem(adventure, itemId);
                return item ? item.name : itemId;
            }),
            turnCount: session.turnCount,
            log: cloneLog(session.log),
            hints: room && room.hints ? room.hints.slice() : (adventure.defaultHints || []).slice(),
            missionCommand: trigger && trigger.aliases && trigger.aliases[0] || '',
            session: session
        };
    }

    function executeLook(adventure, session, remainder, locale) {
        if (!remainder) {
            return { text: describeRoom(adventure, session, true) };
        }
        const room = getRoom(adventure, session.roomId);
        const exit = resolveRoomExit(room, remainder);
        if (exit) {
            const destination = getRoom(adventure, exit.to);
            return {
                text: destination
                    ? engineText(locale, 'exitLead', { name: destination.name })
                    : engineText(locale, 'exitLeadId', { id: exit.to })
            };
        }

        const actor = resolveEntity(adventure, session, remainder, { actors: true, items: false });
        if (actor) {
            return { text: evaluateConditionalText(actor.lookRules || actor.lookText, session, actor.lookText || engineText(locale, 'actorWaiting', { name: actor.name })) };
        }

        const item = resolveEntity(adventure, session, remainder, { actors: false, items: true });
        if (item) {
            return { text: evaluateConditionalText(item.lookRules || item.lookText, session, item.lookText || engineText(locale, 'itemWaiting', { name: item.name })) };
        }

        return { text: engineText(locale, 'lookMissingTarget'), consumeTurn: false };
    }

    function executeGo(adventure, session, remainder, locale) {
        if (!remainder) {
            return { text: engineText(locale, 'goMissingTarget'), consumeTurn: false };
        }
        const room = getRoom(adventure, session.roomId);
        const exit = resolveRoomExit(room, remainder);
        if (!exit) {
            return { text: engineText(locale, 'goNoExit'), consumeTurn: false };
        }
        if (!conditionsMet(session, exit.conditions)) {
            return { text: exit.failText || engineText(locale, 'goBlocked'), consumeTurn: false };
        }
        session.roomId = exit.to;
        return {
            text: describeRoom(adventure, session, true),
            movedRoom: true
        };
    }

    function executeTake(adventure, session, remainder, locale) {
        if (!remainder) {
            return { text: engineText(locale, 'takeMissingTarget'), consumeTurn: false };
        }
        const item = resolveEntity(adventure, session, remainder, { actors: false, items: true, includeInventory: false });
        if (!item) {
            return { text: engineText(locale, 'takeNoItem'), consumeTurn: false };
        }
        if (!item.portable) {
            return { text: item.cantTakeText || engineText(locale, 'takeCant', { name: item.name }), consumeTurn: false };
        }
        session.inventory = uniqueList(session.inventory.concat(item.id));
        return { text: item.takeText || engineText(locale, 'takeDone', { name: item.name }) };
    }

    function executeTalk(adventure, session, remainder, locale) {
        if (!remainder) {
            return { text: engineText(locale, 'talkMissingTarget'), consumeTurn: false };
        }
        const actor = resolveEntity(adventure, session, remainder, { actors: true, items: false });
        if (!actor) {
            return { text: engineText(locale, 'talkNoTarget'), consumeTurn: false };
        }
        const rule = pickConditionalEntry(actor.talkRules || [], session);
        if (!rule) {
            return { text: actor.talkText || engineText(locale, 'talkNoNew', { name: actor.name }) };
        }
        const effectResult = applyEffects(adventure, session, rule.effects);
        return {
            text: rule.text || actor.talkText || engineText(locale, 'talkDefault', { name: actor.name }),
            startedMission: effectResult.startedMission,
            talkedActorId: actor.id,
            talkedActorName: actor.name,
            talkedPortraitKey: actor.portraitKey || actor.id
        };
    }

    function executeUse(adventure, session, remainder, locale) {
        const parsed = parseUseRemainder(remainder, locale);
        if (!parsed.objectText) {
            return { text: engineText(locale, 'useMissingItem'), consumeTurn: false };
        }
        const item = resolveEntity(adventure, session, parsed.objectText, { actors: false, items: true, includeInventory: true });
        if (!item) {
            return { text: engineText(locale, 'useNoItem'), consumeTurn: false };
        }
        if (!(session.inventory || []).includes(item.id)) {
            return { text: engineText(locale, 'useNotOwned', { name: item.name }), consumeTurn: false };
        }

        const target = parsed.targetText
            ? resolveEntity(adventure, session, parsed.targetText, { actors: true, items: true, includeInventory: false })
            : null;
        const matchedRules = (adventure.useRules || []).filter(function (rule) {
            return rule.item === item.id && (!rule.target || (target && rule.target === target.id));
        });

        if (!matchedRules.length) {
            return {
                text: engineText(locale, 'useNoPair', {
                    item: item.name,
                    target: target && target.name
                }),
                consumeTurn: false
            };
        }

        for (const rule of matchedRules) {
            if (!conditionsMet(session, rule.conditions)) {
                if (rule.failText) return { text: rule.failText, consumeTurn: false };
                continue;
            }
            const effectResult = applyEffects(adventure, session, rule.effects);
            return {
                text: rule.text || (resolveLocale(locale) === 'en' ? 'Operation complete.' : '操作完成。'),
                movedRoom: effectResult.movedRoom,
                startedMission: effectResult.startedMission,
                advancedScene: effectResult.advancedScene
            };
        }

        return { text: engineText(locale, 'useTooEarly'), consumeTurn: false };
    }

    function executeCommand(adventure, session, rawInput, locale) {
        const raw = String(rawInput || '').trim();
        const compact = normalizeKey(raw);
        if (!compact) {
            return { session: session, text: engineText(locale, 'commandEmpty'), consumeTurn: false };
        }

        appendLog(session, 'command', `> ${raw}`);

        const missionTrigger = getMissionTrigger(adventure, session, compact, locale);
        if (missionTrigger) {
            if (missionTrigger.text) appendLog(session, 'system', missionTrigger.text);
            if (!missionTrigger.blocked && missionTrigger.flow) {
                session.turnCount += 1;
                return {
                    session: session,
                    startedMission: missionTrigger.flow,
                    text: missionTrigger.text || '',
                    consumeTurn: true
                };
            }
            return {
                session: session,
                text: missionTrigger.text,
                consumeTurn: false
            };
        }

        const parsed = splitVerb(compact, locale);
        let result;
        switch (parsed.verb) {
            case 'help':
                result = {
                    text: engineText(locale, 'help'),
                    consumeTurn: false
                };
                break;
            case 'inventory':
                result = {
                    text: session.inventory.length
                        ? engineText(locale, 'inventoryList', {
                            items: session.inventory.map(function (itemId) { return getItem(adventure, itemId).name; }).join(resolveLocale(locale) === 'en' ? ', ' : '、')
                        })
                        : engineText(locale, 'inventoryEmpty'),
                    consumeTurn: false
                };
                break;
            case 'objective':
                result = {
                    text: getCurrentObjective(adventure, session) || engineText(locale, 'objectiveEmpty'),
                    consumeTurn: false
                };
                break;
            case 'look':
                result = executeLook(adventure, session, parsed.remainder, locale);
                break;
            case 'go':
                result = executeGo(adventure, session, parsed.remainder, locale);
                break;
            case 'talk':
                result = executeTalk(adventure, session, parsed.remainder, locale);
                break;
            case 'take':
                result = executeTake(adventure, session, parsed.remainder, locale);
                break;
            case 'use':
                result = executeUse(adventure, session, parsed.remainder, locale);
                break;
            default:
                result = {
                    text: engineText(locale, 'unknownCommand'),
                    consumeTurn: false
                };
                break;
        }

        if (result.text) appendLog(session, 'system', result.text);
        if (result.consumeTurn !== false) session.turnCount += 1;
        return Object.assign({ session: session }, result);
    }

    window.StarHunterAdventureEngine = {
        normalizeText: normalizeText,
        normalizeKey: normalizeKey,
        startSession: startSession,
        getViewModel: getViewModel,
        getRoom: getRoom,
        getItem: getItem,
        getActor: getActor,
        executeCommand: executeCommand,
        describeRoom: describeRoom
    };
})();
