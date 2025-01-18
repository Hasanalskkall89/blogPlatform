-- Update image paths in post_media table
UPDATE post_media 
SET media_url = CASE post_id
    WHEN 1 THEN '/api/posts/uploads/images/test_image_1.jpg'
    WHEN 2 THEN '/api/posts/uploads/images/test_image_2.jpg'
    WHEN 3 THEN '/api/posts/uploads/images/test_image_3.jpg'
    WHEN 4 THEN '/api/posts/uploads/images/test_image_4.jpg'
    WHEN 5 THEN '/api/posts/uploads/images/test_image_5.jpg'
    WHEN 6 THEN '/api/posts/uploads/images/test_image_6.jpg'
END
WHERE post_id IN (1,2,3,4,5,6);
