
import policies from './policies.json';

export interface Policy {
    id: string;
    title: string;
    text: string;
}

export function retrieveRelevantPolicies(receiptText: string): Policy[] {
    const text = receiptText.toLowerCase();

    // Simple keyword matching for Light RAG
    const relevant = policies.filter(p => {
        // Check various keywords associated with policies
        if (p.id === 'travel_3_2' && (text.includes('meal') || text.includes('food') || text.includes('restaurant') || text.includes('dinner') || text.includes('lunch') || text.includes('breakfast'))) return true;
        if (p.id === 'office_1_1' && (text.includes('paper') || text.includes('monitor') || text.includes('pen') || text.includes('notebook') || text.includes('supply') || text.includes('office'))) return true;
        if (p.id === 'transport_2_1' && (text.includes('uber') || text.includes('lyft') || text.includes('taxi') || text.includes('cab') || text.includes('ride') || text.includes('trip'))) return true;
        if (p.id === 'alcohol_policy' && (text.includes('wine') || text.includes('beer') || text.includes('alcohol') || text.includes('cocktail') || text.includes('bar'))) return true;

        // Default: if no specific keywords match, maybe include all or none? 
        // For "Light RAG", we want to be selective. 
        // Let's add a generic fallback if the text contains the policy title words
        return p.title.toLowerCase().split(' ').some(word => text.includes(word) && word.length > 3);
    });

    // If nothing matches, return a default set or empty (let's return all if none match to be safe, or just empty? 
    // The user prompt implies we MUST find relevant policies. Let's return all if empty as a fallback for the demo).
    return relevant.length > 0 ? relevant : policies;
}
