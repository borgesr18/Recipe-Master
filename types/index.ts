export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            companies: {
                Row: {
                    id: string
                    name: string
                    business_name: string | null
                    cnpj: string | null
                    phone: string | null
                    email: string | null
                    logo_url: string | null
                    primary_color: string | null
                    secondary_color: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    business_name?: string | null
                    cnpj?: string | null
                    phone?: string | null
                    email?: string | null
                    logo_url?: string | null
                    primary_color?: string | null
                    secondary_color?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    business_name?: string | null
                    cnpj?: string | null
                    phone?: string | null
                    email?: string | null
                    logo_url?: string | null
                    primary_color?: string | null
                    secondary_color?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            profiles: {
                Row: {
                    id: string
                    company_id: string
                    name: string
                    email: string
                    role: 'admin' | 'production_manager' | 'financial' | 'operator' | 'viewer' | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    company_id: string
                    name: string
                    email: string
                    role?: 'admin' | 'production_manager' | 'financial' | 'operator' | 'viewer' | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    company_id?: string
                    name?: string
                    email?: string
                    role?: 'admin' | 'production_manager' | 'financial' | 'operator' | 'viewer' | null
                    created_at?: string
                    updated_at?: string
                }
            }
            ingredients: {
                Row: {
                    id: string
                    company_id: string
                    name: string
                    category: string | null
                    purchase_unit: 'kg' | 'g' | 'l' | 'ml' | 'unit' | null
                    quantity_per_package: number
                    package_price: number
                    cost_per_gram: number | null
                    cost_per_ml: number | null
                    cost_per_unit: number | null
                    correction_factor: number
                    notes: string | null
                    active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    company_id: string
                    name: string
                    category?: string | null
                    purchase_unit?: 'kg' | 'g' | 'l' | 'ml' | 'unit' | null
                    quantity_per_package: number
                    package_price: number
                    cost_per_gram?: number | null
                    cost_per_ml?: number | null
                    cost_per_unit?: number | null
                    correction_factor?: number
                    notes?: string | null
                    active?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    company_id?: string
                    name?: string
                    category?: string | null
                    purchase_unit?: 'kg' | 'g' | 'l' | 'ml' | 'unit' | null
                    quantity_per_package?: number
                    package_price?: number
                    cost_per_gram?: number | null
                    cost_per_ml?: number | null
                    cost_per_unit?: number | null
                    correction_factor?: number
                    notes?: string | null
                    active?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            // Add other tables as needed (shortened for brevity in this step, will add more as I implement features)
        }
    }
}
