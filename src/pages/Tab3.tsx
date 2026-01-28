import { IonButton, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/react';
import './Tab3.css';
import { UserInfo } from '../interfaces/UserInfo';
import { useState } from 'react';
import { useIonViewDidEnter } from '@ionic/react';
import { getUserInfo } from '../services/GithubServices';
import { useHistory } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { logOutOutline } from 'ionicons/icons';
import AuthService from '../services/AuthService';


const Tab3: React.FC = () => { 
  const [loading, setLoading] = useState(false);

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null); 
  const history = useHistory();
  const loadUserInfo = async () => {  
    setLoading(true);
    const info = await getUserInfo(); 
    setUserInfo(info)
    setLoading(false);
  };
  useIonViewDidEnter (() => {
    loadUserInfo(); 
  }); 

  const handleLogout = () => { 
    AuthService.logout();  
    history.replace('/login'); 
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Perfil de Usuario</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Perfil de Usuario</IonTitle>
          </IonToolbar>
          </IonHeader>
          {loading ? null : userInfo ? (
            <>
              <IonCard>
                <img alt={userInfo.name} src={userInfo.avatar_url} />
                <IonCardHeader>
                  <IonCardTitle>{userInfo.name}</IonCardTitle>
                  <IonCardSubtitle>{userInfo.login}</IonCardSubtitle>
                </IonCardHeader>
                <IonCardContent>{userInfo.bio ?? 'Breve Descripción.'}</IonCardContent>
              </IonCard>

              <IonButton expand="block" color="danger" onClick={handleLogout}>
                <IonIcon slot="start" icon={logOutOutline} />
                Cerrar sesión
              </IonButton>
            </>
          ) : (
            <div style={{ padding: 16, textAlign: 'center' }}>
              <p>No autenticado o error al obtener datos del usuario.</p>
              <IonButton expand="block" onClick={() => history.replace('/login')}>
                Ir a login
              </IonButton>
            </div>
          )}
          </IonContent>
          <LoadingSpinner isOpen={loading} />
        </IonPage>
        );
};
export default Tab3;