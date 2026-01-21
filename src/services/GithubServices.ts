import axios from "axios";
import { RepositoryItem } from "../interfaces/RepositoryItem";
import { UserInfo } from "../interfaces/UserInfo";
import AuthService from "./AuthService";

const GITHUB_API_URL = import.meta.env.VITE_API_URL;

const githubApi = axios.create({
    baseURL: GITHUB_API_URL,
    headers: {
        Accept: 'application/vnd.github+json',
    },
}); 

githubApi.interceptors.request.use((config) => { 
    const token = AuthService.getToken();
    if (token) {
        // Usar formato recomendado por GitHub: 'token <TOKEN>'
        config.headers = config.headers || {};
        config.headers.Authorization = `token ${token}`;
    }
    return config; 
}, (error) => {
    return Promise.reject(error);
});    


export const fetchRepositories = async (): Promise<RepositoryItem[]> => {
    try {
        const response = await githubApi.get('/user/repos',{
           
            params:{
                per_page: 100,
                sort: "created",
                direction: "desc",
                affiliation: "owner",
            }
        });
        const repositories: RepositoryItem[]= response.data.map((repo: any) => ({

            name: repo.name,
            description:repo.description ? repo.description : null,
            imageUrl: repo.owner ? repo.owner.avatar_url : null,
            owner: repo.owner ? repo.owner.login : null,    
            language: repo.language ? repo.language : null,

        }));
        return repositories;

    }    catch (error) {
            console.error("Hubo un error al obtener repositorios", error);
            return [];
        }
    }

export const createRepository = async (repo: RepositoryItem): Promise<boolean> => {
    try {
        const payload = {
            name: repo.name,
            description: repo.description || '',
            private: false,
        };
        console.log('Enviando repositorio a GitHub:', payload);
        const response = await githubApi.post('/user/repos', payload);
        console.log("Repositorio ingresado", response.data);
        return true;
    } catch (error) {
        console.error("Error al crear repositorio", error);
        throw error;
    }
};

// Elimina repo (owner, nombre)
export const deleteRepository = async (owner: string, repoName: string): Promise<boolean> => {
    try {
        await githubApi.delete(`/repos/${owner}/${repoName}`);
        return true;
    } catch (error) {
        console.error('Error al eliminar repositorio', error);
        return false;
    }
};

// Edita repo (campos: name, description)
export const editRepository = async (
    owner: string,
    repoName: string,
    data: { name?: string; description?: string }
): Promise<any> => {
    try {
        const response = await githubApi.patch(`/repos/${owner}/${repoName}`, data, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        console.log('Respuesta del servidor:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error al editar repositorio', error);
        throw error;
    }
};

export const getUserInfo = async (): Promise<UserInfo | null> => {
    try {
        const response = await githubApi.get('/user');
        return response.data as UserInfo;

    } catch (error) {
        console.error("Error al obtener informacion del usuario", error);
        const userNotFound: UserInfo = {
            login: "undefined",
            name: "Usario no encontrado",
            bio: "No se pudo obtener la informacion del usuario",
            avatar_url: "https://cdn-icons-png.flaticon.com/512/5436/5436149.png"
        }
        return userNotFound;
    }
}; 