-- Function to create a new company and admin user profile
CREATE OR REPLACE FUNCTION create_tenant(
  company_name TEXT,
  user_name TEXT,
  user_email TEXT,
  user_id UUID
) RETURNS UUID AS $$
DECLARE
  new_company_id UUID;
BEGIN
  -- Create Company
  INSERT INTO companies (name)
  VALUES (company_name)
  RETURNING id INTO new_company_id;

  -- Create Profile
  INSERT INTO profiles (id, company_id, name, email, role)
  VALUES (user_id, new_company_id, user_name, user_email, 'admin');

  RETURN new_company_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
