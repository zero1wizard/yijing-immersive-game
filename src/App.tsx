import { useEffect, useMemo, useState } from "react";
import { chapterSummary, hexagrams } from "./data/hexagrams";
import {
  applyChoice,
  getChapterProgress,
  getCompletionRate,
  getDailyReflection,
  getHexagramById,
  getPracticeSummary,
  getRecommendedHexagrams,
  getRecentChapterFocus,
  getReflectionPath,
  getSearchResults,
  getThemeMomentum,
  INITIAL_PROGRESS,
  mergeIds,
  saveDailyReflection,
  toggleReadingMode,
  toggleTheme,
  updateNote,
} from "./lib/engine";
import { loadProgress, saveProgress } from "./lib/storage";
import type { Chapter, Hexagram, ProgressState } from "./types";

function todayIso(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  const day = `${now.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function App() {
  const [progress, setProgress] = useState<ProgressState>(() => {
    if (typeof window === "undefined") {
      return INITIAL_PROGRESS;
    }

    return loadProgress(window.localStorage);
  });
  const [currentHexagramId, setCurrentHexagramId] = useState<number>(1);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | "全部">("全部");
  const [search, setSearch] = useState("");
  const [showCodex, setShowCodex] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = progress.theme;
    saveProgress(progress, window.localStorage);
  }, [progress]);

  const currentHexagram = getHexagramById(currentHexagramId);
  const daily = useMemo(() => getDailyReflection(todayIso()), []);
  const reflectionPath = useMemo(() => getReflectionPath(todayIso()), []);
  const filteredHexagrams = useMemo(
    () => getSearchResults(search, selectedChapter === "全部" ? undefined : selectedChapter),
    [search, selectedChapter],
  );
  const completionRate = getCompletionRate(progress);
  const practiceSummary = useMemo(() => getPracticeSummary(progress), [progress]);
  const themeMomentum = useMemo(() => getThemeMomentum(progress), [progress]);
  const recentChapterFocus = useMemo(() => getRecentChapterFocus(progress), [progress]);
  const recommendedHexagrams = useMemo(
    () => getRecommendedHexagrams(currentHexagramId, progress),
    [currentHexagramId, progress],
  );

  function encounter(hexagram: Hexagram) {
    setCurrentHexagramId(hexagram.id);
    setShowCodex(false);
    setProgress((current) => ({
      ...current,
      encounteredHexagramIds: mergeIds(current.encounteredHexagramIds, [hexagram.id]),
      unlockedHexagramIds: mergeIds(current.unlockedHexagramIds, [hexagram.id]),
    }));
  }

  function handleChoice(choiceId: string) {
    const choice = currentHexagram.choices.find((item) => item.id === choiceId);

    if (!choice) {
      return;
    }

    setProgress((current) => applyChoice(current, currentHexagram.id, choice));
    setCurrentHexagramId(choice.transformedHexagramId);
  }

  function handleDailyOpen() {
    setProgress((current) => saveDailyReflection(current, daily));
    setCurrentHexagramId(daily.hexagramId);
    setShowCodex(false);
  }

  const transformedTargets = currentHexagram.choices.map((choice) => ({
    choice,
    target: getHexagramById(choice.transformedHexagramId),
  }));

  return (
    <div className={`app-shell ${progress.readingMode ? "reading-mode" : ""}`}>
      <aside className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">易境 v0.2</p>
          <h1>在卦象推演中读完《易经》</h1>
          <p className="intro">
            这不是求签器。它更像一张可反复进入的判断训练地图：今天入局，七日回看，慢慢把自己的动作风格练出来。
          </p>
        </div>

        <div className="hero-actions">
          <button type="button" onClick={() => encounter(hexagrams[Math.floor(Math.random() * hexagrams.length)])}>
            随机遭遇
          </button>
          <button type="button" className="ghost" onClick={handleDailyOpen}>今日一卦</button>
          <button type="button" className="ghost" onClick={() => setShowCodex((current) => !current)}>
            {showCodex ? "返回推演" : "打开卦典"}
          </button>
          <button type="button" className="ghost" onClick={() => setProgress((current) => toggleTheme(current))}>
            {progress.theme === "dark" ? "切到明色" : "切到夜色"}
          </button>
          <button type="button" className="ghost" onClick={() => setProgress((current) => toggleReadingMode(current))}>
            {progress.readingMode ? "退出静读" : "进入静读"}
          </button>
        </div>

        <section className="stat-grid">
          <article>
            <span>已完成</span>
            <strong>{progress.completedHexagramIds.length} / 64</strong>
          </article>
          <article>
            <span>解锁率</span>
            <strong>{completionRate}%</strong>
          </article>
          <article>
            <span>札记数</span>
            <strong>{practiceSummary.noteCount}</strong>
          </article>
          <article>
            <span>灵感条目</span>
            <strong>{practiceSummary.insightCount}</strong>
          </article>
        </section>

        <section className="route-map">
          <div className="panel-heading compact-heading">
            <h2>六界路图</h2>
            <span>章节世界</span>
          </div>
          {chapterSummary.map(({ chapter, count }) => (
            <button
              type="button"
              key={chapter}
              className={`route-item ${selectedChapter === chapter ? "active" : ""}`}
              onClick={() => {
                setSelectedChapter(chapter);
                setShowCodex(true);
              }}
            >
              <strong>{chapter}</strong>
              <span>{getChapterProgress(progress, chapter)} / {count}</span>
            </button>
          ))}
        </section>

        <section className="daily-card">
          <div className="panel-heading compact-heading">
            <h2>今日反思</h2>
            <span>{daily.date}</span>
          </div>
          <p className="daily-symbol">{getHexagramById(daily.hexagramId).symbol}</p>
          <p>{daily.prompt}</p>
        </section>

        <section className="practice-card">
          <div className="panel-heading compact-heading">
            <h2>七日修习</h2>
            <span>连续路径</span>
          </div>
          <div className="practice-strip">
            {reflectionPath.map((item, index) => {
              const hexagram = getHexagramById(item.hexagramId);
              const visited = progress.dailyReflections.some((reflection) => reflection.date === item.date);

              return (
                <button
                  type="button"
                  key={item.date}
                  className={`practice-step ${visited ? "visited" : ""} ${item.date === daily.date ? "today" : ""}`}
                  onClick={() => {
                    setProgress((current) => saveDailyReflection(current, item));
                    encounter(hexagram);
                  }}
                >
                  <span>D{index + 1}</span>
                  <strong>{hexagram.name}</strong>
                  <small>{item.date.slice(5)}</small>
                </button>
              );
            })}
          </div>
          <p className="muted practice-caption">连着走七天，不追求“答对”，只看你反复撞上的主题。</p>
        </section>

        <section className="practice-card">
          <div className="panel-heading compact-heading">
            <h2>修习档案</h2>
            <span>轻量统计</span>
          </div>
          <div className="practice-metrics">
            <article>
              <span>推演局数</span>
              <strong>{practiceSummary.totalSessions}</strong>
            </article>
            <article>
              <span>日课天数</span>
              <strong>{practiceSummary.reflectionDays}</strong>
            </article>
          </div>
          <div className="mini-section">
            <h3>最近章节重心</h3>
            {recentChapterFocus.length === 0 ? (
              <p className="muted">你还没形成明显偏向。先走几局，系统再给你脸色。</p>
            ) : (
              <div className="tag-row">
                {recentChapterFocus.map((item) => (
                  <span key={item.chapter} className="metric-pill">{item.chapter} × {item.count}</span>
                ))}
              </div>
            )}
          </div>
          <div className="mini-section">
            <h3>反复出现的主题</h3>
            {themeMomentum.length === 0 ? (
              <p className="muted">还没 enough 痕迹。先选一次，再回来看看自己总在什么地方打转。</p>
            ) : (
              <div className="tag-row">
                {themeMomentum.map((item) => (
                  <span key={item.theme} className="metric-pill">{item.theme} × {item.count}</span>
                ))}
              </div>
            )}
          </div>
        </section>
      </aside>

      <main className="content-panel">
        {showCodex ? (
          <section className="codex-layout">
            <div className="panel-heading">
              <h2>六十四卦典</h2>
              <span>检索、筛选、补札记</span>
            </div>
            <div className="toolbar">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="搜索卦名、拼音、主题、摘要"
              />
              <select
                value={selectedChapter}
                onChange={(event) => setSelectedChapter(event.target.value as Chapter | "全部")}
              >
                <option value="全部">全部章节</option>
                {chapterSummary.map(({ chapter }) => (
                  <option key={chapter} value={chapter}>
                    {chapter}
                  </option>
                ))}
              </select>
            </div>
            <div className="codex-grid">
              {filteredHexagrams.map((hexagram) => {
                const unlocked = progress.unlockedHexagramIds.includes(hexagram.id);

                return (
                  <article
                    key={hexagram.id}
                    className={`codex-card ${unlocked ? "unlocked" : "locked"}`}
                    onClick={() => encounter(hexagram)}
                  >
                    <div className="codex-header">
                      <span>#{hexagram.id}</span>
                      <span>{hexagram.symbol}</span>
                    </div>
                    <h3>{hexagram.name} · {hexagram.title}</h3>
                    <p>{hexagram.summary}</p>
                    <div className="tag-row">
                      {hexagram.themes.map((theme) => (
                        <span key={theme}>{theme}</span>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ) : (
          <section className="encounter-layout">
            <article className="scene-card">
              <div className="panel-heading">
                <h2>当前卦境</h2>
                <span>{currentHexagram.chapter}</span>
              </div>
              <div className="scene-title">
                <p className="scene-symbol">{currentHexagram.symbol}</p>
                <div>
                  <h3>第{currentHexagram.id}卦 · {currentHexagram.name}</h3>
                  <p>{currentHexagram.title} / {currentHexagram.pinyin}</p>
                </div>
              </div>
              <p className="summary">{currentHexagram.summary}</p>
              <p className="scenario">{currentHexagram.scenario}</p>
              <div className="tag-row">
                {currentHexagram.themes.map((theme) => (
                  <span key={theme}>{theme}</span>
                ))}
              </div>
            </article>

            <article className="choice-card">
              <div className="panel-heading">
                <h2>推演选择</h2>
                <span>动爻与转卦</span>
              </div>
              <div className="choice-list">
                {transformedTargets.map(({ choice, target }) => (
                  <button type="button" key={choice.id} className="choice-item" onClick={() => handleChoice(choice.id)}>
                    <strong>{choice.label}</strong>
                    <span>动爻：第{choice.changingLine}爻</span>
                    <span>转向：{target.name} · {target.title}</span>
                    <p>{choice.consequence}</p>
                  </button>
                ))}
              </div>
            </article>

            <article className="choice-card">
              <div className="panel-heading">
                <h2>下一步建议</h2>
                <span>顺手继续</span>
              </div>
              <div className="recommendation-list">
                {recommendedHexagrams.map((item) => (
                  <button type="button" key={item.id} className="recommendation-item" onClick={() => encounter(item)}>
                    <strong>{item.name} · {item.title}</strong>
                    <span>{item.chapter}</span>
                    <p>{item.summary}</p>
                  </button>
                ))}
              </div>
            </article>

            <article className="study-card">
              <div className="panel-heading">
                <h2>静读与札记</h2>
                <span>逐步解锁</span>
              </div>
              <div className="study-columns">
                <div>
                  <h3>六爻提示</h3>
                  <ul className="line-list">
                    {currentHexagram.lineImages.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3>研读提示</h3>
                  <ul className="line-list">
                    {currentHexagram.studyNotes.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                  <h3>相关卦</h3>
                  <div className="tag-row">
                    {currentHexagram.related.map((id) => {
                      const item = getHexagramById(id);
                      return (
                        <button type="button" key={id} className="tag-button" onClick={() => encounter(item)}>
                          {item.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              <textarea
                value={progress.notes[currentHexagram.id] ?? ""}
                onChange={(event) => setProgress((current) => updateNote(current, currentHexagram.id, event.target.value))}
                placeholder="写下你的判断、联想或今天想带走的一句话"
              />
            </article>

            <article className="journal-card">
              <div className="panel-heading">
                <h2>最近推演</h2>
                <span>解锁轨迹</span>
              </div>
              <div className="journal-list">
                {progress.journal.length === 0 ? (
                  <p className="muted">还没有推演记录。先从当前卦境做出一次选择。</p>
                ) : (
                  progress.journal.map((entry) => {
                    const from = getHexagramById(entry.fromHexagramId);
                    const target = getHexagramById(entry.transformedHexagramId);
                    return (
                      <article key={`${entry.timestamp}-${entry.choiceId}`} className="journal-item">
                        <strong>{from.name} → {target.name}</strong>
                        <span>第{entry.changingLine}爻动</span>
                        <p>{entry.consequence}</p>
                      </article>
                    );
                  })
                )}
              </div>
            </article>
          </section>
        )}
      </main>
    </div>
  );
}
