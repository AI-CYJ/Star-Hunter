(function () {
    const archiveEntries = {
        overview: {
            id: 'overview',
            title: '星际猎手',
            group: '世界观',
            quote: '一个提供避风港却不追问风暴，一个支付报酬却从不赎回自由。',
            unlockedByDefault: true,
            body: [
                '科技的跨越式进步把古人类带入了星际时代，观测者计划让各大种族第一次建立起广泛而持续的联系。',
                '短暂的繁华之后，跨星系公司开始争夺核心能源与生存空间。战争没有因为对和平的向往而停下，反而在更深的利益结构里加速蔓延。',
                '星际猎手诞生于这片混乱。它不是正规军，也不是雇佣兵公会，而是一群在战争、流亡与命运缝隙中彼此拣回彼此的人。银河系中心酒吧，就是他们向黑暗借来的一盏灯。'
            ]
        },
        jinxing: {
            id: 'jinxing',
            title: '烬行',
            group: '星际猎手',
            quote: '既见诸君，云胡不喜？',
            unlockedByDefault: false,
            body: [
                '银河系中心酒吧的老板，也是星际猎手的队长。对外，他是最难被量化的狙击手；对内，他更像在废墟边上支起灯牌的人。',
                '烬行最强的地方不是弓箭的威力，而是判断距离的方式。对别人来说是物理，对他来说更像某种本能，一种早已与伤痕长在一起的直觉。',
                '他把酒吧重新装修，不只是为了营业，而是为了给失联者留下一枚能够被重新识别的坐标。对赛博恩尤其如此。'
            ]
        },
        duyi: {
            id: 'duyi',
            title: '度漪',
            group: '星际猎手',
            quote: '人类的音乐，是全宇宙最棒的。',
            unlockedByDefault: false,
            body: [
                '度漪是仍旧坚持以“地球年”丈量记忆的古人类歌者，也是银河系中心酒吧开业后的 1 号会员。',
                '他把地球、月色、旧时代的旋律一起背在身上，在无数星系间巡演。别人觉得他像流浪诗人，他自己则更像一个不肯把故乡交给时间的人。',
                '在主线中，度漪承担着情绪缓冲器的作用。他用一句“月色，打包了一份，寄给你了”，替所有无法直说的思念找到了落脚点。'
            ]
        },
        lingfredil: {
            id: 'lingfredil',
            title: '铃弗瑞迪尔',
            group: '星际猎手',
            quote: '我只是平等地歧视所有生物，包括我自己。',
            unlockedByDefault: false,
            body: [
                '铃兰精灵，顶级治疗师。比起仁心，他更相信好奇心。救人对他来说往往不是使命，而是一次观察命运如何继续运作的实验。',
                '关于他的治疗术，机械族有过危险的推测：所谓治愈，不过是把伤害转移到未来，把代价寄存在时间里。',
                '在游戏里，铃弗瑞迪尔适合承担“设定解释器”和“冷面吐槽者”两种功能，让世界观与人物关系在对话里自然展开。'
            ]
        },
        sword: {
            id: 'sword',
            title: '斯沃德·麦伦',
            group: '星际猎手',
            quote: '共识，就是用来打破的。',
            unlockedByDefault: false,
            body: [
                '全宇宙唯一的半兽人剑客，“悖论之刃”。母星战败、族群溃散之后，他被铃弗瑞迪尔从死亡边缘拖回，又被烬行从麻木里拽出来。',
                '他最初加入星际猎手，并不是因为相信希望，而是因为已经没有别的去处。但正是在一群疯子中间，他慢慢重新学会了笑。',
                '斯沃德线非常适合做进阶任务、训练小游戏和隐藏条件，因为他的角色核心就是“把不被允许的可能性变成事实”。'
            ]
        },
        chen: {
            id: 'chen',
            title: '谶',
            group: '星际猎手',
            quote: '纵隔星海，闻召即来。谶之诺也。',
            unlockedByDefault: false,
            body: [
                '谶是一把从液态金属里觉醒的剑灵。他曾是刀，如今只愿做自己的剑。',
                '在度漪带他去古地球旧道观之后，他第一次意识到“剑只是剑”并不是空洞答案，而是一种让自我落地的证明。',
                '谶的台词天然带有古意，适合放在演出感强的章节标题、技能命名和高光结算文案里。'
            ]
        },
        tara: {
            id: 'tara',
            title: '塔拉撒里昂',
            group: '星际猎手',
            quote: '宇宙里没有月光，但他的歌声能形成潮汐。',
            unlockedByDefault: false,
            body: [
                '人鱼歌王塔拉撒里昂，既是舞台上的顶流，也是曾经的人鱼反抗军领袖。',
                '他从炸运输舰到写劳工白皮书，用最戏剧性的方式证明：真正的解放不只是喊口号，而是让族人能够合法地拥有账户、合同和尊严。',
                '塔拉撒里昂非常适合被做成后续大型章节角色，因为他天生连接着战争、资本、艺术与政治四条叙事线。'
            ]
        },
        cyberon: {
            id: 'cyberon',
            title: '赛博恩',
            group: '星际猎手',
            quote: '宁可与你们重新认识一次，也不可以把与你们的记忆备份。',
            unlockedByDefault: false,
            body: [
                '义体人赛博恩用自己的身体测试血肉和机械能走多远。他曾依靠意识副本反复死亡与复活，直到有一天，他决定停止备份。',
                '那不是因为他终于不怕死了，而是因为他开始拥有不愿丢失的回忆。那一刻，他把余生押给了朋友。',
                '主线“归途有灯”的情感核心，就是烬行试图把这位失联的兄弟重新带回灯下。'
            ]
        },
        maillenCaptain: {
            id: 'maillenCaptain',
            title: '麦伦船长发家史',
            group: '隐藏档案',
            quote: '这是冒险家们独有的心跳声。',
            unlockedByDefault: false,
            body: [
                'MIR-z11 是一颗被矿井和旧战争遗迹覆盖的行星。矿工麦伦在那里意外得到了能够与魔法共鸣的蓝色天然水晶。',
                '公司广播只愿意出两万星际币回收它，而精灵公会却愿意开出一千万。于是，一只半兽人、一头老实牛、一个机械臂领航员和一位满嘴谎话的精灵女孩，被同一枚矿晶拴上了命运。',
                '麦伦从偷渡客手里夺船、在停机坪临时跑路、在占卜屋里被调包、又在空间站里把矿石直接砸进魔动力炉，用近乎胡来的方式硬生生为自己炸开一条航道。',
                '这条故事线不是正史主线，而是埋在星际猎手世界背面的旧档案。它解释了“麦伦”这个名字为何会在后来的群像里带着传奇意味，也为未来扩展出更完整的船长篇留足了空间。'
            ]
        }
    };

    const characterCards = [
        { id: 'jinxing', name: '烬行', role: '队长 / 狙击手', color: '#79b6ff', unlockedByDefault: true },
        { id: 'duyi', name: '度漪', role: '古人类歌者', color: '#ffdb8f', unlockedByDefault: true },
        { id: 'lingfredil', name: '铃弗瑞迪尔', role: '铃兰精灵', color: '#9bf3c6', unlockedByDefault: true },
        { id: 'sword', name: '斯沃德', role: '半兽人剑客', color: '#a9b8ff', unlockedByDefault: true },
        { id: 'chen', name: '谶', role: '剑灵', color: '#ffa2a2', unlockedByDefault: false },
        { id: 'tara', name: '塔拉撒里昂', role: '人鱼歌王', color: '#8de0ff', unlockedByDefault: false },
        { id: 'cyberon', name: '赛博恩', role: '义体人', color: '#f5a2ff', unlockedByDefault: false }
    ];

    const hubDialogues = {
        jinxing: {
            title: '吧台一角',
            lines: [
                { speaker: '烬行', text: '今天这单，不卖酒。我们去把一个人接回来。' },
                { speaker: '烬行', text: '如果你想问我为什么非要把酒吧重新点亮，那是因为有些人只认得这个坐标。' }
            ]
        },
        duyi: {
            title: '旧时代的歌',
            lines: [
                { speaker: '度漪', text: '人类的音乐是全宇宙最棒的，这件事我会一直唱到宇宙热寂。' },
                { speaker: '度漪', text: '你要是紧张，就想一想月亮。想一想总有些光，不是为了照亮战场，而是为了照亮回家的路。' }
            ]
        },
        lingfredil: {
            title: '铃兰与时间',
            lines: [
                { speaker: '铃弗瑞迪尔', text: '放心，我只是在观察你，不是关心你。' },
                { speaker: '铃弗瑞迪尔', text: '所谓治愈，也可能只是把代价往后拖。你们人类不是最爱赌未来吗？' }
            ]
        },
        sword: {
            title: '训练场余温',
            lines: [
                { speaker: '斯沃德', text: '共识这种东西，我现在只拿来骗敌人。' },
                { speaker: '斯沃德', text: '如果我还能继续挥剑，那就说明那场熄灭还没有赢。' }
            ]
        },
        chen: {
            title: '剑心未凉',
            lines: [
                { speaker: '谶', text: '度漪师父说，绝世高手不仅要会出剑，还要心中有爱。' },
                { speaker: '谶', text: '在下仍在学习成为“大侠”，若有不足，还请指教。' }
            ]
        },
        tara: {
            title: '潮汐之外',
            lines: [
                { speaker: '塔拉撒里昂', text: '本王今日不唱悲歌，只想确认你们的欢呼声是不是还和昨天一样大。' },
                { speaker: '塔拉撒里昂', text: '我们不是被观赏的流光，而是会咬断渔网的利齿。记住这一点。' }
            ]
        },
        cyberon: {
            title: '归航之后',
            lines: [
                { speaker: '赛博恩', text: '本大爷都回来了，你们还想让我继续欠账是吧？' },
                { speaker: '赛博恩', text: '要我说，能重新认识你们一次，也不算太亏。' }
            ]
        }
    };

    const chapters = {
        guidingLight: {
            id: 'guidingLight',
            title: '归途有灯',
            subtitle: '从银河系中心酒吧出发，沿着残缺信号把失联的朋友接回来。',
            scenes: [
                {
                    id: 'openingBrief',
                    type: 'dialogue',
                    title: '序章：酒吧重启',
                    location: '银河系中心酒吧',
                    autoStartNext: true,
                    lines: [
                        { speaker: '旁白', text: '战争把银河切成了无数段，银河系中心酒吧却在一次永夜之后重新亮起。' },
                        { speaker: '度漪', text: '门牌擦得这么亮，像是准备迎接什么贵客。' },
                        { speaker: '铃弗瑞迪尔', text: '或者说，是在给迷路的灵魂留一枚更醒目的坐标。' },
                        { speaker: '烬行', text: '差不多。坐标已经稳定，残缺信号也开始回流。' },
                        { speaker: '斯沃德', text: '你找到赛博恩了？' },
                        { speaker: '烬行', text: '还没有。我只找到两段会自己熄灭的航迹。今天这单，不卖酒。我们去把一个人接回来。' }
                    ]
                },
                {
                    id: 'signalPrep',
                    type: 'adventure',
                    title: '行动前夜：主控台校准',
                    adventureId: 'signalPrep'
                },
                {
                    id: 'midnightBar',
                    type: 'dialogue',
                    title: '中场：灯下闲谈',
                    location: '银河系中心酒吧',
                    autoStartNext: true,
                    lines: [
                        { speaker: '度漪', text: '月色，打包了一份，寄给你了。你当时收到的时候，是不是还在枪火里？' },
                        { speaker: '烬行', text: '嗯。屏幕上有一碗月光，战场上什么都没有。' },
                        { speaker: '铃弗瑞迪尔', text: '浪漫会浪费判断，但你们偏偏总能靠这种东西活下来。' },
                        { speaker: '斯沃德', text: '第二段坐标呢？' },
                        { speaker: '烬行', text: '在碎裂空域中心，像有人故意把回家的路切断了一半。' },
                        { speaker: '烬行', text: '收拾一下。下一次出去，不只是回收坐标。我要把那盏灯亲手接回来。' }
                    ]
                },
                {
                    id: 'homewardTrace',
                    type: 'adventure',
                    title: '第二段坐标：归航校准',
                    adventureId: 'homewardTrace'
                },
                {
                    id: 'ending',
                    type: 'dialogue',
                    title: '结章：归途有灯',
                    location: '银河系中心酒吧',
                    autoStartNext: false,
                    lines: [
                        { speaker: '旁白', text: '主控台的灯一盏接一盏亮起，像有人沿着吧台重新摆好了回家的路。' },
                        { speaker: '赛博恩', text: '……我……本大爷是不是……赌赢了？' },
                        { speaker: '度漪', text: '欢迎回来。歌我都准备好了。' },
                        { speaker: '斯沃德', text: '啧，欠账的人果然命都比较硬。' },
                        { speaker: '烬行', text: '账单还没清。人也还在。很好。' },
                        { speaker: '旁白', text: '这一夜之后，银河系中心酒吧不再只是避风港。它成了真正能等人回来的一盏灯。' }
                    ]
                }
            ]
        }
    };

    const adventures = {
        signalPrep: {
            id: 'signalPrep',
            title: '行动前夜：主控台校准',
            subtitle: '把主控终端、星图和队伍状态校准完毕，再从酒吧起航。',
            introText: '酒吧暂时没有人催你开火。所有人都在等你把这次出发的细节准备完整。',
            theme: {
                top: '#09101e',
                middle: '#141f35',
                bottom: '#100a16',
                accent: '#7ab8ff'
            },
            startRoomId: 'barMain',
            objectiveRules: [
                {
                    conditions: { flagsAll: ['missionReady'] },
                    text: '主控台已经进入出发状态。输入“启动行动”离开酒吧，突入战区。'
                },
                {
                    conditions: { flagsAll: ['mapInstalled', 'decoderInstalled'], inventoryNot: ['launchClearance'] },
                    text: '终端校准已完成，去机库连桥向烬行汇报，领取行动许可。'
                },
                {
                    conditions: { flagsAll: ['gotStarMap'], inventoryNot: ['decoderChip'], flagsNot: ['decoderInstalled'] },
                    text: '航图碎页已经到手。去侧廊医务角找铃弗瑞迪尔拿旧式解码片。'
                },
                {
                    conditions: { inventoryAll: ['decoderChip'], flagsNot: ['decoderInstalled'] },
                    text: '把旧式解码片插回主控终端，再继续校准酒吧的出发坐标。'
                },
                {
                    conditions: { inventoryAll: ['launchClearance'], flagsNot: ['missionReady'] },
                    text: '行动许可已经就位。把它录入主控终端，然后执行起航命令。'
                }
            ],
            defaultHints: ['查看主控终端', '前往侧廊医务角', '对话烬行', '背包'],
            rooms: {
                barMain: {
                    id: 'barMain',
                    name: '银河系中心酒吧',
                    description: '吧台的灯带被重新擦亮，像有人把所有疲惫都先藏去了柜台后面。度漪靠在侧边长桌边，正低声哼着旧地球的旋律；通往主控台、侧廊医务角和机库连桥的路都亮着细细的引导灯。',
                    shortDescription: '银河系中心酒吧仍旧安静运转着，几条引导灯把去往主控台、侧廊医务角和机库连桥的路线标了出来。',
                    overlayDescription: '这里是今晚所有行动的起点。先把主控终端校准完整，再去找其他人确认准备情况。',
                    backgroundKey: 'hub',
                    exits: [
                        { to: 'mainConsole', label: '主控台', aliases: ['主控台', '主控终端', '终端区'] },
                        { to: 'medCorner', label: '侧廊医务角', aliases: ['医务角', '侧廊', '医务区'] },
                        { to: 'hangarBridge', label: '机库连桥', aliases: ['机库', '机库连桥', '连桥'] }
                    ],
                    hints: ['前往主控台', '对话度漪', '前往机库连桥']
                },
                mainConsole: {
                    id: 'mainConsole',
                    name: '主控台',
                    description: '主控终端被拆开了一半，三条校准槽正等着被重新插满：星图定位、旧式解码和出发许可。一页被折过很多次的航图碎页还压在台面上。',
                    shortDescription: '主控终端仍在等待星图、解码片和行动许可三项条件全部就位。',
                    overlayDescription: '主控台是这次出发的神经中枢。把正确的东西按顺序录入这里，任务才会真正开始。',
                    backgroundKey: 'hubDetail',
                    exits: [
                        { to: 'barMain', label: '酒吧前厅', aliases: ['酒吧', '前厅', '返回酒吧'] }
                    ],
                    hints: ['拿航图碎页', '查看主控终端', '使用行动许可在主控终端']
                },
                medCorner: {
                    id: 'medCorner',
                    name: '侧廊医务角',
                    description: '医务角的灯温偏冷，铃弗瑞迪尔正坐在药柜前翻一枚旧式解码片，像是在评估它还能不能被这个年代继续容忍。',
                    shortDescription: '铃弗瑞迪尔还待在医务角里，手边那枚旧式解码片闪着冷光。',
                    overlayDescription: '如果谁还能在一堆旧时代硬件里翻出真正有用的东西，多半就是铃弗瑞迪尔。',
                    backgroundKey: 'hubDetail',
                    exits: [
                        { to: 'barMain', label: '酒吧前厅', aliases: ['酒吧', '前厅', '返回酒吧'] }
                    ],
                    hints: ['对话铃弗瑞迪尔', '查看铃弗瑞迪尔']
                },
                hangarBridge: {
                    id: 'hangarBridge',
                    name: '机库连桥',
                    description: '连桥外是机库的蓝白安全灯。烬行正站在舷窗前确认起飞路径，斯沃德倚在护栏边，一副已经准备好把任何坏消息劈开的样子。',
                    shortDescription: '烬行和斯沃德都在机库连桥上，等着主控台那边传来最后的绿色灯号。',
                    overlayDescription: '机库连桥连着行动的最后一步。准备没做完之前，烬行只会让你回去把所有细节补齐。',
                    backgroundKey: 'station',
                    exits: [
                        { to: 'barMain', label: '酒吧前厅', aliases: ['酒吧', '前厅', '返回酒吧'] }
                    ],
                    hints: ['对话烬行', '对话斯沃德', '前往酒吧前厅']
                }
            },
            items: {
                mainConsole: {
                    id: 'mainConsole',
                    name: '主控终端',
                    aliases: ['主控终端', '主控台', '终端'],
                    location: 'mainConsole',
                    portable: false,
                    lookRules: [
                        {
                            conditions: { flagsAll: ['missionReady'] },
                            text: '三条校准槽已经全部转绿，终端正滚动显示“允许离港”。你只差一句命令，就能让整支队伍正式出发。'
                        },
                        {
                            conditions: { flagsAll: ['mapInstalled', 'decoderInstalled'] },
                            text: '星图定位和旧式解码都已经接上，只剩最后一项出发许可还没录入。烬行那边应该已经能给你放行。'
                        },
                        {
                            conditions: { flagsAll: ['mapInstalled'] },
                            text: '星图定位已经恢复，但解码槽还空着。没有旧式解码片，这台终端还读不懂残缺信号。'
                        },
                        {
                            text: '终端面板上依次亮着三条待办：星图定位、旧式解码、出发许可。台边还压着一页航图碎页。'
                        }
                    ]
                },
                starMap: {
                    id: 'starMap',
                    name: '航图碎页',
                    aliases: ['航图碎页', '航图', '碎页'],
                    location: 'mainConsole',
                    hiddenIfFlag: 'mapInstalled',
                    portable: true,
                    lookText: '这页航图被反复折叠过，边缘还有烬行留下的标记。它对应的正是第一段失联航迹。',
                    takeText: '你收起了航图碎页。第一段航迹被重新握回手里。'
                },
                decoderChip: {
                    id: 'decoderChip',
                    name: '旧式解码片',
                    aliases: ['旧式解码片', '解码片', '芯片'],
                    portable: true,
                    lookText: '这是一枚早该被淘汰的旧硬件，但正因为老，它还能兼容那些没人愿意继续维护的残缺信号。'
                },
                launchClearance: {
                    id: 'launchClearance',
                    name: '行动许可',
                    aliases: ['行动许可', '许可', '放行码'],
                    portable: true,
                    lookText: '烬行把自己的权限签在了这份放行码里。它的分量不在纸面，而在“我允许你们把人接回来”这句话。'
                }
            },
            actors: {
                duyi: {
                    id: 'duyi',
                    name: '度漪',
                    aliases: ['度漪'],
                    location: 'barMain',
                    lookText: '度漪把旧时代的温柔留在了酒吧里。他明明也紧张，却总像能替别人先把心跳稳住。',
                    talkRules: [
                        {
                            conditions: { flagsNot: ['talkedDuyiSignal'] },
                            text: '度漪抬头看了你一眼：“先把主控台那边弄好吧。烬行最怕的不是火力不够，是出发前还有哪个细节没被认真对待。”',
                            effects: { setFlags: ['talkedDuyiSignal'] }
                        },
                        {
                            text: '度漪轻轻敲了敲桌面：“去吧。等灯亮起来的时候，记得把人一起带回来。”'
                        }
                    ]
                },
                lingfredil: {
                    id: 'lingfredil',
                    name: '铃弗瑞迪尔',
                    aliases: ['铃弗瑞迪尔', '铃弗', '精灵'],
                    location: 'medCorner',
                    lookText: '铃弗瑞迪尔显然早就把你会来这件事算进去了，连那枚旧式解码片都已经从药柜角落里翻了出来。',
                    talkRules: [
                        {
                            conditions: { flagsNot: ['gotDecoderChip'] },
                            text: '铃弗瑞迪尔把解码片抛给你：“别谢我。我只是好奇，你们这次到底要拿多少浪漫去和一堆战区废铁谈判。”你接住了解码片。',
                            effects: {
                                setFlags: ['gotDecoderChip'],
                                addItems: ['decoderChip']
                            }
                        },
                        {
                            text: '铃弗瑞迪尔淡淡地看了你一眼：“还站在这里做什么？那枚解码片又不会自己走回主控台。”'
                        }
                    ]
                },
                sword: {
                    id: 'sword',
                    name: '斯沃德',
                    aliases: ['斯沃德', '麦伦'],
                    location: 'hangarBridge',
                    lookText: '斯沃德靠在护栏边，像一把已经出鞘一半的刀。只要烬行一声令下，他就会跟着连桥尽头那扇门一起冲出去。',
                    talkRules: [
                        {
                            conditions: { flagsNot: ['talkedSwordSignal'] },
                            text: '斯沃德用下巴点了点机库方向：“去把主控台那边的绿灯全点亮。等你把信号从废墟里拖回来，我再负责把挡路的都劈开。”',
                            effects: { setFlags: ['talkedSwordSignal'] }
                        },
                        {
                            text: '斯沃德啧了一声：“别磨蹭。你现在浪费的每一秒，都是赛博恩在外面多挨的一秒。”'
                        }
                    ]
                },
                jinxing: {
                    id: 'jinxing',
                    name: '烬行',
                    aliases: ['烬行', '队长'],
                    location: 'hangarBridge',
                    lookText: '烬行正对着舷窗外的黑暗确认路线。他不需要太多动作，整条起飞路径就已经像被他先看穿了一遍。',
                    talkRules: [
                        {
                            conditions: { flagsAll: ['mapInstalled', 'decoderInstalled'], flagsNot: ['gotLaunchClearance'] },
                            text: '烬行把一段放行码推到你手里：“主控台那边做得不错。把这个录进去，然后我们就走。”你拿到了行动许可。',
                            effects: {
                                setFlags: ['gotLaunchClearance'],
                                addItems: ['launchClearance']
                            }
                        },
                        {
                            conditions: { flagsAll: ['missionReady'] },
                            text: '烬行抬眼确认你手上的准备状态：“很好。主控台既然已经转绿，就别让那盏灯再多等一秒。输入‘启动行动’，我们出发。”'
                        },
                        {
                            text: '烬行没有回头：“先把主控台的星图和解码槽都接好。准备不完整，我不会让任何人离港。”'
                        }
                    ]
                }
            },
            useRules: [
                {
                    item: 'starMap',
                    target: 'mainConsole',
                    conditions: { flagsNot: ['mapInstalled'] },
                    text: '你把航图碎页压进定位槽里，终端立刻展开了一条重新拼接的战区航迹。第一项校准完成了。',
                    effects: {
                        setFlags: ['mapInstalled'],
                        removeItems: ['starMap']
                    }
                },
                {
                    item: 'decoderChip',
                    target: 'mainConsole',
                    conditions: { flagsAll: ['mapInstalled'], flagsNot: ['decoderInstalled'] },
                    text: '旧式解码片插入后，终端上的乱码逐渐压成了稳定波形。残缺信号终于肯把自己重新说清楚。',
                    effects: {
                        setFlags: ['decoderInstalled'],
                        removeItems: ['decoderChip']
                    }
                },
                {
                    item: 'decoderChip',
                    target: 'mainConsole',
                    failText: '终端连定位航图都还没装好，解码片现在插进去也只会得到一屏无意义噪声。'
                },
                {
                    item: 'launchClearance',
                    target: 'mainConsole',
                    conditions: { flagsAll: ['mapInstalled', 'decoderInstalled'], flagsNot: ['missionReady'] },
                    text: '你把行动许可录入主控终端，三条状态灯一口气全部转绿。酒吧外侧的停机灯同步亮起，整个出发流程已经准备完成。',
                    effects: {
                        setFlags: ['missionReady'],
                        removeItems: ['launchClearance']
                    }
                },
                {
                    item: 'launchClearance',
                    target: 'mainConsole',
                    failText: '没有完成星图和解码的前置校准前，行动许可录进去也不会被系统承认。'
                }
            ],
            commandTriggers: [
                {
                    aliases: ['启动行动', '开始行动', '离港出发'],
                    conditions: { flagsAll: ['missionReady'] },
                    text: '主控台将你的授权写入今晚的第一条航迹。酒吧舱门缓缓滑开，烬行率先朝停泊位走去。',
                    flow: {
                        kind: 'mainline',
                        missionId: 'signalBreakthrough',
                        resultTitle: '任务完成：突破封锁',
                        resultText: '你替烬行撕开了外围火网，把第一批战区信标带回了酒吧。吧台上多了几盏亮起的引导灯。',
                        unlockArchives: ['jinxing', 'duyi', 'lingfredil', 'sword'],
                        unlockConversations: ['jinxing', 'duyi', 'lingfredil', 'sword']
                    }
                }
            ]
        },
        homewardTrace: {
            id: 'homewardTrace',
            title: '第二段坐标：归航校准',
            subtitle: '把残缺副本坐标拼回可追踪状态，再去迎赛博恩回家。',
            introText: '第一段信标已经归档，但第二段坐标仍像一块会自己碎开的玻璃。今晚真正难的部分，现在才开始。',
            theme: {
                top: '#0b1020',
                middle: '#17183a',
                bottom: '#12091a',
                accent: '#d7a9ff'
            },
            startRoomId: 'warTable',
            objectiveRules: [
                {
                    conditions: { flagsAll: ['rescueReady'] },
                    text: '通讯阵列已经完成归航预热。输入“锁定归航”追向第二段坐标。'
                },
                {
                    conditions: { flagsAll: ['anchorInstalled', 'relayInstalled', 'voiceInstalled'], inventoryNot: ['returnClearance'] },
                    text: '阵列三项校准都已完成，去外接阵列找烬行领取归航许可。'
                },
                {
                    conditions: { inventoryAll: ['returnClearance'], flagsNot: ['rescueReady'] },
                    text: '把归航许可录入通讯阵列，然后执行第二次行动。'
                },
                {
                    conditions: { flagsAll: ['anchorInstalled', 'relayInstalled'], inventoryNot: ['voiceSample'], flagsNot: ['voiceInstalled'] },
                    text: '阵列结构已经稳定，还差一份能让赛博恩被重新“认出来”的声纹样本。去找度漪。'
                },
                {
                    conditions: { inventoryAll: ['stabilityAnchor'], inventoryNot: ['echoRelay'], flagsNot: ['relayInstalled'] },
                    text: '稳定锚已经到手，再去维修舱带上旧式回响器。'
                },
                {
                    conditions: { inventoryAll: ['echoRelay'], inventoryNot: ['stabilityAnchor'], flagsNot: ['anchorInstalled'] },
                    text: '旧式回响器到手了，再和斯沃德确认，让他把稳定锚交给你。'
                }
            ],
            defaultHints: ['查看信标记录台', '前往维修舱', '对话度漪', '目标'],
            rooms: {
                warTable: {
                    id: 'warTable',
                    name: '星图室',
                    description: '第一批战区信标的回收记录正投在墙上，像被重新接回来的脉搏。度漪守在信标记录台边，几条去往维修舱和外接通讯阵列的引导线已经从地板延伸出去。',
                    shortDescription: '星图室里仍滚动着战区信标记录。度漪在一旁整理声纹样本，维修舱与外接通讯阵列都亮着路标。',
                    overlayDescription: '这里能看清第二段副本坐标还缺哪些东西。把声纹、稳定结构和旧式回响都准备齐，阵列才会重新工作。',
                    backgroundKey: 'hubDetail',
                    exits: [
                        { to: 'maintenanceBay', label: '维修舱', aliases: ['维修舱', '维修区'] },
                        { to: 'arrayPlatform', label: '外接通讯阵列', aliases: ['通讯阵列', '外接阵列', '阵列平台'] },
                        { to: 'barMainTrace', label: '酒吧前厅', aliases: ['酒吧', '前厅'] }
                    ],
                    hints: ['对话度漪', '查看信标记录台', '前往维修舱']
                },
                maintenanceBay: {
                    id: 'maintenanceBay',
                    name: '维修舱',
                    description: '维修舱里仍留着上一轮抢修留下的热气。回响器被挂在工具架边，斯沃德则正盯着一枚尚未安装的稳定锚，像在判断它够不够撑过碎裂空域的下一次拉扯。',
                    shortDescription: '旧式回响器和稳定锚都还在维修舱里等着被带走，斯沃德也没有离开。',
                    overlayDescription: '这地方负责把“能不能工作”变成“必须工作”。你需要从这里带走两样让归航阵列站稳脚跟的东西。',
                    backgroundKey: 'station',
                    exits: [
                        { to: 'warTable', label: '星图室', aliases: ['星图室', '记录台'] }
                    ],
                    hints: ['拿旧式回响器', '对话斯沃德']
                },
                arrayPlatform: {
                    id: 'arrayPlatform',
                    name: '外接通讯阵列',
                    description: '阵列平台直接贴在酒吧外壳边缘，碎裂空域的冷光隔着护罩一层层压下来。烬行守在总控接口旁，像是在替谁把那条还没恢复的归途先看稳。',
                    shortDescription: '通讯阵列仍在外壳边缘低鸣。只要所有校准完成，烬行就会立刻下令追向第二段坐标。',
                    overlayDescription: '这里是第二次行动真正开始的地方。稳定锚、回响器、声纹样本与归航许可，都必须在这块接口上完成闭环。',
                    backgroundKey: 'homewardBeacon',
                    exits: [
                        { to: 'warTable', label: '星图室', aliases: ['星图室', '记录台'] }
                    ],
                    hints: ['使用稳定锚在通讯阵列', '对话烬行', '锁定归航']
                },
                barMainTrace: {
                    id: 'barMainTrace',
                    name: '酒吧前厅',
                    description: '吧台边的灯比刚才更亮了一些，像是已经提前替归来的人留好了位置。这里只剩回头看一眼的余地，没有更多答案。',
                    shortDescription: '酒吧前厅依旧亮着灯，所有真正的线索仍在星图室、维修舱和外接阵列之间流动。',
                    overlayDescription: '这里更像一次呼吸的间隙。真正要完成的事，还是得回到星图室和外接阵列。',
                    backgroundKey: 'hub',
                    exits: [
                        { to: 'warTable', label: '星图室', aliases: ['星图室', '记录台'] }
                    ],
                    hints: ['前往星图室']
                }
            },
            items: {
                signalLedger: {
                    id: 'signalLedger',
                    name: '信标记录台',
                    aliases: ['信标记录台', '记录台', '终端'],
                    location: 'warTable',
                    portable: false,
                    lookRules: [
                        {
                            conditions: { flagsAll: ['rescueReady'] },
                            text: '记录台已经把第二段坐标压成了稳定通路。现在真正需要的，只剩把这条路一路飞到尽头。'
                        },
                        {
                            text: '记录台列着三项仍未完成的前置：稳定锚、旧式回响器、可识别赛博恩的声纹样本。少一项，归航坐标就会再次碎掉。'
                        }
                    ]
                },
                echoRelay: {
                    id: 'echoRelay',
                    name: '旧式回响器',
                    aliases: ['旧式回响器', '回响器'],
                    location: 'maintenanceBay',
                    hiddenIfFlag: 'relayInstalled',
                    portable: true,
                    lookText: '这玩意儿的外壳早就不新了，但它最擅长处理的偏偏就是那些不肯老老实实配合的旧信号。',
                    takeText: '你把旧式回响器从工具架上取了下来。它的重量恰好提醒你，这一趟归航没有任何东西是轻飘飘的。'
                },
                stabilityAnchor: {
                    id: 'stabilityAnchor',
                    name: '稳定锚',
                    aliases: ['稳定锚', '锚'],
                    portable: true,
                    lookText: '稳定锚是用来把失控波形钉住的。没有它，阵列再快也只会追着碎片跑。'
                },
                voiceSample: {
                    id: 'voiceSample',
                    name: '声纹样本',
                    aliases: ['声纹样本', '样本', '声纹'],
                    portable: true,
                    lookText: '度漪截下了一段赛博恩旧频道里的回声。这不是简单的音轨，而是一句能让系统重新认出他的“你是谁”。'
                },
                returnClearance: {
                    id: 'returnClearance',
                    name: '归航许可',
                    aliases: ['归航许可', '许可', '归航码'],
                    portable: true,
                    lookText: '烬行把最后的确认压成了一段归航码。它的含义只有一个：目标已确定，准许把人带回来。'
                },
                arrayConsole: {
                    id: 'arrayConsole',
                    name: '通讯阵列',
                    aliases: ['通讯阵列', '阵列', '接口'],
                    location: 'arrayPlatform',
                    portable: false,
                    lookRules: [
                        {
                            conditions: { flagsAll: ['rescueReady'] },
                            text: '阵列所有模块都已经进入归航状态，细密的波形正稳定地指向碎裂空域深处。'
                        },
                        {
                            conditions: { flagsAll: ['anchorInstalled', 'relayInstalled', 'voiceInstalled'] },
                            text: '稳定锚、回响器和声纹样本都已接上，只差最后一段归航许可，整套追踪链路就会被点亮。'
                        },
                        {
                            text: '阵列接口上仍有三个空位。现在它只是在等待有人把“追上赛博恩”这件事变成真正可执行的工程。'
                        }
                    ]
                }
            },
            actors: {
                duyi: {
                    id: 'duyi',
                    name: '度漪',
                    aliases: ['度漪'],
                    location: 'warTable',
                    lookText: '度漪正在反复试听一段旧频道录音，像怕自己一走神，那句本就快要断掉的回应会再次沉进噪声里。',
                    talkRules: [
                        {
                            conditions: { flagsNot: ['gotVoiceSample'] },
                            text: '度漪把处理好的音轨交给你：“这是我从赛博恩旧频道里切下来的回响。拿去吧，让阵列先记住他的声音，再把他带回来。”你拿到了声纹样本。',
                            effects: {
                                setFlags: ['gotVoiceSample'],
                                addItems: ['voiceSample']
                            }
                        },
                        {
                            text: '度漪轻轻点头：“只要阵列能重新认出他，那盏灯就不会再把他漏掉。”'
                        }
                    ]
                },
                sword: {
                    id: 'sword',
                    name: '斯沃德',
                    aliases: ['斯沃德'],
                    location: 'maintenanceBay',
                    lookText: '斯沃德正盯着那枚稳定锚，像在替它判断自己配不配得上今晚这条归航线。',
                    talkRules: [
                        {
                            conditions: { flagsNot: ['gotStabilityAnchor'] },
                            text: '斯沃德把稳定锚丢给你：“拿着。回响器负责把声音带回去，这东西负责让那条路别再塌。今晚别让任何一段坐标再从我们手里掉下去。”你拿到了稳定锚。',
                            effects: {
                                setFlags: ['gotStabilityAnchor'],
                                addItems: ['stabilityAnchor']
                            }
                        },
                        {
                            text: '斯沃德抱着手臂：“回响器、稳定锚、声纹样本，少一件都别去和那堆碎裂信号硬碰。”'
                        }
                    ]
                },
                jinxing: {
                    id: 'jinxing',
                    name: '烬行',
                    aliases: ['烬行', '队长'],
                    location: 'arrayPlatform',
                    lookText: '烬行站在总控接口前，像是已经把所有最坏的可能都先替这次行动算过一遍，只等你把最后的变量补齐。',
                    talkRules: [
                        {
                            conditions: { flagsAll: ['anchorInstalled', 'relayInstalled', 'voiceInstalled'], flagsNot: ['gotReturnClearance'] },
                            text: '烬行确认完阵列读数，把最后一段归航码发给你：“现在这条路已经不会再认错人了。把许可录进去，我们就去把他接回来。”你拿到了归航许可。',
                            effects: {
                                setFlags: ['gotReturnClearance'],
                                addItems: ['returnClearance']
                            }
                        },
                        {
                            conditions: { flagsAll: ['rescueReady'] },
                            text: '烬行的视线停在阵列尽头：“所有条件都齐了。输入‘锁定归航’，然后把那盏灯亲手带到赛博恩眼前。”'
                        },
                        {
                            text: '烬行没有回头：“先把阵列需要的东西全部装好。只要还有一项没对上，碎裂空域就会把第二段坐标继续咬碎。”'
                        }
                    ]
                }
            },
            useRules: [
                {
                    item: 'stabilityAnchor',
                    target: 'arrayConsole',
                    conditions: { flagsNot: ['anchorInstalled'] },
                    text: '你把稳定锚锁进阵列底座，原本漂浮不定的波形总算被压住了第一层晃动。',
                    effects: {
                        setFlags: ['anchorInstalled'],
                        removeItems: ['stabilityAnchor']
                    }
                },
                {
                    item: 'echoRelay',
                    target: 'arrayConsole',
                    conditions: { flagsAll: ['anchorInstalled'], flagsNot: ['relayInstalled'] },
                    text: '旧式回响器接入后，阵列开始主动回捞那些散在噪声里的旧信号碎片。第二层校准完成了。',
                    effects: {
                        setFlags: ['relayInstalled'],
                        removeItems: ['echoRelay']
                    }
                },
                {
                    item: 'echoRelay',
                    target: 'arrayConsole',
                    failText: '阵列连结构都还没稳住，现在接回响器只会让整套读数继续漂。先把稳定锚装上。'
                },
                {
                    item: 'voiceSample',
                    target: 'arrayConsole',
                    conditions: { flagsAll: ['anchorInstalled', 'relayInstalled'], flagsNot: ['voiceInstalled'] },
                    text: '声纹样本写入阵列后，一句熟悉又断续的回应在耳机里划过。系统终于重新学会了“赛博恩”这个名字。',
                    effects: {
                        setFlags: ['voiceInstalled'],
                        removeItems: ['voiceSample']
                    }
                },
                {
                    item: 'voiceSample',
                    target: 'arrayConsole',
                    failText: '在阵列结构和回响链路都没稳下来之前，声纹样本只会被噪声冲散。'
                },
                {
                    item: 'returnClearance',
                    target: 'arrayConsole',
                    conditions: { flagsAll: ['anchorInstalled', 'relayInstalled', 'voiceInstalled'], flagsNot: ['rescueReady'] },
                    text: '你把归航许可录入接口，整座阵列像被点亮了一条隐藏已久的回家路。第二次行动已经完全准备就绪。',
                    effects: {
                        setFlags: ['rescueReady'],
                        removeItems: ['returnClearance']
                    }
                },
                {
                    item: 'returnClearance',
                    target: 'arrayConsole',
                    failText: '阵列的前置模块还没全部完成，归航许可现在录进去也不会被系统接受。'
                }
            ],
            commandTriggers: [
                {
                    aliases: ['锁定归航', '执行归航', '开始救援'],
                    conditions: { flagsAll: ['rescueReady'] },
                    text: '通讯阵列将第二段副本坐标重新压回一条完整曲线。烬行抬手切断外部杂讯，所有人都知道，接下来已经没有退路。',
                    flow: {
                        kind: 'mainline',
                        missionId: 'homewardBeacon',
                        resultTitle: '任务完成：归航坐标稳定',
                        resultText: '第二段副本坐标已经回到酒吧主控台，归航路径被重新拼上了一节，赛博恩的名字再次亮起。',
                        unlockArchives: ['chen', 'tara', 'cyberon'],
                        unlockConversations: ['chen', 'tara', 'cyberon']
                    }
                }
            ]
        }
    };

    const missions = {
        signalBreakthrough: {
            id: 'signalBreakthrough',
            title: '任务一：战区突入',
            subtitle: '突破外围火网，回收失落信标。',
            briefing: '烬行已经锁定了第一段失联航迹。你需要顶着公司封锁，把三枚战区信标拖回酒吧主控台。',
            objectiveLabel: '信标回收',
            tokenType: 'signal',
            tokenLabel: '战区信标',
            tokenSymbol: '◈',
            tokenColor: 195,
            tokenGoal: 3,
            hiddenTokenType: 'shard',
            hiddenTokenLabel: '矿晶碎片',
            hiddenTokenSymbol: '✦',
            hiddenTokenColor: 210,
            missionQuote: '“今天这单，不卖酒。我们去把一个人接回来。”',
            theme: {
                top: '#06101f',
                middle: '#101f3d',
                bottom: '#31151d',
                accent: '#63d9ff'
            },
            phases: [
                {
                    start: 0,
                    end: 14,
                    objectiveText: '击穿外围侦察编队',
                    spawnInterval: 0.92,
                    enemyWeights: { normal: 0.55, fast: 0.25, zigzag: 0.20 },
                    tokenCarriers: ['zigzag'],
                    tokenDropEvery: 1
                },
                {
                    start: 14,
                    end: 28,
                    objectiveText: '锁定失联信标',
                    spawnInterval: 0.76,
                    enemyWeights: { normal: 0.25, fast: 0.25, zigzag: 0.25, tank: 0.25 },
                    tokenCarriers: ['zigzag', 'tank'],
                    tokenDropEvery: 2,
                    hiddenShardCarrier: 'tank'
                },
                {
                    start: 28,
                    end: 999,
                    objectiveText: '带着信标冲出封锁',
                    spawnInterval: 0.66,
                    enemyWeights: { fast: 0.20, zigzag: 0.30, tank: 0.50 },
                    tokenCarriers: ['tank'],
                    tokenDropEvery: 1
                }
            ],
            resultQuote: '第一批灯已经亮了。'
        },
        homewardBeacon: {
            id: 'homewardBeacon',
            title: '任务二：归途有灯',
            subtitle: '沿着残缺副本坐标，为赛博恩点亮归航路径。',
            briefing: '第二段坐标正在碎裂空域深处衰减。把它们带回来，酒吧的灯就有机会把赛博恩重新认出来。',
            objectiveLabel: '坐标回收',
            tokenType: 'memory',
            tokenLabel: '副本坐标',
            tokenSymbol: '◎',
            tokenColor: 305,
            tokenGoal: 2,
            hiddenTokenType: 'shard',
            hiddenTokenLabel: '矿晶碎片',
            hiddenTokenSymbol: '✦',
            hiddenTokenColor: 210,
            missionQuote: '“家，应该是一个真正能等人回来的地方。”',
            theme: {
                top: '#120b1e',
                middle: '#21133a',
                bottom: '#351631',
                accent: '#f8a8ff'
            },
            phases: [
                {
                    start: 0,
                    end: 16,
                    objectiveText: '清出回收走廊',
                    spawnInterval: 0.80,
                    enemyWeights: { normal: 0.25, fast: 0.30, zigzag: 0.30, tank: 0.15 },
                    tokenCarriers: ['zigzag'],
                    tokenDropEvery: 2
                },
                {
                    start: 16,
                    end: 34,
                    objectiveText: '锁定副本坐标',
                    spawnInterval: 0.66,
                    enemyWeights: { fast: 0.20, zigzag: 0.30, tank: 0.50 },
                    tokenCarriers: ['tank'],
                    tokenDropEvery: 1,
                    hiddenShardCarrier: 'zigzag'
                },
                {
                    start: 34,
                    end: 999,
                    objectiveText: '撑到归航通道稳定',
                    spawnInterval: 0.58,
                    enemyWeights: { fast: 0.20, zigzag: 0.25, tank: 0.55 },
                    tokenCarriers: ['tank'],
                    tokenDropEvery: 2
                }
            ],
            resultQuote: '“……我……本大爷是不是……赌赢了？”'
        },
        deepWellEscape: {
            id: 'deepWellEscape',
            title: '隐藏任务：深井逃亡',
            subtitle: '麦伦船长的旧档案被重新点亮。',
            briefing: '旧档案显示，矿工麦伦曾抱着一枚蓝色天然水晶，从 MIR-z11 的深井城市一路赌到空间站。你将沿着这段记录重新跑完那场逃亡。',
            objectiveLabel: '矿晶回收',
            tokenType: 'crystal',
            tokenLabel: '蓝星矿晶',
            tokenSymbol: '◆',
            tokenColor: 200,
            tokenGoal: 3,
            missionQuote: '“目标：魔动力炉。”',
            theme: {
                top: '#171108',
                middle: '#342114',
                bottom: '#0d1629',
                accent: '#88cbff'
            },
            phases: [
                {
                    start: 0,
                    end: 16,
                    objectiveText: '穿过矿区封锁线',
                    spawnInterval: 0.84,
                    enemyWeights: { normal: 0.45, fast: 0.35, zigzag: 0.20 },
                    tokenCarriers: ['fast'],
                    tokenDropEvery: 2
                },
                {
                    start: 16,
                    end: 34,
                    objectiveText: '护住矿晶冲向空间站',
                    spawnInterval: 0.68,
                    enemyWeights: { normal: 0.15, fast: 0.25, zigzag: 0.25, tank: 0.35 },
                    tokenCarriers: ['zigzag', 'tank'],
                    tokenDropEvery: 1
                },
                {
                    start: 34,
                    end: 999,
                    objectiveText: '在爆炸前完成撤离',
                    spawnInterval: 0.56,
                    enemyWeights: { fast: 0.25, zigzag: 0.20, tank: 0.55 },
                    tokenCarriers: ['tank'],
                    tokenDropEvery: 1
                }
            ],
            resultQuote: '这是冒险家们独有的心跳声。'
        }
    };

    const hiddenStories = {
        maillenCaptain: {
            id: 'maillenCaptain',
            title: '隐藏线：麦伦船长发家史',
            subtitle: 'MIR-z11 的旧矿区里，还藏着另一条通往星海的路。',
            unlockFragments: 2,
            requiresChapterComplete: true,
            missionId: 'deepWellEscape',
            introDialogue: {
                title: '旧档案接入',
                location: '档案室 / MIR-z11',
                lines: [
                    { speaker: '旁白', text: '当你把两枚矿晶碎片放进档案台，酒吧主控突然弹出一段被封存多年的旧记录。' },
                    { speaker: '旁白', text: '记录来自 MIR-z11 深井城市：矿灯、矿灰、治安警报，还有一颗被旧报纸层层裹住的蓝色矿石，同时在画面里亮起。' },
                    { speaker: '麦伦', text: '两万？你知道这一块在外面悬赏多少吗？精灵那边的公会能给一千万！' },
                    { speaker: '考沃', text: '俺也去不会开飞船，也不会赚大钱，但俺也去会帮你保守秘密。你要跑，俺也去跟你一起跑。' },
                    { speaker: '杰森', text: '初次见面，船长。无论远近，单程一趟咱都只要一百星际币。至于今晚这条命值不值这个价，就看你敢不敢上船了。' },
                    { speaker: '荔枝', text: '尊敬的船长，很高兴能上船为您效力，叫我荔枝就好。至于我为什么先盯上了那块矿石，你可以等逃出去以后再慢慢跟我算。' },
                    { speaker: '麦伦', text: '那就别废话了。矿石、飞船、船员，能从这口井里冲出去一个算一个。' },
                    { speaker: '烬行', text: '这是“麦伦”这个名字第一次在星图上留下坐标的时候。去看看吧，也许你会明白，某些传奇最早并不是从王座开始，而是从矿灰里长出来的。' }
                ]
            },
            outroDialogue: {
                title: '档案回放结束',
                location: '银河系中心酒吧',
                lines: [
                    { speaker: '旁白', text: '旧档案在空间站动力室的蓝光里走向终点，引擎雷鸣压过了警报。吧台边随之多出一页被正式归档的记录。' },
                    { speaker: '杰森', text: '全体准备，我们就要出发了。要聊天，等离开这片爆炸半径再说。' },
                    { speaker: '考沃', text: '船长，俺也去把你扛回来了。你可别刚出矿区，就把命赔在第一趟航线里。' },
                    { speaker: '荔枝', text: '别这么看我呀。至少最后这次，我确实把路带对了。' },
                    { speaker: '麦伦', text: '记着吧。从今天起，这船不是偷来的路，是我们自己抢出来的命。' },
                    { speaker: '度漪', text: '原来有些传奇不是从王座开始，而是从一块矿石、一艘破船和一次不肯认输的逃亡开始。' },
                    { speaker: '烬行', text: '把它留着吧。以后总会有人需要知道，所谓“船长”，最初不过是一个敢把未来扛上船的人。' }
                ]
            }
        }
    };

    const assetManifest = {
        backgrounds: {
            menuTitle: 'Story Asset/章节标题主视觉.png',
            hub: 'Story Asset/银河系中心酒吧背景图.png',
            hubDetail: 'Story Asset/吧台近景或酒柜局部图.png',
            hunters: 'Story Asset/猎手.png',
            signalBreakthrough: 'Story Asset/战区背景.png',
            homewardBeacon: 'Story Asset/碎裂空域背景.png',
            deepWellCity: 'Story Asset/MIR-z11 深井城市背景.png',
            mine: 'Story Asset/矿区背景.png',
            station: 'Story Asset/空间站背景.png'
        },
        portraits: {
            jinxing: {
                primary: 'Story Asset/烬行半身立绘.png',
                alt: 'Story Asset/烬行半身立绘2.0.png'
            },
            duyi: {
                primary: 'Story Asset/度漪半身立绘.png',
                alt: 'Story Asset/度漪半身立绘2.0.png'
            },
            lingfredil: {
                primary: 'Story Asset/铃弗瑞迪尔半身立绘.png',
                alt: 'Story Asset/铃弗瑞迪尔半身立绘2.0.png'
            },
            sword: {
                primary: 'Story Asset/斯沃德麦伦半身立绘.png',
                alt: 'Story Asset/斯沃德麦伦半身立绘2.0.png'
            },
            chen: {
                primary: 'Story Asset/谶半身立绘.png',
                alt: 'Story Asset/谶半身立绘2.0.png'
            },
            tara: {
                primary: 'Story Asset/塔拉撒里昂半身立绘.png',
                alt: 'Story Asset/塔拉撒里昂半身立绘2.0.png'
            },
            cyberon: {
                primary: 'Story Asset/赛博恩半身立绘.png',
                alt: 'Story Asset/赛博恩半身立绘2.0.png'
            },
            maillen: {
                primary: 'Story Asset/麦伦半身立绘.png'
            },
            kaowo: {
                primary: 'Story Asset/考沃半身立绘.png'
            },
            jason: {
                primary: 'Story Asset/杰森半身立绘.png'
            },
            lizhi: {
                primary: 'Story Asset/荔枝半身立绘.png'
            }
        },
        speakerPortraitMap: {
            '烬行': 'jinxing',
            '度漪': 'duyi',
            '铃弗瑞迪尔': 'lingfredil',
            '斯沃德': 'sword',
            '斯沃德·麦伦': 'sword',
            '谶': 'chen',
            '塔拉撒里昂': 'tara',
            '赛博恩': 'cyberon',
            '麦伦': 'maillen',
            '考沃': 'kaowo',
            '杰森': 'jason',
            '荔枝': 'lizhi'
        },
        archivePortraitMap: {
            overview: 'background:hub',
            jinxing: 'jinxing',
            duyi: 'duyi',
            lingfredil: 'lingfredil',
            sword: 'sword',
            chen: 'chen',
            tara: 'tara',
            cyberon: 'cyberon',
            maillenCaptain: 'maillen'
        },
        audio: {
            bgm: {
                hub: 'Story Asset/酒吧氛围 BGM.mp3',
                mainline: 'Story Asset/主线战斗 BGM.mp3',
                hidden: 'Story Asset/隐藏线战斗 BGM.mp3'
            },
            sfx: {
                button: 'Story Asset/按钮确认.mp3',
                dialogue: 'Story Asset/对话翻页.mp3',
                archiveUnlock: 'Story Asset/档案解锁.mp3',
                objective: 'Story Asset/目标达成.mp3',
                missionComplete: 'Story Asset/任务完成.mp3',
                failure: 'Story Asset/失败提示.mp3'
            }
        }
    };

    const assetChecklist = {
        barHub: [
            '银河系中心酒吧背景图 1 张',
            '吧台近景或酒柜局部图 1 张',
            '酒吧氛围 BGM 1 首',
            '章节主视觉或标题图 1 张'
        ],
        mainline: [
            '烬行、赛博恩、度漪、铃弗瑞迪尔、斯沃德、谶、塔拉撒里昂的头像或半身立绘',
            '战区背景 1 组，碎裂空域背景 1 组',
            '主线战斗 BGM 1 首',
            '章节解锁、任务完成、对话翻页等基础音效'
        ],
        hiddenStory: [
            '麦伦、考沃、杰森、荔枝的头像或半身立绘',
            'MIR-z11 深井城市背景 1 组',
            '矿区与空间站背景各 1 组',
            '隐藏线战斗 BGM 1 首'
        ]
    };

    const locales = {
        en: {
            archiveEntries: {
                overview: {
                    title: 'Star Hunter',
                    group: 'World',
                    quote: 'A place that offers shelter without asking about the storm, and pays for work without ever buying back freedom.',
                    body: [
                        'A leap in technology brought ancient humanity into the age of the stars, and the Observer Project gave the major species their first broad and lasting contact.',
                        'The brief age of prosperity ended when interstellar corporations began fighting over core energy and living space. War did not stop because people longed for peace. It accelerated inside deeper structures of profit and control.',
                        'Star Hunters were born inside that chaos. They are neither a regular army nor a mercenary guild, but a group of people who kept picking one another back up from the cracks between war, exile and fate. The Galactic Center Bar is the lamp they borrowed from the dark.'
                    ]
                },
                jinxing: {
                    title: 'Jinxing',
                    group: 'Star Hunters',
                    quote: 'To meet all of you, how could I not be glad?',
                    body: [
                        'Jinxing is the owner of the Galactic Center Bar and the captain of Star Hunters. To outsiders he is an impossible sharpshooter to measure. To his own people he is the man who keeps a sign lit at the edge of ruin.',
                        'His greatest strength is not the bow itself, but the way he judges distance. For others it is physics. For him it feels like instinct, a reflex grown out of old scars.',
                        'He rebuilt the bar not just to reopen business, but to leave behind a coordinate that the lost could still recognize. No one matters more to that vow than Cyberon.'
                    ]
                },
                duyi: {
                    title: 'Duyi',
                    group: 'Star Hunters',
                    quote: 'Human music is the best thing in the universe.',
                    body: [
                        'Duyi is an ancient human singer who still measures memory in Earth years, and the first official member to return when the Galactic Center Bar reopened.',
                        'He carries Earth, moonlight and old songs with him across the stars. Others call him a wandering poet. He thinks of himself as someone who refuses to hand his homeland over to time.',
                        'Within the main story, Duyi acts as an emotional buffer. With lines like “I packed some moonlight and sent it to you,” he gives all the things no one can say aloud a place to land.'
                    ]
                },
                lingfredil: {
                    title: 'Lingfredil',
                    group: 'Star Hunters',
                    quote: 'I treat every life form with equal contempt, including myself.',
                    body: [
                        'A lily elf and a top-tier healer, Lingfredil trusts curiosity more than kindness. Saving people is less a sacred calling to him than a chance to observe how fate chooses to continue.',
                        'The machine races once made a dangerous guess about his healing: perhaps all cure really does is move the damage into the future and let time hold the bill.',
                        'In the game, Lingfredil works well as both a cold explainer of setting details and a razor-edged deadpan, letting worldbuilding and character relationships unfold naturally in dialogue.'
                    ]
                },
                sword: {
                    title: 'Sword Maillen',
                    group: 'Star Hunters',
                    quote: 'Consensus exists to be broken.',
                    body: [
                        'Sword is the only half-beast swordsman in the universe, the blade known as the Paradox Edge. After his homeworld fell and his people scattered, Lingfredil dragged him back from death and Jinxing pulled him out of numbness.',
                        'He did not join Star Hunters because he believed in hope. He joined because he had nowhere else left to go. And yet among a crew of lunatics, he slowly learned how to laugh again.',
                        'Sword-focused content is ideal for advanced missions, training segments and hidden conditions, because his whole character is built around making forbidden possibilities real.'
                    ]
                },
                chen: {
                    title: 'Chen',
                    group: 'Star Hunters',
                    quote: 'Across the sea of stars, call and I will answer. Such is Chen’s vow.',
                    body: [
                        'Chen is a sword spirit awakened from liquid metal. Once he was only a blade. Now he insists on becoming a sword that belongs to himself.',
                        'After Duyi took him to an old Taoist shrine on ancient Earth, he understood for the first time that “a sword is simply a sword” was not an empty answer, but a way to let the self finally touch the ground.',
                        'Chen’s lines naturally carry an archaic cadence, which makes him perfect for dramatic chapter titles, skill names and high-impact result text.'
                    ]
                },
                tara: {
                    title: 'Tarasalion',
                    group: 'Star Hunters',
                    quote: 'There is no moonlight in space, but his voice can still summon a tide.',
                    body: [
                        'The merfolk superstar Tarasalion is both a legend of the stage and a former leader of merfolk resistance.',
                        'He moved from blowing up transport ships to writing labor white papers, proving in the most theatrical way possible that liberation is not just about slogans, but about giving people accounts, contracts and dignity they can actually hold.',
                        'Tarasalion is excellent material for a future major chapter because he naturally connects war, capital, art and politics all at once.'
                    ]
                },
                cyberon: {
                    title: 'Cyberon',
                    group: 'Star Hunters',
                    quote: 'I would rather meet you all again from the beginning than back up the memories I made with you.',
                    body: [
                        'Cyberon used his own body to test how far flesh and machinery could go together. He once died and returned over and over through consciousness backups, until one day he chose to stop copying himself.',
                        'It was not because he finally stopped fearing death. It was because he had started to own memories he could no longer bear to lose. In that moment, he wagered the rest of his life on his friends.',
                        'The emotional core of “A Light for the Way Home” is Jinxing trying to bring this lost brother back beneath the lamp.'
                    ]
                },
                maillenCaptain: {
                    title: 'Captain Maillen’s Rise',
                    group: 'Hidden Files',
                    quote: 'This is the heartbeat unique to adventurers.',
                    body: [
                        'MIR-z11 is a planet buried under mines and the relics of old wars. It was there that the miner Maillen discovered a blue natural crystal capable of resonating with magic.',
                        'The company broadcast offered only twenty thousand credits to recover it, while an elven guild was willing to pay ten million. A half-beast, an honest bull, a helmsman with a mechanical arm and a silver-tongued elf girl all ended up tied to the same crystal.',
                        'Maillen stole a ship from smugglers, ran across a landing pad, got tricked inside a fortune-teller’s den, and finally smashed the crystal straight into an arcane reactor aboard a station, blowing open a way forward by sheer refusal to lose.',
                        'This route is not the official main history, but an old record buried behind the Star Hunters world. It explains why the name “Maillen” later carries the weight of legend, and leaves room for a much larger captain-focused saga in the future.'
                    ]
                }
            },
            characterCards: [
                { name: 'Jinxing', role: 'Captain / Sharpshooter' },
                { name: 'Duyi', role: 'Ancient Human Singer' },
                { name: 'Lingfredil', role: 'Lily Elf Healer' },
                { name: 'Sword', role: 'Half-Beast Swordsman' },
                { name: 'Chen', role: 'Sword Spirit' },
                { name: 'Tarasalion', role: 'Merfolk Song King' },
                { name: 'Cyberon', role: 'Cyborg Wanderer' }
            ],
            hubDialogues: {
                jinxing: {
                    title: 'At the Bar',
                    lines: [
                        { speakerKey: 'jinxing', speaker: 'Jinxing', text: 'We are not selling drinks tonight. We are going to bring someone home.' },
                        { speakerKey: 'jinxing', speaker: 'Jinxing', text: 'If you want to know why I insisted on lighting the bar again, it is because some people still recognize only this coordinate.' }
                    ]
                },
                duyi: {
                    title: 'A Song From the Old Age',
                    lines: [
                        { speakerKey: 'duyi', speaker: 'Duyi', text: 'Human music is the greatest thing in the universe. I plan to keep singing that truth all the way to heat death.' },
                        { speakerKey: 'duyi', speaker: 'Duyi', text: 'If you are nervous, think of the moon. There is always some kind of light that exists not for the battlefield, but for the way home.' }
                    ]
                },
                lingfredil: {
                    title: 'Lilies and Time',
                    lines: [
                        { speakerKey: 'lingfredil', speaker: 'Lingfredil', text: 'Relax. I am merely observing you, not caring about you.' },
                        { speakerKey: 'lingfredil', speaker: 'Lingfredil', text: 'What you call healing may just be moving the price farther into the future. Humans do love gambling against tomorrow.' }
                    ]
                },
                sword: {
                    title: 'Heat Left on the Training Floor',
                    lines: [
                        { speakerKey: 'sword', speaker: 'Sword', text: 'Consensus is something I keep around purely to lie to enemies.' },
                        { speakerKey: 'sword', speaker: 'Sword', text: 'If I can still swing this blade, then the thing that tried to put me out has not won yet.' }
                    ]
                },
                chen: {
                    title: 'The Blade-Heart Still Burns',
                    lines: [
                        { speakerKey: 'chen', speaker: 'Chen', text: 'Master Duyi says a true hero must know not only how to wield a sword, but how to carry compassion.' },
                        { speakerKey: 'chen', speaker: 'Chen', text: 'I am still learning how to become worthy of the title. If I fall short, I ask for your guidance.' }
                    ]
                },
                tara: {
                    title: 'Beyond the Tide',
                    lines: [
                        { speakerKey: 'tara', speaker: 'Tarasalion', text: 'I am not singing tragedy tonight. I only wish to confirm whether your cheers are still as loud as they were yesterday.' },
                        { speakerKey: 'tara', speaker: 'Tarasalion', text: 'We are not decorative light to be admired. We are the teeth that bite through the net. Remember that.' }
                    ]
                },
                cyberon: {
                    title: 'After the Return',
                    lines: [
                        { speakerKey: 'cyberon', speaker: 'Cyberon', text: 'I am back, and you people already want me to keep my tab open?' },
                        { speakerKey: 'cyberon', speaker: 'Cyberon', text: 'If you ask me, meeting all of you again from scratch was not the worst trade in the universe.' }
                    ]
                }
            },
            chapters: {
                guidingLight: {
                    title: 'A Light for the Way Home',
                    subtitle: 'Set out from the Galactic Center Bar and follow the fractured signal trail to bring a lost friend back.',
                    scenes: [
                        {
                            title: 'Prologue: Bar Reboot',
                            location: 'Galactic Center Bar',
                            lines: [
                                { speakerKey: 'narrator', speaker: 'Narrator', text: 'War split the galaxy into fragments, yet the Galactic Center Bar lit up again after one long night.' },
                                { speakerKey: 'duyi', speaker: 'Duyi', text: 'The sign looks polished enough to welcome some honored guest.' },
                                { speakerKey: 'lingfredil', speaker: 'Lingfredil', text: 'Or perhaps it is simply trying to leave a brighter coordinate for a wandering soul.' },
                                { speakerKey: 'jinxing', speaker: 'Jinxing', text: 'Something like that. The coordinate is stable now, and the broken signal has started flowing back.' },
                                { speakerKey: 'sword', speaker: 'Sword', text: 'You found Cyberon?' },
                                { speakerKey: 'jinxing', speaker: 'Jinxing', text: 'Not yet. I only found two fading tracks. We are not selling drinks tonight. We are going to bring someone home.' }
                            ]
                        },
                        {
                            title: 'Night Before Launch: Main Console Calibration'
                        },
                        {
                            title: 'Interlude: Beneath the Lights',
                            location: 'Galactic Center Bar',
                            lines: [
                                { speakerKey: 'duyi', speaker: 'Duyi', text: 'I packed up a little moonlight and sent it to you. When you received it, were you still standing in gunfire?' },
                                { speakerKey: 'jinxing', speaker: 'Jinxing', text: 'Yeah. There was a bowl of moonlight on the screen and nothing but war out there.' },
                                { speakerKey: 'lingfredil', speaker: 'Lingfredil', text: 'Romance wastes judgment, and yet you humans insist on surviving through it.' },
                                { speakerKey: 'sword', speaker: 'Sword', text: 'And the second coordinate?' },
                                { speakerKey: 'jinxing', speaker: 'Jinxing', text: 'At the heart of fractured space, as though someone deliberately severed the way home in half.' },
                                { speakerKey: 'jinxing', speaker: 'Jinxing', text: 'Get ready. The next trip is not only about recovering data. I am going to bring that lamp home with my own hands.' }
                            ]
                        },
                        {
                            title: 'Second Coordinate: Homeward Calibration'
                        },
                        {
                            title: 'Epilogue: A Light for the Way Home',
                            location: 'Galactic Center Bar',
                            lines: [
                                { speakerKey: 'narrator', speaker: 'Narrator', text: 'The lights on the main console turned on one after another, as though someone had lined the bar with a path that led home.' },
                                { speakerKey: 'cyberon', speaker: 'Cyberon', text: '...Did... did I... actually win this one...?' },
                                { speakerKey: 'duyi', speaker: 'Duyi', text: 'Welcome back. I already have the song ready.' },
                                { speakerKey: 'sword', speaker: 'Sword', text: 'Hah. People who owe a tab do tend to be hard to kill.' },
                                { speakerKey: 'jinxing', speaker: 'Jinxing', text: 'The bill is still here. So are you. Good.' },
                                { speakerKey: 'narrator', speaker: 'Narrator', text: 'After that night, the Galactic Center Bar was no longer merely a shelter from the storm. It became a lamp that truly knew how to wait for people to return.' }
                            ]
                        }
                    ]
                }
            },
            adventures: {
                signalPrep: {
                    title: 'Night Before Launch: Main Console Calibration',
                    subtitle: 'Finish calibrating the main console, chart path and team readiness before leaving the bar.',
                    introText: 'No one is rushing you to open fire tonight. They are all waiting for you to prepare this departure properly.',
                    objectiveRules: [
                        { text: 'The main console is fully green. Type “launch action” to leave the bar and breach the warzone.' },
                        { text: 'Terminal calibration is complete. Go to the hangar bridge and report to Jinxing to receive launch clearance.' },
                        { text: 'You already have the star chart fragment. Go to the med corner and ask Lingfredil for the legacy decoder chip.' },
                        { text: 'The legacy decoder chip is in your hands. Insert it into the main console and continue calibrating the launch route.' },
                        { text: 'Launch clearance is ready. Record it into the main console and execute the departure command.' }
                    ],
                    defaultHints: ['look main console', 'go med corner', 'talk jinxing', 'inventory'],
                    rooms: {
                        barMain: {
                            name: 'Galactic Center Bar',
                            description: 'The light strip along the counter has been polished back to life, as if every trace of exhaustion had been tucked away behind the shelves. Duyi leans by the long table, humming an old Earth melody. Thin guide lights mark the routes to the main console, the med corner and the hangar bridge.',
                            shortDescription: 'The Galactic Center Bar is running quietly, with guide lights pointing toward the main console, med corner and hangar bridge.',
                            overlayDescription: 'This is where tonight’s action begins. Finish calibrating the main console, then go confirm the rest of the crew.',
                            exits: [
                                { label: 'Main Console', aliases: ['main console', 'console', 'terminal area'] },
                                { label: 'Med Corner', aliases: ['med corner', 'med bay', 'corner'] },
                                { label: 'Hangar Bridge', aliases: ['hangar bridge', 'hangar', 'bridge'] }
                            ],
                            hints: ['go main console', 'talk duyi', 'go hangar bridge']
                        },
                        mainConsole: {
                            name: 'Main Console',
                            description: 'The main terminal has been half dismantled. Three calibration slots are waiting to be filled again: chart lock, legacy decoder and launch clearance. A folded star chart fragment is still pinned to the desk.',
                            shortDescription: 'The main console is still waiting for the chart, decoder chip and launch clearance to all be in place.',
                            overlayDescription: 'The main console is the nervous system of this departure. Feed it the right things in the right order, and the mission truly begins.',
                            exits: [
                                { label: 'Bar Front', aliases: ['bar front', 'bar', 'back'] }
                            ],
                            hints: ['take star map', 'look main console', 'use launch clearance on main console']
                        },
                        medCorner: {
                            name: 'Med Corner',
                            description: 'The light here is colder. Lingfredil sits by the medicine cabinet, turning a legacy decoder chip in his fingers as if judging whether this era is still worthy of using it.',
                            shortDescription: 'Lingfredil is still at the med corner, the legacy decoder chip gleaming coldly beside him.',
                            overlayDescription: 'If anyone can dig something truly useful out of a pile of obsolete hardware, it will probably be Lingfredil.',
                            exits: [
                                { label: 'Bar Front', aliases: ['bar front', 'bar', 'back'] }
                            ],
                            hints: ['talk lingfredil', 'look lingfredil']
                        },
                        hangarBridge: {
                            name: 'Hangar Bridge',
                            description: 'Blue-white safety lights glow outside the hangar. Jinxing is facing the viewport, confirming the launch path, while Sword leans on the rail like a blade already half drawn.',
                            shortDescription: 'Jinxing and Sword are both on the hangar bridge, waiting for the final green light from the main console.',
                            overlayDescription: 'The hangar bridge is the final step before launch. Until preparation is complete, Jinxing will only send you back to fix what is missing.',
                            exits: [
                                { label: 'Bar Front', aliases: ['bar front', 'bar', 'back'] }
                            ],
                            hints: ['talk jinxing', 'talk sword', 'go bar front']
                        }
                    },
                    items: {
                        mainConsole: {
                            name: 'Main Console',
                            aliases: ['main console', 'console', 'terminal'],
                            lookRules: [
                                { text: 'All three calibration lanes are now green, and the terminal is scrolling “departure authorized.” You are one command away from sending the whole crew out.' },
                                { text: 'The chart lock and legacy decoder are both online. Only the final launch clearance is still missing. Jinxing should be ready to sign off now.' },
                                { text: 'The chart lock is restored, but the decoder slot is still empty. Without a legacy decoder chip, the terminal still cannot read the broken signal.' },
                                { text: 'The panel lists three pending steps: chart lock, legacy decoder and launch clearance. A star chart fragment is still lying by the side.' }
                            ]
                        },
                        starMap: {
                            name: 'Star Map Fragment',
                            aliases: ['star map fragment', 'star map', 'map fragment'],
                            lookText: 'The fragment has been folded and unfolded countless times, with Jinxing’s own marks still along the edges. It points directly to the first lost route.',
                            takeText: 'You pocket the star map fragment. The first trail is once again in your grasp.'
                        },
                        decoderChip: {
                            name: 'Legacy Decoder Chip',
                            aliases: ['legacy decoder chip', 'decoder chip', 'decoder', 'chip'],
                            lookText: 'This hardware should have been obsolete ages ago, but because it is old, it still speaks the language of signals that no one else bothers to maintain.'
                        },
                        launchClearance: {
                            name: 'Launch Clearance',
                            aliases: ['launch clearance', 'clearance', 'launch code'],
                            lookText: 'Jinxing signed his own authority into this clearance code. Its real weight is not in the file, but in the sentence behind it: I allow you to bring that person home.'
                        }
                    },
                    actors: {
                        duyi: {
                            name: 'Duyi',
                            aliases: ['duyi'],
                            lookText: 'Duyi keeps the gentleness of the old age inside this bar. He is tense too, but somehow still knows how to steady everyone else first.',
                            talkRules: [
                                { text: 'Duyi looks up at you. “Get the main console sorted out first. What Jinxing fears most is never firepower. It is one tiny detail left unchecked before departure.”' },
                                { text: 'Duyi taps the table softly. “Go on. When the lamps come on, remember to bring the person back with them.”' }
                            ]
                        },
                        lingfredil: {
                            name: 'Lingfredil',
                            aliases: ['lingfredil', 'ling', 'elf'],
                            lookText: 'Lingfredil clearly expected you to come. He has already dug the decoder chip out of the far corner of the cabinet.',
                            talkRules: [
                                { text: 'Lingfredil tosses the chip to you. “Do not thank me. I merely want to know how much romance you people think it takes to bargain with a heap of warzone scrap.” You catch the decoder chip.' },
                                { text: 'Lingfredil gives you a flat look. “Why are you still standing here? That chip is not going to walk itself back to the main console.”' }
                            ]
                        },
                        sword: {
                            name: 'Sword',
                            aliases: ['sword'],
                            lookText: 'Sword leans against the rail like a blade that is already half out of the sheath. The moment Jinxing gives the word, he will go forward with the door at the end of the bridge.',
                            talkRules: [
                                { text: 'Sword jerks his chin toward the hangar. “Go turn every light on at the main console. Once you drag the signal back out of the rubble, I will handle anything still standing in the way.”' },
                                { text: 'Sword clicks his tongue. “Stop wasting time. Every second you stall here is another second Cyberon is still out there.”' }
                            ]
                        },
                        jinxing: {
                            name: 'Jinxing',
                            aliases: ['jinxing', 'captain'],
                            lookText: 'Jinxing is checking the void beyond the viewport as if he has already measured the entire launch path once with his own eyes.',
                            talkRules: [
                                { text: 'Jinxing slides a launch code into your hand. “The main console work looks good. Record this, and then we move.” You received launch clearance.' },
                                { text: 'Jinxing finally looks at your completed prep. “Good. If the main console is green, then do not make that lamp wait another second. Type “launch action” and we leave.”' },
                                { text: 'Jinxing does not turn around. “Get the chart and decoder slots online first. If the prep is not complete, no one leaves the dock.”' }
                            ]
                        }
                    },
                    useRules: [
                        { text: 'You press the star map fragment into the lock slot, and the terminal unfolds a reconstructed route through the warzone. The first calibration step is complete.' },
                        { text: 'Once the decoder chip slots in, the static on the screen compresses into a stable waveform. At last, the broken signal decides to speak clearly again.' },
                        { failText: 'The terminal does not even have the chart lock restored yet. If you plug the decoder chip in now, all you will get is noise.' },
                        { text: 'You record the launch clearance into the main console. All three status lights turn green at once, and the docking lamps outside the bar answer in sync. The departure sequence is now fully ready.' },
                        { failText: 'Until the chart and decoder are in place, the launch clearance will not be accepted by the system.' }
                    ],
                    commandTriggers: [
                        {
                            aliases: ['launch action', 'start operation', 'depart'],
                            text: 'The main console writes your authorization into tonight’s first trajectory. The bar doors begin to slide open, and Jinxing is already moving toward the docking berth.',
                            flow: {
                                resultTitle: 'Mission Complete: Break the Blockade',
                                resultText: 'You tore open the outer fireline for Jinxing and brought the first batch of warzone beacons back to the bar. A few more lamps are now lit above the counter.'
                            }
                        }
                    ]
                },
                homewardTrace: {
                    title: 'Second Coordinate: Homeward Calibration',
                    subtitle: 'Restore the fractured backup coordinates into a trackable route, then go bring Cyberon home.',
                    introText: 'The first batch of beacons is already logged, but the second coordinate still fractures like a sheet of cracking glass. The hardest part begins now.',
                    objectiveRules: [
                        { text: 'The comm array is fully primed for return tracking. Type “lock homeward route” to chase the second coordinate.' },
                        { text: 'All three array calibrations are complete. Go to the external array and speak with Jinxing to receive the return clearance.' },
                        { text: 'The return clearance is already in your hands. Record it into the comm array, then begin the second action.' },
                        { text: 'The structure is stable now, but the array still lacks a voiceprint sample that can make the system recognize Cyberon again. Go to Duyi.' },
                        { text: 'You already have the stabilizer anchor. Return to the maintenance bay and take the old echo relay.' },
                        { text: 'You already have the echo relay. Talk to Sword so he can give you the stabilizer anchor.' }
                    ],
                    defaultHints: ['look signal console', 'go maintenance bay', 'talk duyi', 'objective'],
                    rooms: {
                        warTable: {
                            name: 'Chart Room',
                            description: 'The recovery records from the first warzone beacons are projected across the wall like a pulse that has been stitched back into one body. Duyi stands by the signal console, while guide lines run toward the maintenance bay and the external comm array.',
                            shortDescription: 'The chart room still rolls the warzone beacon record across the wall. Duyi is organizing the voiceprint sample while the maintenance bay and the external array remain marked.',
                            overlayDescription: 'This room tells you exactly what the second coordinate still needs. Gather the voiceprint, the stabilizer structure and the old echo hardware, and the array will work again.',
                            exits: [
                                { label: 'Maintenance Bay', aliases: ['maintenance bay', 'maintenance'] },
                                { label: 'External Comms Array', aliases: ['external comms array', 'comms array', 'array platform'] },
                                { label: 'Bar Front', aliases: ['bar front', 'bar'] }
                            ],
                            hints: ['talk duyi', 'look signal console', 'go maintenance bay']
                        },
                        maintenanceBay: {
                            name: 'Maintenance Bay',
                            description: 'The maintenance bay is still warm from the last emergency repair. The old echo relay hangs by the tools, while Sword watches an uninstalled stabilizer anchor as if judging whether it can survive the next strain of fractured space.',
                            shortDescription: 'The old echo relay and stabilizer anchor are both still in the maintenance bay, and Sword has not left.',
                            overlayDescription: 'This is where “it might work” gets turned into “it must work.” You need to leave with the two pieces that can hold the return array steady.',
                            exits: [
                                { label: 'Chart Room', aliases: ['chart room', 'signal console'] }
                            ],
                            hints: ['take echo relay', 'talk sword']
                        },
                        arrayPlatform: {
                            name: 'External Comms Array',
                            description: 'The array platform is bolted straight to the bar’s outer shell, where the cold light of fractured space presses down through the shield in steady layers. Jinxing stands by the master interface as if he is holding a route steady for someone who has not yet made it back.',
                            shortDescription: 'The comm array is still humming along the hull. Once every calibration is complete, Jinxing will immediately push after the second coordinate.',
                            overlayDescription: 'This is where the second action truly begins. The stabilizer anchor, the echo relay, the voiceprint sample and the return clearance must all close the loop here.',
                            exits: [
                                { label: 'Chart Room', aliases: ['chart room', 'signal console'] }
                            ],
                            hints: ['use stabilizer anchor on comms array', 'talk jinxing', 'lock homeward route']
                        },
                        barMainTrace: {
                            name: 'Bar Front',
                            description: 'The lamps by the counter burn a little brighter than before, as if they have already reserved a place for the one who is still on the way back. There is nothing here but one brief breath before you return to work.',
                            shortDescription: 'The bar front is still lit, but every real answer remains somewhere between the chart room, the maintenance bay and the external array.',
                            overlayDescription: 'This room is only a pause. The real work still waits back in the chart room and at the external array.',
                            exits: [
                                { label: 'Chart Room', aliases: ['chart room', 'signal console'] }
                            ],
                            hints: ['go chart room']
                        }
                    },
                    items: {
                        signalLedger: {
                            name: 'Signal Console',
                            aliases: ['signal console', 'console', 'ledger'],
                            lookRules: [
                                { text: 'The console has already compressed the second coordinate into a stable route. The only thing left now is to fly that route all the way to its end.' },
                                { text: 'The console lists three missing prerequisites: a stabilizer anchor, an old echo relay and a voiceprint sample capable of recognizing Cyberon. Without any one of them, the homeward route will fracture again.' }
                            ]
                        },
                        echoRelay: {
                            name: 'Old Echo Relay',
                            aliases: ['old echo relay', 'echo relay', 'relay'],
                            lookText: 'Its casing is no longer new, but it excels at handling the exact kind of stubborn old signals that refuse to cooperate with modern hardware.',
                            takeText: 'You lift the old echo relay from the rack. Its weight is a reminder that nothing about this return route will be light.'
                        },
                        stabilityAnchor: {
                            name: 'Stabilizer Anchor',
                            aliases: ['stabilizer anchor', 'anchor'],
                            lookText: 'The anchor is built to nail down unstable waveforms. Without it, the array can only chase fragments forever.'
                        },
                        voiceSample: {
                            name: 'Voiceprint Sample',
                            aliases: ['voiceprint sample', 'voiceprint', 'sample'],
                            lookText: 'Duyi carved this sample out of an old Cyberon channel. It is not just sound, but a sentence that lets the system remember who he is.'
                        },
                        returnClearance: {
                            name: 'Return Clearance',
                            aliases: ['return clearance', 'clearance', 'return code'],
                            lookText: 'Jinxing compressed his final confirmation into a single return code. It means only one thing: the target is identified, and the way home is authorized.'
                        },
                        arrayConsole: {
                            name: 'Comms Array',
                            aliases: ['comms array', 'array', 'console'],
                            lookRules: [
                                { text: 'Every module in the array has entered return-tracking mode, and fine waveforms now point steadily into fractured space.' },
                                { text: 'The stabilizer anchor, echo relay and voiceprint sample are all in place. Only the final return clearance remains before the full pursuit chain lights up.' },
                                { text: 'Three slots on the interface are still empty. For now, the array is simply waiting for someone to turn “bring Cyberon back” into a real operation.' }
                            ]
                        }
                    },
                    actors: {
                        duyi: {
                            name: 'Duyi',
                            aliases: ['duyi'],
                            lookText: 'Duyi is replaying an old channel recording over and over, as if he fears that one lapse in attention might let that fragile response sink back into the static.',
                            talkRules: [
                                { text: 'Duyi passes you the processed audio track. “I cut this echo out of one of Cyberon’s old channels. Take it. Let the array remember his voice first, and then bring him home.” You received the voiceprint sample.' },
                                { text: 'Duyi nods lightly. “As long as the array can recognize him again, that lamp will not lose him twice.”' }
                            ]
                        },
                        sword: {
                            name: 'Sword',
                            aliases: ['sword'],
                            lookText: 'Sword is staring at the stabilizer anchor as if judging whether it deserves to carry tonight’s route home.',
                            talkRules: [
                                { text: 'Sword tosses you the anchor. “Take it. The relay will drag the voice back. This thing will keep the route from collapsing again. Tonight, do not let a single coordinate slip through our hands.” You received the stabilizer anchor.' },
                                { text: 'Sword folds his arms. “Echo relay, stabilizer anchor, voiceprint sample. Do not even think about wrestling fractured space without every one of them.”' }
                            ]
                        },
                        jinxing: {
                            name: 'Jinxing',
                            aliases: ['jinxing', 'captain'],
                            lookText: 'Jinxing stands by the master interface as if he has already calculated every worst-case outcome, waiting only for you to finish closing the final variable.',
                            talkRules: [
                                { text: 'After confirming the array readout, Jinxing sends you the last return code. “This route won’t mistake him anymore. Record this, and then we go bring him home.” You received the return clearance.' },
                                { text: 'Jinxing keeps his gaze on the far end of the array. “Everything is ready. Type “lock homeward route,” and then carry that lamp all the way to Cyberon.”' },
                                { text: 'Jinxing does not look back. “Finish every part the array needs. If even one piece is wrong, fractured space will keep chewing the second coordinate apart.”' }
                            ]
                        }
                    },
                    useRules: [
                        { text: 'You lock the stabilizer anchor into the base of the array, and the drifting waveform finally loses its first layer of shake.' },
                        { text: 'Once the old echo relay is connected, the array starts hauling back signal fragments that had been scattered through the static. The second calibration layer is complete.' },
                        { failText: 'The array structure is not even stable yet. If you connect the relay now, the whole readout will keep drifting. Install the stabilizer anchor first.' },
                        { text: 'When the voiceprint sample is written into the array, a familiar broken reply cuts across your headset. The system finally learns the name “Cyberon” again.' },
                        { failText: 'Before the array structure and echo chain are stable, the voiceprint sample will be torn apart by static.' },
                        { text: 'You record the return clearance into the interface, and the whole array lights up like a hidden road home. The second action is now fully ready.' },
                        { failText: 'The prerequisite array modules are not all complete yet, so the return clearance would not be accepted by the system.' }
                    ],
                    commandTriggers: [
                        {
                            aliases: ['lock homeward route', 'begin rescue', 'start rescue'],
                            text: 'The comm array compresses the second backup coordinate back into one complete line. Jinxing cuts the outside noise with a single motion, and everyone understands that there is no room to retreat now.',
                            flow: {
                                resultTitle: 'Mission Complete: Homeward Route Stabilized',
                                resultText: 'The second backup coordinate has been restored to the bar mainframe. Another section of the road home has been stitched back together, and Cyberon’s name shines again.'
                            }
                        }
                    ]
                }
            },
            missions: {
                signalBreakthrough: {
                    title: 'Mission 1: Breach the Blockade',
                    subtitle: 'Break through the outer fireline and recover the lost beacons.',
                    briefing: 'Jinxing has already locked onto the first lost trail. You must push through the corporate blockade and drag three warzone beacons back to the bar mainframe.',
                    objectiveLabel: 'Beacon Recovery',
                    tokenLabel: 'Warzone Beacon',
                    hiddenTokenLabel: 'Crystal Shard',
                    missionQuote: '“We are not selling drinks tonight. We are going to bring someone home.”',
                    phases: [
                        { objectiveText: 'Break the outer scout wing' },
                        { objectiveText: 'Lock the lost beacon' },
                        { objectiveText: 'Break out with the beacon' }
                    ],
                    resultQuote: 'The first lamps are lit.'
                },
                homewardBeacon: {
                    title: 'Mission 2: A Light for the Way Home',
                    subtitle: 'Follow the fractured backup coordinates and light a route home for Cyberon.',
                    briefing: 'The second coordinate is decaying deep inside fractured space. Bring it back, and the lamp at the bar may still recognize Cyberon when he returns.',
                    objectiveLabel: 'Coordinate Recovery',
                    tokenLabel: 'Backup Coordinate',
                    hiddenTokenLabel: 'Crystal Shard',
                    missionQuote: '“Home should be a place that truly knows how to wait for someone to come back.”',
                    phases: [
                        { objectiveText: 'Clear the recovery corridor' },
                        { objectiveText: 'Lock the backup coordinate' },
                        { objectiveText: 'Hold until the route stabilizes' }
                    ],
                    resultQuote: '“...Did... did I... actually win this one...?”'
                },
                deepWellEscape: {
                    title: 'Hidden Mission: Deep Well Escape',
                    subtitle: 'Captain Maillen’s old record has flared back to life.',
                    briefing: 'The recovered archive shows that the miner Maillen once held a blue natural crystal and gambled his way from the deep well city of MIR-z11 all the way to a station. You are about to relive that escape route.',
                    objectiveLabel: 'Crystal Recovery',
                    tokenLabel: 'Blue Star Crystal',
                    missionQuote: '“Target: the arcane reactor.”',
                    phases: [
                        { objectiveText: 'Break through the mine cordon' },
                        { objectiveText: 'Protect the crystal and rush the station' },
                        { objectiveText: 'Escape before detonation' }
                    ],
                    resultQuote: 'This is the heartbeat unique to adventurers.'
                }
            },
            hiddenStories: {
                maillenCaptain: {
                    title: 'Hidden Route: Captain Maillen’s Rise',
                    subtitle: 'Inside the old mines of MIR-z11, another road to the stars still survives.',
                    introDialogue: {
                        title: 'Old File Connected',
                        location: 'Archive Room / MIR-z11',
                        lines: [
                            { speakerKey: 'narrator', speaker: 'Narrator', text: 'When you place the two crystal shards onto the archive table, the bar mainframe suddenly opens a record that has been sealed for years.' },
                            { speakerKey: 'narrator', speaker: 'Narrator', text: 'The record comes from MIR-z11 Deep Well City: mine lamps, dust, security alarms, and a blue ore wrapped in layers of old newspaper, all flaring to life together.' },
                            { speakerKey: 'maillen', speaker: 'Maillen', text: 'Twenty thousand? Do you know how much this thing is worth outside? The elven guild will pay ten million for it!' },
                            { speakerKey: 'kaowo', speaker: 'Kaowo', text: 'I cannot fly, and I cannot get rich, but I can keep a secret. If you run, I run with you.' },
                            { speakerKey: 'jason', speaker: 'Jason', text: 'A pleasure, Captain. Near or far, one-way passage is always a hundred credits with me. Whether your life is worth the fare tonight depends on whether you dare to board.' },
                            { speakerKey: 'lizhi', speaker: 'Lizhi', text: 'Captain, I am delighted to serve under you. You may call me Lizhi. As for why I noticed the crystal first, you can settle that bill once we are alive enough to argue.' },
                            { speakerKey: 'maillen', speaker: 'Maillen', text: 'Then stop talking. Ore, ship, crew — if even one of us can make it out of this well, that is enough.' },
                            { speakerKey: 'jinxing', speaker: 'Jinxing', text: 'This is the moment the name “Maillen” first burned itself onto a star chart. Go see it. Some legends do not begin on a throne. They begin in mine dust.' }
                        ]
                    },
                    outroDialogue: {
                        title: 'Archive Playback Complete',
                        location: 'Galactic Center Bar',
                        lines: [
                            { speakerKey: 'narrator', speaker: 'Narrator', text: 'The old archive reaches its end beneath the blue light of the station reactor room, the roar of the engines overwhelming the alarm. A new page is quietly added to the bar records.' },
                            { speakerKey: 'jason', speaker: 'Jason', text: 'Everyone ready. We launch now. Save the conversation for when we are outside the blast radius.' },
                            { speakerKey: 'kaowo', speaker: 'Kaowo', text: 'Captain, I dragged you back this time. Try not to lose your life on the very first route after leaving the mine.' },
                            { speakerKey: 'lizhi', speaker: 'Lizhi', text: 'Do not look at me like that. At least this time, I really did lead the way correctly.' },
                            { speakerKey: 'maillen', speaker: 'Maillen', text: 'Remember this. From today on, this ship is not a stolen road. It is the life we tore open for ourselves.' },
                            { speakerKey: 'duyi', speaker: 'Duyi', text: 'So some legends do not begin on a throne after all, but with one crystal, one broken ship and one escape that simply refused to lose.' },
                            { speakerKey: 'jinxing', speaker: 'Jinxing', text: 'Keep this record. Someday someone will need to know that what people later called a captain began as nothing more than someone willing to carry the future onto a ship.' }
                        ]
                    }
                }
            },
            assetManifest: {
                speakerPortraitMap: {
                    Jinxing: 'jinxing',
                    Duyi: 'duyi',
                    Lingfredil: 'lingfredil',
                    Sword: 'sword',
                    'Sword Maillen': 'sword',
                    Chen: 'chen',
                    Tarasalion: 'tara',
                    Cyberon: 'cyberon',
                    Maillen: 'maillen',
                    Kaowo: 'kaowo',
                    Jason: 'jason',
                    Lizhi: 'lizhi'
                }
            }
        }
    };

    window.StarHunterStoryData = {
        version: 2,
        storageKey: 'starHunterNarrativeSaveV1',
        mainlineChapterId: 'guidingLight',
        archiveEntries,
        characterCards,
        hubDialogues,
        chapters,
        adventures,
        missions,
        hiddenStories,
        locales,
        assetManifest,
        assetChecklist
    };
})();
