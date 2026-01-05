export type StatID = string;

export interface StatInfo {
    id: StatID;
    name: string;
    aliases: string[];
}

export interface Disc {
    slot: number;
    main?: string;
    substats?: string[];
}

export interface CalculationResultDisc {
    slot: number;
    main: string;
    substats: string[];
    matches: string[];
    matches_count: number;
    base: number;
    score: number;
}

export interface CalculationRequest {
    priorities: string[];
    base_enhancement: number;
    mode: 'simple';
    discs: Disc[];
    auto_fill_source?: string;
}

export interface CalculationResponse {
    discs: CalculationResultDisc[];
    total_score: number;
    auto_fill_source_used: string;
}

export interface StatsConfig {
    stats: StatInfo[];
    templates: Record<string, { name: string; substats: string[] }>;
}

export interface StatBreakdown {
    stat: StatID;
    contribution: number; // 0..1 normalized
    explanation?: string;
}

export interface AIResponse {
    priorities?: StatID[];
    mainStats?: {
        slot4: string;
        slot5: string;
        slot6: string;
    };
    notes?: string;
    text?: string;
    confidence?: number; // 0..1
    breakdown?: StatBreakdown[]; // explain score composition
    recommendationReasons?: string[]; // short bullets for UI
}
