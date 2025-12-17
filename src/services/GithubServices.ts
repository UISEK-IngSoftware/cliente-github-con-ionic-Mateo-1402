import axios from "axios";
import { RepositoryItem } from "../interfaces/RepositoryItem";
import { UserInfo } from "../interfaces/UserInfo";

const GITHUB_API_URL = import.meta.env.VITE_API_URL;
const GITHUB_API_TOKEN = import.meta.env.VITE_GITHUB_API_TOKEN;

// --- Obtener Repositorios ---
export const fetchRepositories = async (): Promise<RepositoryItem[]> => {
    try {
        const response = await axios.get(`${GITHUB_API_URL}/user/repos`, {
            headers: {
                Authorization: `Bearer ${GITHUB_API_TOKEN}`,
            },
            params: {
                per_page: 100,
                sort: "created",
                direction: "desc",
            }
        });

        const repositories: RepositoryItem[] = response.data.map((repo: any) => ({
            name: repo.name,
            description: repo.description || null,
            imageUrl: repo.owner ? repo.owner.avatar_url : null,
            owner: repo.owner ? repo.owner.login : null,
            language: repo.language || null,
        }));
        
        return repositories;

    } catch (error) { 
        console.error("Hubo un problema al obtener los repositorios", error);
        return [];
    }
};

// --- Crear Repositorio ---
export const createRepository = async (repo: RepositoryItem): Promise<void> => {
    try {
        const response = await axios.post(`${GITHUB_API_URL}/user/repos`, {
            name: repo.name,
            description: repo.description,
            private: false // Por defecto público, cámbialo a true si lo prefieres
        }, {
            headers:{
                Authorization: `Bearer ${GITHUB_API_TOKEN}`,
            }
        });

        console.log("Repositorio creado:", response.data);
    } catch (error) {
        console.error("Hubo un problema al crear el repositorio", error);
        // Opcional: podrías hacer throw error aquí si quieres notificar al usuario en la UI
    }
};

// --- Obtener Info del Usuario (Corregido) ---
export const getUserInfo = async () : Promise<UserInfo | null> => {
    try {
        const response = await axios.get(`${GITHUB_API_URL}/user`, {
            headers: {
                Authorization: `Bearer ${GITHUB_API_TOKEN}`,
            }
        });
        
        // CORRECCIÓN: Mapear y retornar la data exitosa
        const userData: UserInfo = {
            login: response.data.login,
            name: response.data.name,
            bio: response.data.bio,
            avatar_url: response.data.avatar_url
        };

        return userData;
      
    } catch (error) {
        console.error("Hubo un problema al obtener la información del usuario", error);
        
        const userNotFound: UserInfo = {
            login: 'undefined',
            name: 'undefined',
            bio: 'undefined',
            // Usar un placeholder real (el link de pinterest suele romper las imágenes)
            avatar_url: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png', 
        };

        return userNotFound;
    }
};