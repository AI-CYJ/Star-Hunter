(function () {
    function uniqueList(list) {
        return Array.from(new Set((list || []).filter(Boolean)));
    }

    function mergeProgress(base, saved) {
        const merged = Object.assign({}, base, saved || {});
        merged.version = base.version;
        merged.unlockedArchives = uniqueList([].concat(base.unlockedArchives, saved && saved.unlockedArchives));
        merged.unlockedConversations = uniqueList([].concat(base.unlockedConversations, saved && saved.unlockedConversations));
        merged.hiddenUnlocked = Object.assign({}, base.hiddenUnlocked, saved && saved.hiddenUnlocked);
        merged.hiddenCompleted = Object.assign({}, base.hiddenCompleted, saved && saved.hiddenCompleted);
        merged.seenDialogues = Object.assign({}, base.seenDialogues, saved && saved.seenDialogues);
        merged.missionRecords = Object.assign({}, base.missionRecords, saved && saved.missionRecords);
        merged.flags = Object.assign({}, base.flags, saved && saved.flags);
        merged.adventure = {
            activeAdventureId: saved && saved.adventure && typeof saved.adventure.activeAdventureId === 'string'
                ? saved.adventure.activeAdventureId
                : base.adventure.activeAdventureId,
            sessions: Object.assign({}, base.adventure.sessions, saved && saved.adventure && saved.adventure.sessions)
        };
        merged.hiddenFragments = Math.max(base.hiddenFragments, saved && saved.hiddenFragments || 0);
        merged.currentSceneIndex = typeof merged.currentSceneIndex === 'number' ? merged.currentSceneIndex : base.currentSceneIndex;
        merged.chapterCompleted = !!merged.chapterCompleted;
        return merged;
    }

    function createDefaultProgress(data) {
        const unlockedArchives = Object.values(data.archiveEntries)
            .filter((entry) => entry.unlockedByDefault)
            .map((entry) => entry.id);

        const unlockedConversations = data.characterCards
            .filter((card) => card.unlockedByDefault)
            .map((card) => card.id);

        return {
            version: data.version || 1,
            currentChapterId: data.mainlineChapterId,
            currentSceneIndex: 0,
            chapterCompleted: false,
            unlockedArchives,
            unlockedConversations,
            hiddenUnlocked: {},
            hiddenCompleted: {},
            seenDialogues: {},
            missionRecords: {},
            hiddenFragments: 0,
            adventure: {
                activeAdventureId: null,
                sessions: {}
            },
            flags: {
                hunterOutfits: {}
            }
        };
    }

    function loadProgress(data) {
        const base = createDefaultProgress(data);
        try {
            const raw = localStorage.getItem(data.storageKey);
            if (!raw) return base;
            const parsed = JSON.parse(raw);
            return mergeProgress(base, parsed);
        } catch (error) {
            console.warn('无法读取剧情存档，使用默认进度。', error);
            return base;
        }
    }

    function saveProgress(data, progress) {
        localStorage.setItem(data.storageKey, JSON.stringify(progress));
    }

    function getChapter(data, chapterId) {
        return data.chapters[chapterId];
    }

    function getCurrentScene(data, progress) {
        const chapter = getChapter(data, progress.currentChapterId);
        if (!chapter) return null;
        return chapter.scenes[progress.currentSceneIndex] || null;
    }

    function advanceMainline(data, progress) {
        const chapter = getChapter(data, progress.currentChapterId);
        if (!chapter) return null;
        progress.currentSceneIndex += 1;
        if (progress.currentSceneIndex >= chapter.scenes.length) {
            progress.chapterCompleted = true;
            progress.currentSceneIndex = chapter.scenes.length;
            return null;
        }
        return chapter.scenes[progress.currentSceneIndex];
    }

    function markDialogueSeen(progress, dialogueId) {
        if (dialogueId) progress.seenDialogues[dialogueId] = true;
    }

    function unlockArchives(progress, archiveIds) {
        const added = [];
        for (const archiveId of archiveIds || []) {
            if (!progress.unlockedArchives.includes(archiveId)) {
                progress.unlockedArchives.push(archiveId);
                added.push(archiveId);
            }
        }
        progress.unlockedArchives = uniqueList(progress.unlockedArchives);
        return added;
    }

    function unlockConversations(progress, conversationIds) {
        const added = [];
        for (const conversationId of conversationIds || []) {
            if (!progress.unlockedConversations.includes(conversationId)) {
                progress.unlockedConversations.push(conversationId);
                added.push(conversationId);
            }
        }
        progress.unlockedConversations = uniqueList(progress.unlockedConversations);
        return added;
    }

    function createMissionRuntime(config) {
        return {
            missionId: config.id,
            elapsed: 0,
            kills: 0,
            tokensSpawned: 0,
            tokensCollected: 0,
            carrierKillsByPhase: {},
            hiddenShardPhases: {},
            bannerTimer: 3.4,
            missionCompleteFlash: 0,
            completed: false,
            completionDelay: 0,
            notices: []
        };
    }

    function getMissionPhase(config, elapsed) {
        for (let index = 0; index < config.phases.length; index += 1) {
            const phase = config.phases[index];
            if (elapsed >= phase.start && elapsed < phase.end) {
                return { index, phase };
            }
        }
        const lastIndex = config.phases.length - 1;
        return { index: lastIndex, phase: config.phases[lastIndex] };
    }

    function pickWeightedKey(weightTable) {
        const entries = Object.entries(weightTable || {});
        let total = 0;
        for (const [, value] of entries) total += value;
        const threshold = Math.random() * total;
        let cursor = 0;
        for (const [key, value] of entries) {
            cursor += value;
            if (threshold <= cursor) return key;
        }
        return entries.length ? entries[0][0] : 'normal';
    }

    function registerMissionKill(config, runtime, enemy) {
        runtime.kills += 1;
        const phaseInfo = getMissionPhase(config, runtime.elapsed);
        const phaseKey = String(phaseInfo.index);
        const phase = phaseInfo.phase;

        const result = {
            phaseInfo,
            dropToken: false,
            dropHiddenShard: false
        };

        if (config.tokenGoal > runtime.tokensSpawned && phase.tokenCarriers && phase.tokenCarriers.includes(enemy.type)) {
            runtime.carrierKillsByPhase[phaseKey] = (runtime.carrierKillsByPhase[phaseKey] || 0) + 1;
            const every = Math.max(1, phase.tokenDropEvery || 1);
            if (runtime.carrierKillsByPhase[phaseKey] % every === 0) {
                runtime.tokensSpawned += 1;
                result.dropToken = true;
            }
        }

        if (config.hiddenTokenType && phase.hiddenShardCarrier && phase.hiddenShardCarrier === enemy.type && !runtime.hiddenShardPhases[phaseKey]) {
            runtime.hiddenShardPhases[phaseKey] = true;
            result.dropHiddenShard = true;
        }

        return result;
    }

    function collectMissionToken(config, runtime) {
        runtime.tokensCollected += 1;
        if (runtime.tokensCollected >= config.tokenGoal) {
            runtime.completed = true;
            runtime.completionDelay = 1.1;
            return true;
        }
        return false;
    }

    function canAccessArchive(progress, archiveId) {
        return progress.unlockedArchives.includes(archiveId);
    }

    function canAccessConversation(progress, conversationId) {
        return progress.unlockedConversations.includes(conversationId);
    }

    function getArchiveList(data) {
        return Object.values(data.archiveEntries).sort((left, right) => {
            const groupOrder = {
                '世界观': 0,
                World: 0,
                '制作需求': 1,
                Production: 1,
                '星际猎手': 2,
                'Star Hunters': 2,
                '隐藏档案': 3,
                'Hidden Files': 3
            };
            return (groupOrder[left.group] || 9) - (groupOrder[right.group] || 9);
        });
    }

    function getNextVisibleArchive(data, progress, currentArchiveId) {
        const archives = getArchiveList(data);
        const firstUnlocked = archives.find((entry) => canAccessArchive(progress, entry.id));
        if (!currentArchiveId && firstUnlocked) return firstUnlocked.id;
        if (currentArchiveId && canAccessArchive(progress, currentArchiveId)) return currentArchiveId;
        return firstUnlocked ? firstUnlocked.id : archives[0] && archives[0].id;
    }

    function maybeUnlockHiddenStories(data, progress) {
        const unlocked = [];
        for (const hiddenStory of Object.values(data.hiddenStories)) {
            if (progress.hiddenUnlocked[hiddenStory.id]) continue;
            if (hiddenStory.requiresChapterComplete && !progress.chapterCompleted) continue;
            if (progress.hiddenFragments >= hiddenStory.unlockFragments) {
                progress.hiddenUnlocked[hiddenStory.id] = true;
                unlocked.push(hiddenStory.id);
            }
        }
        return unlocked;
    }

    function markHiddenStoryComplete(progress, hiddenStoryId) {
        progress.hiddenCompleted[hiddenStoryId] = true;
    }

    function isHiddenStoryUnlocked(progress, hiddenStoryId) {
        return !!progress.hiddenUnlocked[hiddenStoryId];
    }

    function isHiddenStoryCompleted(progress, hiddenStoryId) {
        return !!progress.hiddenCompleted[hiddenStoryId];
    }

    function recordMission(progress, missionId, missionStats) {
        progress.missionRecords[missionId] = Object.assign({}, progress.missionRecords[missionId], missionStats);
    }

    function cloneAdventureSession(session) {
        if (!session) return null;
        return JSON.parse(JSON.stringify(session));
    }

    function getAdventureSession(progress, adventureId) {
        if (!progress.adventure || !progress.adventure.sessions) return null;
        return cloneAdventureSession(progress.adventure.sessions[adventureId]);
    }

    function setAdventureSession(progress, adventureId, session) {
        if (!progress.adventure) {
            progress.adventure = {
                activeAdventureId: null,
                sessions: {}
            };
        }
        if (!progress.adventure.sessions) progress.adventure.sessions = {};
        progress.adventure.activeAdventureId = adventureId || null;
        progress.adventure.sessions[adventureId] = cloneAdventureSession(session);
        return progress.adventure.sessions[adventureId];
    }

    function clearAdventureSession(progress, adventureId) {
        if (!progress.adventure || !progress.adventure.sessions) return;
        delete progress.adventure.sessions[adventureId];
        if (progress.adventure.activeAdventureId === adventureId) {
            progress.adventure.activeAdventureId = null;
        }
    }

    window.StarHunterSceneManager = {
        createDefaultProgress,
        loadProgress,
        saveProgress,
        getChapter,
        getCurrentScene,
        advanceMainline,
        markDialogueSeen,
        unlockArchives,
        unlockConversations,
        createMissionRuntime,
        getMissionPhase,
        pickWeightedKey,
        registerMissionKill,
        collectMissionToken,
        canAccessArchive,
        canAccessConversation,
        getArchiveList,
        getNextVisibleArchive,
        maybeUnlockHiddenStories,
        markHiddenStoryComplete,
        isHiddenStoryUnlocked,
        isHiddenStoryCompleted,
        recordMission,
        getAdventureSession,
        setAdventureSession,
        clearAdventureSession
    };
})();
