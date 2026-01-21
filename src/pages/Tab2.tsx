import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { IonInput,IonTextarea } from '@ionic/react';
import './Tab2.css';
import { useHistory } from 'react-router';
import { RepositoryItem } from '../interfaces/RepositoryItem';
import { createRepository } from '../services/GithubServices';
import { useState } from 'react';

const Tab2: React.FC = () => { 

  const history = useHistory();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const saveRepository = async () => { 

    if (name.trim() === '') {
      alert('El nombre del Repositorio es Obligatorio'); 
      return; 
    }

    setLoading(true);
    try {
      const repoFormData: RepositoryItem = {
        name: name,
        description: description,
        imageUrl: null,
        owner: null,
        language: null,
      };
      
      const result = await createRepository(repoFormData);
      if (result) {
        alert('Repositorio creado exitosamente');
        setName('');
        setDescription('');
        // Pequeño delay para asegurar que GitHub procesó la creación
        setTimeout(() => {
          history.push('/tab1');
        }, 500);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear el Repositorio.');
    } finally {
      setLoading(false);
    }
  }; 


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Formulario de Repositorio</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Formulario de Repositorio</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className="form-container"> 
          <IonInput label= "Nombre del repositorio" 
            labelPlacement="floating" 
            fill="outline" 
            placeholder="android-project" 
            className='form-field' 
            value={name} 
            onIonChange={(e) => setName(e.detail.value!)}
        
            ></IonInput>
          <IonTextarea
            label="Descripción del Repositorio" 
            labelPlacement="floating" 
            fill="outline"
            placeholder="Este es un Repositorio de Android"
            className='form-field' 
            value={description} 
            onIonChange={(e) => setDescription(e.detail.value!)}
            rows={6}
            ></IonTextarea>
          <IonButton expand='block' className='form-field' onClick={saveRepository} disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar'}
            </IonButton>      



        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;