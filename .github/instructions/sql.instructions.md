---
description: 'Guidelines for generating SQL statements
applyTo: '**/*.sql'
---

# SQL Development

## General SQL

### Database schema generation
- all table names should be in singular form
- all column names should be in singular form
- all tables should have a primary key column named `id`
- all tables should have a column named `created_at` to store the creation timestamp
- all tables should have a column named `updated_at` to store the last update timestamp

### Database schema design
- all tables should have a primary key constraint
- all foreign key constraints should have a name
- all foreign key constraints should be defined inline
- all foreign key constraints should have `ON DELETE CASCADE` option
- all foreign key constraints should have `ON UPDATE CASCADE` option
- all foreign key constraints should reference the primary key of the parent table

### SQL Coding Style
- use uppercase for SQL keywords (SELECT, FROM, WHERE)
- use consistent indentation for nested queries and conditions
- include comments to explain complex logic
- break long queries into multiple lines for readability
- organize clauses consistently (SELECT, FROM, JOIN, WHERE, GROUP BY, HAVING, ORDER BY)

### SQL Query Structure
- use explicit column names in SELECT statements instead of SELECT *
- qualify column names with table name or alias when using multiple tables
- limit the use of subqueries when joins can be used instead
- include LIMIT/TOP clauses to restrict result sets
- use appropriate indexing for frequently queried columns
- avoid using functions on indexed columns in WHERE clauses

### Stored Procedure Structure
- include header comment block with description, parameters, and return values
- return standardized error codes/messages
- return result sets with consistent column order
- use OUTPUT parameters for returning status information
- prefix temporary tables with 'tmp_'


### SQL Security Best Practices
- parameterize all queries to prevent SQL injection
- use prepared statements when executing dynamic SQL
- avoid embedding credentials in SQL scripts
- implement proper error handling without exposing system details
- avoid using dynamic SQL within stored procedures

### Transaction Management
- explicitly begin and commit transactions
- use appropriate isolation levels based on requirements
- avoid long-running transactions that lock tables
- use batch processing for large data operations

## PostgreSQL-Specific

### Advanced Data Types

#### Custom Types & Domains
```sql
-- Create custom types
CREATE TYPE address_type AS (
    street TEXT,
    city TEXT,
    postal_code TEXT,
    country TEXT
);

CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');

-- Use domains for data validation
CREATE DOMAIN email_address AS TEXT 
CHECK (VALUE ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Table using custom types
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    email email_address NOT NULL,
    address address_type,
    status order_status DEFAULT 'pending'
);
```

#### Range Types
```sql
-- PostgreSQL range types
CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    room_id INTEGER,
    reservation_period tstzrange,
    price_range numrange
);

-- Range queries
SELECT * FROM reservations 
WHERE reservation_period && tstzrange('2024-07-20', '2024-07-25');

-- Exclude overlapping ranges
ALTER TABLE reservations 
ADD CONSTRAINT no_overlap 
EXCLUDE USING gist (room_id WITH =, reservation_period WITH &&);
```

#### Geometric Types
```sql
-- PostgreSQL geometric types
CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    name TEXT,
    coordinates POINT,
    coverage CIRCLE,
    service_area POLYGON
);

-- Geometric queries
SELECT name FROM locations 
WHERE coordinates <-> point(40.7128, -74.0060) < 10; -- Within 10 units

-- GiST index for geometric data
CREATE INDEX idx_locations_coords ON locations USING gist(coordinates);
```

### Best Practices

#### JSONB Best Practices
```sql
-- ❌ BAD: Inefficient JSONB usage
SELECT * FROM orders WHERE data->>'status' = 'shipped';  -- No index support

-- ✅ GOOD: Indexable JSONB queries
CREATE INDEX idx_orders_status ON orders USING gin((data->'status'));
SELECT * FROM orders WHERE data @> '{"status": "shipped"}';

-- ❌ BAD: Deep nesting without consideration
UPDATE orders SET data = data || '{"shipping":{"tracking":{"number":"123"}}}';

-- ✅ GOOD: Structured JSONB with validation
ALTER TABLE orders ADD CONSTRAINT valid_status 
CHECK (data->>'status' IN ('pending', 'shipped', 'delivered'));
```

#### Array Operations
```sql
-- ❌ BAD: Inefficient array operations
SELECT * FROM products WHERE 'electronics' = ANY(categories);  -- No index

-- ✅ GOOD: GIN indexed array queries
CREATE INDEX idx_products_categories ON products USING gin(categories);
SELECT * FROM products WHERE categories @> ARRAY['electronics'];

-- ❌ BAD: Array concatenation in loops
-- This would be inefficient in a function/procedure

-- ✅ GOOD: Bulk array operations
UPDATE products SET categories = categories || ARRAY['new_category']
WHERE id IN (SELECT id FROM products WHERE condition);
```

#### Schema Design
```sql
-- ❌ BAD: Not using PostgreSQL features
CREATE TABLE users (
    id INTEGER,
    email VARCHAR(255),
    created_at TIMESTAMP
);

-- ✅ GOOD: PostgreSQL-optimized schema
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email CITEXT UNIQUE NOT NULL,  -- Case-insensitive email
    created_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}',
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Add JSONB GIN index for metadata queries
CREATE INDEX idx_users_metadata ON users USING gin(metadata);
```

#### Custom Types and Domains
```sql
-- ❌ BAD: Using generic types for specific data
CREATE TABLE transactions (
    amount DECIMAL(10,2),
    currency VARCHAR(3),
    status VARCHAR(20)
);

-- ✅ GOOD: PostgreSQL custom types
CREATE TYPE currency_code AS ENUM ('USD', 'EUR', 'GBP', 'JPY');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'cancelled');
CREATE DOMAIN positive_amount AS DECIMAL(10,2) CHECK (VALUE > 0);

CREATE TABLE transactions (
    amount positive_amount NOT NULL,
    currency currency_code NOT NULL,
    status transaction_status DEFAULT 'pending'
);
```
#### Pagination
```sql
-- ❌ BAD: OFFSET for large datasets
SELECT * FROM products ORDER BY id OFFSET 10000 LIMIT 20;

-- ✅ GOOD: Cursor-based pagination
SELECT * FROM products 
WHERE id > $last_id 
ORDER BY id 
LIMIT 20;
```

#### Aggregation
```sql
-- ❌ BAD: Inefficient grouping
SELECT user_id, COUNT(*) 
FROM orders 
WHERE order_date >= '2024-01-01' 
GROUP BY user_id;

-- ✅ GOOD: Optimized with partial index
CREATE INDEX idx_orders_recent ON orders(user_id) 
WHERE order_date >= '2024-01-01';

SELECT user_id, COUNT(*) 
FROM orders 
WHERE order_date >= '2024-01-01' 
GROUP BY user_id;
```

### Anti-Patterns

#### Performance Anti-Patterns
- **Avoiding PostgreSQL-specific indexes**: Not using GIN/GiST for appropriate data types
- **Misusing JSONB**: Treating JSONB like a simple string field
- **Ignoring array operators**: Using inefficient array operations
- **Poor partition key selection**: Not leveraging PostgreSQL partitioning effectively

#### Schema Design Issues
- **Not using ENUM types**: Using VARCHAR for limited value sets
- **Ignoring constraints**: Missing CHECK constraints for data validation
- **Wrong data types**: Using VARCHAR instead of TEXT or CITEXT
- **Missing JSONB structure**: Unstructured JSONB without validation

#### Function and Trigger Issues
```sql
-- ❌ BAD: Inefficient trigger function
CREATE OR REPLACE FUNCTION update_modified_time()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();  -- Should use TIMESTAMPTZ
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ✅ GOOD: Optimized trigger function
CREATE OR REPLACE FUNCTION update_modified_time()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Set trigger to fire only when needed
CREATE TRIGGER update_modified_time_trigger
    BEFORE UPDATE ON table_name
    FOR EACH ROW
    WHEN (OLD.* IS DISTINCT FROM NEW.*)
    EXECUTE FUNCTION update_modified_time();
```

### Extension Usage
#### Useful Extensions
- **uuid-ossp**: For generating UUIDs
- **pgcrypto**: For cryptographic functions
- **pg_trgm**: For trigram-based text search and similarity
- **btree_gin**: For GIN indexing of B-tree data types

#### Extension Best Practices
```sql
-- ✅ Check if extension exists before creating
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ✅ Use extensions appropriately
-- UUID generation
SELECT uuid_generate_v4();

-- Password hashing
SELECT crypt('password', gen_salt('bf'));

-- Fuzzy text matching
SELECT word_similarity('postgres', 'postgre');
```

### Security

#### Row Level Security (RLS)
```sql
-- ✅ GOOD: Implementing RLS
ALTER TABLE sensitive_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_data_policy ON sensitive_data
    FOR ALL TO application_role
    USING (user_id = current_setting('app.current_user_id')::INTEGER);
```

#### Privilege Management
```sql
-- ❌ BAD: Overly broad permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO app_user;

-- ✅ GOOD: Granular permissions
GRANT SELECT, INSERT, UPDATE ON specific_table TO app_user;
GRANT USAGE ON SEQUENCE specific_table_id_seq TO app_user;
```

### Performance Tuning

#### Query Optimization
```sql
-- EXPLAIN ANALYZE for performance analysis
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT) 
SELECT u.name, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at > '2024-01-01'::date
GROUP BY u.id, u.name;

-- Identify slow queries from pg_stat_statements
SELECT query, calls, total_time, mean_time, rows,
       100.0 * shared_blks_hit / nullif(shared_blks_hit + shared_blks_read, 0) AS hit_percent
FROM pg_stat_statements 
ORDER BY total_time DESC 
LIMIT 10;
```

#### Index Strategies
```sql
-- Composite indexes for multi-column queries
CREATE INDEX idx_orders_user_date ON orders(user_id, order_date);

-- Partial indexes for filtered queries
CREATE INDEX idx_active_users ON users(created_at) WHERE status = 'active';

-- Expression indexes for computed values
CREATE INDEX idx_users_lower_email ON users(lower(email));

-- Covering indexes to avoid table lookups
CREATE INDEX idx_orders_covering ON orders(user_id, status) INCLUDE (total, created_at);
```

#### Connection & Memory Management
```sql
-- Check connection usage
SELECT count(*) as connections, state 
FROM pg_stat_activity 
GROUP BY state;

-- Monitor memory usage
SELECT name, setting, unit 
FROM pg_settings 
WHERE name IN ('shared_buffers', 'work_mem', 'maintenance_work_mem');
```

#### tips
- **Use EXPLAIN (ANALYZE, BUFFERS)** for detailed query analysis
- **Use connection pooling** (pgbouncer) for high-concurrency applications
- **Regular VACUUM and ANALYZE** for optimal performance
- **Partition large tables** using PostgreSQL 10+ declarative partitioning
- **Use pg_stat_statements** for query performance monitoring

### Code Quality Checklist

#### Schema Design
- [ ] Using appropriate PostgreSQL data types (CITEXT, JSONB, arrays)
- [ ] Leveraging ENUM types for constrained values
- [ ] Implementing proper CHECK constraints
- [ ] Using TIMESTAMPTZ instead of TIMESTAMP
- [ ] Defining custom domains for reusable constraints

#### Performance Considerations
- [ ] Appropriate index types (GIN for JSONB/arrays, GiST for ranges)
- [ ] JSONB queries using containment operators (@>, ?)
- [ ] Array operations using PostgreSQL-specific operators
- [ ] Proper use of window functions and CTEs
- [ ] Efficient use of PostgreSQL-specific functions

#### PostgreSQL Features Utilization
- [ ] Using extensions where appropriate
- [ ] Implementing stored procedures in PL/pgSQL when beneficial
- [ ] Leveraging PostgreSQL's advanced SQL features
- [ ] Using PostgreSQL-specific optimization techniques
- [ ] Implementing proper error handling in functions

#### Security and Compliance
- [ ] Row Level Security (RLS) implementation where needed
- [ ] Proper role and privilege management
- [ ] Using PostgreSQL's built-in encryption functions
- [ ] Implementing audit trails with PostgreSQL features

### Guidelines
1. **Data Type Optimization**: Ensure PostgreSQL-specific types are used appropriately
2. **Index Strategy**: Review index types and ensure PostgreSQL-specific indexes are utilized
3. **JSONB Structure**: Validate JSONB schema design and query patterns
4. **Function Quality**: Review PL/pgSQL functions for efficiency and best practices
5. **Extension Usage**: Verify appropriate use of PostgreSQL extensions
6. **Performance Features**: Check utilization of PostgreSQL's advanced features
7. **Security Implementation**: Review PostgreSQL-specific security features

Focus on PostgreSQL's unique capabilities and ensure the code leverages what makes PostgreSQL special rather than treating it as a generic SQL database.
