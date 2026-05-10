(function () {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const rawStoryData = window.StarHunterStoryData;
    const sceneApi = window.StarHunterSceneManager;
    const ui = window.StarHunterUI;
    const adventureEngine = window.StarHunterAdventureEngine;
    const languageSwitcher = document.getElementById('language-switcher');
    const adventureInputLayer = document.getElementById('adventure-input-layer');
    const adventureStatus = document.getElementById('adventure-status');
    const adventureCommandForm = document.getElementById('adventure-command-form');
    const adventureCommandInput = document.getElementById('adventure-command-input');
    const adventureQuickVerbs = document.getElementById('adventure-quick-verbs');

    if (!canvas || !ctx || !rawStoryData || !sceneApi || !ui || !adventureEngine || !languageSwitcher || !adventureInputLayer || !adventureCommandForm || !adventureCommandInput || !adventureQuickVerbs) {
        console.error('Star Hunter 启动失败：缺少必要脚本。');
        return;
    }

    const LANGUAGE_STORAGE_KEY = 'starHunterLanguage';
    const LANGUAGE_LABELS = {
        zh: '中文',
        en: 'English'
    };

    const STATE = {
        MENU: 'menu',
        HUB: 'hub',
        HUNTERS: 'hunters',
        DIALOGUE: 'dialogue',
        ADVENTURE: 'adventure',
        MISSION: 'mission',
        RESULT: 'result',
        ARCHIVE: 'archive',
        GAMEOVER: 'gameover'
    };

    const POWERUP_DEFS = [
        { type: 'heal', color: 340, symbol: '❤', desc: '恢复生命', lifetime: 8 },
        { type: 'triple', color: 50, symbol: '✦', desc: '三连射', lifetime: 9 },
        { type: 'rapid', color: 200, symbol: '⚡', desc: '快速射击', lifetime: 9 },
        { type: 'shield', color: 260, symbol: '🛡', desc: '护盾', lifetime: 10 },
        { type: 'bomb', color: 30, symbol: '💥', desc: '清屏炸弹', lifetime: 7 }
    ];

    const ENEMY_TYPES = {
        normal: { name: '普通', color: 0, radius: 14, speed: 1.2, hp: 1, score: 100, shape: 'diamond' },
        fast: { name: '快速', color: 25, radius: 10, speed: 3.5, hp: 1, score: 180, shape: 'triangle' },
        tank: { name: '重型', color: 340, radius: 22, speed: 0.7, hp: 3, score: 350, shape: 'hexagon' },
        zigzag: { name: '蛇形', color: 160, radius: 13, speed: 1.8, hp: 1, score: 220, shape: 'star' }
    };

    const SCENE_THEMES = {
        menu: { top: '#051129', middle: '#0d1f42', bottom: '#050811', accent: '#6db4ff' },
        hub: { top: '#090c1a', middle: '#1b1731', bottom: '#2d1826', accent: '#ffbd72' },
        hunters: { top: '#0b1020', middle: '#1a1e38', bottom: '#120c1f', accent: '#82a7ff' },
        archive: { top: '#08141f', middle: '#10273b', bottom: '#091019', accent: '#9fdcff' },
        dialogue: { top: '#090e1f', middle: '#171d33', bottom: '#120a1b', accent: '#c7a5ff' },
        adventure: { top: '#08111f', middle: '#101c33', bottom: '#0a0f19', accent: '#89c4ff' },
        result: { top: '#091221', middle: '#182241', bottom: '#140a1f', accent: '#94d4ff' },
        gameover: { top: '#11070b', middle: '#280f1a', bottom: '#09040b', accent: '#ff8d74' }
    };

    const UI_TEXT = {
        zh: {
            menuHealthAdvice: '健康游戏忠告:抵制不良游戏,拒绝盗版游戏。注意自我保护,谨防受骗上当。适度游戏益脑,沉迷游戏伤身。合理安排时间,享受健康生活。',
            adventureMissingScene: function (params) { return `未找到 adventure 场景：${params.id}`; },
            adventureStatusPrompt: function (params) { return params && params.command ? `关键命令：${params.command}` : '输入命令推进剧情，例如“查看主控终端”。'; },
            adventurePlaceholder: function (params) { return params && params.example ? `例如：${params.example}` : '例如：查看主控终端'; },
            hunterLockedOutfit: '这位猎手还没有正式登场，暂时不能切换装扮。',
            hunterOutfitSwitched: function (params) { return `${params.name} 已切换为${params.variant === 'alt' ? ' 2.0 装扮。' : '初始装扮。'}`; },
            storyResetDone: '剧情存档已清空，已恢复到初始进度。最高分不会被重置。',
            storyResetConfirm: '再次点击“清空剧情存档”确认。只会重置剧情进度，不影响最高分。',
            hiddenNeedFragments: '继续主线并收集 2 枚矿晶碎片后，这条旧档案才会出现。',
            hiddenForceUnlocked: '应急协议生效：已强行解锁隐藏档案“麦伦船长发家史”。',
            hiddenForceProgress: function (params) { return `主线已完成但碎片不足。再点击 ${params.remaining} 次即可强行解锁隐藏档案（当前 ${params.current}/3）。`; },
            hiddenUnlocked: 'MIR-z11 旧档案已解锁，隐藏任务“深井逃亡”上线。',
            mainlineCompleted: '主线“归途有灯”已完成。',
            storyAdvanced: '剧情推进完成，新的档案已记录。',
            hiddenArchived: '隐藏档案已归档：麦伦船长发家史。',
            hiddenMissionCompleteTitle: '隐藏任务完成：深井逃亡',
            hiddenMissionCompleteText: '旧档案里的逃亡路线已经被完整回放。麦伦船长的第一段发家史，被正式归入银河系中心酒吧档案库。',
            missionFailureTitle: '任务失败',
            missionFailureDefault: '你的飞船在回收行动中被击坠，酒吧的那盏灯还得再等你一次。',
            retryMission: '重新执行任务',
            returnToHub: '返回酒吧',
            continueStoryButton: '继续剧情',
            archiveOldFileButton: '归档旧档案',
            shieldBroken: '护盾破碎!',
            enemyEscaped: '敌人逃脱!',
            missionFailEscaped: '你没能守住撤离线，失联坐标再次沉入战区。',
            powerupTriple: '三连射!',
            powerupRapid: '极速射击!',
            powerupShield: '护盾激活!',
            powerupClear: '清屏!',
            objectiveReached: '目标达成，撤离通道已打开。',
            hiddenFragmentStatus: function (params) { return `矿晶碎片 ${params.current}/2`; },
            comboSuffix: '连击!',
            failShotDown: '你的飞船在任务中被击坠，回收行动被迫中断。',
            hudHighScore: function (params) { return `最高: ${params.score}`; },
            hudStage: function (params) { return `阶段 ${params.current}/${params.total} · ${params.objective}`; },
            hudShield: '🛡 护盾',
            hudTriple: function (params) { return `✦ 三连射 ${params.seconds}s`; },
            hudRapid: function (params) { return `⚡ 速射 ${params.seconds}s`; },
            hudCombo: function (params) { return `${params.combo} 连击!`; },
            progressCompleted: '主线“归途有灯”已完成，银河系中心酒吧重新亮起。',
            progressFinishedCount: function (params) { return `已完成 ${params.done}/${params.total}`; },
            progressCurrent: function (params) { return `当前进度：${params.step}`; },
            roleLocked: '待剧情解锁',
            hunterLockedNotice: '这位猎手还没有正式登场。继续主线后再回来看看。',
            hubTitle: '银河系中心酒吧',
            hubSubtitle: '队伍的避风港，也是所有剧情重新开始的地方。',
            archivesUnlocked: function (params) { return `档案已解锁：${params.count} 项`; },
            hiddenFragmentsCount: function (params) { return `隐藏碎片：${params.current}/2`; },
            hiddenStatusArchived: '隐藏档案已归档',
            hiddenStatusUnlocked: '旧档案已接入',
            hiddenStatusForce: function (params) { return `缺 ${params.count} 枚碎片，可连点 3 次强开（${params.taps}/3）`; },
            hiddenStatusMissing: function (params) { return `缺少矿晶碎片 ${params.count} 枚`; },
            actionConsole: '行动控制台',
            mainlineDoneButton: '主线已完成',
            mainlineContinueButton: '继续主线：归途有灯',
            mainlineDoneNotice: '主线已经通关。你现在可以补完档案或挑战隐藏任务。',
            enterArchive: '进入档案室',
            replayHidden: '重看隐藏档案',
            investigateHidden: '调查旧档案：深井逃亡',
            hiddenLockedForce: '隐藏档案未解锁 · 连点 3 次',
            hiddenLocked: '隐藏档案未解锁',
            storyResetConfirmButton: '再次点击确认清空剧情存档',
            storyResetButton: '清空剧情存档',
            huntersTitle: '星际猎手',
            huntersSubtitle: '点击进入猎手页，为已解锁角色切换装扮。剧情登场会自动沿用当前选择。',
            huntersUnlocked: function (params) { return `已解锁 ${params.current}/${params.total}`; },
            huntersSwappable: function (params) { return `可切换装扮 ${params.count} 位`; },
            enterHunters: '进入星际猎手',
            huntersPageSubtitle: '已解锁猎手可切换装扮，剧情立绘会自动沿用当前选择。',
            hoverSelect: '选择',
            currentOutfit: '当前装扮',
            outfitHint: '切换后，该角色在剧情对话中的立绘会自动同步。',
            primaryOutfit: '初始装扮',
            altOutfit: '2.0 装扮',
            onlyPrimaryOutfit: '当前仅有初始装扮',
            viewShortDialogue: '查看角色短对话',
            adventureIntelTitle: '当前情报',
            adventureObjective: function (params) { return `目标：${params.value || '暂无'}`; },
            adventureVisibleActors: function (params) { return `可见人物：${params.value || '暂无'}`; },
            adventureVisibleItems: function (params) { return `可见物件：${params.value || '暂无'}`; },
            adventureExits: function (params) { return `可前往地点：${params.value || '暂无'}`; },
            adventureInventory: function (params) { return `随身物品：${params.value || '当前为空'}`; },
            adventureCommand: function (params) { return `行动指令：${params.value}`; },
            adventureHints: function (params) { return `建议尝试：${params.value}`; },
            adventureLogTitle: '命令记录',
            dialogueContinue: '继续',
            dialogueNext: '下一句',
            dialogueHint: '点击对话框任意位置或按空格 / Enter 继续。',
            archiveRoom: '档案室',
            archiveRoomHint: '已解锁条目可以直接阅读，未解锁条目会在主线或隐藏任务中打开。',
            archiveLockedPrefix: '未解锁 · ',
            archiveLockedNotice: '该档案尚未解锁。继续主线或寻找隐藏线索后再回来。',
            resultStats: function (params) { return `得分 ${params.score}  ·  最大连击 ${params.combo}`; },
            resultFragments: function (params) { return `矿晶碎片：${params.current}/2`; },
            resultNewArchives: '新解锁档案',
            gameOverStats: function (params) { return `本次任务得分：${params.score}  ·  最大连击：${params.combo}`; },
            menuEnterHub: '酒吧枢纽已上线。先和大家聊聊，再继续主线吧。'
        },
        en: {
            menuHealthAdvice: 'Healthy Gaming Advice: Resist harmful games and reject pirated games. Protect yourself and beware of scams. Moderate play is good for the mind, addiction harms the body. Arrange your time wisely and enjoy a healthy life.',
            adventureMissingScene: function (params) { return `Adventure scene not found: ${params.id}`; },
            adventureStatusPrompt: function (params) { return params && params.command ? `Key command: ${params.command}` : 'Type a command to move the story forward, for example “look main console”.'; },
            adventurePlaceholder: function (params) { return params && params.example ? `For example: ${params.example}` : 'For example: look main console'; },
            hunterLockedOutfit: 'This hunter has not officially joined the story yet, so outfits cannot be switched now.',
            hunterOutfitSwitched: function (params) { return `${params.name} is now using ${params.variant === 'alt' ? 'the 2.0 outfit.' : 'the default outfit.'}`; },
            storyResetDone: 'Narrative progress has been cleared and restored to the starting state. Your high score was not reset.',
            storyResetConfirm: 'Click “Clear Narrative Save” again to confirm. Only story progress will be reset.',
            hiddenNeedFragments: 'Finish the main story and collect 2 crystal shards before this old file can appear.',
            hiddenForceUnlocked: 'Emergency protocol enabled: hidden archive “Captain Maillen\'s Rise” has been force-unlocked.',
            hiddenForceProgress: function (params) { return `Main story completed, but shards are still missing. Click ${params.remaining} more times to force unlock the hidden archive (${params.current}/3).`; },
            hiddenUnlocked: 'The old MIR-z11 file is now unlocked. Hidden mission “Deep Well Escape” is now available.',
            mainlineCompleted: 'Main story “A Light for the Way Home” is complete.',
            storyAdvanced: 'Story progression complete. New records have been archived.',
            hiddenArchived: 'Hidden archive recorded: Captain Maillen\'s Rise.',
            hiddenMissionCompleteTitle: 'Hidden Mission Complete: Deep Well Escape',
            hiddenMissionCompleteText: 'The escape route preserved in the old file has now been fully replayed. The first chapter of Captain Maillen’s rise is officially archived at the Galactic Center Bar.',
            missionFailureTitle: 'Mission Failed',
            missionFailureDefault: 'Your ship was shot down during the recovery run. The light in the bar will have to wait for you once more.',
            retryMission: 'Retry Mission',
            returnToHub: 'Back to Bar',
            continueStoryButton: 'Continue Story',
            archiveOldFileButton: 'Archive Old File',
            shieldBroken: 'Shield Broken!',
            enemyEscaped: 'Enemy Escaped!',
            missionFailEscaped: 'You failed to hold the extraction line. The lost coordinates sank back into the warzone.',
            powerupTriple: 'Triple Shot!',
            powerupRapid: 'Rapid Fire!',
            powerupShield: 'Shield Online!',
            powerupClear: 'Screen Clear!',
            objectiveReached: 'Objective complete. The extraction route is now open.',
            hiddenFragmentStatus: function (params) { return `Crystal shards ${params.current}/2`; },
            comboSuffix: 'combo!',
            failShotDown: 'Your ship was destroyed in the mission. The recovery operation has been forced to stop.',
            hudHighScore: function (params) { return `Best: ${params.score}`; },
            hudStage: function (params) { return `Phase ${params.current}/${params.total} · ${params.objective}`; },
            hudShield: '🛡 Shield',
            hudTriple: function (params) { return `✦ Triple ${params.seconds}s`; },
            hudRapid: function (params) { return `⚡ Rapid ${params.seconds}s`; },
            hudCombo: function (params) { return `${params.combo} Combo!`; },
            progressCompleted: 'Main story “A Light for the Way Home” is complete. The Galactic Center Bar shines again.',
            progressFinishedCount: function (params) { return `Completed ${params.done}/${params.total}`; },
            progressCurrent: function (params) { return `Current progress: ${params.step}`; },
            roleLocked: 'Unlock through story progress',
            hunterLockedNotice: 'This hunter has not officially appeared yet. Continue the main story and come back later.',
            hubTitle: 'Galactic Center Bar',
            hubSubtitle: 'The team\'s shelter, and the place where every story begins again.',
            archivesUnlocked: function (params) { return `Archives unlocked: ${params.count}`; },
            hiddenFragmentsCount: function (params) { return `Hidden shards: ${params.current}/2`; },
            hiddenStatusArchived: 'Hidden archive fully recorded',
            hiddenStatusUnlocked: 'Old file connected',
            hiddenStatusForce: function (params) { return `${params.count} shards missing. Tap 3 times to force unlock (${params.taps}/3)`; },
            hiddenStatusMissing: function (params) { return `${params.count} crystal shard(s) still missing`; },
            actionConsole: 'Action Console',
            mainlineDoneButton: 'Main Story Complete',
            mainlineContinueButton: 'Continue: A Light for the Way Home',
            mainlineDoneNotice: 'The main story is already complete. You can now finish the archive or challenge the hidden mission.',
            enterArchive: 'Enter Archive Room',
            replayHidden: 'Replay Hidden Archive',
            investigateHidden: 'Investigate Old File: Deep Well Escape',
            hiddenLockedForce: 'Hidden archive locked · tap 3 times',
            hiddenLocked: 'Hidden archive locked',
            storyResetConfirmButton: 'Click again to confirm clearing story save',
            storyResetButton: 'Clear Narrative Save',
            huntersTitle: 'Star Hunters',
            huntersSubtitle: 'Open the hunter page to switch outfits for unlocked characters. Story appearances will follow your current selection.',
            huntersUnlocked: function (params) { return `Unlocked ${params.current}/${params.total}`; },
            huntersSwappable: function (params) { return `${params.count} hunter(s) can switch outfits`; },
            enterHunters: 'Open Star Hunters',
            huntersPageSubtitle: 'Unlocked hunters can switch outfits, and their story portraits will update automatically.',
            hoverSelect: 'Select',
            currentOutfit: 'Current Outfit',
            outfitHint: 'After switching, this character will use the selected portrait in story scenes.',
            primaryOutfit: 'Default Outfit',
            altOutfit: '2.0 Outfit',
            onlyPrimaryOutfit: 'Only the default outfit is available',
            viewShortDialogue: 'View Short Dialogue',
            adventureIntelTitle: 'Current Intel',
            adventureObjective: function (params) { return `Objective: ${params.value || 'None'}`; },
            adventureVisibleActors: function (params) { return `Visible characters: ${params.value || 'None'}`; },
            adventureVisibleItems: function (params) { return `Visible objects: ${params.value || 'None'}`; },
            adventureExits: function (params) { return `Available exits: ${params.value || 'None'}`; },
            adventureInventory: function (params) { return `Inventory: ${params.value || 'Empty'}`; },
            adventureCommand: function (params) { return `Action command: ${params.value}`; },
            adventureHints: function (params) { return `Suggested: ${params.value}`; },
            adventureLogTitle: 'Command Log',
            dialogueContinue: 'Continue',
            dialogueNext: 'Next',
            dialogueHint: 'Click anywhere on the dialogue panel or press Space / Enter to continue.',
            archiveRoom: 'Archive Room',
            archiveRoomHint: 'Unlocked entries can be read immediately. Locked entries open through the main story or hidden missions.',
            archiveLockedPrefix: 'Locked · ',
            archiveLockedNotice: 'This archive entry is still locked. Continue the main story or search for hidden clues first.',
            resultStats: function (params) { return `Score ${params.score}  ·  Max Combo ${params.combo}`; },
            resultFragments: function (params) { return `Crystal shards: ${params.current}/2`; },
            resultNewArchives: 'New Archives',
            gameOverStats: function (params) { return `This run: ${params.score}  ·  Max Combo: ${params.combo}`; },
            menuEnterHub: 'The bar hub is online. Talk with the crew first, then continue the story.'
        }
    };

    const ADVENTURE_COMMAND_TEXT = {
        zh: {
            look: { label: '查看', seed: '查看' },
            go: { label: '前往', seed: '前往' },
            talk: { label: '对话', seed: '对话' },
            take: { label: '拿', seed: '拿' },
            use: { label: '使用', seed: '使用' },
            inventory: { label: '背包', command: '背包' },
            objective: { label: '目标', command: '目标' },
            help: { label: '帮助', command: '帮助' }
        },
        en: {
            look: { label: 'Look', seed: 'look ' },
            go: { label: 'Go', seed: 'go ' },
            talk: { label: 'Talk', seed: 'talk ' },
            take: { label: 'Take', seed: 'take ' },
            use: { label: 'Use', seed: 'use ' },
            inventory: { label: 'Inventory', command: 'inventory' },
            objective: { label: 'Objective', command: 'objective' },
            help: { label: 'Help', command: 'help' }
        }
    };

    function formatUiText(template, params) {
        return String(template || '').replace(/\{(\w+)\}/g, function (_, key) {
            return params && params[key] != null ? String(params[key]) : '';
        });
    }

    function uiText(key, params) {
        const pack = UI_TEXT[currentLanguage] || UI_TEXT.zh;
        const entry = pack[key];
        if (typeof entry === 'function') return entry(params || {});
        return formatUiText(entry, params || {});
    }

    function normalizeLanguage(language) {
        return language === 'en' ? 'en' : 'zh';
    }

    function getSavedLanguage() {
        try {
            return normalizeLanguage(localStorage.getItem(LANGUAGE_STORAGE_KEY) || 'zh');
        } catch (error) {
            return 'zh';
        }
    }

    function isPlainObject(value) {
        return !!value && Object.prototype.toString.call(value) === '[object Object]';
    }

    function isLocalizedValue(value) {
        return isPlainObject(value) && ('zh' in value || 'en' in value);
    }

    function deepClone(value) {
        if (Array.isArray(value)) return value.map(deepClone);
        if (isPlainObject(value)) {
            const cloned = {};
            for (const [key, child] of Object.entries(value)) cloned[key] = deepClone(child);
            return cloned;
        }
        return value;
    }

    function deepMergeLocalized(base, overlay) {
        if (overlay === undefined) return deepClone(base);
        if (Array.isArray(base) && Array.isArray(overlay)) {
            const length = Math.max(base.length, overlay.length);
            const merged = [];
            for (let index = 0; index < length; index += 1) {
                if (index < base.length && index < overlay.length) merged[index] = deepMergeLocalized(base[index], overlay[index]);
                else if (index < overlay.length) merged[index] = deepClone(overlay[index]);
                else merged[index] = deepClone(base[index]);
            }
            return merged;
        }
        if (isPlainObject(base) && isPlainObject(overlay) && !isLocalizedValue(base) && !isLocalizedValue(overlay)) {
            const merged = {};
            const keys = new Set([].concat(Object.keys(base), Object.keys(overlay)));
            for (const key of keys) {
                if (key in base && key in overlay) merged[key] = deepMergeLocalized(base[key], overlay[key]);
                else if (key in overlay) merged[key] = deepClone(overlay[key]);
                else merged[key] = deepClone(base[key]);
            }
            return merged;
        }
        return deepClone(overlay);
    }

    function localizeNode(value, language) {
        if (isLocalizedValue(value)) {
            const localized = value[language] != null ? value[language] : value.zh != null ? value.zh : value.en;
            return localizeNode(localized, language);
        }
        if (Array.isArray(value)) return value.map(function (entry) { return localizeNode(entry, language); });
        if (isPlainObject(value)) {
            const localized = {};
            for (const [key, child] of Object.entries(value)) localized[key] = localizeNode(child, language);
            return localized;
        }
        return value;
    }

    function buildLocalizedStoryData(language) {
        const normalizedLanguage = normalizeLanguage(language);
        const overlay = rawStoryData.locales && rawStoryData.locales[normalizedLanguage]
            ? rawStoryData.locales[normalizedLanguage]
            : null;
        const merged = overlay ? deepMergeLocalized(rawStoryData, overlay) : deepClone(rawStoryData);
        const localized = localizeNode(merged, normalizedLanguage);
        delete localized.locales;
        return localized;
    }

    let currentLanguage = getSavedLanguage();
    let storyData = buildLocalizedStoryData(currentLanguage);
    setDocumentLanguage(currentLanguage);

    function setDocumentLanguage(language) {
        document.documentElement.lang = language === 'en' ? 'en' : 'zh-CN';
    }

    function shouldShowLanguageSwitcher() {
        return gameState === STATE.MENU
            || gameState === STATE.HUB
            || gameState === STATE.HUNTERS
            || gameState === STATE.ARCHIVE
            || gameState === STATE.ADVENTURE;
    }

    function syncLanguageSwitcherUi() {
        languageSwitcher.style.display = shouldShowLanguageSwitcher() ? 'flex' : 'none';
        const buttons = languageSwitcher.querySelectorAll('.language-switch-button');
        buttons.forEach(function (button) {
            const isActive = button.dataset.language === currentLanguage;
            button.classList.toggle('active', isActive);
            button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
    }

    function applyLanguage(language, options) {
        const settings = options || {};
        const normalizedLanguage = normalizeLanguage(language);
        currentLanguage = normalizedLanguage;
        if (settings.persist !== false) {
            try {
                localStorage.setItem(LANGUAGE_STORAGE_KEY, currentLanguage);
            } catch (error) {
                console.warn('无法保存语言设置。', error);
            }
        }

        setDocumentLanguage(currentLanguage);
        storyData = buildLocalizedStoryData(currentLanguage);

        if (narrativeProgress) {
            selectedArchiveId = sceneApi.getNextVisibleArchive(storyData, narrativeProgress, selectedArchiveId);
            if (currentAdventureScene) {
                const scene = getCurrentSceneDefinition();
                if (scene && scene.type === 'adventure') {
                    currentAdventureScene = scene;
                    currentAdventureConfig = storyData.adventures[scene.adventureId];
                }
            }
            if (currentMissionConfig) {
                currentMissionConfig = storyData.missions[currentMissionConfig.id] || currentMissionConfig;
            }
            selectedHunterId = getSelectableHunterId(selectedHunterId);
        }

        syncLanguageSwitcherUi();
        syncAdventureInputUi();
    }

    // 首页太阳系构图：中心写实地球 + 六颗环绕小行星/行星。
    const MENU_PLANET_CONFIGS = {
        center: {
            id: 'earth-prime',
            radiusFactor: 0.155,
            rotateSpeed: 0.085,
            cloudSpeed: 0.18,
            phase: 0.5,
            style: 'earth',
            glow: 'rgba(96,170,255,0.34)',
            accent: '#eef8ff',
            baseColor: '#143d78',
            ringColor: 'rgba(208,170,116,0.20)',
            atmosphereColor: 'rgba(122,196,255,0.46)'
        },
        satellites: [
            { id: 'sat-ice',      radiusFactor: 0.070, orbitFactor: 2.95, orbitTilt: 0.58, orbitSpeed: 0.055, phase: 3.95, selfRotateSpeed: 0.18, cloudSpeed: 0.16, style: 'ice',      glow: 'rgba(132,214,255,0.36)', accent: '#f4fbff', baseColor: '#7cb6ec', ringColor: null },
            { id: 'sat-verdant',  radiusFactor: 0.072, orbitFactor: 2.85, orbitTilt: 0.53, orbitSpeed: 0.050, phase: 5.18, selfRotateSpeed: 0.16, cloudSpeed: 0.14, style: 'forest',   glow: 'rgba(128,206,120,0.34)', accent: '#e8f4cb', baseColor: '#54773e', ringColor: null },
            { id: 'sat-ocean',    radiusFactor: 0.071, orbitFactor: 3.05, orbitTilt: 0.60, orbitSpeed: 0.060, phase: 2.80, selfRotateSpeed: 0.22, cloudSpeed: 0.20, style: 'ocean',    glow: 'rgba(84,150,255,0.30)', accent: '#c0ddff', baseColor: '#1d4da6', ringColor: null },
            { id: 'sat-cyber',    radiusFactor: 0.070, orbitFactor: 3.00, orbitTilt: 0.57, orbitSpeed: 0.057, phase: 0.78, selfRotateSpeed: 0.24, cloudSpeed: 0.28, style: 'cyber',    glow: 'rgba(142,118,255,0.34)', accent: '#e0caff', baseColor: '#33295d', ringColor: null },
            { id: 'sat-ember',    radiusFactor: 0.074, orbitFactor: 3.30, orbitTilt: 0.64, orbitSpeed: 0.046, phase: 2.15, selfRotateSpeed: 0.17, cloudSpeed: 0.08, style: 'ember',    glow: 'rgba(255,150,72,0.40)', accent: '#ffd7a0', baseColor: '#8c3d08', ringColor: null },
            { id: 'sat-volcanic', radiusFactor: 0.073, orbitFactor: 3.24, orbitTilt: 0.66, orbitSpeed: 0.044, phase: 1.00, selfRotateSpeed: 0.15, cloudSpeed: 0.08, style: 'volcanic', glow: 'rgba(255,108,90,0.30)', accent: '#ffc0b2', baseColor: '#4f4043', ringColor: null }
        ]
    };

    let W = 0;
    let H = 0;
    let pointerX = 0;
    let pointerY = 0;
    let pointerActive = false;
    let mouseOnCanvas = false;
    let hoveredButtonId = null;
    let uiButtons = [];

    let gameState = STATE.MENU;
    let highScore = parseInt(localStorage.getItem('starHunterHighScore') || '0', 10);
    let gameTime = 0;
    let difficultyLevel = 1;
    let difficultyTimer = 0;
    let flashAlpha = 0;

    let score = 0;
    let comboCount = 0;
    let comboTimer = 0;
    let maxCombo = 0;

    let stars = [];
    let menuLightParticles = [];
    let particles = [];
    let shakeAmount = 0;
    let shakeDuration = 0;
    let shakeX = 0;
    let shakeY = 0;

    const player = {
        x: 0,
        y: 0,
        targetX: 0,
        targetY: 0,
        width: 36,
        height: 44,
        lives: 5,
        maxLives: 5,
        shieldActive: false,
        tripleShot: false,
        tripleShotTimer: 0,
        rapidFire: false,
        rapidFireTimer: 0,
        fireCooldown: 0,
        baseFireRate: 0.16,
        engineFlame: 0
    };

    let bullets = [];
    let enemies = [];
    let powerUps = [];
    let floatingTexts = [];

    let narrativeProgress = sceneApi.loadProgress(storyData);
    let selectedArchiveId = sceneApi.getNextVisibleArchive(storyData, narrativeProgress, 'overview');
    let selectedHunterId = storyData.characterCards[0] ? storyData.characterCards[0].id : null;
    let currentDialogue = null;
    let currentDialogueIndex = 0;
    let currentAdventureScene = null;
    let currentAdventureConfig = null;
    let currentAdventureSession = null;
    let adventureTalkPortraitFx = null;
    let currentMissionConfig = null;
    let currentMissionFlow = null;
    let missionRuntime = null;
    let resultState = null;
    let gameOverState = null;
    let overlayNotice = { text: '', timer: 0, color: '#ffd36a' };
    let archiveNotice = '';
    let chapterBannerTimer = 0;
    let chapterBannerText = '';
    let storyResetConfirmUntil = 0;
    const assetBank = {
        images: {},
        audio: { bgm: {}, sfx: {} },
        audioUnlocked: false,
        currentBgmKey: null
    };

    function resizeCanvas() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
        resetPlayerPosition();
        initStars();
    }

    function initMenuLightParticles() {
        const count = Math.max(36, Math.floor((W * H) / 36000));
        menuLightParticles = [];
        for (let index = 0; index < count; index += 1) {
            menuLightParticles.push({
                x: Math.random() * W,
                y: H * (0.16 + Math.random() * 0.70),
                vx: 16 + Math.random() * 34,
                vy: (Math.random() - 0.5) * 18,
                size: 1 + Math.random() * 2.8,
                hue: 188 + Math.random() * 48,
                alpha: 0.22 + Math.random() * 0.55,
                lifeOffset: Math.random() * Math.PI * 2
            });
        }
    }

    function resetPlayerPosition() {
        player.x = W / 2;
        player.y = H * 0.72;
        player.targetX = player.x;
        player.targetY = player.y;
        pointerX = player.x;
        pointerY = player.y;
    }

    function syncCursor() {
        const hidden = gameState === STATE.MISSION;
        document.body.style.cursor = hidden ? 'none' : 'default';
        canvas.style.cursor = hidden ? 'none' : 'default';
        canvas.dataset.mode = gameState;
    }

    function colorFromHue(hue, alpha) {
        return `hsla(${hue}, 100%, 72%, ${alpha == null ? 1 : alpha})`;
    }

    function createAssetUrl(relativePath) {
        return new URL(relativePath, window.location.href).href;
    }

    function registerImageAsset(key, relativePath) {
        const image = new Image();
        const record = { image: image, loaded: false, failed: false, path: relativePath };
        image.onload = function () {
            record.loaded = true;
        };
        image.onerror = function () {
            record.failed = true;
            console.warn('图片加载失败:', relativePath);
        };
        image.src = createAssetUrl(relativePath);
        assetBank.images[key] = record;
    }

    function registerAudioAsset(group, key, relativePath, options) {
        const audio = new Audio(createAssetUrl(relativePath));
        audio.preload = 'auto';
        audio.loop = !!options.loop;
        audio.volume = options.volume;
        assetBank.audio[group][key] = audio;
    }

    function preloadAssets() {
        const manifest = storyData.assetManifest;
        for (const [key, relativePath] of Object.entries(manifest.backgrounds)) {
            registerImageAsset(`background:${key}`, relativePath);
        }
        for (const [key, portraitSet] of Object.entries(manifest.portraits)) {
            registerImageAsset(`portrait:${key}:primary`, portraitSet.primary);
            if (portraitSet.alt) registerImageAsset(`portrait:${key}:alt`, portraitSet.alt);
        }
        for (const [key, relativePath] of Object.entries(manifest.audio.bgm)) {
            registerAudioAsset('bgm', key, relativePath, {
                loop: true,
                volume: key === 'hub' ? 0.36 : 0.42
            });
        }
        for (const [key, relativePath] of Object.entries(manifest.audio.sfx)) {
            registerAudioAsset('sfx', key, relativePath, {
                loop: false,
                volume: key === 'dialogue' ? 0.52 : 0.68
            });
        }
    }

    function getImageAsset(key) {
        const record = assetBank.images[key];
        if (!record || !record.loaded || record.failed) return null;
        return record.image;
    }

    function drawImageCover(image, x, y, w, h, alpha, radius) {
        if (!image || !image.naturalWidth || !image.naturalHeight) return;
        const imageRatio = image.naturalWidth / image.naturalHeight;
        const boxRatio = w / h;
        let drawWidth = w;
        let drawHeight = h;
        let offsetX = x;
        let offsetY = y;

        if (imageRatio > boxRatio) {
            drawHeight = h;
            drawWidth = h * imageRatio;
            offsetX = x - (drawWidth - w) / 2;
        } else {
            drawWidth = w;
            drawHeight = w / imageRatio;
            offsetY = y - (drawHeight - h) / 2;
        }

        ctx.save();
        if (alpha != null) ctx.globalAlpha = alpha;
        if (radius) {
            ui.drawGlassPanel(ctx, {
                x: x,
                y: y,
                w: w,
                h: h,
                radius: radius,
                fill: 'rgba(0,0,0,0)',
                stroke: 'rgba(0,0,0,0)',
                shadow: 'rgba(0,0,0,0)'
            });
            ctx.beginPath();
            const r = Math.min(radius, Math.min(w, h) / 2);
            ctx.moveTo(x + r, y);
            ctx.arcTo(x + w, y, x + w, y + h, r);
            ctx.arcTo(x + w, y + h, x, y + h, r);
            ctx.arcTo(x, y + h, x, y, r);
            ctx.arcTo(x, y, x + w, y, r);
            ctx.closePath();
            ctx.clip();
        }
        ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
        ctx.restore();
    }

    function drawArtworkFrame(image, x, y, w, h, options) {
        const opts = options || {};
        ui.drawGlassPanel(ctx, {
            x: x,
            y: y,
            w: w,
            h: h,
            radius: opts.radius || 22,
            fill: opts.fill || 'rgba(8,12,26,0.52)',
            stroke: opts.stroke || 'rgba(255,255,255,0.16)',
            shadow: 'rgba(0,0,0,0)'
        });
        if (image) {
            drawImageCover(image, x + 2, y + 2, w - 4, h - 4, opts.alpha == null ? 0.96 : opts.alpha, (opts.radius || 22) - 4);
        }
        if (opts.overlay) {
            ctx.save();
            ctx.fillStyle = opts.overlay;
            ctx.beginPath();
            const radius = Math.min((opts.radius || 22) - 4, Math.min(w - 4, h - 4) / 2);
            const ix = x + 2;
            const iy = y + 2;
            const iw = w - 4;
            const ih = h - 4;
            ctx.moveTo(ix + radius, iy);
            ctx.arcTo(ix + iw, iy, ix + iw, iy + ih, radius);
            ctx.arcTo(ix + iw, iy + ih, ix, iy + ih, radius);
            ctx.arcTo(ix, iy + ih, ix, iy, radius);
            ctx.arcTo(ix, iy, ix + iw, iy, radius);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
    }

    function getPortraitImageKey(portraitKey, preferredVariant) {
        if (!portraitKey) return null;
        const normalizedVariant = normalizePortraitVariant(portraitKey, preferredVariant);
        const preferredKey = normalizedVariant ? `portrait:${portraitKey}:${normalizedVariant}` : null;
        const primaryKey = assetBank.images[`portrait:${portraitKey}:primary`] ? `portrait:${portraitKey}:primary` : null;
        const altKey = assetBank.images[`portrait:${portraitKey}:alt`] ? `portrait:${portraitKey}:alt` : null;
        if (preferredKey && getImageAsset(preferredKey)) return preferredKey;
        if (primaryKey && getImageAsset(primaryKey)) return primaryKey;
        if (altKey && getImageAsset(altKey)) return altKey;
        return preferredKey || primaryKey || altKey;
    }

    function getSpeakerPortraitKey(speaker) {
        return storyData.assetManifest.speakerPortraitMap[speaker] || null;
    }

    function getArchiveArtworkKey(archiveId) {
        return storyData.assetManifest.archivePortraitMap[archiveId] || null;
    }

    function getCurrentAdventureRoom() {
        if (!currentAdventureConfig || !currentAdventureSession) return null;
        return adventureEngine.getRoom(currentAdventureConfig, currentAdventureSession.roomId);
    }

    function getSceneBackgroundAssetKey() {
        if (gameState === STATE.MENU) return 'background:menuTitle';
        if (gameState === STATE.HUB) return 'background:hub';
        if (gameState === STATE.HUNTERS) return 'background:hubDetail';
        if (gameState === STATE.ARCHIVE) return 'background:hubDetail';
        if (gameState === STATE.ADVENTURE) {
            const room = getCurrentAdventureRoom();
            return room && room.backgroundKey ? `background:${room.backgroundKey}` : 'background:hubDetail';
        }
        if (gameState === STATE.DIALOGUE) {
            if (currentDialogue && currentDialogue.location) {
                if (currentDialogue.location.indexOf('MIR-z11') >= 0) return 'background:deepWellCity';
                if (currentDialogue.location.indexOf('银河系中心酒吧') >= 0 || currentDialogue.location.indexOf('Galactic Center Bar') >= 0) return 'background:hub';
            }
            return 'background:hubDetail';
        }
        if ((gameState === STATE.MISSION || gameState === STATE.RESULT || gameState === STATE.GAMEOVER) && currentMissionConfig) {
            if (currentMissionConfig.id === 'signalBreakthrough') return 'background:signalBreakthrough';
            if (currentMissionConfig.id === 'homewardBeacon') return 'background:homewardBeacon';
            if (currentMissionConfig.id === 'deepWellEscape') {
                if (gameState === STATE.MISSION && missionRuntime) {
                    const phaseInfo = getCurrentMissionPhaseInfo();
                    if (phaseInfo.index === 0) return 'background:mine';
                    if (phaseInfo.index === 1) return 'background:deepWellCity';
                }
                return 'background:station';
            }
        }
        return null;
    }

    function unlockAudio() {
        if (assetBank.audioUnlocked) return;
        assetBank.audioUnlocked = true;
        syncSceneAudio();
    }

    function playSfx(name) {
        if (!assetBank.audioUnlocked) return;
        const audio = assetBank.audio.sfx[name];
        if (!audio) return;
        try {
            audio.pause();
            audio.currentTime = 0;
            const promise = audio.play();
            if (promise && typeof promise.catch === 'function') promise.catch(function () {});
        } catch (error) {
            console.warn('音效播放失败:', name, error);
        }
    }

    function resolveSceneBgm() {
        if (gameState === STATE.MISSION || gameState === STATE.GAMEOVER) {
            return currentMissionFlow && currentMissionFlow.kind === 'hidden' ? 'hidden' : 'mainline';
        }
        if (gameState === STATE.DIALOGUE && currentDialogue && currentDialogue.location && currentDialogue.location.indexOf('MIR-z11') >= 0) {
            return 'hidden';
        }
        if (
            gameState === STATE.MENU
            || gameState === STATE.HUB
            || gameState === STATE.HUNTERS
            || gameState === STATE.ARCHIVE
            || gameState === STATE.ADVENTURE
            || gameState === STATE.RESULT
            || gameState === STATE.DIALOGUE
        ) {
            return 'hub';
        }
        return null;
    }

    function syncSceneAudio() {
        if (!assetBank.audioUnlocked) return;
        const nextBgmKey = resolveSceneBgm();
        if (assetBank.currentBgmKey === nextBgmKey) return;

        if (assetBank.currentBgmKey && assetBank.audio.bgm[assetBank.currentBgmKey]) {
            assetBank.audio.bgm[assetBank.currentBgmKey].pause();
        }

        assetBank.currentBgmKey = nextBgmKey;
        if (!nextBgmKey) return;

        const audio = assetBank.audio.bgm[nextBgmKey];
        if (!audio) return;
        try {
            audio.currentTime = 0;
            const promise = audio.play();
            if (promise && typeof promise.catch === 'function') promise.catch(function () {});
        } catch (error) {
            console.warn('BGM 播放失败:', nextBgmKey, error);
        }
    }

    function setGameState(nextState) {
        gameState = nextState;
        syncCursor();
        syncSceneAudio();
        syncLanguageSwitcherUi();
        syncAdventureInputUi();
    }

    function clearAdventureState() {
        currentAdventureScene = null;
        currentAdventureConfig = null;
        currentAdventureSession = null;
        adventureTalkPortraitFx = null;
    }

    function getAdventureViewModel() {
        if (!currentAdventureConfig || !currentAdventureSession) return null;
        return adventureEngine.getViewModel(currentAdventureConfig, currentAdventureSession);
    }

    function updateAdventureTalkPortraitFx(dt) {
        if (!adventureTalkPortraitFx) return;
        adventureTalkPortraitFx.timer -= dt;
        if (adventureTalkPortraitFx.timer <= 0) adventureTalkPortraitFx = null;
    }

    function triggerAdventureTalkPortrait(portraitKey, actorName) {
        const resolvedPortraitKey = portraitKey || getSpeakerPortraitKey(actorName) || null;
        if (!resolvedPortraitKey) return;
        const portraitAssetKey = getPortraitImageKey(
            resolvedPortraitKey,
            getHunterCardById(resolvedPortraitKey) ? getHunterOutfitVariant(resolvedPortraitKey) : 'primary'
        );
        if (!getImageAsset(portraitAssetKey)) return;
        adventureTalkPortraitFx = {
            portraitKey: resolvedPortraitKey,
            actorName: actorName || '',
            duration: 3.2,
            timer: 3.2
        };
    }

    function drawAdventureTalkPortraitFx() {
        if (gameState !== STATE.ADVENTURE || !adventureTalkPortraitFx) return;
        const portraitAssetKey = getPortraitImageKey(
            adventureTalkPortraitFx.portraitKey,
            getHunterCardById(adventureTalkPortraitFx.portraitKey) ? getHunterOutfitVariant(adventureTalkPortraitFx.portraitKey) : 'primary'
        );
        const portraitImage = getImageAsset(portraitAssetKey);
        if (!portraitImage) return;

        const progress = 1 - (adventureTalkPortraitFx.timer / adventureTalkPortraitFx.duration);
        const fadeIn = Math.min(1, progress / 0.16);
        const fadeOut = Math.min(1, adventureTalkPortraitFx.timer / 0.95);
        const alpha = 0.92 * fadeIn * fadeOut;
        if (alpha <= 0.01) return;

        const panelW = Math.min(360, W * (W < 960 ? 0.40 : 0.28));
        const panelH = Math.min(H * 0.60, panelW * 1.44);
        const panelX = Math.max(16, W - panelW - Math.max(18, W * 0.024));
        const panelY = Math.max(92, H * 0.15 + Math.sin(gameTime * 2.1) * 8);

        ctx.save();
        ctx.globalAlpha = alpha;

        const glow = ctx.createRadialGradient(
            panelX + panelW * 0.50,
            panelY + panelH * 0.34,
            panelW * 0.08,
            panelX + panelW * 0.50,
            panelY + panelH * 0.48,
            panelW * 0.86
        );
        glow.addColorStop(0, 'rgba(122,176,255,0.38)');
        glow.addColorStop(0.56, 'rgba(108,148,255,0.16)');
        glow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = glow;
        ctx.fillRect(panelX - 28, panelY - 28, panelW + 56, panelH + 56);

        drawArtworkFrame(portraitImage, panelX, panelY, panelW, panelH, {
            radius: 28,
            alpha: 0.99,
            fill: 'rgba(10,16,34,0.24)',
            stroke: 'rgba(255,255,255,0.14)'
        });

        const overlay = ctx.createLinearGradient(panelX, panelY, panelX, panelY + panelH);
        overlay.addColorStop(0, 'rgba(8,12,24,0.00)');
        overlay.addColorStop(0.68, 'rgba(8,12,24,0.08)');
        overlay.addColorStop(1, 'rgba(8,12,24,0.36)');
        ctx.fillStyle = overlay;
        ctx.beginPath();
        ctx.roundRect(panelX + 2, panelY + 2, panelW - 4, panelH - 4, 24);
        ctx.fill();

        if (adventureTalkPortraitFx.actorName) {
            ctx.fillStyle = 'rgba(255,255,255,0.82)';
            ctx.font = 'bold 24px "PingFang SC","Microsoft YaHei",sans-serif';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'alphabetic';
            ctx.fillText(adventureTalkPortraitFx.actorName, panelX + panelW - 18, panelY + panelH - 18);
        }
        ctx.restore();
    }

    function focusAdventureInput() {
        if (gameState !== STATE.ADVENTURE) return;
        setTimeout(function () {
            adventureCommandInput.focus();
            adventureCommandInput.select();
        }, 0);
    }

    function persistAdventureSession() {
        if (!currentAdventureConfig || !currentAdventureSession) return;
        sceneApi.setAdventureSession(narrativeProgress, currentAdventureConfig.id, currentAdventureSession);
        sceneApi.saveProgress(storyData, narrativeProgress);
    }

    function syncAdventureInputUi() {
        const visible = gameState === STATE.ADVENTURE && !!currentAdventureConfig && !!currentAdventureSession;
        adventureInputLayer.style.display = visible ? 'block' : 'none';
        adventureInputLayer.setAttribute('aria-hidden', visible ? 'false' : 'true');
        const commandPack = ADVENTURE_COMMAND_TEXT[currentLanguage] || ADVENTURE_COMMAND_TEXT.zh;
        adventureQuickVerbs.querySelectorAll('.quick-verb').forEach(function (button) {
            const commandKey = button.dataset.commandKey || button.dataset.verbKey;
            const spec = commandPack[commandKey];
            if (!spec) return;
            button.textContent = spec.label;
            if (spec.command) button.dataset.commandValue = spec.command;
            if (spec.seed) button.dataset.seedValue = spec.seed;
        });
        if (!visible) return;

        const view = getAdventureViewModel();
        const missionHint = uiText('adventureStatusPrompt', { command: view && view.missionCommand });
        adventureStatus.textContent = `${view.objective || currentAdventureConfig.subtitle || ''} ${missionHint}`.trim();
        adventureCommandInput.placeholder = uiText('adventurePlaceholder', {
            example: view && view.hints && view.hints.length ? view.hints[0] : ''
        });
    }

    function startAdventureScene(scene) {
        const adventure = storyData.adventures[scene.adventureId];
        if (!adventure) {
            setOverlayNotice(uiText('adventureMissingScene', { id: scene.adventureId }), '#ff9b8d');
            goToHub();
            return;
        }

        clearCombatEntities();
        currentDialogue = null;
        currentDialogueIndex = 0;
        resultState = null;
        gameOverState = null;
        currentMissionConfig = null;
        currentMissionFlow = null;
        missionRuntime = null;
        currentAdventureScene = scene;
        currentAdventureConfig = adventure;
        currentAdventureSession = adventureEngine.startSession(adventure, sceneApi.getAdventureSession(narrativeProgress, adventure.id), {
            entryTitle: scene.title
        });
        persistAdventureSession();
        chapterBannerText = scene.title || adventure.title;
        chapterBannerTimer = 2.0;
        setGameState(STATE.ADVENTURE);
        focusAdventureInput();
    }

    function submitAdventureCommand(rawCommand) {
        if (!currentAdventureConfig || !currentAdventureSession) return;
        const result = adventureEngine.executeCommand(currentAdventureConfig, currentAdventureSession, rawCommand, currentLanguage);
        currentAdventureSession = result.session;
        persistAdventureSession();
        syncAdventureInputUi();

        if (result.talkedPortraitKey || result.talkedActorName) {
            triggerAdventureTalkPortrait(result.talkedPortraitKey, result.talkedActorName);
        }

        if (result.startedMission) {
            playSfx('objective');
            adventureCommandInput.value = '';
            startMissionFromFlow(result.startedMission);
            return;
        }

        if (result.text) {
            playSfx('dialogue');
        }
        adventureCommandInput.value = '';
    }

    function setOverlayNotice(text, color) {
        overlayNotice.text = text;
        overlayNotice.timer = 4.5;
        overlayNotice.color = color || '#ffd36a';
    }

    function getHiddenForceTapCount() {
        return narrativeProgress.flags.hiddenForceTapCount || 0;
    }

    function resetHiddenForceTapCount(shouldPersist) {
        if (!narrativeProgress.flags.hiddenForceTapCount) return;
        narrativeProgress.flags.hiddenForceTapCount = 0;
        if (shouldPersist) sceneApi.saveProgress(storyData, narrativeProgress);
    }

    function isHiddenForceUnlockEligible(hiddenStory) {
        return !!hiddenStory
            && narrativeProgress.chapterCompleted
            && !sceneApi.isHiddenStoryUnlocked(narrativeProgress, hiddenStory.id)
            && narrativeProgress.hiddenFragments < hiddenStory.unlockFragments;
    }

    function getHunterCardById(hunterId) {
        return storyData.characterCards.find(function (card) {
            return card.id === hunterId;
        }) || null;
    }

    function getHunterArchiveEntry(hunterId) {
        return storyData.archiveEntries[hunterId] || null;
    }

    function isHunterUnlocked(hunterId) {
        return sceneApi.canAccessConversation(narrativeProgress, hunterId);
    }

    function getUnlockedHunterCards() {
        return storyData.characterCards.filter(function (card) {
            return isHunterUnlocked(card.id);
        });
    }

    function getSelectableHunterId(preferredHunterId) {
        if (preferredHunterId && isHunterUnlocked(preferredHunterId)) return preferredHunterId;
        if (selectedHunterId && isHunterUnlocked(selectedHunterId)) return selectedHunterId;
        const firstUnlocked = getUnlockedHunterCards()[0];
        if (firstUnlocked) return firstUnlocked.id;
        return storyData.characterCards[0] ? storyData.characterCards[0].id : null;
    }

    function getHunterOutfitSelections() {
        if (!narrativeProgress.flags) narrativeProgress.flags = {};
        if (!narrativeProgress.flags.hunterOutfits) narrativeProgress.flags.hunterOutfits = {};
        return narrativeProgress.flags.hunterOutfits;
    }

    function hunterHasAltPortrait(hunterId) {
        const portraitSet = storyData.assetManifest.portraits[hunterId];
        return !!(portraitSet && portraitSet.alt);
    }

    function normalizePortraitVariant(portraitKey, preferredVariant) {
        const portraitSet = storyData.assetManifest.portraits[portraitKey];
        if (!portraitSet) return null;
        const wantsAlt = preferredVariant === true || preferredVariant === 'alt';
        if (wantsAlt && portraitSet.alt) return 'alt';
        if (portraitSet.primary) return 'primary';
        return portraitSet.alt ? 'alt' : null;
    }

    function getHunterOutfitVariant(hunterId) {
        const savedVariant = getHunterOutfitSelections()[hunterId];
        return normalizePortraitVariant(hunterId, savedVariant) || 'primary';
    }

    function setHunterOutfitVariant(hunterId, variant) {
        if (!isHunterUnlocked(hunterId)) {
            setOverlayNotice(uiText('hunterLockedOutfit'), '#ffd49a');
            return;
        }
        const normalizedVariant = normalizePortraitVariant(hunterId, variant) || 'primary';
        const hunterOutfits = getHunterOutfitSelections();
        if (normalizedVariant === 'primary') delete hunterOutfits[hunterId];
        else hunterOutfits[hunterId] = normalizedVariant;
        sceneApi.saveProgress(storyData, narrativeProgress);
        setOverlayNotice(
            uiText('hunterOutfitSwitched', {
                name: getHunterCardById(hunterId).name,
                variant: normalizedVariant
            }),
            '#9fddff'
        );
    }

    function openHunters(preferredHunterId) {
        selectedHunterId = getSelectableHunterId(preferredHunterId);
        setGameState(STATE.HUNTERS);
    }

    function initStars() {
        stars = [];
        for (let layer = 0; layer < 3; layer += 1) {
            const count = Math.floor((W * H) / (8000 / (layer + 1)));
            for (let index = 0; index < count; index += 1) {
                stars.push({
                    x: Math.random() * W,
                    y: Math.random() * H,
                    r: Math.random() * (1.2 + layer * 0.6) + 0.3,
                    speed: 0.3 + layer * 0.7 + Math.random() * 1.2,
                    driftX: (Math.random() - 0.5) * (0.35 + layer * 0.25),
                    twinkle: Math.random() * Math.PI * 2,
                    twinkleSpeed: 0.01 + Math.random() * 0.04,
                    hue: 200 + Math.random() * 40,
                    alpha: 0.4 + Math.random() * 0.6,
                    layer: layer,
                    lastDx: 0,
                    lastDy: 0
                });
            }
        }
    }

    function updateStars(dt) {
        const multiplier = gameState === STATE.HUB
            ? 0.35
            : gameState === STATE.ARCHIVE
                ? 0.2
                : gameState === STATE.MENU
                    ? 1.45
                    : 1;
        for (const star of stars) {
            star.lastDx = star.driftX * multiplier * dt * 60;
            star.lastDy = star.speed * multiplier * dt * 60;
            star.x += star.lastDx;
            star.y += star.lastDy;
            star.twinkle += star.twinkleSpeed * dt * 60;
            if (star.x > W + 6) star.x = -6;
            if (star.x < -6) star.x = W + 6;
            if (star.y > H + 5) {
                star.y = -5;
                star.x = Math.random() * W;
            }
        }
    }

    function drawStars() {
        const menuWarp = gameState === STATE.MENU;
        for (const star of stars) {
            const flicker = 0.6 + 0.4 * Math.sin(star.twinkle);
            const alpha = star.alpha * flicker;
            if (menuWarp) {
                const streak = 7 + star.layer * 7;
                ctx.strokeStyle = `hsla(${star.hue}, 78%, 78%, ${Math.min(0.72, alpha * 0.78)})`;
                ctx.lineWidth = Math.max(0.7, star.r * 1.18);
                ctx.beginPath();
                ctx.moveTo(star.x - star.lastDx * streak, star.y - star.lastDy * streak);
                ctx.lineTo(star.x + star.lastDx * 0.6, star.y + star.lastDy * 0.6);
                ctx.stroke();
            }
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${star.hue}, 60%, 80%, ${alpha})`;
            ctx.fill();
            if (star.r > 1.5 && flicker > 0.85) {
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.r * 2.5, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${star.hue}, 80%, 85%, ${alpha * 0.25})`;
                ctx.fill();
            }
        }
    }

    function spawnParticles(x, y, count, hue, speedRange, lifeRange, sizeRange) {
        for (let index = 0; index < count; index += 1) {
            const angle = Math.random() * Math.PI * 2;
            const speed = speedRange[0] + Math.random() * (speedRange[1] - speedRange[0]);
            const life = lifeRange[0] + Math.random() * (lifeRange[1] - lifeRange[0]);
            const size = sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]);
            particles.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life,
                maxLife: life,
                hue: hue + (Math.random() - 0.5) * 30,
                size,
                decay: 0.96 + Math.random() * 0.03
            });
        }
        if (particles.length > 600) particles.splice(0, particles.length - 600);
    }

    function updateParticles(dt) {
        for (let index = particles.length - 1; index >= 0; index -= 1) {
            const particle = particles[index];
            particle.life -= dt;
            particle.x += particle.vx * dt * 60;
            particle.y += particle.vy * dt * 60;
            particle.vx *= particle.decay;
            particle.vy *= particle.decay;
            particle.size *= 0.995;
            if (particle.life <= 0) particles.splice(index, 1);
        }
    }

    function drawParticles() {
        for (const particle of particles) {
            const alpha = Math.max(0, particle.life / particle.maxLife);
            const saturation = 80 + alpha * 20;
            const light = 40 + alpha * 40;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${particle.hue}, ${saturation}%, ${light}%, ${alpha})`;
            ctx.fill();
            if (particle.size > 2) {
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size * 2.2, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${particle.hue}, 90%, 60%, ${alpha * 0.3})`;
                ctx.fill();
            }
        }
    }

    function triggerShake(amount, duration) {
        shakeAmount = Math.max(shakeAmount, amount);
        shakeDuration = Math.max(shakeDuration, duration);
    }

    function updateShake(dt) {
        if (shakeDuration <= 0) return;
        shakeDuration -= dt;
        shakeX = (Math.random() - 0.5) * 2 * shakeAmount;
        shakeY = (Math.random() - 0.5) * 2 * shakeAmount;
        shakeAmount *= 0.85;
        if (shakeDuration <= 0) {
            shakeX = 0;
            shakeY = 0;
            shakeAmount = 0;
        }
    }

    function addFloatingText(x, y, text, color, size) {
        floatingTexts.push({
            x,
            y,
            text,
            color,
            size: size || 1,
            life: 1.2,
            maxLife: 1.2,
            vy: -2.5
        });
    }

    function updateFloatingTexts(dt) {
        for (let index = floatingTexts.length - 1; index >= 0; index -= 1) {
            const item = floatingTexts[index];
            item.life -= dt;
            item.y += item.vy * dt * 60;
            if (item.life <= 0) floatingTexts.splice(index, 1);
        }
    }

    function drawFloatingTexts() {
        for (const item of floatingTexts) {
            const alpha = item.life / item.maxLife;
            const scale = 1 + (1 - alpha) * 0.5;
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.fillStyle = item.color;
            ctx.font = `bold ${18 * item.size * scale}px "PingFang SC","Microsoft YaHei",sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowColor = item.color;
            ctx.shadowBlur = 10;
            ctx.fillText(item.text, item.x, item.y);
            ctx.shadowBlur = 0;
            ctx.restore();
        }
    }

    function resetPlayer() {
        resetPlayerPosition();
        player.lives = player.maxLives;
        player.shieldActive = false;
        player.tripleShot = false;
        player.tripleShotTimer = 0;
        player.rapidFire = false;
        player.rapidFireTimer = 0;
        player.fireCooldown = 0;
        player.engineFlame = 0;
    }

    function clearCombatEntities() {
        bullets = [];
        enemies = [];
        powerUps = [];
        particles = [];
        floatingTexts = [];
        shakeAmount = 0;
        shakeDuration = 0;
        shakeX = 0;
        shakeY = 0;
        flashAlpha = 0;
        difficultyTimer = 0;
        comboCount = 0;
        comboTimer = 0;
        maxCombo = 0;
    }

    function resetCombatState() {
        score = 0;
        difficultyLevel = 1;
        clearCombatEntities();
        resetPlayer();
    }

    function openArchive(archiveId) {
        selectedArchiveId = sceneApi.getNextVisibleArchive(storyData, narrativeProgress, archiveId);
        archiveNotice = '';
        setGameState(STATE.ARCHIVE);
        clearCombatEntities();
    }

    function goToHub(message) {
        clearCombatEntities();
        currentDialogue = null;
        currentDialogueIndex = 0;
        clearAdventureState();
        adventureCommandInput.blur();
        resultState = null;
        gameOverState = null;
        currentMissionConfig = null;
        currentMissionFlow = null;
        missionRuntime = null;
        setGameState(STATE.HUB);
        if (message) setOverlayNotice(message, '#ffe29a');
    }

    function clearNarrativeProgress() {
        narrativeProgress = sceneApi.createDefaultProgress(storyData);
        selectedArchiveId = sceneApi.getNextVisibleArchive(storyData, narrativeProgress, 'overview');
        selectedHunterId = getSelectableHunterId(storyData.characterCards[0] && storyData.characterCards[0].id);
        archiveNotice = '';
        storyResetConfirmUntil = 0;
        clearAdventureState();
        localStorage.removeItem(storyData.storageKey);
        sceneApi.saveProgress(storyData, narrativeProgress);
    }

    function handleStoryResetAction() {
        if (storyResetConfirmUntil > gameTime) {
            clearNarrativeProgress();
            goToHub(uiText('storyResetDone'));
            return;
        }
        storyResetConfirmUntil = gameTime + 4.5;
        setOverlayNotice(uiText('storyResetConfirm'), '#ffb59b');
    }

    function handleHiddenLockedAction(hiddenStory) {
        if (!hiddenStory) return;
        if (!isHiddenForceUnlockEligible(hiddenStory)) {
            resetHiddenForceTapCount(false);
            setOverlayNotice(uiText('hiddenNeedFragments'), '#ffd49a');
            return;
        }

        const nextCount = getHiddenForceTapCount() + 1;
        narrativeProgress.flags.hiddenForceTapCount = nextCount;

        if (nextCount >= 3) {
            narrativeProgress.hiddenUnlocked[hiddenStory.id] = true;
            narrativeProgress.flags.hiddenForceTapCount = 0;
            sceneApi.saveProgress(storyData, narrativeProgress);
            playSfx('archiveUnlock');
            setOverlayNotice(uiText('hiddenForceUnlocked'), '#8dcfff');
            return;
        }

        sceneApi.saveProgress(storyData, narrativeProgress);
        setOverlayNotice(uiText('hiddenForceProgress', {
            remaining: 3 - nextCount,
            current: nextCount
        }), '#ffd49a');
    }

    function maybeUnlockHiddenStories() {
        const unlocked = sceneApi.maybeUnlockHiddenStories(storyData, narrativeProgress);
        if (unlocked.length) {
            narrativeProgress.flags.hiddenForceTapCount = 0;
            sceneApi.saveProgress(storyData, narrativeProgress);
            setOverlayNotice(uiText('hiddenUnlocked'), '#8dcfff');
            playSfx('archiveUnlock');
            return true;
        }
        return false;
    }

    function getCurrentSceneDefinition() {
        return sceneApi.getCurrentScene(storyData, narrativeProgress);
    }

    function startDialogueSequence(dialogueData, options) {
        const settings = options || {};
        currentDialogue = {
            id: dialogueData.id || dialogueData.title,
            title: dialogueData.title,
            location: dialogueData.location,
            lines: dialogueData.lines.map(function (line) {
                return Object.assign({}, line, {
                    speakerKey: line.speakerKey || getSpeakerPortraitKey(line.speaker) || null
                });
            }),
            onComplete: settings.onComplete || null
        };
        currentDialogueIndex = 0;
        chapterBannerText = dialogueData.title;
        chapterBannerTimer = 1.8;
        clearCombatEntities();
        setGameState(STATE.DIALOGUE);
    }

    function continueMainline() {
        const scene = getCurrentSceneDefinition();
        if (!scene) {
            narrativeProgress.chapterCompleted = true;
            sceneApi.saveProgress(storyData, narrativeProgress);
            const unlockedHidden = maybeUnlockHiddenStories();
            goToHub(unlockedHidden ? '' : uiText('mainlineCompleted'));
            return;
        }

        if (scene.type === 'dialogue') {
            sceneApi.markDialogueSeen(narrativeProgress, scene.id);
            sceneApi.saveProgress(storyData, narrativeProgress);
            startDialogueSequence(scene, {
                onComplete: function () {
                    sceneApi.advanceMainline(storyData, narrativeProgress);
                    sceneApi.saveProgress(storyData, narrativeProgress);
                    if (scene.autoStartNext) continueMainline();
                    else {
                        const unlockedHidden = maybeUnlockHiddenStories();
                        goToHub(unlockedHidden ? '' : uiText('storyAdvanced'));
                    }
                }
            });
            return;
        }

        if (scene.type === 'adventure') {
            startAdventureScene(scene);
            return;
        }

        if (scene.type === 'mission') {
            startMissionFromFlow({
                kind: 'mainline',
                missionId: scene.missionId,
                sourceSceneId: scene.id,
                resultTitle: scene.resultTitle,
                resultText: scene.resultText,
                unlockArchives: scene.unlockArchives || [],
                unlockConversations: scene.unlockConversations || []
            });
        }
    }

    function startHiddenStory(hiddenStoryId) {
        const hiddenStory = storyData.hiddenStories[hiddenStoryId];
        if (!hiddenStory) return;
        startDialogueSequence(hiddenStory.introDialogue, {
            onComplete: function () {
                startMissionFromFlow({
                    kind: 'hidden',
                    hiddenStoryId: hiddenStoryId,
                    missionId: hiddenStory.missionId,
                    resultTitle: uiText('hiddenMissionCompleteTitle'),
                    resultText: uiText('hiddenMissionCompleteText'),
                    unlockArchives: ['maillenCaptain'],
                    unlockConversations: []
                });
            }
        });
    }

    function startMissionFromFlow(flow) {
        currentMissionFlow = flow;
        currentMissionConfig = storyData.missions[flow.missionId];
        missionRuntime = sceneApi.createMissionRuntime(currentMissionConfig);
        resultState = null;
        gameOverState = null;
        resetCombatState();
        chapterBannerText = currentMissionConfig.title;
        chapterBannerTimer = 2.6;
        setGameState(STATE.MISSION);
    }

    function finishMissionSuccess() {
        if (!currentMissionFlow || !currentMissionConfig || !missionRuntime) return;

        if (score > highScore) {
            highScore = score;
            localStorage.setItem('starHunterHighScore', String(highScore));
        }

        const unlockedArchives = sceneApi.unlockArchives(narrativeProgress, currentMissionFlow.unlockArchives || []);
        const unlockedConversations = sceneApi.unlockConversations(narrativeProgress, currentMissionFlow.unlockConversations || []);
        if (unlockedArchives.length) playSfx('archiveUnlock');
        playSfx('missionComplete');
        sceneApi.recordMission(narrativeProgress, currentMissionConfig.id, {
            completed: true,
            bestScore: Math.max(score, narrativeProgress.missionRecords[currentMissionConfig.id] && narrativeProgress.missionRecords[currentMissionConfig.id].bestScore || 0),
            maxCombo: Math.max(maxCombo, narrativeProgress.missionRecords[currentMissionConfig.id] && narrativeProgress.missionRecords[currentMissionConfig.id].maxCombo || 0)
        });
        sceneApi.saveProgress(storyData, narrativeProgress);

        resultState = {
            title: currentMissionFlow.resultTitle,
            text: currentMissionFlow.resultText,
            quote: currentMissionConfig.resultQuote,
            stats: {
                score,
                maxCombo,
                tokens: missionRuntime.tokensCollected
            },
            unlockedArchives,
            unlockedConversations,
            primaryLabel: currentMissionFlow.kind === 'mainline' ? uiText('continueStoryButton') : uiText('archiveOldFileButton')
        };

        clearCombatEntities();
        setGameState(STATE.RESULT);
    }

    function finishMissionResult() {
        if (!currentMissionFlow) return;

        if (currentMissionFlow.kind === 'mainline') {
            sceneApi.advanceMainline(storyData, narrativeProgress);
            sceneApi.saveProgress(storyData, narrativeProgress);
            resultState = null;
            continueMainline();
            return;
        }

        if (currentMissionFlow.kind === 'hidden') {
            const hiddenStory = storyData.hiddenStories[currentMissionFlow.hiddenStoryId];
            sceneApi.markHiddenStoryComplete(narrativeProgress, currentMissionFlow.hiddenStoryId);
            sceneApi.saveProgress(storyData, narrativeProgress);
            resultState = null;
            startDialogueSequence(hiddenStory.outroDialogue, {
                onComplete: function () {
                    goToHub(uiText('hiddenArchived'));
                }
            });
        }
    }

    function failCurrentMission(reason) {
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('starHunterHighScore', String(highScore));
        }
        gameOverState = {
            title: uiText('missionFailureTitle'),
            body: reason || uiText('missionFailureDefault'),
            primaryLabel: uiText('retryMission'),
            secondaryLabel: uiText('returnToHub')
        };
        setGameState(STATE.GAMEOVER);
        playSfx('failure');
        spawnParticles(player.x, player.y, 60, 20, [3, 10], [0.5, 1.5], [2, 8]);
        triggerShake(18, 0.7);
        flashAlpha = 0.9;
    }

    function retryCurrentMission() {
        if (!currentMissionFlow) {
            goToHub();
            return;
        }
        startMissionFromFlow(currentMissionFlow);
    }

    function fireBullet(angleOffset) {
        const speed = 30;
        const radians = (-Math.PI / 2) + angleOffset;
        bullets.push({
            x: player.x + Math.cos(radians) * 16,
            y: player.y - 18 + Math.sin(radians) * 16,
            vx: Math.cos(radians) * speed,
            vy: Math.sin(radians) * speed,
            radius: 4.5,
            hue: 48
        });
        spawnParticles(player.x, player.y - 20, 2, 50, [0.5, 1.5], [0.05, 0.15], [1.5, 3]);
    }

    function handleShooting(dt) {
        player.fireCooldown -= dt;
        const fireRate = player.rapidFire ? player.baseFireRate * 0.5 : player.baseFireRate;
        if (player.fireCooldown <= 0 && gameState === STATE.MISSION) {
            player.fireCooldown = fireRate;
            if (player.tripleShot) {
                fireBullet(-0.22);
                fireBullet(0);
                fireBullet(0.22);
            } else {
                fireBullet(0);
            }
        }
    }

    function getDefaultEnemyWeights() {
        if (difficultyLevel < 3) return { normal: 0.7, fast: 0.2, zigzag: 0.1 };
        if (difficultyLevel < 6) return { normal: 0.45, fast: 0.25, zigzag: 0.18, tank: 0.12 };
        return { normal: 0.3, fast: 0.2, zigzag: 0.2, tank: 0.3 };
    }

    function getCurrentMissionPhaseInfo() {
        if (!currentMissionConfig || !missionRuntime) return null;
        return sceneApi.getMissionPhase(currentMissionConfig, missionRuntime.elapsed);
    }

    function spawnEnemy(typeKey) {
        const key = typeKey || sceneApi.pickWeightedKey(
            gameState === STATE.MISSION && currentMissionConfig
                ? getCurrentMissionPhaseInfo().phase.enemyWeights
                : getDefaultEnemyWeights()
        );
        const type = ENEMY_TYPES[key];
        const margin = type.radius + 10;
        const phaseInfo = getCurrentMissionPhaseInfo();
        const storyCarrier = !!(phaseInfo && phaseInfo.phase.tokenCarriers && phaseInfo.phase.tokenCarriers.includes(key) && currentMissionConfig.tokenGoal > missionRuntime.tokensSpawned);
        const hiddenCarrier = !!(phaseInfo && phaseInfo.phase.hiddenShardCarrier === key && !missionRuntime.hiddenShardPhases[String(phaseInfo.index)]);
        enemies.push({
            x: margin + Math.random() * (W - margin * 2),
            y: -type.radius - Math.random() * 80,
            type: key,
            storyCarrier: storyCarrier,
            hiddenCarrier: hiddenCarrier,
            ...type,
            hp: type.hp,
            maxHp: type.hp,
            wobbleAmp: key === 'zigzag' ? 2.5 + Math.random() * 2 : 0,
            wobbleFreq: 0.03 + Math.random() * 0.04,
            wobbleOffset: Math.random() * Math.PI * 2
        });
    }

    function updateEnemies(dt) {
        if (gameState === STATE.MISSION) {
            const phaseInfo = getCurrentMissionPhaseInfo();
            difficultyLevel = 1 + phaseInfo.index * 3 + Math.floor(missionRuntime.elapsed / 12);
            const spawnInterval = missionRuntime.completed ? 999 : phaseInfo.phase.spawnInterval;
            difficultyTimer += dt;
            if (difficultyTimer >= spawnInterval) {
                difficultyTimer -= spawnInterval;
                spawnEnemy();
                if (!missionRuntime.completed && difficultyLevel >= 5 && Math.random() < 0.28) {
                    setTimeout(function () {
                        if (gameState === STATE.MISSION && currentMissionConfig && !missionRuntime.completed) spawnEnemy();
                    }, 140);
                }
            }
        } else if (gameState === STATE.MENU) {
            difficultyTimer += dt;
            if (difficultyTimer >= 1.1 && enemies.length < 8) {
                difficultyTimer -= 1.1;
                spawnEnemy();
            }
        }

        for (let index = enemies.length - 1; index >= 0; index -= 1) {
            const enemy = enemies[index];
            const speedMult = 1 + Math.max(0, difficultyLevel - 1) * 0.08;
            enemy.y += enemy.speed * speedMult * dt * 60;
            if (enemy.wobbleAmp > 0) enemy.x += Math.sin(gameTime * enemy.wobbleFreq * 60 + enemy.wobbleOffset) * enemy.wobbleAmp * dt * 60;

            if (enemy.y > H + enemy.radius + 30) {
                if (gameState === STATE.MISSION) {
                    if (player.shieldActive) {
                        player.shieldActive = false;
                        spawnParticles(enemy.x, H, 20, 260, [2, 5], [0.3, 0.6], [2, 4]);
                        addFloatingText(enemy.x, H - 20, uiText('shieldBroken'), '#b388ff', 1.0);
                    } else {
                        player.lives -= 1;
                        comboCount = 0;
                        comboTimer = 0;
                        spawnParticles(enemy.x, H, 30, 0, [3, 7], [0.4, 0.8], [2, 6]);
                        triggerShake(10, 0.4);
                        flashAlpha = 0.5;
                        addFloatingText(enemy.x, H - 20, uiText('enemyEscaped'), '#ff6040', 1.2);
                        if (player.lives <= 0) {
                            enemies.splice(index, 1);
                            failCurrentMission(uiText('missionFailEscaped'));
                            return;
                        }
                    }
                }

                enemies.splice(index, 1);
                if (comboCount > 0 && gameState === STATE.MISSION) {
                    comboCount = 0;
                    comboTimer = 0;
                }
            }

            if (enemy.x < enemy.radius) enemy.x = enemy.radius;
            if (enemy.x > W - enemy.radius) enemy.x = W - enemy.radius;
        }
    }

    function spawnPowerUp(x, y) {
        const roll = Math.random();
        let def;
        if (player.lives < player.maxLives && roll < 0.3) def = POWERUP_DEFS[0];
        else if (roll < 0.45) def = POWERUP_DEFS[Math.floor(Math.random() * POWERUP_DEFS.length)];
        else if (roll < 0.75) def = POWERUP_DEFS[1 + Math.floor(Math.random() * 3)];
        else def = POWERUP_DEFS[4];
        powerUps.push({ x, y, ...def, radius: 13, vy: 1.5 + Math.random() * 1.5, pulse: 0 });
        if (powerUps.length > 18) powerUps.shift();
    }

    function spawnStoryPickup(kind, x, y) {
        if (!currentMissionConfig) return;
        let def;
        if (kind === 'token') {
            def = {
                type: currentMissionConfig.tokenType,
                color: currentMissionConfig.tokenColor,
                symbol: currentMissionConfig.tokenSymbol,
                desc: currentMissionConfig.tokenLabel,
                lifetime: 12
            };
        } else if (kind === 'hidden') {
            def = {
                type: currentMissionConfig.hiddenTokenType,
                color: currentMissionConfig.hiddenTokenColor,
                symbol: currentMissionConfig.hiddenTokenSymbol,
                desc: currentMissionConfig.hiddenTokenLabel,
                lifetime: 12
            };
        }
        if (!def) return;
        powerUps.push({ x, y, ...def, radius: 14, vy: 1.2, pulse: 0, storyPickup: true });
    }

    function updatePowerUps(dt) {
        for (let index = powerUps.length - 1; index >= 0; index -= 1) {
            const powerUp = powerUps[index];
            powerUp.y += powerUp.vy * dt * 60;
            powerUp.pulse += dt * 5;
            powerUp.lifetime -= dt;
            if (powerUp.y > H + 30 || powerUp.lifetime <= 0) powerUps.splice(index, 1);
        }
    }

    function drawPowerUp(powerUp) {
        const pulse = 1 + Math.sin(powerUp.pulse) * 0.2;
        const radius = powerUp.radius * pulse;
        ctx.save();
        ctx.translate(powerUp.x, powerUp.y);
        const glow = ctx.createRadialGradient(0, 0, radius * 0.3, 0, 0, radius * 2);
        glow.addColorStop(0, `hsla(${powerUp.color}, 100%, 70%, 0.7)`);
        glow.addColorStop(1, 'hsla(0,0%,0%,0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(0, 0, radius * 2, 0, Math.PI * 2);
        ctx.fill();

        const bodyGrad = ctx.createRadialGradient(-radius * 0.2, -radius * 0.2, radius * 0.1, 0, 0, radius);
        bodyGrad.addColorStop(0, `hsla(${powerUp.color}, 90%, 75%, 0.95)`);
        bodyGrad.addColorStop(1, `hsla(${powerUp.color}, 80%, 40%, 0.85)`);
        ctx.fillStyle = bodyGrad;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = `hsla(${powerUp.color}, 100%, 85%, 0.9)`;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = '#fff';
        ctx.font = `${radius * 1.05}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(powerUp.symbol, 0, 1);
        ctx.restore();
    }

    function collectPowerUp(powerUp) {
        spawnParticles(powerUp.x, powerUp.y, 18, powerUp.color, [1, 4], [0.3, 0.7], [1.5, 4]);
        switch (powerUp.type) {
            case 'heal':
                player.lives = Math.min(player.maxLives, player.lives + 1);
                addFloatingText(powerUp.x, powerUp.y, '+1 ❤', '#ff6b8a', 1.2);
                break;
            case 'triple':
                player.tripleShot = true;
                player.tripleShotTimer = 8;
                addFloatingText(powerUp.x, powerUp.y, uiText('powerupTriple'), '#ffdd57', 1.0);
                break;
            case 'rapid':
                player.rapidFire = true;
                player.rapidFireTimer = 10;
                addFloatingText(powerUp.x, powerUp.y, uiText('powerupRapid'), '#4dc9f6', 1.0);
                break;
            case 'shield':
                player.shieldActive = true;
                addFloatingText(powerUp.x, powerUp.y, uiText('powerupShield'), '#b388ff', 1.0);
                break;
            case 'bomb':
                for (const enemy of enemies) {
                    spawnParticles(enemy.x, enemy.y, 15, enemy.color, [2, 6], [0.3, 0.6], [2, 5]);
                }
                score += enemies.length * 80;
                enemies = [];
                flashAlpha = 0.7;
                triggerShake(8, 0.35);
                addFloatingText(powerUp.x, powerUp.y, uiText('powerupClear'), '#ff9944', 1.5);
                break;
            case 'signal':
            case 'memory':
            case 'crystal': {
                const completed = sceneApi.collectMissionToken(currentMissionConfig, missionRuntime);
                addFloatingText(
                    powerUp.x,
                    powerUp.y,
                    `${currentMissionConfig.tokenLabel} ${missionRuntime.tokensCollected}/${currentMissionConfig.tokenGoal}`,
                    '#d4f6ff',
                    1.1
                );
                if (completed) {
                    enemies = [];
                    flashAlpha = 0.5;
                    triggerShake(7, 0.35);
                    setOverlayNotice(uiText('objectiveReached'), '#a8ecff');
                    playSfx('objective');
                }
                break;
            }
            case 'shard':
                narrativeProgress.hiddenFragments += 1;
                sceneApi.saveProgress(storyData, narrativeProgress);
                addFloatingText(
                    powerUp.x,
                    powerUp.y,
                    uiText('hiddenFragmentStatus', { current: narrativeProgress.hiddenFragments }),
                    '#8ecbff',
                    1.1
                );
                if (narrativeProgress.chapterCompleted) maybeUnlockHiddenStories();
                break;
            default:
                break;
        }
    }

    function handleMissionEnemyDestroyed(enemy) {
        if (gameState !== STATE.MISSION || !currentMissionConfig || !missionRuntime) return;
        const dropInfo = sceneApi.registerMissionKill(currentMissionConfig, missionRuntime, enemy);
        if (dropInfo.dropToken) spawnStoryPickup('token', enemy.x, enemy.y);
        if (dropInfo.dropHiddenShard) spawnStoryPickup('hidden', enemy.x, enemy.y);
    }

    function checkCollisions() {
        for (let bulletIndex = bullets.length - 1; bulletIndex >= 0; bulletIndex -= 1) {
            const bullet = bullets[bulletIndex];
            let bulletHit = false;
            for (let enemyIndex = enemies.length - 1; enemyIndex >= 0; enemyIndex -= 1) {
                const enemy = enemies[enemyIndex];
                const dx = bullet.x - enemy.x;
                const dy = bullet.y - enemy.y;
                if (Math.sqrt(dx * dx + dy * dy) < bullet.radius + enemy.radius) {
                    bulletHit = true;
                    enemy.hp -= 1;
                    spawnParticles(bullet.x, bullet.y, 5, enemy.color, [1, 3], [0.1, 0.35], [1, 3]);
                    if (enemy.hp <= 0) {
                        spawnParticles(enemy.x, enemy.y, 22, enemy.color, [2, 7], [0.3, 0.8], [2, 6]);
                        comboCount += 1;
                        comboTimer = 1.5;
                        if (comboCount > maxCombo) maxCombo = comboCount;
                        const comboBonus = Math.min(comboCount - 1, 15) * 25;
                        score += enemy.score + comboBonus;
                        addFloatingText(
                            enemy.x,
                            enemy.y,
                            `+${enemy.score + comboBonus}${comboCount >= 5 ? ` ${uiText('hudCombo', { combo: comboCount })}` : ''}`,
                            comboCount >= 8 ? '#ff4444' : comboCount >= 4 ? '#ffaa00' : '#ffffff',
                            comboCount >= 5 ? 1.3 : 1
                        );
                        handleMissionEnemyDestroyed(enemy);
                        if (Math.random() < (enemy.type === 'tank' ? 0.55 : enemy.type === 'zigzag' ? 0.22 : 0.12)) spawnPowerUp(enemy.x, enemy.y);
                        enemies.splice(enemyIndex, 1);
                    }
                    break;
                }
            }
            if (bulletHit) bullets.splice(bulletIndex, 1);
        }

        for (let index = bullets.length - 1; index >= 0; index -= 1) {
            const bullet = bullets[index];
            if (bullet.y < -30 || bullet.y > H + 30 || bullet.x < -30 || bullet.x > W + 30) bullets.splice(index, 1);
        }

        if (gameState === STATE.MISSION) {
            for (let enemyIndex = enemies.length - 1; enemyIndex >= 0; enemyIndex -= 1) {
                const enemy = enemies[enemyIndex];
                const dx = player.x - enemy.x;
                const dy = player.y - enemy.y;
                if (Math.sqrt(dx * dx + dy * dy) < (player.width + player.height) / 4 + enemy.radius) {
                    if (player.shieldActive) {
                        player.shieldActive = false;
                        spawnParticles(player.x, player.y, 30, 260, [2, 6], [0.3, 0.7], [2, 5]);
                        addFloatingText(player.x, player.y - 20, uiText('shieldBroken'), '#b388ff', 1.1);
                    } else {
                        player.lives -= 1;
                        comboCount = 0;
                        comboTimer = 0;
                        spawnParticles(player.x, player.y, 35, 0, [3, 8], [0.4, 0.9], [2, 7]);
                        triggerShake(12, 0.5);
                        flashAlpha = 0.6;
                    }
                    enemies.splice(enemyIndex, 1);
                    if (player.lives <= 0) {
                        failCurrentMission(uiText('failShotDown'));
                        return;
                    }
                }
            }
        }

        for (let index = powerUps.length - 1; index >= 0; index -= 1) {
            const powerUp = powerUps[index];
            const dx = player.x - powerUp.x;
            const dy = player.y - powerUp.y;
            if (Math.sqrt(dx * dx + dy * dy) < (player.width + player.height) / 4 + powerUp.radius) {
                collectPowerUp(powerUp);
                powerUps.splice(index, 1);
            }
        }
    }

    function updateMission(dt) {
        missionRuntime.elapsed += dt;
        missionRuntime.bannerTimer = Math.max(0, missionRuntime.bannerTimer - dt);

        if (pointerActive || mouseOnCanvas) {
            player.targetX = pointerX;
            player.targetY = pointerY;
        }

        const lerpSpeed = 14;
        player.x += (player.targetX - player.x) * Math.min(lerpSpeed * dt, 1);
        player.y += (player.targetY - player.y) * Math.min(lerpSpeed * dt, 1);
        player.x = Math.max(player.width / 2, Math.min(W - player.width / 2, player.x));
        player.y = Math.max(player.height / 2, Math.min(H - player.height / 2, player.y));

        if (player.tripleShot) {
            player.tripleShotTimer -= dt;
            if (player.tripleShotTimer <= 0) player.tripleShot = false;
        }
        if (player.rapidFire) {
            player.rapidFireTimer -= dt;
            if (player.rapidFireTimer <= 0) player.rapidFire = false;
        }

        player.engineFlame += dt * 18;
        handleShooting(dt);
        updateEnemies(dt);
        updatePowerUps(dt);
        checkCollisions();

        if (missionRuntime.completed) {
            missionRuntime.completionDelay -= dt;
            if (missionRuntime.completionDelay <= 0) {
                finishMissionSuccess();
            }
        }
    }

    function updateMenu(dt) {
        enemies.length = 0;
        powerUps.length = 0;
        flashAlpha = Math.max(0, flashAlpha - dt * 2.5);
    }

    function updateGameOver(dt) {
        updateEnemies(dt);
        for (const enemy of enemies) enemy.y += enemy.speed * 0.5 * dt * 60;
        for (let index = enemies.length - 1; index >= 0; index -= 1) {
            if (enemies[index].y > H + 50) enemies.splice(index, 1);
        }
        updatePowerUps(dt);
    }

    function update(dt) {
        gameTime += dt;
        updateShake(dt);
        updateStars(dt);
        updateParticles(dt);
        updateFloatingTexts(dt);

        if (overlayNotice.timer > 0) overlayNotice.timer -= dt;
        if (chapterBannerTimer > 0) chapterBannerTimer -= dt;
        if (storyResetConfirmUntil > 0 && gameTime >= storyResetConfirmUntil) storyResetConfirmUntil = 0;
        if (flashAlpha > 0) flashAlpha = Math.max(0, flashAlpha - dt * 3);
        if (comboTimer > 0) {
            comboTimer -= dt;
            if (comboTimer <= 0) comboCount = 0;
        }

        for (const bullet of bullets) {
            bullet.x += bullet.vx * dt * 60;
            bullet.y += bullet.vy * dt * 60;
        }

        switch (gameState) {
            case STATE.MISSION:
                updateMission(dt);
                break;
            case STATE.ADVENTURE:
                updateAdventureTalkPortraitFx(dt);
                break;
            case STATE.MENU:
                updateMenu(dt);
                break;
            case STATE.GAMEOVER:
                updateGameOver(dt);
                break;
            default:
                break;
        }
    }

    function getActiveTheme() {
        if ((gameState === STATE.MISSION || gameState === STATE.RESULT || gameState === STATE.GAMEOVER) && currentMissionConfig) {
            return currentMissionConfig.theme;
        }
        if (gameState === STATE.HUB) return SCENE_THEMES.hub;
        if (gameState === STATE.HUNTERS) return SCENE_THEMES.hunters;
        if (gameState === STATE.ARCHIVE) return SCENE_THEMES.archive;
        if (gameState === STATE.ADVENTURE) return currentAdventureConfig && currentAdventureConfig.theme ? currentAdventureConfig.theme : SCENE_THEMES.adventure;
        if (gameState === STATE.DIALOGUE) {
            if (currentDialogue && currentDialogue.location && currentDialogue.location.indexOf('MIR-z11') >= 0) {
                return storyData.missions.deepWellEscape.theme;
            }
            return SCENE_THEMES.dialogue;
        }
        if (gameState === STATE.RESULT) return SCENE_THEMES.result;
        if (gameState === STATE.GAMEOVER) return SCENE_THEMES.gameover;
        return SCENE_THEMES.menu;
    }

    function drawBackground() {
        const theme = getActiveTheme();
        const backgroundImage = getImageAsset(getSceneBackgroundAssetKey());
        if (backgroundImage) {
            drawImageCover(
                backgroundImage,
                0,
                0,
                W,
                H,
                gameState === STATE.MISSION ? 0.44 : gameState === STATE.MENU ? 0.98 : gameState === STATE.ADVENTURE ? 0.46 : 0.32
            );
        }
        const background = ctx.createLinearGradient(0, 0, 0, H);
        background.addColorStop(0, theme.top);
        background.addColorStop(0.52, theme.middle);
        background.addColorStop(1, theme.bottom);
        ctx.fillStyle = background;
        ctx.globalAlpha = backgroundImage
            ? (gameState === STATE.MISSION ? 0.78 : gameState === STATE.MENU ? 0.18 : gameState === STATE.ADVENTURE ? 0.72 : 0.88)
            : 1;
        ctx.fillRect(0, 0, W, H);
        ctx.globalAlpha = 1;

        const glow = ctx.createRadialGradient(W / 2, H * 0.25, 20, W / 2, H * 0.25, Math.max(W, H) * 0.8);
        glow.addColorStop(0, `${theme.accent}33`);
        glow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = glow;
        ctx.globalAlpha = gameState === STATE.MENU ? 0.36 : 1;
        ctx.fillRect(0, 0, W, H);
        ctx.globalAlpha = 1;
    }

    function drawEnemy(enemy) {
        ctx.save();
        ctx.translate(enemy.x, enemy.y);
        const hue = enemy.color;
        const baseLight = 50;
        const hpRatio = enemy.hp / enemy.maxHp;
        const flicker = hpRatio < 1 ? 0.7 + 0.3 * Math.sin(gameTime * 30) : 1;

        const glow = ctx.createRadialGradient(0, 0, enemy.radius * 0.4, 0, 0, enemy.radius * 2.2);
        glow.addColorStop(0, `hsla(${hue}, 100%, ${baseLight + 15}%, ${0.5 * flicker})`);
        glow.addColorStop(1, 'hsla(0,0%,0%,0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(0, 0, enemy.radius * 2.2, 0, Math.PI * 2);
        ctx.fill();

        if (enemy.storyCarrier || enemy.hiddenCarrier) {
            const ringColor = enemy.hiddenCarrier
                ? colorFromHue(currentMissionConfig.hiddenTokenColor, 0.9)
                : colorFromHue(currentMissionConfig.tokenColor, 0.9);
            ctx.strokeStyle = ringColor;
            ctx.lineWidth = enemy.hiddenCarrier ? 3 : 2;
            ctx.beginPath();
            ctx.arc(0, 0, enemy.radius + 8 + Math.sin(gameTime * 8) * 2, 0, Math.PI * 2);
            ctx.stroke();
        }

        ctx.fillStyle = `hsla(${hue}, 90%, ${baseLight}%, ${0.9 * flicker})`;
        ctx.strokeStyle = `hsla(${hue}, 100%, ${baseLight + 25}%, ${flicker})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        switch (enemy.shape) {
            case 'diamond':
                ctx.moveTo(0, -enemy.radius);
                ctx.lineTo(enemy.radius * 0.75, 0);
                ctx.lineTo(0, enemy.radius);
                ctx.lineTo(-enemy.radius * 0.75, 0);
                break;
            case 'triangle':
                ctx.moveTo(0, -enemy.radius);
                ctx.lineTo(enemy.radius * 0.85, enemy.radius * 0.6);
                ctx.lineTo(-enemy.radius * 0.85, enemy.radius * 0.6);
                break;
            case 'hexagon':
                for (let index = 0; index < 6; index += 1) {
                    const angle = (Math.PI / 3) * index - Math.PI / 6;
                    const x = Math.cos(angle) * enemy.radius;
                    const y = Math.sin(angle) * enemy.radius;
                    if (index === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                break;
            case 'star':
                for (let index = 0; index < 10; index += 1) {
                    const angle = (Math.PI / 5) * index - Math.PI / 2;
                    const radius = index % 2 === 0 ? enemy.radius : enemy.radius * 0.45;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;
                    if (index === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                break;
            default:
                break;
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        if (enemy.maxHp > 1 && hpRatio < 1) {
            const width = enemy.radius * 1.6;
            const height = 4;
            const barY = -enemy.radius - 10;
            ctx.fillStyle = 'rgba(0,0,0,0.6)';
            ctx.fillRect(-width / 2, barY, width, height);
            ctx.fillStyle = `hsl(${hue}, 100%, 55%)`;
            ctx.fillRect(-width / 2, barY, width * hpRatio, height);
        }

        ctx.restore();
    }

    function drawPlayer() {
        ctx.save();
        ctx.translate(player.x, player.y);

        if (player.shieldActive) {
            const shieldGrad = ctx.createRadialGradient(0, 0, 22, 0, 0, 34);
            shieldGrad.addColorStop(0, 'rgba(180,140,255,0.15)');
            shieldGrad.addColorStop(0.6, 'rgba(140,100,255,0.4)');
            shieldGrad.addColorStop(1, 'rgba(100,60,255,0)');
            ctx.fillStyle = shieldGrad;
            ctx.beginPath();
            ctx.arc(0, 2, 34, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = 'rgba(200,170,255,0.7)';
            ctx.lineWidth = 3;
            ctx.setLineDash([8, 4]);
            ctx.lineDashOffset = -gameTime * 40;
            ctx.beginPath();
            ctx.arc(0, 2, 30, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        const flameLen = 14 + Math.sin(player.engineFlame) * 6;
        const flameGrad = ctx.createLinearGradient(0, 18, 0, 18 + flameLen);
        flameGrad.addColorStop(0, 'rgba(100,200,255,0.9)');
        flameGrad.addColorStop(0.3, 'rgba(60,150,255,0.7)');
        flameGrad.addColorStop(0.7, 'rgba(20,80,255,0.3)');
        flameGrad.addColorStop(1, 'rgba(0,20,200,0)');
        ctx.fillStyle = flameGrad;
        ctx.beginPath();
        ctx.moveTo(-8, 16);
        ctx.lineTo(8, 16);
        ctx.lineTo(2, 16 + flameLen);
        ctx.lineTo(-2, 16 + flameLen);
        ctx.closePath();
        ctx.fill();

        const flameLen2 = 8 + Math.cos(player.engineFlame * 1.7) * 4;
        ctx.fillStyle = flameGrad;
        ctx.beginPath();
        ctx.moveTo(-4, 14);
        ctx.lineTo(4, 14);
        ctx.lineTo(1, 14 + flameLen2);
        ctx.lineTo(-1, 14 + flameLen2);
        ctx.closePath();
        ctx.fill();

        const shipGrad = ctx.createLinearGradient(0, -20, 0, 18);
        shipGrad.addColorStop(0, '#e8f4ff');
        shipGrad.addColorStop(0.3, '#80c8ff');
        shipGrad.addColorStop(0.7, '#2880d0');
        shipGrad.addColorStop(1, '#104080');
        ctx.fillStyle = shipGrad;
        ctx.beginPath();
        ctx.moveTo(0, -22);
        ctx.bezierCurveTo(14, -10, 20, 6, 16, 16);
        ctx.lineTo(-16, 16);
        ctx.bezierCurveTo(-20, 6, -14, -10, 0, -22);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = 'rgba(200,230,255,0.8)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = 'rgba(200,240,255,0.9)';
        ctx.beginPath();
        ctx.ellipse(0, -2, 6, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    function drawBullets() {
        for (const bullet of bullets) {
            const gradient = ctx.createRadialGradient(bullet.x, bullet.y, 0, bullet.x, bullet.y, bullet.radius * 2.5);
            gradient.addColorStop(0, 'rgba(255,255,200,0.95)');
            gradient.addColorStop(0.4, 'rgba(255,200,50,0.7)');
            gradient.addColorStop(1, 'rgba(255,150,0,0)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(bullet.x, bullet.y, bullet.radius * 2.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#fffef0';
            ctx.beginPath();
            ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function registerButton(button) {
        uiButtons.push(button);
        return button;
    }

    function drawActionButton(button) {
        const hovered = pointerActive && ui.pointInRect(pointerX, pointerY, button);
        if (hovered) hoveredButtonId = button.id || button.label;
        ui.drawButton(ctx, button, hovered);
        registerButton(button);
    }

    function drawOverlayNotice() {
        if (overlayNotice.timer <= 0 || !overlayNotice.text) return;
        const alpha = Math.min(1, overlayNotice.timer / 0.5);
        const width = Math.min(W * 0.72, 680);
        const height = 42;
        const x = (W - width) / 2;
        const y = H - 68;
        ctx.save();
        ctx.globalAlpha = alpha;
        ui.drawGlassPanel(ctx, {
            x: x,
            y: y,
            w: width,
            h: height,
            radius: 21,
            fill: 'rgba(8,12,28,0.82)',
            stroke: 'rgba(255,255,255,0.18)',
            shadow: 'rgba(0,0,0,0)'
        });
        ctx.fillStyle = overlayNotice.color;
        ctx.font = 'bold 15px "PingFang SC","Microsoft YaHei",sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(overlayNotice.text, W / 2, y + height / 2 + 1);
        ctx.restore();
    }

    function drawMissionUI() {
        const phaseInfo = getCurrentMissionPhaseInfo();
        const progress = currentMissionConfig.tokenGoal > 0
            ? missionRuntime.tokensCollected / currentMissionConfig.tokenGoal
            : 0;

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 22px "PingFang SC","Microsoft YaHei",sans-serif';
        ctx.textAlign = 'left';
        ctx.shadowColor = 'rgba(100,180,255,0.6)';
        ctx.shadowBlur = 8;
        ctx.fillText(`⭐ ${Math.floor(score).toLocaleString()}`, 20, 38);
        ctx.shadowBlur = 0;

        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.font = '13px "PingFang SC","Microsoft YaHei",sans-serif';
        ctx.fillText(uiText('hudHighScore', { score: Math.floor(highScore).toLocaleString() }), 20, 58);

        ui.drawInfoChip(ctx, {
            x: W - 180,
            y: 20,
            text: `${currentMissionConfig.objectiveLabel} ${missionRuntime.tokensCollected}/${currentMissionConfig.tokenGoal}`,
            color: '#f4fbff',
            fill: 'rgba(10,18,40,0.82)'
        });

        ctx.fillStyle = 'rgba(255,255,255,0.78)';
        ctx.font = 'bold 14px "PingFang SC","Microsoft YaHei",sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(uiText('hudStage', {
            current: phaseInfo.index + 1,
            total: 3,
            objective: phaseInfo.phase.objectiveText
        }), W / 2, 38);

        ui.drawProgressBar(ctx, {
            x: W * 0.2,
            y: 52,
            w: W * 0.6,
            h: 12,
            progress: progress,
            colorStart: currentMissionConfig.theme.accent,
            colorEnd: '#ffffff'
        });

        const heartSize = 16;
        const heartStartX = W - 20 - player.maxLives * (heartSize + 6);
        for (let index = 0; index < player.maxLives; index += 1) {
            const hx = heartStartX + index * (heartSize + 6);
            ctx.fillStyle = index < player.lives ? '#ff4060' : 'rgba(255,255,255,0.2)';
            ctx.font = `${heartSize}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('❤', hx + heartSize / 2, 90);
        }

        let statusY = 112;
        ctx.textAlign = 'right';
        ctx.font = 'bold 12px "PingFang SC","Microsoft YaHei",sans-serif';
        if (player.shieldActive) {
            ctx.fillStyle = '#c8a8ff';
            ctx.fillText(uiText('hudShield'), W - 20, statusY);
            statusY += 18;
        }
        if (player.tripleShot) {
            ctx.fillStyle = '#ffdd57';
            ctx.fillText(uiText('hudTriple', { seconds: player.tripleShotTimer.toFixed(1) }), W - 20, statusY);
            statusY += 18;
        }
        if (player.rapidFire) {
            ctx.fillStyle = '#4dc9f6';
            ctx.fillText(uiText('hudRapid', { seconds: player.rapidFireTimer.toFixed(1) }), W - 20, statusY);
        }

        if (comboCount >= 3) {
            const comboAlpha = Math.min(1, comboTimer / 0.5);
            const comboScale = 1 + Math.min(comboCount * 0.04, 0.5);
            ctx.save();
            ctx.globalAlpha = comboAlpha;
            ctx.fillStyle = comboCount >= 10 ? '#ff4444' : comboCount >= 6 ? '#ff9944' : '#ffcc44';
            ctx.font = `bold ${Math.floor(28 * comboScale)}px "PingFang SC","Microsoft YaHei",sans-serif`;
            ctx.textAlign = 'center';
            ctx.shadowColor = ctx.fillStyle;
            ctx.shadowBlur = 15;
            ctx.fillText(uiText('hudCombo', { combo: comboCount }), W / 2, 96);
            ctx.shadowBlur = 0;
            ctx.restore();
        }

        if (missionRuntime.bannerTimer > 0) drawMissionBanner();
    }

    function drawMissionBanner() {
        const alpha = Math.min(1, missionRuntime.bannerTimer / 0.6);
        const panelW = Math.min(W * 0.64, 700);
        const panelH = 120;
        const x = (W - panelW) / 2;
        const y = H * 0.14;
        ctx.save();
        ctx.globalAlpha = alpha;
        ui.drawGlassPanel(ctx, {
            x: x,
            y: y,
            w: panelW,
            h: panelH,
            radius: 28,
            fill: 'rgba(7,10,24,0.78)',
            stroke: 'rgba(255,255,255,0.18)',
            shadow: 'rgba(0,0,0,0.25)'
        });
        ctx.textAlign = 'center';
        ctx.fillStyle = '#f4fbff';
        ctx.font = 'bold 30px "PingFang SC","Microsoft YaHei",sans-serif';
        ctx.fillText(currentMissionConfig.title, W / 2, y + 40);
        ctx.fillStyle = 'rgba(215,228,255,0.82)';
        ctx.font = '16px "PingFang SC","Microsoft YaHei",sans-serif';
        ctx.fillText(currentMissionConfig.subtitle, W / 2, y + 68);
        ctx.fillStyle = currentMissionConfig.theme.accent;
        ctx.font = 'italic 15px "PingFang SC","Microsoft YaHei",sans-serif';
        ctx.fillText(currentMissionConfig.missionQuote, W / 2, y + 96);
        ctx.restore();
    }

    function getMenuPlanetStates() {
        const minD = Math.min(W, H);
        const centerR = minD * MENU_PLANET_CONFIGS.center.radiusFactor;
        const centerCX = W / 2;
        const centerCY = H * 0.47 + Math.sin(gameTime * 0.12) * minD * 0.008;
        const cpulse = 1 + Math.sin(gameTime * 0.18 + MENU_PLANET_CONFIGS.center.phase) * 0.012;
        const centralPlanet = Object.assign({}, MENU_PLANET_CONFIGS.center, {
            cx: centerCX,
            cy: centerCY,
            radius: centerR * cpulse,
            rotation: gameTime * MENU_PLANET_CONFIGS.center.rotateSpeed,
            cloudShift: gameTime * MENU_PLANET_CONFIGS.center.cloudSpeed
        });
        const satellites = MENU_PLANET_CONFIGS.satellites.map(function (sat) {
            const orbitR = centerR * sat.orbitFactor;
            const angle = gameTime * sat.orbitSpeed + sat.phase;
            const depth = Math.sin(angle);
            const satRadius = minD * sat.radiusFactor * (0.92 + (depth + 1) * 0.06);
            return Object.assign({}, sat, {
                cx: centerCX + orbitR * Math.cos(angle),
                cy: centerCY + orbitR * Math.sin(angle) * sat.orbitTilt,
                radius: satRadius,
                rotation: gameTime * sat.selfRotateSpeed,
                cloudShift: gameTime * sat.cloudSpeed,
                depth: depth,
                orbitR: orbitR,
                orbitAngle: angle,
                isSatellite: true
            });
        }).sort(function (left, right) {
            return left.depth - right.depth;
        });
        return { centralPlanet: centralPlanet, satellites: satellites };
    }

    function drawMenuOrbitLine(cx, cy, orbitR, tilt, color) {
        ctx.save();
        ctx.strokeStyle = color || 'rgba(145,198,255,0.10)';
        ctx.lineWidth = 1.1;
        ctx.setLineDash([7, 14]);
        ctx.beginPath();
        ctx.ellipse(cx, cy, orbitR, orbitR * tilt, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
    }

    function menuNoise(seed) {
        const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
        return value - Math.floor(value);
    }

    function drawMenuAsteroidBelt(planet, drawFrontHalf) {
        const beltWidth = planet.radius * 1.78;
        const beltHeight = planet.radius * 0.34;
        const startAngle = drawFrontHalf ? 0.08 : Math.PI + 0.08;
        const endAngle = drawFrontHalf ? Math.PI - 0.08 : Math.PI * 2 - 0.08;

        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.strokeStyle = drawFrontHalf ? 'rgba(228,185,126,0.16)' : 'rgba(186,154,116,0.06)';
        ctx.lineWidth = planet.radius * (drawFrontHalf ? 0.16 : 0.10);
        ctx.beginPath();
        ctx.ellipse(planet.cx, planet.cy, beltWidth, beltHeight, 0, startAngle, endAngle);
        ctx.stroke();
        ctx.restore();

        for (let index = 0; index < 140; index += 1) {
            const seedA = menuNoise(index + 11);
            const seedB = menuNoise(index + 91);
            const seedC = menuNoise(index + 181);
            const angle = (index / 140) * Math.PI * 2 + gameTime * (0.026 + seedA * 0.012);
            const isFront = Math.sin(angle) > 0;
            if (isFront !== drawFrontHalf) continue;

            const radiusX = beltWidth + (seedA - 0.5) * planet.radius * 0.42;
            const radiusY = beltHeight + (seedB - 0.5) * planet.radius * 0.08;
            const x = planet.cx + Math.cos(angle) * radiusX;
            const y = planet.cy + Math.sin(angle) * radiusY;
            const rockRadius = planet.radius * (0.010 + seedC * 0.026);
            const alpha = drawFrontHalf ? 0.16 + seedA * 0.20 : 0.06 + seedA * 0.10;

            ctx.beginPath();
            ctx.arc(x, y, rockRadius * 1.8, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,210,160,${alpha * 0.18})`;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(x, y, rockRadius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(176,150,126,${alpha})`;
            ctx.fill();
        }
    }

    function drawMenuShip(x, y, scale, heading, engineColor) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(heading);

        const engineGlow = ctx.createLinearGradient(-scale * 4.4, 0, -scale * 0.5, 0);
        engineGlow.addColorStop(0, 'rgba(0,0,0,0)');
        engineGlow.addColorStop(1, engineColor || 'rgba(120,220,255,0.88)');
        ctx.strokeStyle = engineGlow;
        ctx.lineWidth = scale * 0.74;
        ctx.beginPath();
        ctx.moveTo(-scale * 4.2, 0);
        ctx.lineTo(-scale * 0.4, 0);
        ctx.stroke();

        ctx.fillStyle = 'rgba(210,222,240,0.94)';
        ctx.beginPath();
        ctx.moveTo(scale * 1.8, 0);
        ctx.lineTo(-scale * 0.4, -scale * 0.62);
        ctx.lineTo(-scale * 1.2, -scale * 0.28);
        ctx.lineTo(-scale * 1.8, 0);
        ctx.lineTo(-scale * 1.2, scale * 0.28);
        ctx.lineTo(-scale * 0.4, scale * 0.62);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = 'rgba(115,152,198,0.78)';
        ctx.beginPath();
        ctx.moveTo(-scale * 0.2, -scale * 0.42);
        ctx.lineTo(scale * 0.86, 0);
        ctx.lineTo(-scale * 0.2, scale * 0.42);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = 'rgba(120,228,255,0.88)';
        ctx.beginPath();
        ctx.arc(scale * 0.52, 0, scale * 0.20, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    function drawMenuSpaceStation(x, y, scale, rotation, accentColor) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);

        ctx.strokeStyle = accentColor || 'rgba(156,214,255,0.74)';
        ctx.lineWidth = Math.max(1.2, scale * 0.14);
        ctx.beginPath();
        ctx.ellipse(0, 0, scale * 1.8, scale * 1.12, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(205,224,255,0.36)';
        ctx.beginPath();
        ctx.moveTo(-scale * 2.3, 0);
        ctx.lineTo(scale * 2.3, 0);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, -scale * 1.42);
        ctx.lineTo(0, scale * 1.42);
        ctx.stroke();

        ctx.fillStyle = 'rgba(26,40,68,0.94)';
        ctx.beginPath();
        ctx.arc(0, 0, scale * 0.54, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(132,219,255,0.80)';
        ctx.beginPath();
        ctx.arc(0, 0, scale * 0.20, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(34,52,88,0.92)';
        ctx.fillRect(-scale * 3.2, -scale * 0.52, scale * 1.1, scale * 1.04);
        ctx.fillRect(scale * 2.1, -scale * 0.52, scale * 1.1, scale * 1.04);

        ctx.strokeStyle = 'rgba(124,192,255,0.44)';
        ctx.beginPath();
        ctx.moveTo(-scale * 3.0, 0);
        ctx.lineTo(-scale * 2.1, 0);
        ctx.moveTo(scale * 2.1, 0);
        ctx.lineTo(scale * 3.0, 0);
        ctx.stroke();
        ctx.restore();
    }

    function drawMenuMeteorSwipes() {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        for (let index = 0; index < 3; index += 1) {
            const progress = (gameTime * (0.024 + index * 0.006) + index * 0.31) % 1;
            const x = W * (0.12 + progress * 0.74);
            const y = H * (0.12 + index * 0.10 + Math.sin(gameTime * 0.52 + index) * 0.018);
            const length = 88 + index * 28;
            const angle = 0.48;
            const tailX = x - Math.cos(angle) * length;
            const tailY = y - Math.sin(angle) * length;
            const gradient = ctx.createLinearGradient(tailX, tailY, x, y);
            gradient.addColorStop(0, 'rgba(255,255,255,0)');
            gradient.addColorStop(0.56, 'rgba(160,214,255,0.14)');
            gradient.addColorStop(1, 'rgba(255,236,210,0.76)');
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1.2 + index * 0.35;
            ctx.beginPath();
            ctx.moveTo(tailX, tailY);
            ctx.lineTo(x, y);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(x, y, 1.6 + index * 0.45, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,245,224,${0.42 + index * 0.12})`;
            ctx.fill();
        }
        ctx.restore();
    }

    function drawMenuNarrativeElements(centralPlanet, satellites) {
        const stationAnchor = satellites.find(function (planet) { return planet.id === 'sat-verdant'; }) || satellites[0];
        const stationScale = Math.max(10, stationAnchor.radius * 0.30);
        drawMenuSpaceStation(
            stationAnchor.cx - stationAnchor.radius * 1.30,
            stationAnchor.cy + stationAnchor.radius * 0.88,
            stationScale,
            gameTime * 0.24,
            'rgba(164,220,255,0.72)'
        );

        drawMenuShip(
            centralPlanet.cx - centralPlanet.radius * 1.84 + Math.sin(gameTime * 0.46) * centralPlanet.radius * 0.16,
            centralPlanet.cy + centralPlanet.radius * 0.34 + Math.cos(gameTime * 0.72) * centralPlanet.radius * 0.10,
            Math.max(7, centralPlanet.radius * 0.11),
            0.12,
            'rgba(112,224,255,0.82)'
        );
        drawMenuShip(
            centralPlanet.cx + centralPlanet.radius * 1.74 + Math.sin(gameTime * 0.34 + 1.6) * centralPlanet.radius * 0.12,
            centralPlanet.cy - centralPlanet.radius * 0.60 + Math.cos(gameTime * 0.58 + 0.9) * centralPlanet.radius * 0.08,
            Math.max(6, centralPlanet.radius * 0.09),
            Math.PI - 0.34,
            'rgba(255,178,118,0.74)'
        );
    }

    function drawMenuPlanetSurface(planet) {
        const radius = planet.radius;
        ctx.save();
        ctx.translate(planet.cx, planet.cy);
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.clip();
        ctx.save();
        ctx.rotate(planet.rotation * 0.12);

        switch (planet.style) {
            case 'earth': {
                const ocean = ctx.createLinearGradient(-radius, -radius, radius, radius);
                ocean.addColorStop(0, 'rgba(76,150,255,0.92)');
                ocean.addColorStop(0.45, 'rgba(24,96,188,0.96)');
                ocean.addColorStop(1, 'rgba(7,34,82,0.98)');
                ctx.fillStyle = ocean;
                ctx.fillRect(-radius, -radius, radius * 2, radius * 2);

                ctx.fillStyle = 'rgba(66,112,70,0.92)';
                ctx.beginPath();
                ctx.ellipse(-radius * 0.16, -radius * 0.18, radius * 0.46, radius * 0.26, -0.24, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.ellipse(radius * 0.28, -radius * 0.02, radius * 0.18, radius * 0.34, 0.18, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.ellipse(radius * 0.04, radius * 0.24, radius * 0.19, radius * 0.24, 0.16, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = 'rgba(118,148,84,0.72)';
                ctx.beginPath();
                ctx.ellipse(-radius * 0.06, -radius * 0.10, radius * 0.18, radius * 0.12, 0.18, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.ellipse(radius * 0.33, radius * 0.26, radius * 0.18, radius * 0.10, -0.18, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = 'rgba(186,152,86,0.56)';
                ctx.beginPath();
                ctx.ellipse(-radius * 0.02, -radius * 0.08, radius * 0.16, radius * 0.10, 0.25, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.ellipse(radius * 0.12, radius * 0.11, radius * 0.10, radius * 0.08, -0.12, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = 'rgba(220,236,255,0.72)';
                ctx.beginPath();
                ctx.ellipse(0, -radius * 0.84, radius * 0.38, radius * 0.15, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.ellipse(0, radius * 0.84, radius * 0.30, radius * 0.11, 0, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = 'rgba(255,255,255,0.10)';
                ctx.beginPath();
                ctx.ellipse(-radius * 0.30, -radius * 0.18, radius * 0.38, radius * 0.14, -0.32, 0, Math.PI * 2);
                ctx.fill();
                break;
            }
            case 'ice': {
                const ice = ctx.createLinearGradient(-radius, -radius * 0.6, radius, radius);
                ice.addColorStop(0, 'rgba(224,244,255,0.98)');
                ice.addColorStop(0.46, 'rgba(126,190,242,0.96)');
                ice.addColorStop(1, 'rgba(72,112,168,0.98)');
                ctx.fillStyle = ice;
                ctx.fillRect(-radius, -radius, radius * 2, radius * 2);

                ctx.strokeStyle = 'rgba(245,250,255,0.28)';
                ctx.lineWidth = Math.max(1.1, radius * 0.04);
                for (let index = 0; index < 4; index += 1) {
                    ctx.beginPath();
                    ctx.arc(0, -radius * 0.16 + index * radius * 0.18, radius * (0.56 - index * 0.06), 0.28, 2.88);
                    ctx.stroke();
                }
                ctx.fillStyle = 'rgba(255,255,255,0.18)';
                ctx.beginPath();
                ctx.ellipse(radius * 0.20, -radius * 0.18, radius * 0.24, radius * 0.10, 0.4, 0, Math.PI * 2);
                ctx.fill();
                break;
            }
            case 'forest': {
                const forest = ctx.createLinearGradient(-radius, -radius, radius, radius);
                forest.addColorStop(0, 'rgba(148,182,102,0.94)');
                forest.addColorStop(0.55, 'rgba(72,108,48,0.98)');
                forest.addColorStop(1, 'rgba(28,52,24,0.98)');
                ctx.fillStyle = forest;
                ctx.fillRect(-radius, -radius, radius * 2, radius * 2);

                ctx.fillStyle = 'rgba(178,210,122,0.44)';
                ctx.beginPath();
                ctx.ellipse(-radius * 0.20, -radius * 0.12, radius * 0.30, radius * 0.16, -0.25, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.ellipse(radius * 0.24, radius * 0.12, radius * 0.24, radius * 0.14, 0.22, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = 'rgba(234,246,214,0.10)';
                ctx.beginPath();
                ctx.arc(0, 0, radius * 0.72, 0, Math.PI * 2);
                ctx.fill();
                break;
            }
            case 'ocean': {
                const sea = ctx.createLinearGradient(-radius, -radius, radius, radius * 0.8);
                sea.addColorStop(0, 'rgba(124,182,255,0.94)');
                sea.addColorStop(0.48, 'rgba(26,72,176,0.98)');
                sea.addColorStop(1, 'rgba(8,24,84,0.98)');
                ctx.fillStyle = sea;
                ctx.fillRect(-radius, -radius, radius * 2, radius * 2);

                ctx.strokeStyle = 'rgba(206,233,255,0.24)';
                ctx.lineWidth = Math.max(1, radius * 0.036);
                for (let index = 0; index < 4; index += 1) {
                    ctx.beginPath();
                    ctx.arc(0, -radius * 0.12 + index * radius * 0.18, radius * (0.60 - index * 0.07), Math.PI * 0.14, Math.PI * 0.92);
                    ctx.stroke();
                }
                ctx.fillStyle = 'rgba(175,224,255,0.14)';
                ctx.beginPath();
                ctx.arc(-radius * 0.18, radius * 0.14, radius * 0.18, 0, Math.PI * 2);
                ctx.fill();
                break;
            }
            case 'cyber': {
                const cyber = ctx.createLinearGradient(-radius, -radius, radius, radius);
                cyber.addColorStop(0, 'rgba(82,82,150,0.96)');
                cyber.addColorStop(0.55, 'rgba(40,34,78,0.98)');
                cyber.addColorStop(1, 'rgba(12,14,28,0.99)');
                ctx.fillStyle = cyber;
                ctx.fillRect(-radius, -radius, radius * 2, radius * 2);

                ctx.strokeStyle = 'rgba(118,196,255,0.24)';
                ctx.lineWidth = Math.max(1, radius * 0.032);
                for (let index = -2; index <= 2; index += 1) {
                    ctx.beginPath();
                    ctx.moveTo(-radius * 0.76, index * radius * 0.18);
                    ctx.lineTo(radius * 0.76, index * radius * 0.18);
                    ctx.stroke();
                }
                for (let index = -1; index <= 1; index += 1) {
                    ctx.beginPath();
                    ctx.arc(0, 0, radius * (0.28 + index * 0.18), -0.8, 1.0);
                    ctx.stroke();
                }
                ctx.fillStyle = 'rgba(232,120,255,0.22)';
                ctx.beginPath();
                ctx.arc(radius * 0.18, -radius * 0.12, radius * 0.14, 0, Math.PI * 2);
                ctx.fill();
                break;
            }
            case 'ember': {
                const ember = ctx.createRadialGradient(-radius * 0.18, -radius * 0.20, radius * 0.10, 0, 0, radius);
                ember.addColorStop(0, 'rgba(255,248,214,0.98)');
                ember.addColorStop(0.24, 'rgba(255,204,118,0.98)');
                ember.addColorStop(0.58, 'rgba(255,116,32,0.98)');
                ember.addColorStop(1, 'rgba(124,32,4,0.98)');
                ctx.fillStyle = ember;
                ctx.fillRect(-radius, -radius, radius * 2, radius * 2);

                ctx.strokeStyle = 'rgba(255,224,142,0.24)';
                ctx.lineWidth = Math.max(1.1, radius * 0.042);
                for (let index = 0; index < 5; index += 1) {
                    const angle = planet.rotation * 0.08 + index * 1.24;
                    ctx.beginPath();
                    ctx.moveTo(Math.cos(angle) * radius * 0.18, Math.sin(angle) * radius * 0.18);
                    ctx.lineTo(Math.cos(angle + 0.4) * radius * 0.66, Math.sin(angle + 0.4) * radius * 0.66);
                    ctx.stroke();
                }
                break;
            }
            case 'volcanic': {
                const volcanic = ctx.createLinearGradient(-radius, -radius, radius, radius);
                volcanic.addColorStop(0, 'rgba(126,128,136,0.94)');
                volcanic.addColorStop(0.42, 'rgba(74,70,76,0.98)');
                volcanic.addColorStop(1, 'rgba(26,24,28,0.99)');
                ctx.fillStyle = volcanic;
                ctx.fillRect(-radius, -radius, radius * 2, radius * 2);

                ctx.strokeStyle = 'rgba(255,108,88,0.44)';
                ctx.lineWidth = Math.max(1.1, radius * 0.034);
                ctx.beginPath();
                ctx.moveTo(-radius * 0.54, -radius * 0.10);
                ctx.lineTo(-radius * 0.10, radius * 0.12);
                ctx.lineTo(radius * 0.08, -radius * 0.02);
                ctx.lineTo(radius * 0.44, radius * 0.24);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(-radius * 0.12, -radius * 0.50);
                ctx.lineTo(radius * 0.06, -radius * 0.14);
                ctx.lineTo(radius * 0.32, radius * 0.02);
                ctx.stroke();
                break;
            }
            default:
                break;
        }
        ctx.restore();

        if (planet.style === 'earth' || planet.style === 'ocean' || planet.style === 'forest' || planet.style === 'ice') {
            for (let band = 0; band < 5; band += 1) {
                const bandY = -radius * 0.42 + band * radius * 0.22 + Math.sin(planet.cloudShift * 1.1 + band + planet.phase) * radius * 0.04;
                const shiftX = Math.sin(planet.cloudShift * 1.9 + band * 0.8 + planet.phase) * radius * 0.24;
                const width = radius * (1.10 - band * 0.08);
                const height = radius * (0.08 + band * 0.012);
                const alpha = planet.style === 'earth' ? 0.14 : 0.09;
                ctx.fillStyle = `rgba(236,244,255,${alpha})`;
                ctx.beginPath();
                ctx.ellipse(shiftX, bandY, width, height, -0.1, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        ctx.restore();
    }

    function drawMenuPlanetNightLights(planet, toSunX, toSunY) {
        if (planet.style !== 'earth' && planet.style !== 'cyber') return;

        const radius = planet.radius;
        ctx.save();
        ctx.translate(planet.cx, planet.cy);
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.clip();
        ctx.rotate(planet.rotation * 0.12);
        ctx.globalCompositeOperation = 'screen';
        ctx.shadowBlur = radius * 0.08;
        ctx.shadowColor = planet.style === 'earth' ? 'rgba(255,188,98,0.82)' : 'rgba(168,126,255,0.82)';

        const count = planet.style === 'earth' ? 44 : 28;
        for (let index = 0; index < count; index += 1) {
            const seedA = menuNoise(index + 23);
            const seedB = menuNoise(index + 129);
            const seedC = menuNoise(index + 261);
            const px = (seedA * 1.55 - 0.92) * radius;
            const py = (seedB * 1.55 - 0.76) * radius;
            const lightSideDot = px * toSunX + py * toSunY;
            if (lightSideDot > -radius * 0.05) continue;

            const lightRadius = radius * (0.012 + seedC * 0.022);
            const alpha = planet.style === 'earth' ? 0.16 + seedC * 0.26 : 0.20 + seedC * 0.30;
            ctx.fillStyle = planet.style === 'earth'
                ? `rgba(255,196,108,${alpha})`
                : `rgba(176,132,255,${alpha})`;
            ctx.beginPath();
            ctx.arc(px, py, lightRadius, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }

    function drawMenuPlanet(planet) {
        const radius = planet.radius;
        const sunX = W * 0.92;
        const sunY = H * 0.14;
        const vectorX = sunX - planet.cx;
        const vectorY = sunY - planet.cy;
        const vectorLength = Math.max(1, Math.hypot(vectorX, vectorY));
        const toSunX = vectorX / vectorLength;
        const toSunY = vectorY / vectorLength;
        const lightAngle = Math.atan2(toSunY, toSunX);

        const base = ctx.createRadialGradient(
            planet.cx + toSunX * radius * 0.34,
            planet.cy + toSunY * radius * 0.34,
            radius * 0.08,
            planet.cx,
            planet.cy,
            radius * 1.02
        );
        base.addColorStop(0, planet.accent);
        base.addColorStop(0.40, planet.baseColor);
        base.addColorStop(1, '#050913');

        ctx.save();
        ctx.shadowColor = planet.glow;
        ctx.shadowBlur = radius * (planet.isSatellite ? 0.58 : 0.76);
        ctx.fillStyle = planet.glow;
        ctx.beginPath();
        ctx.arc(planet.cx, planet.cy, radius * 1.24, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        ctx.fillStyle = base;
        ctx.beginPath();
        ctx.arc(planet.cx, planet.cy, radius, 0, Math.PI * 2);
        ctx.fill();

        drawMenuPlanetSurface(planet);

        ctx.save();
        ctx.translate(planet.cx, planet.cy);
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.clip();
        const terminator = ctx.createLinearGradient(-toSunX * radius, -toSunY * radius, toSunX * radius, toSunY * radius);
        terminator.addColorStop(0, 'rgba(0,0,0,0.72)');
        terminator.addColorStop(0.36, 'rgba(0,0,0,0.30)');
        terminator.addColorStop(0.54, 'rgba(100,148,255,0.04)');
        terminator.addColorStop(1, 'rgba(255,255,255,0.18)');
        ctx.fillStyle = terminator;
        ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
        ctx.restore();

        drawMenuPlanetNightLights(planet, toSunX, toSunY);

        if (planet.ringColor) {
            ctx.save();
            ctx.strokeStyle = planet.ringColor;
            ctx.lineWidth = Math.max(2, radius * 0.06);
            ctx.beginPath();
            ctx.ellipse(planet.cx, planet.cy, radius * 1.54, radius * 0.42, -0.04, Math.PI + 0.12, Math.PI * 2 - 0.12);
            ctx.stroke();
            ctx.restore();
        }

        const atmosphere = ctx.createRadialGradient(planet.cx, planet.cy, radius * 0.82, planet.cx, planet.cy, radius * 1.08);
        atmosphere.addColorStop(0, 'rgba(255,255,255,0)');
        atmosphere.addColorStop(0.80, 'rgba(196,226,255,0.06)');
        atmosphere.addColorStop(1, planet.atmosphereColor || 'rgba(188,226,255,0.24)');
        ctx.fillStyle = atmosphere;
        ctx.beginPath();
        ctx.arc(planet.cx, planet.cy, radius * 1.08, 0, Math.PI * 2);
        ctx.fill();

        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        const rim = ctx.createLinearGradient(
            planet.cx - toSunX * radius,
            planet.cy - toSunY * radius,
            planet.cx + toSunX * radius,
            planet.cy + toSunY * radius
        );
        rim.addColorStop(0, 'rgba(0,0,0,0)');
        rim.addColorStop(0.56, 'rgba(140,190,255,0.08)');
        rim.addColorStop(1, 'rgba(255,238,196,0.58)');
        ctx.strokeStyle = rim;
        ctx.lineWidth = Math.max(1.2, radius * 0.05);
        ctx.beginPath();
        ctx.arc(planet.cx, planet.cy, radius * 1.01, lightAngle - 1.18, lightAngle + 1.18);
        ctx.stroke();
        ctx.restore();

        ctx.strokeStyle = 'rgba(255,255,255,0.14)';
        ctx.lineWidth = Math.max(1, radius * 0.022);
        ctx.beginPath();
        ctx.arc(planet.cx, planet.cy, radius, 0, Math.PI * 2);
        ctx.stroke();
    }

    function updateMenuLightParticles(dt) {
        for (const particle of menuLightParticles) {
            particle.x += particle.vx * dt;
            particle.y += particle.vy * dt;
            particle.lifeOffset += dt * 1.2;
            if (particle.x > W + 26) {
                particle.x = -26;
                particle.y = H * (0.16 + Math.random() * 0.70);
            }
            if (particle.y < H * 0.10) particle.y = H * 0.82;
            if (particle.y > H * 0.86) particle.y = H * 0.12;
        }
    }

    function drawMenuLightParticles() {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        for (const particle of menuLightParticles) {
            const pulse = 0.5 + 0.5 * Math.sin(particle.lifeOffset + gameTime * 2.2);
            const alpha = particle.alpha * (0.45 + pulse * 0.8);
            const tailX = particle.x - particle.vx * 0.24;
            const tailY = particle.y - particle.vy * 0.24;
            ctx.strokeStyle = `hsla(${particle.hue}, 92%, 74%, ${alpha * 0.72})`;
            ctx.lineWidth = particle.size * 0.95;
            ctx.beginPath();
            ctx.moveTo(tailX, tailY);
            ctx.lineTo(particle.x, particle.y);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size * (0.65 + pulse * 0.5), 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${particle.hue}, 92%, 70%, ${alpha})`;
            ctx.fill();
        }
        ctx.restore();
    }

    function drawMenuSunlight(heroPlanet) {
        if (!heroPlanet) return;
        const sunX = W * 0.92;
        const sunY = H * 0.14;
        const vectorX = heroPlanet.cx - sunX;
        const vectorY = heroPlanet.cy - sunY;
        const vectorLength = Math.max(1, Math.hypot(vectorX, vectorY));
        const normalX = vectorX / vectorLength;
        const normalY = vectorY / vectorLength;
        const tangentX = -normalY;
        const tangentY = normalX;

        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        const sunGlow = ctx.createRadialGradient(sunX, sunY, 12, sunX, sunY, Math.max(W, H) * 0.36);
        sunGlow.addColorStop(0, 'rgba(255,242,214,0.88)');
        sunGlow.addColorStop(0.35, 'rgba(255,208,146,0.28)');
        sunGlow.addColorStop(1, 'rgba(255,200,120,0)');
        ctx.fillStyle = sunGlow;
        ctx.fillRect(0, 0, W, H);

        for (let beam = -2; beam <= 2; beam += 1) {
            const spread = beam * 36 + Math.sin(gameTime * 0.8 + beam) * 10;
            const startX = sunX + tangentX * spread;
            const startY = sunY + tangentY * spread;
            const endX = startX + normalX * (W * 1.05) + tangentX * 54;
            const endY = startY + normalY * (H * 0.95) + tangentY * 54;
            const beamGradient = ctx.createLinearGradient(startX, startY, endX, endY);
            beamGradient.addColorStop(0, 'rgba(255,222,170,0.22)');
            beamGradient.addColorStop(0.32, 'rgba(168,218,255,0.08)');
            beamGradient.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.strokeStyle = beamGradient;
            ctx.lineWidth = 18 - Math.abs(beam) * 2.5;
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
        }

        const rimGradient = ctx.createLinearGradient(
            heroPlanet.cx - heroPlanet.radius * 1.2,
            heroPlanet.cy - heroPlanet.radius * 1.1,
            heroPlanet.cx + heroPlanet.radius * 1.1,
            heroPlanet.cy + heroPlanet.radius * 1.1
        );
        rimGradient.addColorStop(0, 'rgba(0,0,0,0)');
        rimGradient.addColorStop(0.56, 'rgba(122,192,255,0.24)');
        rimGradient.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.strokeStyle = rimGradient;
        ctx.lineWidth = Math.max(3, heroPlanet.radius * 0.11);
        ctx.beginPath();
        ctx.arc(heroPlanet.cx, heroPlanet.cy, heroPlanet.radius * 1.02, Math.PI * 0.88, Math.PI * 1.72);
        ctx.stroke();

        const flareStepX = normalX * heroPlanet.radius * 0.74;
        const flareStepY = normalY * heroPlanet.radius * 0.74;
        for (let index = 1; index <= 4; index += 1) {
            const flareX = heroPlanet.cx - flareStepX * index;
            const flareY = heroPlanet.cy - flareStepY * index;
            const size = heroPlanet.radius * (0.18 / index);
            ctx.fillStyle = `rgba(255,226,178,${0.22 / index})`;
            ctx.beginPath();
            ctx.arc(flareX, flareY, size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }

    function drawMenuOverlay() {
        const titleFontSize = Math.min(68, W / 8.4);
        const titleY = Math.max(88, H * 0.14);

        ctx.save();
        const topShade = ctx.createLinearGradient(0, 0, 0, H * 0.34);
        topShade.addColorStop(0, 'rgba(2,6,18,0.72)');
        topShade.addColorStop(1, 'rgba(2,6,18,0)');
        ctx.fillStyle = topShade;
        ctx.fillRect(0, 0, W, H * 0.34);

        const bottomShade = ctx.createLinearGradient(0, H * 0.78, 0, H);
        bottomShade.addColorStop(0, 'rgba(2,6,18,0)');
        bottomShade.addColorStop(1, 'rgba(2,6,18,0.76)');
        ctx.fillStyle = bottomShade;
        ctx.fillRect(0, H * 0.78, W, H * 0.22);
        ctx.restore();

        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${titleFontSize}px "PingFang SC","Microsoft YaHei",sans-serif`;
        ctx.shadowColor = 'rgba(0,0,0,0.50)';
        ctx.shadowBlur = 18;
        ctx.fillText('Star-Hunter', W / 2, titleY);
        ctx.shadowBlur = 0;

        const noticeText = uiText('menuHealthAdvice');
        ui.drawParagraphBlock(ctx, {
            text: noticeText,
            x: W / 2,
            y: H - 48,
            maxWidth: Math.min(W * 0.84, 920),
            lineHeight: 22,
            color: 'rgba(230,236,248,0.82)',
            font: '13px "PingFang SC","Microsoft YaHei",sans-serif',
            align: 'center'
        });
    }

    function getMainlineProgressText() {
        if (narrativeProgress.chapterCompleted) return uiText('progressCompleted');
        const chapter = storyData.chapters[narrativeProgress.currentChapterId];
        const currentScene = getCurrentSceneDefinition();
        const stepLabel = currentScene
            ? `${narrativeProgress.currentSceneIndex + 1}/${chapter.scenes.length} · ${currentScene.title || storyData.missions[currentScene.missionId].title}`
            : uiText('progressFinishedCount', { done: chapter.scenes.length, total: chapter.scenes.length });
        return uiText('progressCurrent', { step: stepLabel });
    }

    function drawCharacterCard(card, x, y, w, h, options) {
        const opts = options || {};
        const unlocked = !!opts.unlocked;
        const selected = !!opts.selected;
        const hovered = pointerActive && ui.pointInRect(pointerX, pointerY, { x: x, y: y, w: w, h: h });
        const outfitVariant = unlocked ? getHunterOutfitVariant(card.id) : 'primary';
        const portraitKey = getPortraitImageKey(card.id, outfitVariant);
        const portraitImage = getImageAsset(portraitKey);
        ui.drawGlassPanel(ctx, {
            x: x,
            y: y,
            w: w,
            h: h,
            radius: 20,
            fill: selected
                ? 'rgba(36,58,112,0.90)'
                : hovered
                    ? 'rgba(18,28,52,0.92)'
                    : 'rgba(10,16,34,0.82)',
            stroke: selected
                ? 'rgba(158,204,255,0.82)'
                : hovered
                    ? 'rgba(255,255,255,0.32)'
                    : 'rgba(255,255,255,0.14)',
            shadow: 'rgba(0,0,0,0)'
        });

        drawArtworkFrame(portraitImage, x + 10, y + 8, 56, 60, {
            radius: 16,
            alpha: unlocked ? 0.98 : 0.42,
            fill: 'rgba(14,18,36,0.65)',
            stroke: unlocked ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.08)',
            overlay: unlocked ? null : 'rgba(3,4,10,0.46)'
        });

        ctx.textAlign = 'left';
        ctx.fillStyle = unlocked ? '#f5fbff' : 'rgba(255,255,255,0.38)';
        ctx.font = 'bold 16px "PingFang SC","Microsoft YaHei",sans-serif';
        ctx.fillText(card.name, x + 78, y + 28);
        ctx.fillStyle = unlocked ? 'rgba(215,230,255,0.72)' : 'rgba(255,255,255,0.22)';
        ctx.font = '13px "PingFang SC","Microsoft YaHei",sans-serif';
        ctx.fillText(unlocked ? card.role : uiText('roleLocked'), x + 78, y + 50);

        if (unlocked && hunterHasAltPortrait(card.id) && outfitVariant === 'alt') {
            ctx.fillStyle = 'rgba(255,234,174,0.92)';
            ctx.font = 'bold 11px "PingFang SC","Microsoft YaHei",sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText('2.0', x + w - 14, y + 22);
            ctx.textAlign = 'left';
        }

        if (hovered && portraitImage && unlocked && opts.hoverHint) {
            ctx.fillStyle = 'rgba(255,255,255,0.78)';
            ctx.font = '11px "PingFang SC","Microsoft YaHei",sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText(opts.hoverHint, x + w - 14, y + 50);
            ctx.textAlign = 'left';
        }

        registerButton({
            id: `card-${card.id}`,
            x: x,
            y: y,
            w: w,
            h: h,
            onClick: function () {
                if (!unlocked) {
                    setOverlayNotice(uiText('hunterLockedNotice'), '#ffd49a');
                    return;
                }
                if (opts.onClick) {
                    opts.onClick(card);
                    return;
                }
                startDialogueSequence(storyData.hubDialogues[card.id], {
                    onComplete: function () {
                        goToHub();
                    }
                });
            }
        });
    }

    function drawHubOverlay() {
        const leftX = W * 0.05;
        const topY = H * 0.08;
        const leftW = W * 0.48;
        const topH = H * 0.5;
        const rightX = W * 0.56;
        const rightW = W * 0.39;
        const rightH = topH;
        const bottomY = H * 0.63;
        const bottomH = H * 0.25;
        const hubImage = getImageAsset('background:hub');
        const hubDetailImage = getImageAsset('background:hubDetail');

        ui.drawGlassPanel(ctx, {
            x: leftX,
            y: topY,
            w: leftW,
            h: topH,
            radius: 28,
            fill: 'rgba(11,12,24,0.78)',
            stroke: 'rgba(255,187,108,0.18)'
        });
        ui.drawGlassPanel(ctx, {
            x: rightX,
            y: topY,
            w: rightW,
            h: rightH,
            radius: 28,
            fill: 'rgba(11,12,24,0.78)',
            stroke: 'rgba(255,187,108,0.18)'
        });
        ui.drawGlassPanel(ctx, {
            x: leftX,
            y: bottomY,
            w: W * 0.90,
            h: bottomH,
            radius: 28,
            fill: 'rgba(11,12,24,0.82)',
            stroke: 'rgba(255,187,108,0.18)'
        });

        if (hubImage) drawImageCover(hubImage, leftX + 2, topY + 2, leftW - 4, topH - 4, 0.16, 26);
        if (hubDetailImage) drawImageCover(hubDetailImage, rightX + 2, topY + 2, rightW - 4, rightH - 4, 0.18, 26);

        ui.drawPanelTitle(ctx, uiText('hubTitle'), leftX + 30, topY + 48, {
            color: '#fff2d8',
            glow: 'rgba(255,191,100,0.28)'
        });
        ctx.fillStyle = 'rgba(255,230,190,0.74)';
        ctx.font = '16px "PingFang SC","Microsoft YaHei",sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(uiText('hubSubtitle'), leftX + 30, topY + 78);

        ui.drawDivider(ctx, leftX + 30, topY + 108, leftW - 60, 'rgba(255,200,140,0.22)');

        ui.drawParagraphBlock(ctx, {
            text: getMainlineProgressText(),
            x: leftX + 30,
            y: topY + 132,
            maxWidth: leftW - 60,
            lineHeight: 28,
            color: '#f4f8ff',
            font: 'bold 18px "PingFang SC","Microsoft YaHei",sans-serif'
        });

        const chapter = storyData.chapters[narrativeProgress.currentChapterId];
        const totalScenes = chapter.scenes.length;
        const progressValue = narrativeProgress.chapterCompleted
            ? 1
            : Math.min(1, narrativeProgress.currentSceneIndex / totalScenes);
        ui.drawProgressBar(ctx, {
            x: leftX + 30,
            y: topY + 208,
            w: leftW - 60,
            h: 14,
            progress: progressValue,
            colorStart: '#ffca81',
            colorEnd: '#ff9f6b'
        });

        ctx.fillStyle = 'rgba(226,237,255,0.72)';
        ctx.font = '14px "PingFang SC","Microsoft YaHei",sans-serif';
        ctx.fillText(uiText('archivesUnlocked', { count: narrativeProgress.unlockedArchives.length }), leftX + 30, topY + 250);
        ctx.fillText(uiText('hiddenFragmentsCount', { current: narrativeProgress.hiddenFragments }), leftX + 30, topY + 278);

        const hiddenStory = storyData.hiddenStories.maillenCaptain;
        const hiddenUnlocked = sceneApi.isHiddenStoryUnlocked(narrativeProgress, hiddenStory.id);
        const hiddenCompleted = sceneApi.isHiddenStoryCompleted(narrativeProgress, hiddenStory.id);
        const hiddenForceEligible = isHiddenForceUnlockEligible(hiddenStory);
        const hiddenForceTapCount = hiddenForceEligible ? getHiddenForceTapCount() : 0;
        const hiddenStatus = hiddenCompleted
            ? uiText('hiddenStatusArchived')
            : hiddenUnlocked
                ? uiText('hiddenStatusUnlocked')
                : hiddenForceEligible
                    ? uiText('hiddenStatusForce', {
                        count: Math.max(0, hiddenStory.unlockFragments - narrativeProgress.hiddenFragments),
                        taps: hiddenForceTapCount
                    })
                    : uiText('hiddenStatusMissing', {
                        count: Math.max(0, hiddenStory.unlockFragments - narrativeProgress.hiddenFragments)
                    });

        ctx.fillStyle = 'rgba(255,230,190,0.88)';
        ctx.font = 'bold 18px "PingFang SC","Microsoft YaHei",sans-serif';
        ctx.fillText(uiText('actionConsole'), rightX + 30, topY + 44);
        ctx.fillStyle = hiddenForceEligible ? 'rgba(255,219,157,0.86)' : 'rgba(226,237,255,0.66)';
        ctx.font = hiddenForceEligible ? 'bold 13px "PingFang SC","Microsoft YaHei",sans-serif' : '14px "PingFang SC","Microsoft YaHei",sans-serif';
        ctx.fillText(hiddenStatus, rightX + 30, topY + 70);

        const buttonX = rightX + 30;
        const buttonW = rightW - 60;
        drawActionButton({
            id: 'hub-mainline',
            x: buttonX,
            y: topY + 104,
            w: buttonW,
            h: 52,
            label: narrativeProgress.chapterCompleted ? uiText('mainlineDoneButton') : uiText('mainlineContinueButton'),
            top: '#5a8bff',
            bottom: '#2749a7',
            onClick: function () {
                if (narrativeProgress.chapterCompleted) {
                    setOverlayNotice(uiText('mainlineDoneNotice'), '#d7e8ff');
                    return;
                }
                continueMainline();
            }
        });
        drawActionButton({
            id: 'hub-archive',
            x: buttonX,
            y: topY + 174,
            w: buttonW,
            h: 52,
            label: uiText('enterArchive'),
            top: '#4a7fce',
            bottom: '#244a86',
            onClick: function () {
                openArchive(selectedArchiveId);
            }
        });
        drawActionButton({
            id: 'hub-hidden',
            x: buttonX,
            y: topY + 244,
            w: buttonW,
            h: 52,
            label: hiddenCompleted
                ? uiText('replayHidden')
                : hiddenUnlocked
                    ? uiText('investigateHidden')
                    : hiddenForceEligible
                        ? uiText('hiddenLockedForce')
                        : uiText('hiddenLocked'),
            top: hiddenUnlocked ? '#68a6ff' : '#485163',
            bottom: hiddenUnlocked ? '#2853a6' : '#262b35',
            onClick: function () {
                if (!hiddenUnlocked) {
                    handleHiddenLockedAction(hiddenStory);
                    return;
                }
                startHiddenStory(hiddenStory.id);
            }
        });
        drawActionButton({
            id: 'hub-reset-story',
            x: buttonX,
            y: topY + 314,
            w: buttonW,
            h: 42,
            label: storyResetConfirmUntil > gameTime ? uiText('storyResetConfirmButton') : uiText('storyResetButton'),
            top: storyResetConfirmUntil > gameTime ? '#ff966d' : '#8a5b5b',
            bottom: storyResetConfirmUntil > gameTime ? '#c04833' : '#5a3131',
            onClick: function () {
                handleStoryResetAction();
            }
        });

        const hunterPanel = {
            x: leftX,
            y: bottomY,
            w: W * 0.90,
            h: bottomH
        };
        const hunterHovered = pointerActive && ui.pointInRect(pointerX, pointerY, hunterPanel);
        const hunterCards = storyData.characterCards;
        const unlockedHunterCards = getUnlockedHunterCards();
        const hunterPreviewImage = getImageAsset('background:hunters') || getImageAsset('background:hubDetail') || getImageAsset('background:hub');
        const swappableCount = unlockedHunterCards.filter(function (card) {
            return hunterHasAltPortrait(card.id);
        }).length;

        ui.drawGlassPanel(ctx, {
            x: hunterPanel.x,
            y: hunterPanel.y,
            w: hunterPanel.w,
            h: hunterPanel.h,
            radius: 28,
            fill: hunterHovered ? 'rgba(13,18,38,0.88)' : 'rgba(11,12,24,0.82)',
            stroke: hunterHovered ? 'rgba(168,205,255,0.28)' : 'rgba(255,187,108,0.18)'
        });
        if (hunterPreviewImage) {
            drawImageCover(hunterPreviewImage, hunterPanel.x + 2, hunterPanel.y + 2, hunterPanel.w - 4, hunterPanel.h - 4, 0.20, 26);
        }
        ctx.save();
        const hunterOverlay = ctx.createLinearGradient(hunterPanel.x, hunterPanel.y, hunterPanel.x + hunterPanel.w, hunterPanel.y + hunterPanel.h);
        hunterOverlay.addColorStop(0, 'rgba(8,12,28,0.72)');
        hunterOverlay.addColorStop(0.48, 'rgba(12,14,30,0.66)');
        hunterOverlay.addColorStop(1, 'rgba(9,12,28,0.88)');
        ctx.fillStyle = hunterOverlay;
        ctx.beginPath();
        ctx.roundRect(hunterPanel.x + 2, hunterPanel.y + 2, hunterPanel.w - 4, hunterPanel.h - 4, 26);
        ctx.fill();
        ctx.restore();

        ui.drawPanelTitle(ctx, uiText('huntersTitle'), hunterPanel.x + 24, hunterPanel.y + 36, {
            color: '#fff2d8',
            glow: 'rgba(130,178,255,0.24)'
        });
        ctx.fillStyle = 'rgba(230,237,255,0.70)';
        ctx.font = '14px "PingFang SC","Microsoft YaHei",sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(uiText('huntersSubtitle'), hunterPanel.x + 24, hunterPanel.y + 60);

        ui.drawInfoChip(ctx, {
            x: hunterPanel.x + 24,
            y: hunterPanel.y + 76,
            text: uiText('huntersUnlocked', { current: unlockedHunterCards.length, total: hunterCards.length }),
            color: '#eaf6ff',
            fill: 'rgba(28,42,82,0.88)'
        });
        ui.drawInfoChip(ctx, {
            x: hunterPanel.x + 156,
            y: hunterPanel.y + 76,
            text: uiText('huntersSwappable', { count: swappableCount }),
            color: '#fff4d4',
            fill: 'rgba(80,54,106,0.88)'
        });

        const previewCards = unlockedHunterCards.slice(0, 4);
        const previewCardW = 96;
        const previewCardH = 112;
        const previewGap = 12;
        const previewStartX = hunterPanel.x + hunterPanel.w - 24 - previewCards.length * previewCardW - Math.max(0, previewCards.length - 1) * previewGap;
        const previewY = hunterPanel.y + 28;
        for (let index = 0; index < previewCards.length; index += 1) {
            const card = previewCards[index];
            const portraitImage = getImageAsset(getPortraitImageKey(card.id, getHunterOutfitVariant(card.id)));
            drawArtworkFrame(portraitImage, previewStartX + index * (previewCardW + previewGap), previewY, previewCardW, previewCardH, {
                radius: 20,
                alpha: 0.99,
                fill: 'rgba(10,16,32,0.56)',
                stroke: 'rgba(255,255,255,0.14)'
            });
        }

        registerButton({
            id: 'hub-hunters-panel',
            x: hunterPanel.x,
            y: hunterPanel.y,
            w: hunterPanel.w,
            h: hunterPanel.h,
            onClick: function () {
                openHunters();
            }
        });

        drawActionButton({
            id: 'hub-hunters',
            x: hunterPanel.x + 24,
            y: hunterPanel.y + hunterPanel.h - 66,
            w: 188,
            h: 44,
            label: uiText('enterHunters'),
            top: '#6097ff',
            bottom: '#284fa5',
            onClick: function () {
                openHunters();
            }
        });
    }

    function openHunterConversation(hunterId) {
        startDialogueSequence(storyData.hubDialogues[hunterId], {
            onComplete: function () {
                openHunters(hunterId);
            }
        });
    }

    function drawHuntersOverlay() {
        selectedHunterId = getSelectableHunterId(selectedHunterId);
        const selectedCard = getHunterCardById(selectedHunterId);
        const selectedEntry = getHunterArchiveEntry(selectedHunterId);
        const selectedVariant = getHunterOutfitVariant(selectedHunterId);
        const hunterBgImage = getImageAsset('background:hunters') || getImageAsset('background:hubDetail') || getImageAsset('background:hub');

        const panelX = W * 0.05;
        const panelY = H * 0.07;
        const panelW = W * 0.90;
        const panelH = H * 0.86;
        const rosterW = Math.min(400, panelW * 0.34);
        const detailX = panelX + rosterW + 18;
        const detailW = panelW - rosterW - 18;
        const previewW = Math.min(340, detailW * 0.42);
        const previewH = panelH - 136;
        const previewX = detailX + detailW - previewW - 26;
        const previewY = panelY + 82;
        const textX = detailX + 28;
        const textMaxWidth = detailW - previewW - 72;
        const unlockedHunterCards = getUnlockedHunterCards();

        ui.drawGlassPanel(ctx, {
            x: panelX,
            y: panelY,
            w: rosterW,
            h: panelH,
            radius: 28,
            fill: 'rgba(9,14,28,0.86)',
            stroke: 'rgba(145,190,255,0.18)'
        });
        ui.drawGlassPanel(ctx, {
            x: detailX,
            y: panelY,
            w: detailW,
            h: panelH,
            radius: 28,
            fill: 'rgba(9,14,28,0.84)',
            stroke: 'rgba(145,190,255,0.18)'
        });

        if (hunterBgImage) {
            drawImageCover(hunterBgImage, detailX + 2, panelY + 2, detailW - 4, panelH - 4, 0.18, 26);
        }

        ui.drawPanelTitle(ctx, uiText('huntersTitle'), panelX + 24, panelY + 42, {
            color: '#f4fbff',
            glow: 'rgba(122,170,255,0.24)'
        });
        ctx.fillStyle = 'rgba(212,228,255,0.68)';
        ctx.font = '14px "PingFang SC","Microsoft YaHei",sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(uiText('huntersPageSubtitle'), panelX + 24, panelY + 68);

        ui.drawInfoChip(ctx, {
            x: panelX + 24,
            y: panelY + 84,
            text: uiText('huntersUnlocked', { current: unlockedHunterCards.length, total: storyData.characterCards.length }),
            color: '#eaf6ff',
            fill: 'rgba(32,49,90,0.88)'
        });

        const columns = 2;
        const gap = 12;
        const cardW = (rosterW - 48 - gap) / columns;
        const cardH = 76;
        let index = 0;
        for (const card of storyData.characterCards) {
            const row = Math.floor(index / columns);
            const column = index % columns;
            drawCharacterCard(card, panelX + 24 + column * (cardW + gap), panelY + 130 + row * (cardH + gap), cardW, cardH, {
                unlocked: isHunterUnlocked(card.id),
                selected: selectedCard && selectedCard.id === card.id,
                hoverHint: uiText('hoverSelect'),
                onClick: function () {
                    selectedHunterId = card.id;
                }
            });
            index += 1;
        }

        if (!selectedCard || !selectedEntry) return;

        ui.drawPanelTitle(ctx, selectedCard.name, textX, panelY + 44, {
            color: '#ffffff',
            glow: 'rgba(130,182,255,0.20)'
        });
        ctx.fillStyle = 'rgba(213,229,255,0.70)';
        ctx.font = '16px "PingFang SC","Microsoft YaHei",sans-serif';
        ctx.fillText(selectedCard.role, textX, panelY + 72);

        const currentPortraitImage = getImageAsset(getPortraitImageKey(selectedCard.id, selectedVariant));
        drawArtworkFrame(currentPortraitImage, previewX, previewY, previewW, previewH, {
            radius: 28,
            alpha: 0.99,
            fill: 'rgba(10,16,34,0.54)',
            stroke: 'rgba(255,255,255,0.18)'
        });

        ctx.save();
        const previewOverlay = ctx.createLinearGradient(previewX, previewY, previewX, previewY + previewH);
        previewOverlay.addColorStop(0, 'rgba(10,14,26,0.02)');
        previewOverlay.addColorStop(0.62, 'rgba(10,14,26,0.05)');
        previewOverlay.addColorStop(1, 'rgba(10,14,26,0.38)');
        ctx.fillStyle = previewOverlay;
        ctx.beginPath();
        ctx.roundRect(previewX + 2, previewY + 2, previewW - 4, previewH - 4, 24);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.12)';
        ctx.font = 'bold 28px "PingFang SC","Microsoft YaHei",sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(selectedCard.name, previewX + previewW - 16, previewY + previewH - 24);
        ctx.restore();

        const quoteEndY = ui.drawParagraphBlock(ctx, {
            text: selectedEntry.quote,
            x: textX,
            y: panelY + 112,
            maxWidth: textMaxWidth,
            lineHeight: 26,
            color: 'rgba(156,216,255,0.88)',
            font: 'italic 17px "PingFang SC","Microsoft YaHei",sans-serif'
        });

        ui.drawDivider(ctx, textX, quoteEndY + 8, textMaxWidth, 'rgba(156,216,255,0.18)');

        const introText = (selectedEntry.body || []).slice(0, 2).join('\n\n');
        const bodyEndY = ui.drawParagraphBlock(ctx, {
            text: introText,
            x: textX,
            y: quoteEndY + 26,
            maxWidth: textMaxWidth,
            lineHeight: 28,
            color: 'rgba(239,245,255,0.84)',
            font: '16px "PingFang SC","Microsoft YaHei",sans-serif'
        });

        ctx.fillStyle = '#fff1d5';
        ctx.font = 'bold 18px "PingFang SC","Microsoft YaHei",sans-serif';
        ctx.fillText(uiText('currentOutfit'), textX, Math.max(bodyEndY + 20, panelY + 314));
        ctx.fillStyle = 'rgba(212,228,255,0.66)';
        ctx.font = '14px "PingFang SC","Microsoft YaHei",sans-serif';
        ctx.fillText(uiText('outfitHint'), textX, Math.max(bodyEndY + 46, panelY + 340));

        const outfitButtonY = Math.max(bodyEndY + 64, panelY + 358);
        drawActionButton({
            id: `hunter-primary-${selectedCard.id}`,
            x: textX,
            y: outfitButtonY,
            w: 164,
            h: 46,
            label: uiText('primaryOutfit'),
            top: selectedVariant === 'primary' ? '#79acff' : '#536780',
            bottom: selectedVariant === 'primary' ? '#315eb3' : '#2f3847',
            onClick: function () {
                setHunterOutfitVariant(selectedCard.id, 'primary');
            }
        });

        if (hunterHasAltPortrait(selectedCard.id)) {
            drawActionButton({
                id: `hunter-alt-${selectedCard.id}`,
                x: textX + 178,
                y: outfitButtonY,
                w: 164,
                h: 46,
                label: uiText('altOutfit'),
                top: selectedVariant === 'alt' ? '#8d9eff' : '#5f5f87',
                bottom: selectedVariant === 'alt' ? '#4a54c8' : '#36354d',
                onClick: function () {
                    setHunterOutfitVariant(selectedCard.id, 'alt');
                }
            });
        } else {
            ui.drawGlassPanel(ctx, {
                x: textX + 178,
                y: outfitButtonY,
                w: 164,
                h: 46,
                radius: 18,
                fill: 'rgba(18,24,40,0.72)',
                stroke: 'rgba(255,255,255,0.10)',
                shadow: 'rgba(0,0,0,0)'
            });
            ctx.fillStyle = 'rgba(255,255,255,0.52)';
            ctx.font = '13px "PingFang SC","Microsoft YaHei",sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(uiText('onlyPrimaryOutfit'), textX + 178 + 82, outfitButtonY + 24);
            ctx.textAlign = 'left';
            ctx.textBaseline = 'alphabetic';
        }

        drawActionButton({
            id: `hunter-dialogue-${selectedCard.id}`,
            x: textX,
            y: panelY + panelH - 72,
            w: 188,
            h: 46,
            label: uiText('viewShortDialogue'),
            top: '#4d8dee',
            bottom: '#2a5aa8',
            onClick: function () {
                openHunterConversation(selectedCard.id);
            }
        });
        drawActionButton({
            id: 'hunters-back',
            x: detailX + detailW - 188,
            y: panelY + panelH - 72,
            w: 160,
            h: 46,
            label: uiText('returnToHub'),
            top: '#6b7a96',
            bottom: '#39445a',
            onClick: function () {
                goToHub();
            }
        });
    }

    function drawAdventureOverlay() {
        const view = getAdventureViewModel();
        if (!view) return;

        const pad = Math.max(22, W * 0.035);
        const headerY = Math.max(74, H * 0.09);
        const panelX = pad;
        const panelY = headerY + 20;
        const panelW = W - pad * 2;
        const panelH = Math.max(320, H - panelY - 190);
        const infoGap = 16;
        const stacked = panelW < 980;
        const topPanelH = stacked ? Math.max(132, Math.min(210, panelH * 0.38)) : Math.min(280, panelH * 0.48);
        const leftW = stacked ? panelW : Math.floor(panelW * 0.64);
        const rightW = stacked ? panelW : panelW - leftW - infoGap;
        const rightX = stacked ? panelX : panelX + leftW + infoGap;
        const rightY = stacked ? panelY + topPanelH + infoGap : panelY;
        const rightH = stacked ? Math.max(86, Math.min(150, panelH * 0.22)) : topPanelH;
        const logPanelY = stacked ? rightY + rightH + infoGap : panelY + topPanelH + infoGap;
        const logPanelH = panelY + panelH - logPanelY;

        ui.drawPanelTitle(ctx, currentAdventureScene && currentAdventureScene.title ? currentAdventureScene.title : view.title, panelX, headerY, {
            color: '#f3f8ff',
            font: 'bold 30px "PingFang SC","Microsoft YaHei",sans-serif',
            glow: 'rgba(116,183,255,0.24)',
            glowBlur: 14
        });
        ctx.fillStyle = 'rgba(215,228,255,0.76)';
        ctx.font = '15px "PingFang SC","Microsoft YaHei",sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(view.subtitle || currentAdventureConfig.subtitle || '', panelX, headerY + 28);

        ui.drawGlassPanel(ctx, {
            x: panelX,
            y: panelY,
            w: leftW,
            h: topPanelH,
            radius: 24,
            fill: 'rgba(8,12,28,0.80)',
            stroke: 'rgba(144,188,255,0.18)',
            shadow: 'rgba(0,0,0,0.22)'
        });

        const innerPad = 26;
        ui.drawPanelTitle(ctx, view.roomName, panelX + innerPad, panelY + 36, {
            color: '#ffffff',
            font: 'bold 24px "PingFang SC","Microsoft YaHei",sans-serif'
        });
        ui.drawDivider(ctx, panelX + innerPad, panelY + 52, leftW - innerPad * 2, 'rgba(156,208,255,0.18)');
        ui.drawParagraphBlock(ctx, {
            text: view.roomDescription,
            x: panelX + innerPad,
            y: panelY + 70,
            maxWidth: leftW - innerPad * 2,
            lineHeight: 24,
            color: 'rgba(235,242,255,0.88)',
            font: '15px "PingFang SC","Microsoft YaHei",sans-serif'
        });

        ui.drawGlassPanel(ctx, {
            x: rightX,
            y: rightY,
            w: rightW,
            h: rightH,
            radius: 24,
            fill: 'rgba(8,12,28,0.82)',
            stroke: 'rgba(144,188,255,0.18)',
            shadow: 'rgba(0,0,0,0.22)'
        });
        ui.drawPanelTitle(ctx, uiText('adventureIntelTitle'), rightX + 22, rightY + 32, {
            color: '#f3f8ff',
            font: 'bold 20px "PingFang SC","Microsoft YaHei",sans-serif'
        });
        const facts = [
            uiText('adventureObjective', { value: view.objective || '' }),
            uiText('adventureVisibleActors', { value: view.visibleActors.length ? view.visibleActors.join(currentLanguage === 'en' ? ', ' : '、') : '' }),
            uiText('adventureVisibleItems', { value: view.visibleItems.length ? view.visibleItems.join(currentLanguage === 'en' ? ', ' : '、') : '' }),
            uiText('adventureExits', { value: view.exits.length ? view.exits.join(currentLanguage === 'en' ? ', ' : '、') : '' }),
            uiText('adventureInventory', { value: view.inventory.length ? view.inventory.join(currentLanguage === 'en' ? ', ' : '、') : '' })
        ];
        if (view.missionCommand) facts.push(uiText('adventureCommand', { value: view.missionCommand }));
        if (view.hints.length) facts.push(uiText('adventureHints', { value: view.hints.slice(0, 3).join(' / ') }));
        ui.drawParagraphBlock(ctx, {
            text: facts.join('\n'),
            x: rightX + 22,
            y: rightY + 60,
            maxWidth: rightW - 44,
            lineHeight: 22,
            color: 'rgba(225,236,255,0.80)',
            font: '14px "PingFang SC","Microsoft YaHei",sans-serif'
        });

        ui.drawGlassPanel(ctx, {
            x: panelX,
            y: logPanelY,
            w: panelW,
            h: logPanelH,
            radius: 24,
            fill: 'rgba(8,12,28,0.78)',
            stroke: 'rgba(144,188,255,0.16)',
            shadow: 'rgba(0,0,0,0.22)'
        });
        ui.drawPanelTitle(ctx, uiText('adventureLogTitle'), panelX + 22, logPanelY + 30, {
            color: '#f3f8ff',
            font: 'bold 20px "PingFang SC","Microsoft YaHei",sans-serif'
        });

        const logEntries = view.log.slice(-14);
        const logX = panelX + 24;
        const logWidth = panelW - 48;
        const logTop = logPanelY + 58;
        const logBottom = logPanelY + logPanelH - 24;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        const laidOutEntries = logEntries.map(function (entry) {
            const lineHeight = entry.kind === 'command' ? 22 : 21;
            ctx.font = entry.kind === 'command'
                ? 'bold 14px "Consolas","PingFang SC","Microsoft YaHei",monospace'
                : '14px "PingFang SC","Microsoft YaHei",sans-serif';
            return {
                entry: entry,
                lineHeight: lineHeight,
                wrapped: ui.wrapText(ctx, entry.text, logWidth)
            };
        }).map(function (layout) {
            layout.blockHeight = layout.wrapped.length * layout.lineHeight + 6;
            return layout;
        });

        const visibleLayouts = [];
        let usedHeight = 0;
        for (let index = laidOutEntries.length - 1; index >= 0; index -= 1) {
            const layout = laidOutEntries[index];
            if (visibleLayouts.length && usedHeight + layout.blockHeight > (logBottom - logTop)) break;
            visibleLayouts.unshift(layout);
            usedHeight += layout.blockHeight;
        }

        let cursorY = Math.max(logTop, logBottom - usedHeight);
        for (const layout of visibleLayouts) {
            ctx.font = layout.entry.kind === 'command'
                ? 'bold 14px "Consolas","PingFang SC","Microsoft YaHei",monospace'
                : '14px "PingFang SC","Microsoft YaHei",sans-serif';
            ctx.fillStyle = layout.entry.kind === 'command'
                ? 'rgba(255,223,164,0.92)'
                : 'rgba(228,238,255,0.86)';
            for (const line of layout.wrapped) {
                ctx.fillText(line, logX, cursorY);
                cursorY += layout.lineHeight;
            }
            cursorY += 6;
        }
    }

    function drawDialogueOverlay() {
        const panelW = Math.min(W * 0.86, 1000);
        const panelH = Math.min(H * 0.72, 580);
        const x = (W - panelW) / 2;
        const y = H * 0.12;
        const line = currentDialogue.lines[currentDialogueIndex];
        const portraitRoleKey = line.speakerKey || getSpeakerPortraitKey(line.speaker);
        const portraitImage = portraitRoleKey
            ? getImageAsset(getPortraitImageKey(portraitRoleKey, getHunterOutfitVariant(portraitRoleKey)))
            : null;
        const widePortraitLayout = !!portraitImage && panelW >= 760;
        const innerPad = 34;
        const portraitMargin = 18;
        const portraitW = portraitImage
            ? widePortraitLayout
                ? Math.min(400, panelW * 0.41)
                : Math.min(260, panelW * 0.29)
            : 0;
        const portraitH = portraitImage
            ? widePortraitLayout
                ? panelH - portraitMargin * 2
                : panelH - 150
            : 0;
        const portraitX = portraitImage
            ? widePortraitLayout
                ? x + panelW - portraitW - portraitMargin
                : x + panelW - portraitW - 34
            : 0;
        const portraitY = portraitImage ? (widePortraitLayout ? y + portraitMargin : y + 112) : 0;
        const textX = x + innerPad;
        const textRight = portraitImage
            ? widePortraitLayout
                ? portraitX - 28
                : x + panelW - 34 - portraitW - 24
            : x + panelW - innerPad;
        const textMaxWidth = Math.max(180, textRight - textX);
        ui.drawGlassPanel(ctx, {
            x: x,
            y: y,
            w: panelW,
            h: panelH,
            radius: 30,
            fill: 'rgba(8,10,26,0.82)',
            stroke: 'rgba(205,220,255,0.18)'
        });

        ui.drawPanelTitle(ctx, currentDialogue.title, textX, y + 44, {
            color: '#f5fbff',
            glow: 'rgba(140,190,255,0.22)'
        });
        ctx.fillStyle = 'rgba(201,220,255,0.72)';
        ctx.font = '14px "PingFang SC","Microsoft YaHei",sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(currentDialogue.location || uiText('hubTitle'), textX, y + 70);
        ctx.textAlign = 'right';
        ctx.fillText(`${currentDialogueIndex + 1} / ${currentDialogue.lines.length}`, x + panelW - 34, y + 70);
        ctx.textAlign = 'left';

        ui.drawDivider(ctx, x + 34, y + 96, panelW - 68, 'rgba(180,210,255,0.18)');

        ui.drawInfoChip(ctx, {
            x: textX,
            y: y + 122,
            text: line.speaker,
            color: '#ffffff',
            fill: 'rgba(35,52,92,0.88)',
            stroke: 'rgba(255,255,255,0.16)'
        });

        if (portraitImage) {
            ctx.save();
            const glow = ctx.createRadialGradient(
                portraitX + portraitW * 0.46,
                portraitY + portraitH * 0.36,
                portraitW * 0.10,
                portraitX + portraitW * 0.50,
                portraitY + portraitH * 0.48,
                portraitW * 0.92
            );
            glow.addColorStop(0, 'rgba(104,142,255,0.26)');
            glow.addColorStop(0.55, 'rgba(86,118,230,0.10)');
            glow.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = glow;
            ctx.fillRect(portraitX - 18, portraitY - 18, portraitW + 36, portraitH + 36);
            ctx.restore();

            drawArtworkFrame(portraitImage, portraitX, portraitY, portraitW, portraitH, {
                radius: widePortraitLayout ? 28 : 24,
                alpha: 0.99,
                fill: 'rgba(12,18,34,0.48)',
                stroke: 'rgba(255,255,255,0.18)'
            });
            ctx.save();
            const overlay = ctx.createLinearGradient(portraitX, portraitY, portraitX, portraitY + portraitH);
            overlay.addColorStop(0, 'rgba(10,14,26,0.02)');
            overlay.addColorStop(0.55, 'rgba(10,14,26,0.06)');
            overlay.addColorStop(1, 'rgba(10,14,26,0.34)');
            ctx.fillStyle = overlay;
            ctx.beginPath();
            const radius = widePortraitLayout ? 24 : 20;
            ctx.moveTo(portraitX + radius, portraitY);
            ctx.arcTo(portraitX + portraitW, portraitY, portraitX + portraitW, portraitY + portraitH, radius);
            ctx.arcTo(portraitX + portraitW, portraitY + portraitH, portraitX, portraitY + portraitH, radius);
            ctx.arcTo(portraitX, portraitY + portraitH, portraitX, portraitY, radius);
            ctx.arcTo(portraitX, portraitY, portraitX + portraitW, portraitY, radius);
            ctx.closePath();
            ctx.fill();
            ctx.restore();

            if (widePortraitLayout) {
                ctx.save();
                ctx.fillStyle = 'rgba(255,255,255,0.12)';
                ctx.font = 'bold 32px "PingFang SC","Microsoft YaHei",sans-serif';
                ctx.textAlign = 'right';
                ctx.textBaseline = 'alphabetic';
                ctx.fillText(line.speaker, portraitX + portraitW - 18, portraitY + portraitH - 20);
                ctx.restore();

                ctx.save();
                ctx.strokeStyle = 'rgba(255,255,255,0.10)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(textRight + 14, y + 112);
                ctx.lineTo(textRight + 14, y + panelH - 30);
                ctx.stroke();
                ctx.restore();
            }
        }

        ui.drawParagraphBlock(ctx, {
            text: line.text,
            x: textX,
            y: y + 170,
            maxWidth: textMaxWidth,
            lineHeight: 38,
            color: '#f4f8ff',
            font: '22px "PingFang SC","Microsoft YaHei",sans-serif'
        });

        drawActionButton({
            id: 'dialogue-advance',
            x: widePortraitLayout ? textX : x + panelW - 210,
            y: y + panelH - 82,
            w: 170,
            h: 48,
            label: currentDialogueIndex === currentDialogue.lines.length - 1 ? uiText('dialogueContinue') : uiText('dialogueNext'),
            top: '#5797ff',
            bottom: '#2c59b0',
            onClick: function () {
                advanceDialogue();
            }
        });

        ctx.fillStyle = 'rgba(255,255,255,0.44)';
        ctx.font = '13px "PingFang SC","Microsoft YaHei",sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(
            uiText('dialogueHint'),
            widePortraitLayout ? textX + 194 : textX,
            y + panelH - 52
        );
    }

    function drawArchiveOverlay() {
        const listX = W * 0.04;
        const topY = H * 0.06;
        const listW = W * 0.28;
        const panelH = H * 0.88;
        const contentX = W * 0.35;
        const contentW = W * 0.61;
        const archives = sceneApi.getArchiveList(storyData);
        const selected = storyData.archiveEntries[selectedArchiveId];
        const selectedArtKey = getArchiveArtworkKey(selectedArchiveId);

        ui.drawGlassPanel(ctx, {
            x: listX,
            y: topY,
            w: listW,
            h: panelH,
            radius: 28,
            fill: 'rgba(7,14,24,0.84)',
            stroke: 'rgba(159,220,255,0.18)'
        });
        ui.drawGlassPanel(ctx, {
            x: contentX,
            y: topY,
            w: contentW,
            h: panelH,
            radius: 28,
            fill: 'rgba(7,14,24,0.84)',
            stroke: 'rgba(159,220,255,0.18)'
        });

        ui.drawPanelTitle(ctx, uiText('archiveRoom'), listX + 24, topY + 42, {
            color: '#eaf8ff',
            glow: 'rgba(120,190,255,0.22)'
        });
        ctx.fillStyle = 'rgba(205,224,255,0.64)';
        ctx.font = '14px "PingFang SC","Microsoft YaHei",sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(uiText('archiveRoomHint'), listX + 24, topY + 66);

        let itemY = topY + 96;
        for (const entry of archives) {
            const unlocked = sceneApi.canAccessArchive(narrativeProgress, entry.id);
            const hovered = pointerActive && ui.pointInRect(pointerX, pointerY, { x: listX + 16, y: itemY, w: listW - 32, h: 46 });
            const selectedEntry = selectedArchiveId === entry.id;
            ui.drawGlassPanel(ctx, {
                x: listX + 16,
                y: itemY,
                w: listW - 32,
                h: 46,
                radius: 16,
                fill: selectedEntry
                    ? 'rgba(44,98,188,0.82)'
                    : hovered
                        ? 'rgba(18,30,58,0.88)'
                        : 'rgba(10,18,34,0.7)',
                stroke: selectedEntry
                    ? 'rgba(255,255,255,0.34)'
                    : 'rgba(255,255,255,0.10)',
                shadow: 'rgba(0,0,0,0)'
            });
            ctx.fillStyle = unlocked ? '#f4fbff' : 'rgba(255,255,255,0.32)';
            ctx.font = 'bold 15px "PingFang SC","Microsoft YaHei",sans-serif';
            ctx.fillText(unlocked ? entry.title : `${uiText('archiveLockedPrefix')}${entry.title}`, listX + 30, itemY + 20);
            ctx.fillStyle = unlocked ? 'rgba(208,225,255,0.66)' : 'rgba(255,255,255,0.20)';
            ctx.font = '12px "PingFang SC","Microsoft YaHei",sans-serif';
            ctx.fillText(entry.group, listX + 30, itemY + 36);

            registerButton({
                id: `archive-${entry.id}`,
                x: listX + 16,
                y: itemY,
                w: listW - 32,
                h: 46,
                onClick: function () {
                    if (!unlocked) {
                        archiveNotice = uiText('archiveLockedNotice');
                        return;
                    }
                    selectedArchiveId = entry.id;
                    archiveNotice = '';
                }
            });
            itemY += 54;
        }

        if (archiveNotice) {
            ctx.fillStyle = '#ffd49a';
            ctx.font = '13px "PingFang SC","Microsoft YaHei",sans-serif';
            ctx.fillText(archiveNotice, listX + 24, H - 34);
        }

        if (selected) {
            const selectedImage = selectedArtKey && selectedArtKey.indexOf('background:') === 0
                ? getImageAsset(selectedArtKey)
                : getImageAsset(getPortraitImageKey(
                    selectedArtKey,
                    getHunterCardById(selectedArtKey) ? getHunterOutfitVariant(selectedArtKey) : 'primary'
                ));
            const artW = selectedImage ? Math.min(240, contentW * 0.28) : 0;
            const artH = 264;
            const artX = contentX + contentW - artW - 28;
            const artY = topY + 88;
            const textMaxWidth = contentW - 56 - (selectedImage ? artW + 24 : 0);
            ui.drawPanelTitle(ctx, selected.title, contentX + 28, topY + 44, {
                color: '#ffffff',
                glow: 'rgba(120,190,255,0.2)'
            });
            ui.drawInfoChip(ctx, {
                x: contentX + 28,
                y: topY + 62,
                text: selected.group,
                color: '#eaf8ff',
                fill: 'rgba(16,24,48,0.82)'
            });

            if (selectedImage) {
                drawArtworkFrame(selectedImage, artX, artY, artW, artH, {
                    radius: 24,
                    alpha: 0.97,
                    fill: 'rgba(10,16,30,0.54)',
                    stroke: 'rgba(255,255,255,0.16)',
                    overlay: selectedArtKey.indexOf('background:') === 0 ? 'rgba(10,14,26,0.18)' : null
                });
            }

            const quoteEndY = ui.drawParagraphBlock(ctx, {
                text: selected.quote,
                x: contentX + 28,
                y: topY + 116,
                maxWidth: textMaxWidth,
                lineHeight: 24,
                color: 'rgba(164,215,255,0.88)',
                font: 'italic 16px "PingFang SC","Microsoft YaHei",sans-serif'
            });

            ui.drawDivider(ctx, contentX + 28, quoteEndY + 10, textMaxWidth);

            let paragraphY = quoteEndY + 30;
            for (const paragraph of selected.body) {
                paragraphY = ui.drawParagraphBlock(ctx, {
                    text: paragraph,
                    x: contentX + 28,
                    y: paragraphY,
                    maxWidth: textMaxWidth,
                    lineHeight: 28,
                    color: 'rgba(236,244,255,0.86)',
                    font: '16px "PingFang SC","Microsoft YaHei",sans-serif'
                }) + 12;
            }
        }

        drawActionButton({
            id: 'archive-back',
            x: contentX + contentW - 200,
            y: topY + panelH - 70,
            w: 160,
            h: 46,
            label: uiText('returnToHub'),
            top: '#4d8df2',
            bottom: '#2857aa',
            onClick: function () {
                goToHub();
            }
        });
    }

    function resolveArchiveTitles(ids) {
        return (ids || []).map(function (id) {
            return storyData.archiveEntries[id] ? storyData.archiveEntries[id].title : id;
        });
    }

    function drawResultOverlay() {
        const panelW = Math.min(W * 0.74, 800);
        const panelH = Math.min(H * 0.72, 560);
        const x = (W - panelW) / 2;
        const y = (H - panelH) / 2;
        const panelCenterX = x + panelW / 2;
        ui.drawGlassPanel(ctx, {
            x: x,
            y: y,
            w: panelW,
            h: panelH,
            radius: 30,
            fill: 'rgba(6,10,28,0.82)',
            stroke: 'rgba(190,220,255,0.18)'
        });

        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px "PingFang SC","Microsoft YaHei",sans-serif';
        ctx.shadowColor = 'rgba(100,180,255,0.5)';
        ctx.shadowBlur = 16;
        ctx.fillText(resultState.title, panelCenterX, y + 64);
        ctx.shadowBlur = 0;

        ctx.fillStyle = 'rgba(221,236,255,0.84)';
        ctx.font = '17px "PingFang SC","Microsoft YaHei",sans-serif';
        ui.drawParagraphBlock(ctx, {
            text: resultState.text,
            x: panelCenterX,
            y: y + 108,
            maxWidth: panelW - 80,
            lineHeight: 30,
            color: 'rgba(221,236,255,0.84)',
            font: '17px "PingFang SC","Microsoft YaHei",sans-serif',
            align: 'center'
        });

        ui.drawDivider(ctx, x + 40, y + 182, panelW - 80);

        ctx.fillStyle = 'rgba(255,245,210,0.9)';
        ctx.font = 'italic 16px "PingFang SC","Microsoft YaHei",sans-serif';
        ctx.fillText(resultState.quote, panelCenterX, y + 214);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 18px "PingFang SC","Microsoft YaHei",sans-serif';
        ctx.fillText(uiText('resultStats', {
            score: Math.floor(resultState.stats.score).toLocaleString(),
            combo: resultState.stats.maxCombo
        }), panelCenterX, y + 266);
        ctx.fillStyle = 'rgba(200,220,255,0.72)';
        ctx.font = '15px "PingFang SC","Microsoft YaHei",sans-serif';
        ctx.fillText(`${currentMissionConfig.objectiveLabel}：${resultState.stats.tokens}/${currentMissionConfig.tokenGoal}`, panelCenterX, y + 294);
        ctx.fillText(uiText('resultFragments', { current: narrativeProgress.hiddenFragments }), panelCenterX, y + 320);

        const unlockedArchiveTitles = resolveArchiveTitles(resultState.unlockedArchives);
        if (unlockedArchiveTitles.length) {
            ctx.fillStyle = '#8fe2ff';
            ctx.font = 'bold 16px "PingFang SC","Microsoft YaHei",sans-serif';
            ctx.fillText(uiText('resultNewArchives'), panelCenterX, y + 364);
            ctx.fillStyle = 'rgba(231,245,255,0.82)';
            ctx.font = '15px "PingFang SC","Microsoft YaHei",sans-serif';
            for (let index = 0; index < unlockedArchiveTitles.length; index += 1) {
                ctx.fillText(`• ${unlockedArchiveTitles[index]}`, panelCenterX, y + 392 + index * 24);
            }
        }

        drawActionButton({
            id: 'result-primary',
            x: W / 2 - 96,
            y: y + panelH - 90,
            w: 192,
            h: 52,
            label: resultState.primaryLabel,
            top: '#56a1ff',
            bottom: '#2958b4',
            onClick: function () {
                finishMissionResult();
            }
        });
    }

    function drawGameOverOverlay() {
        const panelW = Math.min(W * 0.66, 720);
        const panelH = Math.min(H * 0.54, 420);
        const x = (W - panelW) / 2;
        const y = (H - panelH) / 2;
        const panelCenterX = x + panelW / 2;
        ui.drawGlassPanel(ctx, {
            x: x,
            y: y,
            w: panelW,
            h: panelH,
            radius: 30,
            fill: 'rgba(18,6,10,0.86)',
            stroke: 'rgba(255,134,112,0.18)'
        });

        ctx.textAlign = 'center';
        ctx.fillStyle = '#ff8d74';
        ctx.font = 'bold 42px "PingFang SC","Microsoft YaHei",sans-serif';
        ctx.shadowColor = 'rgba(255,100,80,0.62)';
        ctx.shadowBlur = 18;
        ctx.fillText(gameOverState.title, panelCenterX, y + 72);
        ctx.shadowBlur = 0;

        ui.drawParagraphBlock(ctx, {
            text: gameOverState.body,
            x: panelCenterX,
            y: y + 126,
            maxWidth: panelW - 96,
            lineHeight: 30,
            color: 'rgba(255,236,232,0.86)',
            font: '17px "PingFang SC","Microsoft YaHei",sans-serif',
            align: 'center'
        });

        ctx.fillStyle = 'rgba(255,255,255,0.68)';
        ctx.font = '15px "PingFang SC","Microsoft YaHei",sans-serif';
        ctx.fillText(uiText('gameOverStats', {
            score: Math.floor(score).toLocaleString(),
            combo: maxCombo
        }), panelCenterX, y + 252);

        drawActionButton({
            id: 'gameover-retry',
            x: W / 2 - 196,
            y: y + panelH - 92,
            w: 170,
            h: 50,
            label: gameOverState.primaryLabel,
            top: '#ff845f',
            bottom: '#b73b2e',
            onClick: function () {
                retryCurrentMission();
            }
        });
        drawActionButton({
            id: 'gameover-back',
            x: W / 2 + 26,
            y: y + panelH - 92,
            w: 170,
            h: 50,
            label: gameOverState.secondaryLabel,
            top: '#6b7a96',
            bottom: '#39445a',
            onClick: function () {
                goToHub();
            }
        });
    }

    function drawChapterBanner() {
        if (chapterBannerTimer <= 0 || !chapterBannerText || gameState === STATE.MISSION) return;
        const alpha = Math.min(1, chapterBannerTimer / 0.6);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.font = 'bold 26px "PingFang SC","Microsoft YaHei",sans-serif';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(120,190,255,0.22)';
        ctx.shadowBlur = 12;
        ctx.fillText(chapterBannerText, W / 2, 74);
        ctx.restore();
    }

    function render() {
        uiButtons = [];
        hoveredButtonId = null;

        drawBackground();

        ctx.save();
        ctx.translate(shakeX, shakeY);
        if (gameState !== STATE.MENU) drawStars();
        for (const powerUp of powerUps) drawPowerUp(powerUp);
        for (const enemy of enemies) drawEnemy(enemy);
        drawBullets();
        drawParticles();
        if (gameState === STATE.MISSION || gameState === STATE.GAMEOVER) {
            if (gameState !== STATE.GAMEOVER || player.lives > 0) drawPlayer();
        }
        drawFloatingTexts();
        ctx.restore();

        if (flashAlpha > 0.01) {
            ctx.fillStyle = `rgba(255,255,255,${flashAlpha})`;
            ctx.fillRect(0, 0, W, H);
        }

        if (gameState === STATE.MISSION) drawMissionUI();
        else if (gameState === STATE.MENU) drawMenuOverlay();
        else if (gameState === STATE.HUB) drawHubOverlay();
        else if (gameState === STATE.HUNTERS) drawHuntersOverlay();
        else if (gameState === STATE.ADVENTURE) {
            drawAdventureOverlay();
            drawAdventureTalkPortraitFx();
        }
        else if (gameState === STATE.DIALOGUE) drawDialogueOverlay();
        else if (gameState === STATE.ARCHIVE) drawArchiveOverlay();
        else if (gameState === STATE.RESULT) drawResultOverlay();
        else if (gameState === STATE.GAMEOVER) drawGameOverOverlay();

        drawChapterBanner();
        drawOverlayNotice();
    }

    function advanceDialogue() {
        if (!currentDialogue) return;
        playSfx('dialogue');
        currentDialogueIndex += 1;
        if (currentDialogueIndex < currentDialogue.lines.length) return;
        const onComplete = currentDialogue.onComplete;
        currentDialogue = null;
        currentDialogueIndex = 0;
        if (onComplete) onComplete();
        else goToHub();
    }

    function getButtonAt(x, y) {
        for (let index = uiButtons.length - 1; index >= 0; index -= 1) {
            const button = uiButtons[index];
            if (ui.pointInRect(x, y, button)) return button;
        }
        return null;
    }

    function invokePrimaryButton() {
        if (!uiButtons.length) return false;
        const primary = uiButtons[0];
        if (primary && primary.onClick) {
            playSfx('button');
            primary.onClick();
            return true;
        }
        return false;
    }

    function handleCanvasActivate(clientX, clientY) {
        unlockAudio();
        const x = clientX;
        const y = clientY;
        const button = getButtonAt(x, y);
        if (button && button.onClick) {
            playSfx('button');
            button.onClick();
            return;
        }

        if (gameState === STATE.MENU) {
            playSfx('button');
            goToHub(uiText('menuEnterHub'));
        } else if (gameState === STATE.ADVENTURE) {
            focusAdventureInput();
        } else if (gameState === STATE.DIALOGUE) {
            advanceDialogue();
        } else if (gameState === STATE.RESULT) {
            playSfx('button');
            finishMissionResult();
        } else if (gameState === STATE.GAMEOVER) {
            playSfx('button');
            retryCurrentMission();
        }
    }

    function cycleArchive(direction) {
        const list = sceneApi.getArchiveList(storyData).filter(function (entry) {
            return sceneApi.canAccessArchive(narrativeProgress, entry.id);
        });
        const currentIndex = Math.max(0, list.findIndex(function (entry) { return entry.id === selectedArchiveId; }));
        const nextIndex = (currentIndex + direction + list.length) % list.length;
        selectedArchiveId = list[nextIndex].id;
    }

    function gameLoop(timestamp) {
        if (!gameLoop.lastTime) gameLoop.lastTime = timestamp;
        let dt = (timestamp - gameLoop.lastTime) / 1000;
        gameLoop.lastTime = timestamp;
        if (dt > 0.15) dt = 0.15;
        if (dt <= 0) dt = 0.016;

        update(dt);
        render();
        requestAnimationFrame(gameLoop);
    }

    canvas.addEventListener('mousemove', function (event) {
        pointerX = event.clientX;
        pointerY = event.clientY;
        pointerActive = true;
        mouseOnCanvas = true;
    });

    canvas.addEventListener('mouseenter', function () {
        mouseOnCanvas = true;
    });

    canvas.addEventListener('mouseleave', function () {
        mouseOnCanvas = false;
        pointerActive = false;
    });

    canvas.addEventListener('touchmove', function (event) {
        event.preventDefault();
        const touch = event.touches[0];
        pointerX = touch.clientX;
        pointerY = touch.clientY - 55;
        pointerActive = true;
        mouseOnCanvas = true;
    }, { passive: false });

    canvas.addEventListener('touchstart', function (event) {
        event.preventDefault();
        const touch = event.touches[0];
        pointerX = touch.clientX;
        pointerY = touch.clientY - 55;
        pointerActive = true;
        mouseOnCanvas = true;
    }, { passive: false });

    canvas.addEventListener('touchend', function () {
        mouseOnCanvas = false;
    });

    canvas.addEventListener('click', function (event) {
        handleCanvasActivate(event.clientX, event.clientY);
    });

    languageSwitcher.addEventListener('click', function (event) {
        const button = event.target.closest('.language-switch-button');
        if (!button) return;
        event.preventDefault();
        applyLanguage(button.dataset.language);
    });

    adventureCommandForm.addEventListener('submit', function (event) {
        event.preventDefault();
        event.stopPropagation();
        if (gameState !== STATE.ADVENTURE) return;
        unlockAudio();
        submitAdventureCommand(adventureCommandInput.value);
        focusAdventureInput();
    });

    adventureCommandInput.addEventListener('keydown', function (event) {
        event.stopPropagation();
    });

    adventureQuickVerbs.addEventListener('click', function (event) {
        const button = event.target.closest('.quick-verb');
        if (!button) return;
        event.preventDefault();
        event.stopPropagation();
        if (gameState !== STATE.ADVENTURE) return;
        unlockAudio();

        const directCommand = button.dataset.commandValue;
        const prefix = button.dataset.seedValue;
        if (directCommand) {
            submitAdventureCommand(directCommand);
            focusAdventureInput();
            return;
        }

        if (prefix) {
            const currentValue = adventureCommandInput.value.trim();
            adventureCommandInput.value = currentValue ? `${prefix}${currentValue}` : prefix;
            focusAdventureInput();
        }
    });

    window.addEventListener('keydown', function (event) {
        if (gameState === STATE.ADVENTURE) {
            const activeTag = document.activeElement && document.activeElement.tagName;
            const typingIntoAdventure = document.activeElement === adventureCommandInput || activeTag === 'INPUT' || activeTag === 'TEXTAREA';
            if (typingIntoAdventure) {
                if (event.code === 'Escape') {
                    adventureCommandInput.blur();
                    event.preventDefault();
                }
                return;
            }
            if (event.code === 'Enter') {
                focusAdventureInput();
                event.preventDefault();
                return;
            }
        }

        if (event.code === 'Space' || event.code === 'Enter') {
            unlockAudio();
            if (!invokePrimaryButton()) {
                if (gameState === STATE.DIALOGUE) advanceDialogue();
                else if (gameState === STATE.MENU) {
                    playSfx('button');
                    goToHub(uiText('menuEnterHub'));
                } else if (gameState === STATE.RESULT) {
                    playSfx('button');
                    finishMissionResult();
                } else if (gameState === STATE.GAMEOVER) {
                    playSfx('button');
                    retryCurrentMission();
                }
            }
            event.preventDefault();
            return;
        }

        if ((gameState === STATE.ARCHIVE || gameState === STATE.HUNTERS) && event.code === 'Escape') {
            goToHub();
            event.preventDefault();
            return;
        }

        if (gameState === STATE.ARCHIVE && event.code === 'ArrowDown') {
            cycleArchive(1);
            event.preventDefault();
            return;
        }

        if (gameState === STATE.ARCHIVE && event.code === 'ArrowUp') {
            cycleArchive(-1);
            event.preventDefault();
        }
    });

    function spawnMenuEnemies() {
        setTimeout(spawnMenuEnemies, 800 + Math.random() * 1200);
    }

    window.addEventListener('resize', resizeCanvas);

    preloadAssets();
    resizeCanvas();
    resetPlayer();
    selectedHunterId = getSelectableHunterId(selectedHunterId);
    applyLanguage(currentLanguage, { persist: false });
    syncCursor();
    syncAdventureInputUi();
    maybeUnlockHiddenStories();
    spawnMenuEnemies();

    console.log('Star Hunter 剧情模式已启动。');
    console.log(' - 菜单 -> 酒吧 -> 对话 -> 任务 -> 结算 -> 档案');
    console.log(' - 主线：归途有灯');
    console.log(' - 隐藏线：麦伦船长发家史');

    requestAnimationFrame(gameLoop);
})();
