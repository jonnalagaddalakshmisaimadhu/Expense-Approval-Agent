
import policies from './policies.json';

export interface Policy {
    id: string;
    title: string;
    text: string;
}

export function retrieveRelevantPolicies(receiptText: string): Policy[] {
    const text = receiptText.toLowerCase();

    const relevant = policies.filter(p => {
        if (p.id === 'travel_3_2' && (text.includes('meal') || text.includes('food') || text.includes('restaurant') || text.includes('dinner') || text.includes('lunch') || text.includes('breakfast'))) return true;
        if (p.id === 'office_1_1' && (text.includes('paper') || text.includes('monitor') || text.includes('pen') || text.includes('notebook') || text.includes('supply') || text.includes('office'))) return true;
        if (p.id === 'transport_2_1' && (text.includes('uber') || text.includes('lyft') || text.includes('taxi') || text.includes('cab') || text.includes('ride') || text.includes('trip'))) return true;
        if (p.id === 'alcohol_policy' && (text.includes('wine') || text.includes('beer') || text.includes('alcohol') || text.includes('cocktail') || text.includes('bar'))) return true;

        return p.title.toLowerCase().split(' ').some(word => text.includes(word) && word.length > 3);
    });

    return relevant.length > 0 ? relevant : policies;
}
