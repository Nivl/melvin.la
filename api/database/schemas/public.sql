CREATE TABLE public.blog_post_revs (
    id uuid NOT NULL,
    blog_post_id uuid NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    thumbnail_url text,
    description text,
    content_json jsonb,
    created_at timestamp with time zone DEFAULT now(),
    deleted_at timestamp with time zone
);
ALTER TABLE public.blog_post_revs OWNER TO pguser;
CREATE TABLE public.blog_posts (
    id uuid NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    thumbnail_url text,
    description text,
    content_json jsonb,
    published_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    deleted_at timestamp with time zone,
    CONSTRAINT blog_posts_description_check CHECK ((char_length(description) <= 130)),
    CONSTRAINT blog_posts_slug_check CHECK ((char_length(slug) <= 105)),
    CONSTRAINT blog_posts_thumbnail_url_check CHECK ((char_length(thumbnail_url) <= 255)),
    CONSTRAINT blog_posts_title_check CHECK ((char_length(title) <= 100))
);
ALTER TABLE public.blog_posts OWNER TO pguser;
CREATE TABLE public.schema_migrations (
    version bigint NOT NULL,
    dirty boolean NOT NULL
);
ALTER TABLE public.schema_migrations OWNER TO pguser;
CREATE TABLE public.user_sessions (
    token uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    deleted_at timestamp with time zone,
    refresh_token uuid NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    refreshed_as uuid,
    ip_address cidr
);
ALTER TABLE public.user_sessions OWNER TO pguser;
CREATE TABLE public.users (
    id uuid NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    password_crypto text NOT NULL,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    deleted_at timestamp with time zone,
    CONSTRAINT users_email_check CHECK ((char_length(email) <= 255)),
    CONSTRAINT users_name_check CHECK ((char_length(name) <= 50)),
    CONSTRAINT users_password_check CHECK ((char_length(password) <= 255)),
    CONSTRAINT users_password_crypto_check CHECK ((char_length(password_crypto) <= 30))
);
ALTER TABLE public.users OWNER TO pguser;
ALTER TABLE ONLY public.blog_post_revs
    ADD CONSTRAINT blog_post_revs_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);
ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_sessions_pkey PRIMARY KEY (token);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.blog_post_revs
    ADD CONSTRAINT blog_post_revs_blog_post_id_fkey FOREIGN KEY (blog_post_id) REFERENCES public.blog_posts(id);
ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
