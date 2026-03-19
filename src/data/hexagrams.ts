import { CHAPTERS, type Chapter, type ChoiceTemplate, type Hexagram } from "../types";

type Seed = {
  id: number;
  key: string;
  name: string;
  pinyin: string;
  title: string;
  symbol: string;
  chapter: Chapter;
  themes: [string, string, string];
};

const seeds: Seed[] = [
  { id: 1, key: "creative", name: "乾", pinyin: "Qian", title: "天行", symbol: "䷀", chapter: "起势", themes: ["开创", "自强", "担当"] },
  { id: 2, key: "receptive", name: "坤", pinyin: "Kun", title: "地载", symbol: "䷁", chapter: "起势", themes: ["承载", "柔顺", "包容"] },
  { id: 3, key: "sprouting", name: "屯", pinyin: "Zhun", title: "萌芽", symbol: "䷂", chapter: "起势", themes: ["初创", "阻滞", "学习"] },
  { id: 4, key: "youthful-folly", name: "蒙", pinyin: "Meng", title: "启蒙", symbol: "䷃", chapter: "起势", themes: ["求教", "未明", "启发"] },
  { id: 5, key: "waiting", name: "需", pinyin: "Xu", title: "待时", symbol: "䷄", chapter: "起势", themes: ["耐心", "积蓄", "准备"] },
  { id: 6, key: "contention", name: "讼", pinyin: "Song", title: "辨争", symbol: "䷅", chapter: "起势", themes: ["分歧", "界限", "止争"] },
  { id: 7, key: "army", name: "师", pinyin: "Shi", title: "行师", symbol: "䷆", chapter: "治理", themes: ["组织", "纪律", "统率"] },
  { id: 8, key: "holding-together", name: "比", pinyin: "Bi", title: "相亲", symbol: "䷇", chapter: "处世", themes: ["结盟", "亲近", "信任"] },
  { id: 9, key: "small-taming", name: "小畜", pinyin: "Xiao Chu", title: "小蓄", symbol: "䷈", chapter: "处世", themes: ["积累", "节制", "润物"] },
  { id: 10, key: "treading", name: "履", pinyin: "Lu", title: "履道", symbol: "䷉", chapter: "处世", themes: ["礼度", "谨慎", "试探"] },
  { id: 11, key: "peace", name: "泰", pinyin: "Tai", title: "通泰", symbol: "䷊", chapter: "治理", themes: ["通达", "协调", "生机"] },
  { id: 12, key: "standstill", name: "否", pinyin: "Pi", title: "闭塞", symbol: "䷋", chapter: "治理", themes: ["隔阂", "停滞", "守正"] },
  { id: 13, key: "fellowship", name: "同人", pinyin: "Tong Ren", title: "同道", symbol: "䷌", chapter: "处世", themes: ["共识", "协作", "公开"] },
  { id: 14, key: "great-possession", name: "大有", pinyin: "Da You", title: "丰有", symbol: "䷍", chapter: "治理", themes: ["丰盛", "责任", "分配"] },
  { id: 15, key: "modesty", name: "谦", pinyin: "Qian", title: "持谦", symbol: "䷎", chapter: "修身", themes: ["谦抑", "平衡", "留白"] },
  { id: 16, key: "enthusiasm", name: "豫", pinyin: "Yu", title: "悦动", symbol: "䷏", chapter: "起势", themes: ["鼓舞", "动员", "预备"] },
  { id: 17, key: "following", name: "随", pinyin: "Sui", title: "随时", symbol: "䷐", chapter: "应变", themes: ["顺势", "回应", "协同"] },
  { id: 18, key: "work-on-decay", name: "蛊", pinyin: "Gu", title: "整弊", symbol: "䷑", chapter: "应变", themes: ["修补", "责任", "更新"] },
  { id: 19, key: "approach", name: "临", pinyin: "Lin", title: "临事", symbol: "䷒", chapter: "治理", themes: ["靠近", "引导", "关照"] },
  { id: 20, key: "contemplation", name: "观", pinyin: "Guan", title: "观照", symbol: "䷓", chapter: "修身", themes: ["观察", "反思", "示范"] },
  { id: 21, key: "biting-through", name: "噬嗑", pinyin: "Shi He", title: "决断", symbol: "䷔", chapter: "治理", themes: ["处置", "法度", "清障"] },
  { id: 22, key: "grace", name: "贲", pinyin: "Bi", title: "文饰", symbol: "䷕", chapter: "修身", themes: ["表达", "修饰", "真实"] },
  { id: 23, key: "splitting-apart", name: "剥", pinyin: "Bo", title: "剥落", symbol: "䷖", chapter: "终局", themes: ["退潮", "失衡", "留存"] },
  { id: 24, key: "return", name: "复", pinyin: "Fu", title: "归复", symbol: "䷗", chapter: "终局", themes: ["回转", "复苏", "节律"] },
  { id: 25, key: "innocence", name: "无妄", pinyin: "Wu Wang", title: "无妄", symbol: "䷘", chapter: "修身", themes: ["真诚", "自然", "不妄"] },
  { id: 26, key: "great-taming", name: "大畜", pinyin: "Da Chu", title: "厚积", symbol: "䷙", chapter: "修身", themes: ["蓄力", "涵养", "定志"] },
  { id: 27, key: "nourishment", name: "颐", pinyin: "Yi", title: "养正", symbol: "䷚", chapter: "修身", themes: ["滋养", "言语", "饮食"] },
  { id: 28, key: "great-preponderance", name: "大过", pinyin: "Da Guo", title: "过梁", symbol: "䷛", chapter: "应变", themes: ["重负", "冒险", "扛住"] },
  { id: 29, key: "abysmal", name: "坎", pinyin: "Kan", title: "重险", symbol: "䷜", chapter: "应变", themes: ["险境", "信念", "穿越"] },
  { id: 30, key: "clinging", name: "离", pinyin: "Li", title: "明照", symbol: "䷝", chapter: "修身", themes: ["光明", "依附", "辨明"] },
  { id: 31, key: "influence", name: "咸", pinyin: "Xian", title: "感应", symbol: "䷞", chapter: "处世", themes: ["吸引", "共振", "感通"] },
  { id: 32, key: "duration", name: "恒", pinyin: "Heng", title: "守恒", symbol: "䷟", chapter: "处世", themes: ["恒常", "承诺", "持续"] },
  { id: 33, key: "retreat", name: "遁", pinyin: "Dun", title: "退守", symbol: "䷠", chapter: "应变", themes: ["抽离", "避锋", "保全"] },
  { id: 34, key: "great-power", name: "大壮", pinyin: "Da Zhuang", title: "壮行", symbol: "䷡", chapter: "应变", themes: ["力量", "边界", "正用"] },
  { id: 35, key: "progress", name: "晋", pinyin: "Jin", title: "进明", symbol: "䷢", chapter: "起势", themes: ["进展", "被见", "登高"] },
  { id: 36, key: "darkening", name: "明夷", pinyin: "Ming Yi", title: "晦明", symbol: "䷣", chapter: "应变", themes: ["受伤", "藏光", "内守"] },
  { id: 37, key: "family", name: "家人", pinyin: "Jia Ren", title: "家序", symbol: "䷤", chapter: "治理", themes: ["内政", "角色", "秩序"] },
  { id: 38, key: "opposition", name: "睽", pinyin: "Kui", title: "相违", symbol: "䷥", chapter: "处世", themes: ["差异", "对视", "求同"] },
  { id: 39, key: "obstruction", name: "蹇", pinyin: "Jian", title: "行难", symbol: "䷦", chapter: "应变", themes: ["阻碍", "转向", "求援"] },
  { id: 40, key: "deliverance", name: "解", pinyin: "Jie", title: "解结", symbol: "䷧", chapter: "应变", themes: ["松绑", "释放", "化解"] },
  { id: 41, key: "decrease", name: "损", pinyin: "Sun", title: "减益", symbol: "䷨", chapter: "修身", themes: ["减法", "舍弃", "成全"] },
  { id: 42, key: "increase", name: "益", pinyin: "Yi", title: "增益", symbol: "䷩", chapter: "治理", themes: ["增援", "共享", "扶持"] },
  { id: 43, key: "breakthrough", name: "夬", pinyin: "Guai", title: "决口", symbol: "䷪", chapter: "治理", themes: ["决裂", "宣示", "果断"] },
  { id: 44, key: "coming-to-meet", name: "姤", pinyin: "Gou", title: "相遇", symbol: "䷫", chapter: "处世", themes: ["遭逢", "诱因", "辨别"] },
  { id: 45, key: "gathering", name: "萃", pinyin: "Cui", title: "聚会", symbol: "䷬", chapter: "治理", themes: ["汇聚", "号召", "凝心"] },
  { id: 46, key: "pushing-upward", name: "升", pinyin: "Sheng", title: "上升", symbol: "䷭", chapter: "起势", themes: ["渐进", "向上", "耐力"] },
  { id: 47, key: "oppression", name: "困", pinyin: "Kun", title: "受困", symbol: "䷮", chapter: "终局", themes: ["困局", "忍耐", "守心"] },
  { id: 48, key: "well", name: "井", pinyin: "Jing", title: "共井", symbol: "䷯", chapter: "治理", themes: ["资源", "公共", "更新"] },
  { id: 49, key: "revolution", name: "革", pinyin: "Ge", title: "变革", symbol: "䷰", chapter: "应变", themes: ["改制", "时机", "换皮"] },
  { id: 50, key: "cauldron", name: "鼎", pinyin: "Ding", title: "成器", symbol: "䷱", chapter: "治理", themes: ["转化", "器用", "文化"] },
  { id: 51, key: "arousing", name: "震", pinyin: "Zhen", title: "惊起", symbol: "䷲", chapter: "起势", themes: ["震动", "警醒", "起行"] },
  { id: 52, key: "keeping-still", name: "艮", pinyin: "Gen", title: "止观", symbol: "䷳", chapter: "修身", themes: ["止息", "边界", "定静"] },
  { id: 53, key: "development", name: "渐", pinyin: "Jian", title: "渐成", symbol: "䷴", chapter: "修身", themes: ["渐进", "次第", "稳固"] },
  { id: 54, key: "marrying-maiden", name: "归妹", pinyin: "Gui Mei", title: "归妹", symbol: "䷵", chapter: "处世", themes: ["角色", "关系", "分寸"] },
  { id: 55, key: "abundance", name: "丰", pinyin: "Feng", title: "丰盛", symbol: "䷶", chapter: "终局", themes: ["盛极", "炽烈", "当下"] },
  { id: 56, key: "wanderer", name: "旅", pinyin: "Lu", title: "旅途", symbol: "䷷", chapter: "终局", themes: ["过客", "适应", "轻装"] },
  { id: 57, key: "gentle", name: "巽", pinyin: "Xun", title: "入微", symbol: "䷸", chapter: "处世", themes: ["渗透", "顺入", "反复"] },
  { id: 58, key: "joyous", name: "兑", pinyin: "Dui", title: "悦言", symbol: "䷹", chapter: "处世", themes: ["交流", "喜悦", "兑现"] },
  { id: 59, key: "dispersion", name: "涣", pinyin: "Huan", title: "涣散", symbol: "䷺", chapter: "终局", themes: ["疏解", "散开", "重联"] },
  { id: 60, key: "limitation", name: "节", pinyin: "Jie", title: "节度", symbol: "䷻", chapter: "修身", themes: ["尺度", "规则", "收束"] },
  { id: 61, key: "inner-truth", name: "中孚", pinyin: "Zhong Fu", title: "中信", symbol: "䷼", chapter: "修身", themes: ["诚信", "内外", "感化"] },
  { id: 62, key: "small-exceeding", name: "小过", pinyin: "Xiao Guo", title: "小越", symbol: "䷽", chapter: "应变", themes: ["轻越", "谨行", "小步"] },
  { id: 63, key: "after-completion", name: "既济", pinyin: "Ji Ji", title: "既成", symbol: "䷾", chapter: "终局", themes: ["完成", "善后", "警惕"] },
  { id: 64, key: "before-completion", name: "未济", pinyin: "Wei Ji", title: "未成", symbol: "䷿", chapter: "终局", themes: ["未竟", "过渡", "续行"] },
];

const chapterFrames: Record<Chapter, string> = {
  起势: "你站在局势初开的门槛，既想前行，也必须看清第一步的代价。",
  处世: "关系网开始发声，真正困难的不是选择立场，而是拿捏分寸。",
  应变: "局面并不按计划推进，真正决定走向的是你如何处理变化。",
  治理: "你不再只为自己行动，而要承担秩序、资源与群体的后果。",
  修身: "外部风浪未必更大，真正关键的是你如何整理自己的心与习惯。",
  终局: "故事来到回看与转折的阶段，结果不是句号，而是下一轮的起点。",
};

const lineVerbs = [
  "先收心，再定步。",
  "与近处的人或事重新对齐。",
  "处理最显眼的冲突与诱惑。",
  "在关键节点表明立场。",
  "守住高位时的克制。",
  "给结局留出回旋。",
];

function wrapId(id: number): number {
  if (id > 64) {
    return ((id - 1) % 64) + 1;
  }

  return id;
}

function buildChoices(seed: Seed): ChoiceTemplate[] {
  const [first, second, third] = seed.themes;
  const observeId = wrapId(seed.id + 1);
  const advanceId = wrapId(seed.id + 11);
  const withdrawId = wrapId(seed.id + 23);

  return [
    {
      id: `${seed.key}-observe`,
      label: `先观其势，围绕${first}搜集线索`,
      stance: "observe",
      changingLine: ((seed.id - 1) % 6) + 1,
      transformedHexagramId: observeId,
      consequence: `你没有急着抢答，而是让局面自己显形。与“${first}”有关的隐线先被看见，节奏变慢，但判断更稳。`,
      unlocks: [observeId, wrapId(seed.id + 6)],
    },
    {
      id: `${seed.key}-advance`,
      label: `主动推进，以${second}切入局面`,
      stance: "advance",
      changingLine: (seed.id % 6) + 1,
      transformedHexagramId: advanceId,
      consequence: `你选择把事情往前推，借“${second}”打开缺口。局势因此移动得更快，但也要求你承担新的曝光与责任。`,
      unlocks: [advanceId, wrapId(seed.id + 18)],
    },
    {
      id: `${seed.key}-withdraw`,
      label: `暂退半步，用${third}整理边界`,
      stance: "withdraw",
      changingLine: ((seed.id + 1) % 6) + 1,
      transformedHexagramId: withdrawId,
      consequence: `你把注意力转回边界与余地，让“${third}”先落地。表面像退，实际上是在为下一轮行动重置坐标。`,
      unlocks: [withdrawId, wrapId(seed.id + 29)],
    },
  ];
}

function buildStudyNotes(seed: Seed): string[] {
  const [first, second, third] = seed.themes;

  return [
    `关键词落点：${first}不是口号，而是你此刻最该优先辨认的力量。`,
    `阅读提示：遇到${second}相关情境时，先分清“时机未到”还是“方法失当”。`,
    `实践提醒：把${third}写进自己的行动准则，比临场靠情绪判断更可靠。`,
  ];
}

function buildLineImages(seed: Seed): string[] {
  return lineVerbs.map((verb, index) => `第${index + 1}爻：围绕“${seed.themes[index % 3]}”调整站位。${verb}`);
}

export const hexagrams: Hexagram[] = seeds.map((seed) => {
  const [first, second, third] = seed.themes;

  return {
    ...seed,
    themes: [...seed.themes],
    summary: `${seed.name}讲的是在“${first}、${second}、${third}”之间寻找恰当动作，不抢结论，先让局势显出它真正的重心。`,
    scenario: `${chapterFrames[seed.chapter]} 眼前这一卦像把你放进一段关于${first}的试炼：有人催你表态，有变量还未落地，而${second}与${third}会不断考验你的拿捏。`,
    studyNotes: buildStudyNotes(seed),
    related: [wrapId(seed.id + 1), wrapId(seed.id + 8), wrapId(seed.id + 16)],
    lineImages: buildLineImages(seed),
    choices: buildChoices(seed),
  };
});

export const chapterSummary = CHAPTERS.map((chapter) => ({
  chapter,
  count: hexagrams.filter((hexagram) => hexagram.chapter === chapter).length,
}));

export const hexagramMap = new Map(hexagrams.map((hexagram) => [hexagram.id, hexagram]));
