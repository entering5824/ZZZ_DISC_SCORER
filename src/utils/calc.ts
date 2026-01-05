import type { CalculationRequest, CalculationResponse, CalculationResultDisc, StatsConfig } from '../types';
import statsData from '../../config/stats.json';

const config = statsData as StatsConfig;

export function normalizeStat(stat: string): string {
    const s = stat.trim().toUpperCase();
    for (const info of config.stats) {
        if (info.id.toUpperCase() === s) return info.id;
        if (info.aliases.some(a => a.toUpperCase() === s)) return info.id;
    }
    return 'UNK';
}

// Valid main stats for each slot
const VALID_MAIN_STATS: Record<number, string[]> = {
    1: ['HP'],
    2: ['ATK'],
    3: ['DEF'],
    4: ['HP%', 'ATK%', 'DEF%', 'CR', 'CD', 'AP'],
    5: ['HP%', 'ATK%', 'DEF%', 'Pen Ratio', 'DMG Bonus'],
    6: ['HP%', 'ATK%', 'DEF%', 'AM', 'Impact', 'ER']
};

// Valid sub stats (same for all slots)
const VALID_SUB_STATS = ['HP', 'HP%', 'ATK', 'ATK%', 'DEF', 'DEF%', 'PEN', 'CR', 'CD', 'AP'];

export function isValidMainStat(slot: number, stat: string): boolean {
    const normalized = normalizeStat(stat);
    if (normalized === 'UNK') return false;
    const validStats = VALID_MAIN_STATS[slot] || [];
    return validStats.includes(normalized);
}

export function isValidSubStat(stat: string): boolean {
    const normalized = normalizeStat(stat);
    if (normalized === 'UNK') return false;
    return VALID_SUB_STATS.includes(normalized);
}

export function getValidMainStats(slot: number): string[] {
    return VALID_MAIN_STATS[slot] || [];
}

export function getValidSubStats(): string[] {
    return [...VALID_SUB_STATS];
}

export function calculateScore(req: CalculationRequest): CalculationResponse {
    const { priorities, base_enhancement, discs, auto_fill_source = 'default' } = req;
    const normalizedPriorities = priorities.map(normalizeStat);

    const results: CalculationResultDisc[] = discs.map((d) => {
        let main = d.main || '';
        if (!main) {
            // Auto-assign based on slot rules
            if (d.slot === 1) main = 'HP';
            else if (d.slot === 2) main = 'ATK';
            else if (d.slot === 3) main = 'DEF';
            else main = '?';
        } else {
            // Validate main stat
            const normalizedMain = normalizeStat(main);
            if (!isValidMainStat(d.slot, normalizedMain)) {
                // If invalid, fallback to default for slot
                if (d.slot === 1) main = 'HP';
                else if (d.slot === 2) main = 'ATK';
                else if (d.slot === 3) main = 'DEF';
                else main = '?';
            } else {
                main = normalizedMain;
            }
        }

        // Normalize main stat for comparison
        const normalizedMain = normalizeStat(main);

        // Auto-fill or validate substats
        let finalSubstats: string[] = [];
        if (!d.substats || d.substats.length === 0) {
            // Auto-fill logic: Use priorities first, then other valid substats
            const pool = [...normalizedPriorities, ...VALID_SUB_STATS];
            const autoSelected = new Set<string>();
            for (const s of pool) {
                if (autoSelected.size >= 4) break;
                if (s !== 'UNK' && s !== normalizedMain && isValidSubStat(s)) {
                    autoSelected.add(s);
                }
            }
            finalSubstats = Array.from(autoSelected);
        } else {
            // Validation logic for provided substats
            const validated = new Set<string>();
            for (const s of d.substats) {
                const normalized = normalizeStat(s);
                if (normalized !== 'UNK' && normalized !== normalizedMain && isValidSubStat(normalized)) {
                    validated.add(normalized);
                }
            }
            finalSubstats = Array.from(validated).slice(0, 4);
        }

        const matches = finalSubstats.filter(s => normalizedPriorities.includes(s));
        const matches_count = matches.length;
        const score = matches_count > 0 ? (base_enhancement + matches_count) : 0;

        return {
            slot: d.slot,
            main: main,
            substats: finalSubstats, // Use normalized valid substats
            matches: matches,
            matches_count: matches_count,
            base: base_enhancement,
            score: score
        };
    });

    const total_score = results.reduce((acc, curr) => acc + curr.score, 0);

    return {
        discs: results,
        total_score,
        auto_fill_source_used: auto_fill_source
    };
}
