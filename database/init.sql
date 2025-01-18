-- Database schema for Blog platform

-- Categories table: Stores blog post categories
create table categories (
  id bigint primary key generated always as identity,
  name varchar(255) not null unique,
  created_at timestamp with time zone default now()
);

-- Create index for category name searches
CREATE INDEX idx_categories_name ON categories(name);

-- Posts table: Stores main blog posts
create table posts (
  id bigint primary key generated always as identity,
  title varchar(255) not null,
  content text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  category_id bigint references categories (id) on delete set null,
  comments_enabled boolean default true,
  likes_count bigint default 0,
  -- Add constraints for data validation
  CONSTRAINT valid_title CHECK (length(trim(title)) > 0),
  CONSTRAINT valid_content CHECK (length(trim(content)) > 0)
);

-- Create indexes for common post queries
CREATE INDEX idx_posts_category ON posts(category_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);

-- Post media table: Stores images and videos related to posts
create table post_media (
  id bigint primary key generated always as identity,
  post_id bigint references posts (id) on delete cascade,
  media_url varchar(255) not null,
  media_type varchar(50) not null check (media_type in ('image', 'video')),
  created_at timestamp with time zone default now(),
  -- Add constraint for valid URL
  CONSTRAINT valid_media_url CHECK (length(trim(media_url)) > 0)
);

-- Create index for post media queries
CREATE INDEX idx_post_media_post ON post_media(post_id);

-- Standalone videos table: Stores independent video content
create table standalone_videos (
  id bigint primary key generated always as identity,
  title varchar(255) not null,
  video_url varchar(255) not null,
  description text,
  created_at timestamp with time zone default now(),
  -- Add constraints for data validation
  CONSTRAINT valid_video_title CHECK (length(trim(title)) > 0),
  CONSTRAINT valid_video_url CHECK (length(trim(video_url)) > 0)
);

-- Tags table: Stores content tags
create table tags (
  id bigint primary key generated always as identity,
  name varchar(255) not null unique,
  created_at timestamp with time zone default now()
);

-- Create index for tag searches
CREATE INDEX idx_tags_name ON tags(name);

-- Post tags junction table: Links posts with tags
create table posttags (
  post_id bigint references posts (id) on delete cascade,
  tag_id bigint references tags (id) on delete cascade,
  created_at timestamp with time zone default now(),
  primary key (post_id, tag_id)
);

-- Comments table: Stores post comments
create table comments (
  id bigint primary key generated always as identity,
  post_id bigint references posts (id) on delete cascade,
  author_name varchar(255) not null,
  content text not null,
  created_at timestamp with time zone default now(),
  -- Add constraints for data validation
  CONSTRAINT valid_author_name CHECK (length(trim(author_name)) > 0),
  CONSTRAINT valid_comment_content CHECK (length(trim(content)) > 0)
);

-- Create index for comment queries
CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);

-- Likes table: Stores post likes
create table likes (
  id bigint primary key generated always as identity,
  post_id bigint references posts (id) on delete cascade,
  ip_address varchar(45) not null,
  created_at timestamp with time zone default now(),
  unique(post_id, ip_address)
);

-- Create index for like queries
CREATE INDEX idx_likes_post ON likes(post_id);

-- Admins table: Stores admin users
CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE,
    -- Add constraints for data validation
    CONSTRAINT valid_username CHECK (length(trim(username)) >= 3),
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create index for admin queries
CREATE INDEX idx_admins_username ON admins(username);
CREATE INDEX idx_admins_email ON admins(email);

-- Create default admin user (password: BlogAdmin@2024!)
INSERT INTO admins (username, password, email) 
VALUES ('admin', '$2a$10$K8zCg.SAp1OI1nUFk.F7EOyT1/Wd1.QZK2V2MO.yQRsNN/vKUEQry', 'admin@example.com')
ON CONFLICT (username) DO NOTHING;
