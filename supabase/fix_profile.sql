-- SCRIPT PARA CORRIGIR PERFIL FALTANTE
-- 1. Vá no Supabase Dashboard > Authentication.
-- 2. Copie o "User UID" do usuário que você criou.
-- 3. Substitua 'COLE_O_UID_AQUI' abaixo pelo ID copiado.
-- 4. Rode este script no SQL Editor do Supabase.

DO $$
DECLARE
  -- COLOCAR O ID DO USUÁRIO AQUI (ex: 'a0eebc99-9c0b-...')
  target_user_id UUID := 'COLE_O_UID_AQUI'; 
  
  new_company_id UUID;
  user_email TEXT;
BEGIN
  -- Verifica se o usuário existe no Auth
  SELECT email INTO user_email FROM auth.users WHERE id = target_user_id;
  
  IF user_email IS NULL THEN
    RAISE EXCEPTION 'Usuário não encontrado no Auth com este ID';
  END IF;

  -- 1. Cria a Empresa
  INSERT INTO companies (name)
  VALUES ('Minha Confeitaria (Manual)')
  RETURNING id INTO new_company_id;

  -- 2. Cria o Perfil
  INSERT INTO profiles (id, company_id, name, email, role)
  VALUES (target_user_id, new_company_id, 'Admin Manual', user_email, 'admin');
  
  RAISE NOTICE 'Sucesso! Perfil criado para %', user_email;
END $$;
