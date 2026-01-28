import { IonContent, IonHeader, IonList, IonPage, IonTitle, IonToolbar, useIonViewDidEnter } from '@ionic/react';
import { useState } from 'react';
import './Tab1.css';
import RepoItem from '../components/Repoitem';
import { RepositoryItem } from '../interfaces/RepositoryItem';
import { fetchRepositories } from '../services/GithubServices';
import LoadingSpinner from '../components/LoadingSpinner';

const Tab1: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const[repos,setRepos] = useState<RepositoryItem[]> ([]); 

  const loadRepos = async () => {
    setLoading(true);
    console.log("Recargando repositorios...");
    const reposData = await fetchRepositories(); 
    console.log("Repositorios cargados:", reposData);
    setRepos(reposData);
    setLoading(false);   
  }; 

  useIonViewDidEnter(() => { 
    console.log("IonViewDidEnter - Cargando Repositorios"); 
    loadRepos(); 
  }); 


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Repositorios</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Repositorios</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          {repos.length > 0 ? (
            repos.map(( repo, index) => (
              <RepoItem 
                key={`${repo.owner}-${repo.name}-${index}`} 
                repo={repo} 
                onRefresh={loadRepos}
              /> 
            ))
          ) : (
            <p style={{ padding: '20px', textAlign: 'center' }}>No hay repositorios</p>
          )}
        </IonList>
      </IonContent>
      <LoadingSpinner isOpen={loading} />
      
    </IonPage>
  );
};

export default Tab1;