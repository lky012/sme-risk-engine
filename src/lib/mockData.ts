export type MonthlyFinancial = {
    month: string;
    revenue: number;
    cogs: number;
};

export type SocialActivity = {
    month: string;
    posts: number;
    engagementScore: number;
};

export type Review = {
    id: string;
    date: string;
    platform: 'Google' | 'Yelp' | 'Facebook';
    text: string;
    rating: number;
};

export type SMEPersona = {
    id: string;
    name: string;
    type: string;
    description: string;
    cashRunwayMonths: number;
    financials: MonthlyFinancial[];
    socialActivity: SocialActivity[];
    reviews: Review[];
    baseRisk: 'Low' | 'Medium' | 'High'; // For reference, actual score calculated by engine
};

const past12Months = Array.from({ length: 12 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (11 - i));
    return d.toLocaleString('en-US', { month: 'short', year: '2-digit' });
});

export const mockPersonas: Record<string, SMEPersona> = {
    'blossom-co': {
        id: 'blossom-co',
        name: 'Blossom & Co.',
        type: 'Online Floral Studio',
        description: 'A thriving boutique floral studio with strong online presence and healthy cash flow.',
        baseRisk: 'Low',
        cashRunwayMonths: 18,
        financials: past12Months.map((m, i) => ({
            month: m,
            revenue: 15000 + (i * 1200) + Math.random() * 2000,
            cogs: 6000 + (i * 400) + Math.random() * 500
        })),
        socialActivity: past12Months.slice(-3).map((m, i) => ({
            month: m,
            posts: 20 + i * 2,
            engagementScore: 85 + i * 3
        })),
        reviews: [
            { id: '1', date: '2023-10-12', platform: 'Google', text: 'Absolutely gorgeous arrangements! They nailed the colors for my wedding and delivered on time.', rating: 5 },
            { id: '2', date: '2023-10-25', platform: 'Yelp', text: 'Great customer service, very responsive on Instagram.', rating: 5 },
            { id: '3', date: '2023-11-05', platform: 'Google', text: 'A bit pricey, but the quality of the flowers is unmatched in the city.', rating: 4 },
            { id: '4', date: '2023-11-18', platform: 'Facebook', text: 'The packaging alone is a work of art. 10/10 recommend.', rating: 5 },
            { id: '5', date: '2023-12-02', platform: 'Google', text: 'Ordered a custom bouquet for my mom\'s birthday, she cried! Thank you Blossom & Co!', rating: 5 },
            { id: '6', date: '2023-12-15', platform: 'Yelp', text: 'Consistently fresh blooms. They stay alive way longer than supermarket flowers.', rating: 5 },
            { id: '7', date: '2023-12-28', platform: 'Google', text: 'Lovely little studio. The owner was super sweet and helped me pick exactly what I needed.', rating: 5 },
            { id: '8', date: '2024-01-10', platform: 'Facebook', text: 'Their subscription box is the highlight of my month.', rating: 5 },
            { id: '9', date: '2024-01-22', platform: 'Google', text: 'Beautiful designs but they forgot the personalized note I requested.', rating: 3 },
            { id: '10', date: '2024-02-05', platform: 'Yelp', text: 'Stunning Valentine\'s Day special. My girlfriend loved it.', rating: 5 },
            { id: '11', date: '2024-02-14', platform: 'Google', text: 'Very busy on V-day so pickup took a while, but worth the wait.', rating: 4 },
            { id: '12', date: '2024-02-28', platform: 'Facebook', text: 'Support local! The best florist hands down.', rating: 5 },
            { id: '13', date: '2024-03-12', platform: 'Google', text: 'Their aesthetic is exactly what I was looking for. Very modern.', rating: 5 },
            { id: '14', date: '2024-03-25', platform: 'Yelp', text: 'Fabulous service. Highly recommend the peonies when in season.', rating: 5 },
            { id: '15', date: '2024-04-08', platform: 'Google', text: 'A little hard to find the studio, but once you do it is a magical place.', rating: 4 },
            { id: '16', date: '2024-04-20', platform: 'Facebook', text: 'I follow them just for the beautiful feed, finally ordered and it exceeded expectations!', rating: 5 },
            { id: '17', date: '2024-05-05', platform: 'Google', text: 'Perfect centerpieces for our corporate event. Very professional.', rating: 5 },
            { id: '18', date: '2024-05-18', platform: 'Yelp', text: 'Incredible attention to detail.', rating: 5 },
            { id: '19', date: '2024-06-01', platform: 'Google', text: 'Always my go-to for gifts.', rating: 5 },
            { id: '20', date: '2024-06-15', platform: 'Facebook', text: 'Love the sustainable packaging!', rating: 5 }
        ]
    },
    'neon-beans': {
        id: 'neon-beans',
        name: 'Neon Beans',
        type: 'Boutique Cafe',
        description: 'High aesthetic appeal but struggling with operations and declining cash reserves.',
        baseRisk: 'High',
        cashRunwayMonths: 2,
        financials: past12Months.map((m, i) => ({
            month: m,
            revenue: 28000 - (i * 500) + Math.random() * 3000,
            cogs: 18000 + (i * 800) + Math.random() * 1500 // Costs rising
        })),
        socialActivity: past12Months.slice(-3).map((m, i) => ({
            month: m,
            posts: 5 - i * 2, // Dropping off
            engagementScore: 40 - i * 10
        })),
        reviews: [
            { id: '1', date: '2023-10-10', platform: 'Google', text: 'Cool vibes and great neon signs for photos, but the coffee was burnt.', rating: 3 },
            { id: '2', date: '2023-10-25', platform: 'Yelp', text: 'Waited 45 minutes for a flat white. Unacceptable.', rating: 1 },
            { id: '3', date: '2023-11-12', platform: 'Google', text: 'Staff seemed completely overwhelmed. There were only two people working during the morning rush.', rating: 2 },
            { id: '4', date: '2023-11-28', platform: 'Facebook', text: 'Love the decor, the avocado toast was decent.', rating: 4 },
            { id: '5', date: '2023-12-05', platform: 'Google', text: 'Terrible service. The barista ignored me while texting on her phone.', rating: 1 },
            { id: '6', date: '2023-12-20', platform: 'Yelp', text: 'Used to be my favorite spot but the quality has gone way down in the last few months.', rating: 2 },
            { id: '7', date: '2024-01-08', platform: 'Google', text: 'They were out of oat milk, almond milk, AND matcha. How do you run a cafe like this?', rating: 1 },
            { id: '8', date: '2024-01-25', platform: 'Facebook', text: 'Music was so loud I couldn’t hear myself think. Not a good place to work.', rating: 2 },
            { id: '9', date: '2024-02-14', platform: 'Google', text: 'Waiting for an hour for two coffees and a pastry on a Tuesday. The management needs to hire more staff immediately.', rating: 1 },
            { id: '10', date: '2024-02-28', platform: 'Yelp', text: 'Tables were dirty and nobody came to clear them the whole hour I was there.', rating: 2 },
            { id: '11', date: '2024-03-10', platform: 'Google', text: 'Overpriced for what you get. $8 for a mediocre latte?', rating: 2 },
            { id: '12', date: '2024-03-22', platform: 'Facebook', text: 'Cute place, good lighting.', rating: 4 },
            { id: '13', date: '2024-04-05', platform: 'Google', text: 'I saw a cockroach near the bathroom. Never coming back.', rating: 1 },
            { id: '14', date: '2024-04-18', platform: 'Yelp', text: 'Orders are consistently wrong. Ordered an iced americano, got a hot latte.', rating: 2 },
            { id: '15', date: '2024-05-02', platform: 'Google', text: 'Closed 30 minutes earlier than their posted hours. Very frustrating.', rating: 1 },
            { id: '16', date: '2024-05-15', platform: 'Facebook', text: 'The espresso machine was broken... again.', rating: 1 },
            { id: '17', date: '2024-05-28', platform: 'Google', text: 'It feels like a sinking ship. The staff looked miserable.', rating: 1 },
            { id: '18', date: '2024-06-10', platform: 'Yelp', text: 'Pastries tasted stale, like they were from yesterday.', rating: 2 },
            { id: '19', date: '2024-06-20', platform: 'Google', text: 'Do not go here if you are in a rush. Service is glacially slow.', rating: 1 },
            { id: '20', date: '2024-06-25', platform: 'Facebook', text: 'Nice aesthetic but terrible management. It shows.', rating: 2 }
        ]
    },
    'old-street': {
        id: 'old-street',
        name: 'Old Street Diner',
        type: 'Local Eatery',
        description: 'Steady but stagnant financials, no digital marketing, solid legacy reputation.',
        baseRisk: 'Medium',
        cashRunwayMonths: 8,
        financials: past12Months.map((m) => ({
            month: m,
            revenue: 22000 + (Math.random() * 1000 - 500), // Flat revenue
            cogs: 14000 + (Math.random() * 500 - 250) // Flat costs
        })),
        socialActivity: past12Months.slice(-3).map((m) => ({
            month: m,
            posts: 0, // No social presence
            engagementScore: 0
        })),
        reviews: [
            { id: '1', date: '2019-05-10', platform: 'Google', text: 'Classic diner food. The meatloaf is just like my mom used to make.', rating: 5 },
            { id: '2', date: '2019-08-22', platform: 'Yelp', text: 'Portions are huge, prices are reasonable. A neighborhood staple.', rating: 4 },
            { id: '3', date: '2020-02-15', platform: 'Google', text: 'Nothing fancy, but dependably good. Best blueberry pancakes in town.', rating: 5 },
            { id: '4', date: '2020-11-05', platform: 'Facebook', text: 'Wish they delivered, but always worth the drive.', rating: 4 },
            { id: '5', date: '2021-04-18', platform: 'Google', text: 'Waitstaff is friendly, reminds me of the good old days.', rating: 5 },
            { id: '6', date: '2021-09-30', platform: 'Yelp', text: 'Coffee is diner coffee, don’t expect a flat white here. But the eggs benny is solid.', rating: 4 },
            { id: '7', date: '2022-01-12', platform: 'Google', text: 'Decor hasn\'t changed since 1995, but that\'s part of the charm.', rating: 4 },
            { id: '8', date: '2022-05-25', platform: 'Facebook', text: 'Great place for a hangover breakfast.', rating: 5 },
            { id: '9', date: '2022-10-08', platform: 'Google', text: 'The specials board is always great. Love the Thursday turkey special.', rating: 4 },
            { id: '10', date: '2023-03-14', platform: 'Yelp', text: 'Cash only! Wish they took cards, but there is an ATM inside.', rating: 3 },
            { id: '11', date: '2023-06-22', platform: 'Google', text: 'A bit greasy, but exactly what you want from a diner.', rating: 4 },
            { id: '12', date: '2023-08-10', platform: 'Facebook', text: 'My family has been coming here for 15 years. Consistent quality.', rating: 5 },
            { id: '13', date: '2023-11-18', platform: 'Google', text: 'Service can be a bit slow on Sunday mornings, it gets packed.', rating: 4 },
            { id: '14', date: '2024-01-05', platform: 'Yelp', text: 'The pies! You have to try the cherry pie.', rating: 5 },
            { id: '15', date: '2024-02-28', platform: 'Google', text: 'Very traditional menu. Wish they had more vegan options.', rating: 3 },
            { id: '16', date: '2024-04-12', platform: 'Facebook', text: 'Best hash browns in the county, perfectly crispy.', rating: 5 },
            { id: '17', date: '2024-05-05', platform: 'Google', text: 'The booths are getting a bit torn up, could use a renovation.', rating: 3 },
            { id: '18', date: '2024-05-20', platform: 'Yelp', text: 'Solid, reliable, unpretentious.', rating: 4 },
            { id: '19', date: '2024-06-08', platform: 'Google', text: 'Love the waitresses, they always remember my order.', rating: 5 },
            { id: '20', date: '2024-06-25', platform: 'Facebook', text: 'A true local gem. Don’t change a thing!', rating: 5 }
        ]
    }
};
