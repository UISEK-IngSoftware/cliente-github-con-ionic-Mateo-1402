import axios from "axios";
import { RepositoryItem } from "../interfaces/RepositoryItem";
import { UserInfo } from "../interfaces/UserInfo";
import AuthService from "./AuthService";

const GITHUB_API_URL = import.meta.env.VITE_API_URL;

const githubApi = axios.create({
    baseURL: GITHUB_API_URL, 
}); 

githubApi.interceptors.request.use((config) => { 
    const AuthHeader = AuthService.getAuthHeaders(); 
    if (AuthHeader) { 
        config.headers.Authorization = AuthHeader; 
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
            languaje: repo.language ? repo.language : null,

        }));
        return repositories;

    }    catch (error) {
            console.error("Hubo un error al obtener repositorios", error);
            return [];
        }
    }

export const createRepository = async (repo: RepositoryItem): Promise<void> => {
    try {
        const response = await githubApi.post('/user/repos', repo);
           
        console.log("Repositorio ingresado", response.data);
    } catch (error) {
        console.error("Error al crear repositorio", error);
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