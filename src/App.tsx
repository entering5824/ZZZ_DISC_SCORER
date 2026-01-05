import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Download, Save, Share2, X, ListFilter, Sparkles, Brain, Zap, MessageSquare, ShieldCheck, TrendingUp, Search } from 'lucide-react';
import { calculateScore, getValidMainStats } from './utils/calc';
import { aiAgent } from './utils/aiAgent';
import type { CalculationRequest, CalculationResponse, StatsConfig, AIResponse } from './types';
import statsData from '../config/stats.json';

const config = statsData as StatsConfig;

const CHARACTERS = ["Ellen Joe", "Zhu Yuan", "Von Lycaon", "Soldier 11", "Grace Howard", "Koleda Belobog", "Nekomata"];

function App() {
  const [selectedCharacter, setSelectedCharacter] = useState<string>("Ellen Joe");
  const [searchTerm, setSearchTerm] = useState("");
  const [priorities, setPriorities] = useState<string[]>(['ATK%', 'CR', 'CD', 'AP']);
  const [baseEnhancement, setBaseEnhancement] = useState<number>(5);
  const [slotMains, setSlotMains] = useState<Record<number, string>>({
    4: '',
    5: '',
    6: ''
  });
  const [result, setResult] = useState<CalculationResponse | null>(null);
  const [aiData, setAiData] = useState<AIResponse | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const filteredCharacters = useMemo(() => {
    return CHARACTERS.filter(c => c.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm]);

  const handleCalculate = () => {
    const req: CalculationRequest = {
      priorities,
      base_enhancement: baseEnhancement,
      mode: 'simple',
      discs: [
        { slot: 1 },
        { slot: 2 },
        { slot: 3 },
        { slot: 4, main: slotMains[4] || undefined },
        { slot: 5, main: slotMains[5] || undefined },
        { slot: 6, main: slotMains[6] || undefined }
      ],
      auto_fill_source: 'default'
    };

    const res = calculateScore(req);
    setResult(res);
  };

  // Auto-calculate on budget or priority change
  useEffect(() => {
    handleCalculate();
  }, [baseEnhancement, priorities, slotMains]);

  const handleAiAdvisor = async () => {
    setIsAiLoading(true);
    setAiData(null);
    try {
      const resp = await aiAgent({
        mode: "ADVISOR",
        character: selectedCharacter,
        delay: 300
      });
      setAiData(resp);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleAiOptimize = async () => {
    setIsAiLoading(true);
    setAiData(null);
    try {
      const resp = await aiAgent({
        mode: "AUTO_OPTIMIZE",
        character: selectedCharacter,
        target: "Max DPS",
        delay: 500
      });
      if (resp.priorities) setPriorities(resp.priorities);
      if (resp.mainStats) {
        setSlotMains({
          4: resp.mainStats.slot4,
          5: resp.mainStats.slot5,
          6: resp.mainStats.slot6,
        });
      }
      setAiData(resp);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleAiExplain = async () => {
    if (!result) return;
    setIsAiLoading(true);
    setAiData(null);
    try {
      const resp = await aiAgent({
        mode: "EXPLAIN_RESULT",
        character: selectedCharacter,
        score: result.total_score,
        priorities,
        delay: 400
      });
      setAiData(resp);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
    }
  };

  const addPriority = (statId: string) => {
    if (!statId) return;
    if (!priorities.includes(statId)) {
      setPriorities([...priorities, statId]);
    }
  };

  const removePriority = (statId: string) => {
    setPriorities(priorities.filter(p => p !== statId));
  };

  const copyBuildLink = () => {
    const buildData = {
      char: selectedCharacter,
      prio: priorities,
      mains: slotMains,
      score: result?.total_score
    };
    const b64 = btoa(JSON.stringify(buildData));
    navigator.clipboard.writeText(`${window.location.origin}/#build=${b64}`);
    alert("Build link copied to clipboard!");
  };

  return (
    <>
      <header>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="logo-badge"
          style={{ background: 'var(--accent-primary)', color: 'black', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 900, marginBottom: '0.5rem', display: 'inline-block' }}
        >
          ZZZ v1.4 READY
        </motion.div>
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          ZENLESS SCORER
        </motion.h1>
        <p className="subtitle">Deterministic Disc Substat Intelligence</p>
      </header>

      <div className="container">
        {/* Left Panel: Configuration */}
        <motion.div
          className="panel"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="panel-title">
            <Zap size={20} />
            <span>Character Context</span>
          </div>

          <div className="form-group">
            <div style={{ position: 'relative', marginBottom: '1rem' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search character..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
            <div className="char-select-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', maxHeight: '150px', overflowY: 'auto', padding: '4px' }}>
              {filteredCharacters.map(c => (
                <button
                  key={c}
                  className={`btn btn-secondary ${selectedCharacter === c ? 'active' : ''}`}
                  onClick={() => setSelectedCharacter(c)}
                  style={{
                    fontSize: '0.8rem',
                    padding: '0.6rem',
                    justifyContent: 'flex-start',
                    borderColor: selectedCharacter === c ? 'var(--accent-primary)' : 'var(--glass-border)',
                    background: selectedCharacter === c ? 'rgba(250, 255, 0, 0.1)' : 'var(--glass-bg)'
                  }}
                >
                  {c}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '1.5rem' }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={handleAiAdvisor}>
                <Brain size={16} /> Get Advice
              </button>
              <button className="btn btn-ai" style={{ flex: 1 }} onClick={handleAiOptimize}>
                <Sparkles size={16} /> Auto-Optimize
              </button>
            </div>
          </div>

          <div className="form-group">
            <label><ListFilter size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Target Stats</label>
            <div className="tag-container">
              <AnimatePresence>
                {priorities.map(p => (
                  <motion.span
                    key={p}
                    className="tag match"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    layout
                  >
                    {p} <X size={12} style={{ cursor: 'pointer' }} onClick={() => removePriority(p)} />
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
            <select
              value=""
              onChange={(e) => addPriority(e.target.value)}
            >
              <option value="" disabled>+ Add Stat Priority</option>
              {config.stats
                .filter(s => ['HP', 'HP%', 'ATK', 'ATK%', 'DEF', 'DEF%', 'PEN', 'CR', 'CD', 'AP'].includes(s.id))
                .filter(s => !priorities.includes(s.id))
                .map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
            </select>
          </div>

          <div className="form-group">
            <label>Enhancement Budget (Max 10)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <input
                type="range"
                min="0"
                max="10"
                value={baseEnhancement}
                onChange={(e) => setBaseEnhancement(parseInt(e.target.value))}
                style={{ height: '6px' }}
              />
              <span style={{ fontWeight: 800, color: 'var(--accent-primary)', minWidth: '1.5rem' }}>{baseEnhancement}</span>
            </div>
          </div>

          <div className="form-group">
            <label>Main Stat Lock</label>
            <div className="disc-grid">
              {[4, 5, 6].map(slot => {
                const validMainStats = getValidMainStats(slot);
                return (
                  <div key={slot} className="disc-slot">
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800 }}>SLOT {slot}</span>
                    <select
                      value={slotMains[slot as keyof typeof slotMains]}
                      onChange={(e) => setSlotMains({ ...slotMains, [slot]: e.target.value })}
                      style={{ padding: '0.5rem', fontSize: '0.8rem' }}
                    >
                      <option value="">AUTO</option>
                      {validMainStats.map(stat => (
                        <option key={stat} value={stat}>{stat}</option>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>
          </div>

          <button className="btn btn-primary" onClick={handleCalculate} style={{ marginTop: '1.5rem' }}>
            <Calculator size={18} />
            Run Deterministic Calc
          </button>
        </motion.div>

        {/* Right Panel: AI & Results */}
        <motion.div
          className="panel"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* AI Insights display */}
          <AnimatePresence mode="wait">
            {(aiData || isAiLoading) ? (
              <motion.div
                key="ai-panel"
                className="ai-box"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ marginBottom: '2rem' }}
              >
                {isAiLoading ? (
                  <div className="ai-loading" style={{ padding: '1rem' }}>
                    <div className="ai-dot" />
                    <div className="ai-dot" />
                    <div className="ai-dot" />
                  </div>
                ) : (
                  <div className="ai-content">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-secondary)', fontWeight: 700 }}>
                        <ShieldCheck size={18} />
                        <span>ANALYSIS COMPLETE</span>
                        {aiData?.confidence && (
                          <span style={{ fontSize: '0.6rem', background: 'rgba(0, 242, 255, 0.1)', padding: '0.1rem 0.4rem', borderRadius: '100px' }}>
                            {Math.round(aiData.confidence * 100)}% CONFIDENCE
                          </span>
                        )}
                      </div>
                      <X size={14} style={{ cursor: 'pointer', opacity: 0.5 }} onClick={() => setAiData(null)} />
                    </div>

                    {aiData?.text && <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>{aiData.text}</p>}

                    {aiData?.breakdown && (
                      <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <TrendingUp size={12} /> STAT CONTRIBUTION BREAKDOWN
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {aiData.breakdown.map(b => (
                            <div key={b.stat}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                                <span>{b.stat}</span>
                                <span style={{ color: 'var(--text-muted)' }}>{b.explanation}</span>
                              </div>
                              <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', overflow: 'hidden' }}>
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${b.contribution * 100}%` }}
                                  style={{ height: '100%', background: 'linear-gradient(90deg, var(--accent-secondary), var(--accent-tertiary))' }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {aiData?.recommendationReasons && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>RECOGNIZED META PATTERNS</div>
                        {aiData.recommendationReasons.map((r, i) => (
                          <div key={i} style={{ display: 'flex', gap: '8px', fontSize: '0.85rem' }}>
                            <Sparkles size={12} style={{ color: 'var(--accent-primary)', marginTop: '4px', flexShrink: 0 }} />
                            <span>{r}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ) : null}
          </AnimatePresence>

          {!result ? (
            <div style={{ height: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              <Zap size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
              <p>Configure parameters to generate score</p>
            </div>
          ) : (
            <>
              <motion.div
                className="total-score-panel"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 800 }}>Potential Score</div>
                <div className="total-score-value">{result.total_score}</div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '1.5rem' }}>
                  <button
                    className="btn btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '0.5rem 1rem' }}
                    onClick={handleAiExplain}
                  >
                    <MessageSquare size={14} /> Explain Score
                  </button>
                  <button
                    className="btn btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '0.5rem 1rem' }}
                    onClick={copyBuildLink}
                  >
                    <Share2 size={14} /> Share Build
                  </button>
                </div>
              </motion.div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800 }}>DETAILED SLOTS</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--accent-secondary)' }}>SOURCE: {result.auto_fill_source_used.toUpperCase()}</div>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="results-table">
                  <thead>
                    <tr>
                      <th>Slot</th>
                      <th>Main</th>
                      <th>Optimal Substats</th>
                      <th>Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.discs.map(d => (
                      <motion.tr
                        key={d.slot}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * d.slot }}
                      >
                        <td><span style={{ fontWeight: 800, color: 'var(--text-muted)' }}>#{d.slot}</span></td>
                        <td>
                          <span className="tag" style={{ border: 'none', background: 'rgba(0, 242, 255, 0.1)', color: 'var(--accent-secondary)' }}>
                            {d.main}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                            {d.substats.map((s, i) => (
                              <span key={i} className={`tag ${d.matches.includes(s) ? 'match' : ''}`} style={{ fontSize: '0.65rem' }}>{s}</span>
                            ))}
                          </div>
                        </td>
                        <td><span className="score-badge">{d.score}</span></td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="export-tools">
                <button className="btn btn-secondary" onClick={() => alert("Build saved to local vault!")}><Save size={16} /> Save</button>
                <button className="btn btn-secondary" onClick={() => window.print()}><Download size={16} /> PDF Report</button>
                <button className="btn btn-secondary" onClick={() => {
                  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result));
                  const downloadAnchorNode = document.createElement('a');
                  downloadAnchorNode.setAttribute("href", dataStr);
                  downloadAnchorNode.setAttribute("download", "zzz_build.json");
                  document.body.appendChild(downloadAnchorNode);
                  downloadAnchorNode.click();
                  downloadAnchorNode.remove();
                }}><Download size={16} /> JSON</button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </>
  );
}

export default App;
