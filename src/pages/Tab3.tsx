import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/react';
import './Tab3.css';
import { UserInfo } from '../interfaces/UserInfo';
import { useState } from 'react';
import { useIonViewDidEnter } from '@ionic/react';
import { getUserInfo } from '../services/GithubServices';


const Tab3: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const loadUserInfo = async () => {
    const info = await getUserInfo();
    setUserInfo(info);
    
    
  };

  useIonViewDidEnter(() => {
    loadUserInfo();
  });
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Perfil de usuario</IonTitle> 
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 3</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonCard>
          <img alt={userInfo?.login} 
          src={userInfo?.avatar_url} />
      <IonCardHeader>
        <IonCardTitle>{userInfo?.name}</IonCardTitle>
        <IonCardSubtitle>{userInfo?.login}</IonCardSubtitle>
      </IonCardHeader>

      <IonCardContent>Here's a small text description for the card content. Nothing more, nothing less.</IonCardContent>
    </IonCard>
  
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
