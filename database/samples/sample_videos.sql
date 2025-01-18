-- Add standalone videos
INSERT INTO standalone_videos (title, video_url, description)
VALUES 
('Tech Conference 2024 Highlights', '/api/videos/standalone/tech_conf.mp4', 'Key moments from the biggest tech conference of the year'),
('AI Research Breakthrough', '/api/videos/standalone/ai_research.mp4', 'Demonstration of the latest AI capabilities and applications'),
('Global Summit Opening Ceremony', '/api/videos/standalone/summit.mp4', 'Highlights from the international summit opening ceremony');

-- Update video content for posts
UPDATE post_media 
SET media_url = '/api/videos/posts/tech_demo.mp4'
WHERE media_type = 'video' AND post_id = 1;

UPDATE post_media 
SET media_url = '/api/videos/posts/summit_speech.mp4'
WHERE media_type = 'video' AND post_id = 2;
