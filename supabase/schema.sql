-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Empresas
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    business_name TEXT,
    cnpj TEXT,
    phone TEXT,
    email TEXT,
    logo_url TEXT,
    primary_color TEXT,
    secondary_color TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Usuarios
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT CHECK (role IN ('admin', 'production_manager', 'financial', 'operator', 'viewer')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Insumos (Ingredients)
CREATE TABLE ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    category TEXT,
    purchase_unit TEXT CHECK (purchase_unit IN ('kg', 'g', 'l', 'ml', 'unit')),
    quantity_per_package NUMERIC NOT NULL,
    package_price NUMERIC NOT NULL,
    cost_per_gram NUMERIC,
    cost_per_ml NUMERIC,
    cost_per_unit NUMERIC,
    correction_factor NUMERIC DEFAULT 1.0,
    notes TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Historico Precos Insumos
CREATE TABLE ingredient_price_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
    ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE NOT NULL,
    old_price NUMERIC,
    new_price NUMERIC,
    change_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES profiles(id)
);

-- 5. Embalagens (Packaging)
CREATE TABLE packaging (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    type TEXT,
    capacity_grams NUMERIC,
    capacity_ml NUMERIC,
    package_price NUMERIC NOT NULL,
    quantity_per_package NUMERIC NOT NULL,
    cost_per_unit NUMERIC,
    cost_per_gram NUMERIC,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Receitas (Recipes)
CREATE TABLE recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    category TEXT,
    cake_type TEXT,
    description TEXT,
    base_weight_grams NUMERIC,
    yield_portions INTEGER,
    mold_shape TEXT,
    mold_diameter_cm NUMERIC,
    mold_length_cm NUMERIC,
    mold_width_cm NUMERIC,
    avg_height_cm NUMERIC,
    layers_count INTEGER,
    oven_time_min INTEGER,
    oven_temp_c INTEGER,
    general_preparation_method TEXT,
    difficulty_level TEXT CHECK (difficulty_level IN ('basic', 'intermediate', 'advanced')),
    packaging_id UUID REFERENCES packaging(id),
    total_cost NUMERIC,
    cost_per_kg NUMERIC,
    cost_per_portion NUMERIC,
    suggested_sale_price NUMERIC,
    desired_profit_percent NUMERIC,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Subreceitas
CREATE TABLE sub_recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
    recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE NOT NULL,
    type TEXT CHECK (type IN ('dough', 'filling', 'frosting', 'syrup', 'decoration')),
    name TEXT NOT NULL,
    description TEXT,
    base_weight_grams NUMERIC,
    preparation_method TEXT,
    total_cost NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Subreceita Ingredientes
CREATE TABLE sub_recipe_ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
    sub_recipe_id UUID REFERENCES sub_recipes(id) ON DELETE CASCADE NOT NULL,
    ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE NOT NULL,
    usage_quantity NUMERIC NOT NULL,
    usage_unit TEXT CHECK (usage_unit IN ('g', 'kg', 'ml', 'l', 'unit')),
    use_correction_factor BOOLEAN DEFAULT FALSE,
    total_cost NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Templates Impressao
CREATE TABLE print_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('technical_sheet', 'production', 'summary', 'label')),
    config_json JSONB,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredient_price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE packaging ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE sub_recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE sub_recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE print_templates ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user's company_id
CREATE OR REPLACE FUNCTION get_user_company_id()
RETURNS UUID AS $$
BEGIN
  RETURN (SELECT company_id FROM profiles WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policies (Simplified for initial setup: Users can access data from their company)

-- Companies: Users can view their own company
CREATE POLICY "Users can view their own company" ON companies
    FOR SELECT USING (id = get_user_company_id());

-- Profiles: Users can view profiles from their company
CREATE POLICY "Users can view profiles from their company" ON profiles
    FOR SELECT USING (company_id = get_user_company_id());
-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (id = auth.uid());

-- Ingredients
CREATE POLICY "Users can view ingredients from their company" ON ingredients
    FOR SELECT USING (company_id = get_user_company_id());
CREATE POLICY "Users can insert ingredients for their company" ON ingredients
    FOR INSERT WITH CHECK (company_id = get_user_company_id());
CREATE POLICY "Users can update ingredients from their company" ON ingredients
    FOR UPDATE USING (company_id = get_user_company_id());
CREATE POLICY "Users can delete ingredients from their company" ON ingredients
    FOR DELETE USING (company_id = get_user_company_id());

-- Ingredient Price History
CREATE POLICY "Users can view price history from their company" ON ingredient_price_history
    FOR SELECT USING (company_id = get_user_company_id());
CREATE POLICY "Users can insert price history for their company" ON ingredient_price_history
    FOR INSERT WITH CHECK (company_id = get_user_company_id());

-- Packaging
CREATE POLICY "Users can view packaging from their company" ON packaging
    FOR SELECT USING (company_id = get_user_company_id());
CREATE POLICY "Users can insert packaging for their company" ON packaging
    FOR INSERT WITH CHECK (company_id = get_user_company_id());
CREATE POLICY "Users can update packaging from their company" ON packaging
    FOR UPDATE USING (company_id = get_user_company_id());
CREATE POLICY "Users can delete packaging from their company" ON packaging
    FOR DELETE USING (company_id = get_user_company_id());

-- Recipes
CREATE POLICY "Users can view recipes from their company" ON recipes
    FOR SELECT USING (company_id = get_user_company_id());
CREATE POLICY "Users can insert recipes for their company" ON recipes
    FOR INSERT WITH CHECK (company_id = get_user_company_id());
CREATE POLICY "Users can update recipes from their company" ON recipes
    FOR UPDATE USING (company_id = get_user_company_id());
CREATE POLICY "Users can delete recipes from their company" ON recipes
    FOR DELETE USING (company_id = get_user_company_id());

-- Sub Recipes
CREATE POLICY "Users can view sub_recipes from their company" ON sub_recipes
    FOR SELECT USING (company_id = get_user_company_id());
CREATE POLICY "Users can insert sub_recipes for their company" ON sub_recipes
    FOR INSERT WITH CHECK (company_id = get_user_company_id());
CREATE POLICY "Users can update sub_recipes from their company" ON sub_recipes
    FOR UPDATE USING (company_id = get_user_company_id());
CREATE POLICY "Users can delete sub_recipes from their company" ON sub_recipes
    FOR DELETE USING (company_id = get_user_company_id());

-- Sub Recipe Ingredients
CREATE POLICY "Users can view sub_recipe_ingredients from their company" ON sub_recipe_ingredients
    FOR SELECT USING (company_id = get_user_company_id());
CREATE POLICY "Users can insert sub_recipe_ingredients for their company" ON sub_recipe_ingredients
    FOR INSERT WITH CHECK (company_id = get_user_company_id());
CREATE POLICY "Users can update sub_recipe_ingredients from their company" ON sub_recipe_ingredients
    FOR UPDATE USING (company_id = get_user_company_id());
CREATE POLICY "Users can delete sub_recipe_ingredients from their company" ON sub_recipe_ingredients
    FOR DELETE USING (company_id = get_user_company_id());

-- Print Templates
CREATE POLICY "Users can view print_templates from their company" ON print_templates
    FOR SELECT USING (company_id = get_user_company_id());
CREATE POLICY "Users can insert print_templates for their company" ON print_templates
    FOR INSERT WITH CHECK (company_id = get_user_company_id());
CREATE POLICY "Users can update print_templates from their company" ON print_templates
    FOR UPDATE USING (company_id = get_user_company_id());
CREATE POLICY "Users can delete print_templates from their company" ON print_templates
    FOR DELETE USING (company_id = get_user_company_id());

-- Trigger to handle new user signup (optional, requires Supabase Auth trigger setup)
-- For now, we assume manual or app-based profile creation.

