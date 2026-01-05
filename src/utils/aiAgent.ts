import { z } from 'zod';
import type { StatID, AIResponse, StatBreakdown } from '../types';
import buildsData from '../../config/builds.json';

// Schemas for Runtime Validation
export const AIRequestSchema = z.object({
    mode: z.enum(['ADVISOR', 'AUTO_OPTIMIZE', 'EXPLAIN_RESULT']),
    character: z.string().optional(),
    role: z.string().optional(),
    team_style: z.string().optional(),
    current_stats: z.record(z.string(), z.number()).optional(),
    target: z.string().optional(),
    score: z.number().optional(),
    priorities: z.array(z.string()).optional(),
    mainStats: z.object({
        slot4: z.string().optional(),
        slot5: z.string().optional(),
        slot6: z.string().optional(),
    }).optional(),
    substats: z.record(z.string(), z.number()).optional(),
    delay: z.number().min(0).max(5000).optional(), // Configurable delay
});

export type AIRequest = z.infer<typeof AIRequestSchema>;

const BuildSchema = z.object({
    id: z.string(),
    name: z.string(),
    aliases: z.array(z.string()),
    priorities: z.array(z.string()),
    mainStats: z.object({
        slot4: z.string(),
        slot5: z.string(),
        slot6: z.string(),
    }),
    advisor: z.string(),
    recommendationReasons: z.array(z.string()),
});

const BuildsFileSchema = z.object({
    version: z.string(),
    lastUpdated: z.string(),
    characters: z.array(BuildSchema),
});

const config = BuildsFileSchema.parse(buildsData);

const DEFAULT_BUILD = {
    priorities: ["ATK%", "CR", "CD", "AP"],
    mainStats: {
        slot4: "ATK%",
        slot5: "DMG Bonus",
        slot6: "ATK%"
    },
    advisor: "Generic DPS build prioritizing ATK and Crit. Adjust according to specific character scaling.",
    recommendationReasons: [
        "Balanced ATK and Crit for generic DPS roles",
        "Higher consistency for multi-hit characters",
        "Slot 5 DMG Bonus provides highest multiplicative return"
    ]
};

// Fuzzy Character Matching
function findCharacterBuild(name?: string) {
    if (!name) return DEFAULT_BUILD;
    const search = name.toLowerCase().trim().replace(/[^a-z0-9]/g, '');

    // Exact match or ID match
    const build = config.characters.find(c =>
        c.name.toLowerCase() === name.toLowerCase() ||
        c.id === name ||
        c.aliases.some(a => a.toLowerCase() === name.toLowerCase())
    );

    if (build) return build;

    // Fuzzy match (contains)
    const fuzzy = config.characters.find(c =>
        search.includes(c.id.replace(/_/g, '')) ||
        c.name.toLowerCase().includes(name.toLowerCase()) ||
        c.aliases.some(a => a.toLowerCase().includes(name.toLowerCase()))
    );

    return fuzzy || DEFAULT_BUILD;
}

export async function aiAgent(rawRequest: unknown): Promise<AIResponse> {
    // 1. Runtime Validation
    const request = AIRequestSchema.parse(rawRequest);

    // 2. Configurable Delay
    const delay = request.delay ?? 150;
    await new Promise(resolve => setTimeout(resolve, delay));

    const { mode, character = "Generic", priorities, score } = request;
    const build = findCharacterBuild(character);

    if (mode === 'ADVISOR') {
        return {
            text: `Recommended stat priority:\n${build.priorities.join(' ≥ ')}\n\nMain stat suggestions:\n- Slot 4: ${build.mainStats.slot4}\n- Slot 5: ${build.mainStats.slot5}\n- Slot 6: ${build.mainStats.slot6}`,
            priorities: build.priorities as StatID[],
            mainStats: build.mainStats,
            recommendationReasons: build.recommendationReasons,
            confidence: 0.95
        };
    }

    if (mode === 'AUTO_OPTIMIZE') {
        return {
            priorities: build.priorities as StatID[],
            mainStats: build.mainStats,
            notes: `Optimized for ${character}'s ${request.target || 'Max DPS'} build.`,
            confidence: 1.0,
            recommendationReasons: build.recommendationReasons
        };
    }

    if (mode === 'EXPLAIN_RESULT') {
        const isHigh = (score || 0) > 80;

        // Calculate structured breakdown
        const breakdown: StatBreakdown[] = build.priorities.map((stat, index) => {
            const weight = Math.max(0.1, 1 - (index * 0.25));
            const matched = priorities?.includes(stat);
            return {
                stat,
                contribution: matched ? weight : 0.05,
                explanation: matched ? `Matches priority #${index + 1}` : `Missing recommended stat`
            };
        });

        // Normalize contributions
        const totalContrib = breakdown.reduce((acc, curr) => acc + curr.contribution, 0);
        breakdown.forEach(b => {
            if (totalContrib > 0) b.contribution = b.contribution / totalContrib;
        });

        return {
            text: `This build scores ${isHigh ? 'highly' : 'moderately'} because it ${isHigh ? 'aligns well with' : 'partially matches'} the recommended metas.`,
            confidence: 0.88,
            breakdown,
            recommendationReasons: build.recommendationReasons
        };
    }

    throw new Error("Invalid AI mode");
}
