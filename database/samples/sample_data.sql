-- Insert Categories
INSERT INTO categories (name) VALUES
('Technology'),
('World News'),
('Culture & Arts'),
('Sports'),
('Business'),
('Science');

-- Insert Sample Posts
INSERT INTO posts (title, content, category_id) VALUES
('Technology Trends 2024: The Future is Now', 
'Exploring the cutting-edge technologies that are shaping our future. From artificial intelligence to quantum computing, we delve into the innovations that are transforming industries and everyday life.

Key highlights:
- Latest developments in AI and machine learning
- Breakthrough discoveries in quantum computing
- Emerging trends in cybersecurity
- The evolution of 5G and future connectivity

These advancements are not just changing how we work and live; they''re reshaping the very fabric of our society.',
1),

('Global Summit 2024: World Leaders Unite for Change', 
'A comprehensive coverage of the landmark Global Summit, where world leaders gathered to address pressing global challenges and forge new partnerships for a sustainable future.

Key discussions included:
- Climate change initiatives
- International cooperation frameworks
- Economic development strategies
- Global health security

The summit marked a turning point in international relations, with groundbreaking agreements reached on several key issues.',
2),

('The Renaissance of Modern Art in the Digital Age',
'Exploring how digital technology is revolutionizing the art world, from NFTs to virtual galleries, and how artists are adapting to this new creative landscape.

Topics covered:
- Digital art movements
- Virtual reality exhibitions
- Blockchain in art authentication
- The future of traditional galleries

This transformation is not just about new tools, but about reimagining the very nature of artistic expression.',
3),

('World Championship 2024: A Historic Moment in Sports',
'An in-depth analysis of the World Championship events, highlighting extraordinary performances, unexpected victories, and the human stories behind the competition.

Featured aspects:
- Record-breaking performances
- Behind-the-scenes preparation
- Athletic innovations
- Impact on future sports development

The championship has set new standards for athletic excellence and sportsmanship.',
4),

('Innovation in Business: Startups Changing the Game',
'Discover how innovative startups are disrupting traditional industries and creating new market opportunities in the post-digital era.

Key insights:
- Emerging business models
- Technology integration strategies
- Success stories and lessons learned
- Future market predictions

These companies are not just creating products; they''re reshaping entire industries.',
5),

('Scientific Breakthroughs: New Frontiers in Research',
'Exploring recent scientific discoveries that promise to revolutionize our understanding of the universe and advance human capabilities.

Research highlights:
- Space exploration advances
- Medical research breakthroughs
- Environmental science developments
- Technological innovations

These discoveries are opening new possibilities for human advancement and scientific understanding.',
6);
